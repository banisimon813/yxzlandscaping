import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const token = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN not set");
    const res = await fetch("https://api.hubapi.com/crm/v3/pipelines/deals", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const summary = (data.results || []).map((p: any) => ({
      id: p.id,
      label: p.label,
      stages: (p.stages || []).map((s: any) => ({ id: s.id, label: s.label })),
    }));
    return new Response(JSON.stringify({ pipelines: summary }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
