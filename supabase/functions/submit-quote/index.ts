import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HS_BASE = "https://api.hubapi.com";
const PIPELINE_NAME = "Landscaping Jobs";
const STAGE_NAME = "New Lead";

interface QuoteForm {
  name: string;
  phone: string;
  email: string;
  address?: string;
  sqft?: string;
  service?: string;
  message?: string;
}

async function hs(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${HS_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    console.error(`HubSpot ${init.method || "GET"} ${path} failed:`, res.status, data);
    throw new Error(`HubSpot API ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const token = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not configured");

    const form: QuoteForm = await req.json();
    if (!form.name?.trim() || !form.phone?.trim() || !form.email?.trim()) {
      return new Response(JSON.stringify({ error: "Name, phone, and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [firstName, ...rest] = form.name.trim().split(/\s+/);
    const lastName = rest.join(" ");

    // 1. Upsert contact by email
    const contactProps: Record<string, string> = {
      email: form.email,
      firstname: firstName || form.name,
      phone: form.phone,
    };
    if (lastName) contactProps.lastname = lastName;
    if (form.address) contactProps.address = form.address;

    let contactId: string;
    try {
      const created = await hs(token, "/crm/v3/objects/contacts", {
        method: "POST",
        body: JSON.stringify({ properties: contactProps }),
      });
      contactId = created.id;
    } catch (e: any) {
      // Conflict — contact exists. Look it up and update.
      if (String(e.message).includes("409") || String(e.message).toLowerCase().includes("conflict") || String(e.message).toLowerCase().includes("existing")) {
        const search = await hs(token, "/crm/v3/objects/contacts/search", {
          method: "POST",
          body: JSON.stringify({
            filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: form.email }] }],
            properties: ["email"],
            limit: 1,
          }),
        });
        contactId = search?.results?.[0]?.id;
        if (!contactId) throw e;
        await hs(token, `/crm/v3/objects/contacts/${contactId}`, {
          method: "PATCH",
          body: JSON.stringify({ properties: contactProps }),
        });
      } else {
        throw e;
      }
    }

    // 2. Resolve the account owner (so HubSpot notifies them)
    let ownerId: string | null = null;
    try {
      const owners = await hs(token, "/crm/v3/owners?limit=1");
      ownerId = owners?.results?.[0]?.id ?? null;
    } catch (ownerErr) {
      console.error("Failed to resolve HubSpot owner:", ownerErr);
    }

    // Assign the contact to the owner so HubSpot notifies them
    if (ownerId) {
      try {
        await hs(token, `/crm/v3/objects/contacts/${contactId}`, {
          method: "PATCH",
          body: JSON.stringify({ properties: { hubspot_owner_id: ownerId } }),
        });
      } catch (assignErr) {
        console.error("Failed to assign contact owner:", assignErr);
      }
    }

    // 3. Resolve pipeline + stage by name
    const pipelinesResp = await hs(token, "/crm/v3/pipelines/deals");
    const pipeline = pipelinesResp.results?.find((p: any) => p.label === PIPELINE_NAME);
    if (!pipeline) throw new Error(`Pipeline "${PIPELINE_NAME}" not found in HubSpot`);
    const stage = pipeline.stages?.find((s: any) => s.label === STAGE_NAME);
    if (!stage) throw new Error(`Stage "${STAGE_NAME}" not found in pipeline "${PIPELINE_NAME}"`);


    // 3. Create the deal
    const dealName = `${form.name} - ${form.service || "Quote Request"}`;
    const dealProperties: Record<string, string> = {
      dealname: dealName,
      pipeline: pipeline.id,
      dealstage: stage.id,
      description: [
        `Service Needed: ${form.service || "N/A"}`,
        `Address: ${form.address || "N/A"}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email}`,
        `Sq Ft: ${form.sqft || "N/A"}`,
        form.message ? `Message: ${form.message}` : "",
      ].filter(Boolean).join("\n"),
    };
    // Map website service dropdown -> allowed HubSpot service_type options
    const SERVICE_TYPE_MAP: Record<string, string> = {
      "Light Power Washing": "Power Washing",
      "Power Wash & Sand": "Sanding & Sealing",
      "Sealing (1 Coat)": "Sanding & Sealing",
      "Sealing (2 Coats)": "Sanding & Sealing",
      "Full Restoration": "Sanding & Sealing",
      "Interlock Repair": "Interlock Repair",
      "Interlock Installation": "Interlock Installation",
      "Excavation": "Excavation",
      "Backyard Renovation": "Backyard Renovation",
      "Retaining Wall": "Retaining Wall",
    };
    if (form.service) {
      dealProperties.service_type = SERVICE_TYPE_MAP[form.service] ?? "Other";
    }
    if (form.address) dealProperties.job_address = form.address;
    dealProperties.lead_source = "Website";
    if (ownerId) dealProperties.hubspot_owner_id = ownerId;

    const deal = await hs(token, "/crm/v3/objects/deals", {
      method: "POST",
      body: JSON.stringify({
        properties: dealProperties,
        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }],
          },
        ],
      }),
    });

    // 4. Immediate "New website lead" task with a reminder now (triggers HubSpot in-app + email alert)
    let alertTaskId: string | null = null;
    try {
      const now = Date.now();
      const alertProps: Record<string, string> = {
        hs_task_subject: `New website lead: ${form.name}`,
        hs_task_body: [
          `New quote request from the website.`,
          `Name: ${form.name}`,
          `Phone: ${form.phone}`,
          `Email: ${form.email}`,
          `Address: ${form.address || "N/A"}`,
          `Service: ${form.service || "N/A"}`,
          `Sq Ft: ${form.sqft || "N/A"}`,
          form.message ? `Message: ${form.message}` : "",
        ].filter(Boolean).join("\n"),
        hs_task_status: "NOT_STARTED",
        hs_task_priority: "HIGH",
        hs_task_type: "TODO",
        hs_timestamp: String(now),
        hs_task_reminders: String(now),
      };
      if (ownerId) alertProps.hubspot_owner_id = ownerId;

      const alertTask = await hs(token, "/crm/v3/objects/tasks", {
        method: "POST",
        body: JSON.stringify({
          properties: alertProps,
          associations: [
            { to: { id: deal.id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }] },
            { to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 204 }] },
          ],
        }),
      });
      alertTaskId = alertTask.id;
    } catch (alertErr) {
      console.error("Failed to create lead alert task:", alertErr);
    }

    // 5. Create a follow-up task due in 2 days, assigned to the account owner ("me")
    let taskId: string | null = null;
    try {
      const dueTimestamp = Date.now() + 2 * 24 * 60 * 60 * 1000;


      const taskProperties: Record<string, string> = {
        hs_task_subject: "Follow up with lead",
        hs_task_body: `Follow up on quote request from ${form.name} (${form.phone}, ${form.email}).`,
        hs_task_status: "NOT_STARTED",
        hs_task_priority: "HIGH",
        hs_task_type: "TODO",
        hs_timestamp: String(dueTimestamp),
      };
      if (ownerId) taskProperties.hubspot_owner_id = ownerId;

      const task = await hs(token, "/crm/v3/objects/tasks", {
        method: "POST",
        body: JSON.stringify({
          properties: taskProperties,
          associations: [
            // task -> deal
            { to: { id: deal.id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }] },
            // task -> contact
            { to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 204 }] },
          ],
        }),
      });
      taskId = task.id;
    } catch (taskErr) {
      console.error("Failed to create follow-up task:", taskErr);
    }

    return new Response(JSON.stringify({ success: true, contactId, dealId: deal.id, taskId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("submit-quote error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
