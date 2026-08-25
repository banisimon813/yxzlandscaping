export interface ServiceDefinition {
  slug: string;
  name: string;
  short: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  pricing: { label: string; price: string }[] | null;
  includes: string[];
}

export const services: ServiceDefinition[] = [
  {
    slug: "power-washing",
    name: "Interlock Power Washing",
    short: "High-pressure cleaning that lifts dirt, algae and staining out of your pavers.",
    metaTitle: "Interlock Power Washing GTA — YXZ Landscaping & Hardscaping",
    metaDescription:
      "Professional interlock power washing for driveways, walkways and patios across the Greater Toronto Area. From $0.60/sq ft. Free quote in 24 hours.",
    intro:
      "Years of traffic, weather and organic growth leave interlock looking grey and tired. Our high-pressure wash strips out embedded dirt, algae, moss and surface staining so the original colour of your stone comes back. We work driveways, walkways, patios, steps and pool surrounds throughout the GTA.",
    pricing: [
      { label: "750 sq ft and below", price: "$1.00 / sq ft" },
      { label: "750 – 2,000 sq ft", price: "$0.80 / sq ft" },
      { label: "2,000+ sq ft", price: "$0.60 / sq ft" },
    ],
    includes: [
      "Surface prep and weed removal along joints",
      "Commercial-grade hot/cold pressure washing",
      "Edge, step and border detailing",
      "Full site clean-up before we leave",
    ],
  },
  {
    slug: "power-wash-and-sand",
    name: "Power Wash & Polymeric Sanding",
    short: "A full wash followed by fresh polymeric sand to lock joints and stop weeds.",
    metaTitle: "Polymeric Sanding & Power Washing GTA — YXZ Landscaping",
    metaDescription:
      "Interlock power washing with polymeric sand replacement across the GTA. Locks pavers, stops weeds and ants. From $1.50/sq ft.",
    intro:
      "Washing alone leaves joints open. Replacing the old sand with polymeric sand binds the pavers together, stops weed growth and ant nesting, and keeps your surface from shifting under traffic. This is the option we recommend for most driveways.",
    pricing: [
      { label: "Below 1,000 sq ft", price: "$1.75 / sq ft" },
      { label: "1,000+ sq ft", price: "$1.50 / sq ft" },
    ],
    includes: [
      "Deep pressure wash and joint flush",
      "Removal of failed, washed-out joint sand",
      "New polymeric sand swept and compacted into every joint",
      "Activation and curing so joints set hard",
    ],
  },
  {
    slug: "sealing",
    name: "Interlock Sealing",
    short: "Protective sealer that deepens colour and shields stone from salt and stains.",
    metaTitle: "Interlock Sealing GTA — YXZ Landscaping & Hardscaping",
    metaDescription:
      "Interlock sealing in the Greater Toronto Area. One or two coat sealer that enhances colour and protects against salt, oil and weather. From $1.25/sq ft.",
    intro:
      "Sealer is what keeps a freshly restored surface looking new. It locks in the joint sand, deepens the colour of the stone, and creates a barrier against road salt, oil, leaf tannins and freeze-thaw damage. Choose one coat for protection or two coats for a richer, longer-lasting finish.",
    pricing: [
      { label: "1 Coat", price: "$1.25 / sq ft" },
      { label: "2 Coats", price: "$1.75 / sq ft" },
    ],
    includes: [
      "Surface must be washed and sanded first",
      "Premium paver sealer applied evenly",
      "Colour-enhancing wet-look or natural finish",
      "Cure-time guidance so you know when to drive on it",
    ],
  },
  {
    slug: "full-restoration",
    name: "Full Interlock Restoration",
    short: "Wash, polymeric sand and seal — the complete refresh in one visit.",
    metaTitle: "Full Interlock Restoration GTA — YXZ Landscaping",
    metaDescription:
      "Complete interlock restoration in the GTA: power washing, polymeric sanding and sealing in one project. Custom quote within 24 hours.",
    intro:
      "Our most popular package combines all three steps: a deep power wash, full polymeric sand replacement, and sealer. The result is a driveway or patio that looks newly installed and stays that way for years with minimal upkeep.",
    pricing: null,
    includes: [
      "Deep power wash of the full surface",
      "Complete polymeric sand replacement",
      "One or two coats of sealer, your choice",
      "Minor releveling and paver resets where needed",
    ],
  },
  {
    slug: "interlock-repair",
    name: "Interlock Repair & Releveling",
    short: "Fixing sunken sections, lifted stones, failing edges and drainage problems.",
    metaTitle: "Interlock Repair & Releveling GTA — YXZ Landscaping",
    metaDescription:
      "Interlock repair across the Greater Toronto Area: sunken sections releveled, damaged pavers replaced, edges rebuilt and drainage corrected.",
    intro:
      "Settling, tree roots, frost and poor base work leave interlock uneven, sunken or dangerous to walk on. We lift the affected area, rebuild and compact the base, and reset the stone so it sits flush and drains properly again — no full replacement needed.",
    pricing: null,
    includes: [
      "Lifting and releveling of sunken sections",
      "Base rebuild and re-compaction",
      "Replacement of cracked or spalled pavers",
      "Edge restraint repair and drainage correction",
    ],
  },
  {
    slug: "interlock-installation",
    name: "New Interlock Installation",
    short: "New driveways, walkways, patios and steps built on a proper base.",
    metaTitle: "Interlock Installation GTA — YXZ Landscaping & Hardscaping",
    metaDescription:
      "New interlock installation for driveways, walkways, patios and steps across the Greater Toronto Area. Built on a properly compacted base.",
    intro:
      "A paver surface is only as good as what's underneath it. We excavate to the correct depth, install and compact granular base in lifts, then lay your chosen stone with proper slope, edge restraints and polymeric sand. Driveways, walkways, patios, porches, steps and pool decks.",
    pricing: null,
    includes: [
      "Excavation and grading",
      "Engineered, compacted granular base",
      "Precision paver laying with correct slope and drainage",
      "Edge restraints, cuts and polymeric sand finish",
    ],
  },
  {
    slug: "retaining-walls",
    name: "Retaining Walls & Steps",
    short: "Structural walls and steps that hold grade and shape your yard.",
    metaTitle: "Retaining Walls & Steps GTA — YXZ Landscaping & Hardscaping",
    metaDescription:
      "Retaining wall and step construction across the Greater Toronto Area. Structural block and natural stone walls built to hold grade and drain properly.",
    intro:
      "Retaining walls hold back grade, create usable flat space and frame planting beds, patios and entrances. We build with segmental block and natural stone, including proper base, drainage stone and backfill so the wall stays straight for decades.",
    pricing: null,
    includes: [
      "Compacted base and buried first course",
      "Drainage stone and filter fabric behind the wall",
      "Block or natural stone construction with capping",
      "Matching steps and integrated garden beds",
    ],
  },
  {
    slug: "excavation-and-backyard-renovation",
    name: "Excavation & Backyard Renovation",
    short: "Full backyard transformations, grading, removals and site prep.",
    metaTitle: "Excavation & Backyard Renovation GTA — YXZ Landscaping",
    metaDescription:
      "Excavation, grading and complete backyard renovations across the Greater Toronto Area. Demolition, removals, site prep and hardscape rebuilds.",
    intro:
      "Starting from scratch? We handle demolition and removal of old concrete, asphalt and pavers, excavation, regrading for drainage, and the full rebuild — patios, walkways, walls, steps and soft landscaping. One crew from teardown to finish.",
    pricing: null,
    includes: [
      "Demolition and disposal of existing surfaces",
      "Machine excavation and regrading",
      "Drainage and downspout management",
      "Complete hardscape and finishing work",
    ],
  },
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
