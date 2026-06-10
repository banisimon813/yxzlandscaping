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

    // 2. Resolve pipeline + stage by name
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
    // Map form fields to custom HubSpot deal properties
    if (form.service) dealProperties.service_type = form.service;
    if (form.address) dealProperties.job_address = form.address;

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

        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }],
          },
        ],
      }),
    });

    return new Response(JSON.stringify({ success: true, contactId, dealId: deal.id }), {
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
