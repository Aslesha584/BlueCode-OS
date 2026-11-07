export const initialProspects = [
  {
    id: "p1", company: "Northstar Labs", industry: "B2B SaaS", location: "Bengaluru, India",
    size: "51–200", score: 94, priority: "Hot", status: "Ready to contact", trigger: "Hiring activity", buyingSignal: "Operations roles listed", intent: "No reply recorded", evidence: "Illustrative hiring signal in mock record", stageAgeDays: 2, createdAtDays: 3,
    website: "northstarlabs.example", description: "Workflow automation platform for mid-market operations teams.",
    signal: "Hiring 3 customer operations roles", signalDate: "Observed recently",
    whyNow: "The open operations roles may indicate a growing workload and a potential need for workflow automation. This is a hypothesis to validate, not proof of buying intent.",
    person: "Maya Iyer", role: "VP of Operations", email: "maya@northstarlabs.example",
    fit: ["B2B SaaS business model", "Within the target company-size range", "Operations leader matches the target buyer role"],
    source: "Illustrative mock record — not live provider data"
  },
  {
    id: "p2", company: "OrbitScale", industry: "Technology", location: "Chennai, India",
    size: "11–50", score: 88, priority: "High", status: "Contacted", trigger: "Content engagement", buyingSignal: "Process-scaling content", intent: "No reply recorded", evidence: "Illustrative public-content observation", stageAgeDays: 4, createdAtDays: 8,
    website: "orbitscale.example", description: "A growing software team building tools for distributed businesses.",
    signal: "Recently published a guide on scaling internal processes", signalDate: "Example content signal",
    whyNow: "The content topic is related to process scaling, so it may be a useful conversation opener. Confirm relevance before assuming an active project.",
    person: "Arjun Raman", role: "Founder", email: "arjun@orbitscale.example",
    fit: ["Early-stage company", "Founder is directly involved in buying decisions", "Pain-point alignment needs validation"],
    source: "Illustrative mock record — not live provider data"
  },
  {
    id: "p3", company: "BrightPath Systems", industry: "Business Services", location: "Hyderabad, India",
    size: "51–200", score: 76, priority: "High", status: "Follow-up due", trigger: "No verified trigger", buyingSignal: "Unavailable", intent: "No reply recorded", evidence: "No reliable recent timing evidence supplied", stageAgeDays: 6, createdAtDays: 15,
    website: "brightpath.example", description: "Business services company with a growing client delivery team.",
    signal: "No reliable recent signal available", signalDate: "Not available",
    whyNow: "No verified timing signal is available in this demo record. Use the ICP fit to decide whether more research is worthwhile; do not imply urgency.",
    person: "Neha Kapoor", role: "Head of Growth", email: "neha@brightpath.example",
    fit: ["Industry may be relevant", "Company size matches", "Timing evidence is currently missing"],
    source: "Illustrative mock record — not live provider data"
  },
  {
    id: "p4", company: "CloudHarbor", industry: "Cloud Software", location: "Pune, India",
    size: "201–500", score: 63, priority: "Medium", status: "Interested", trigger: "Partnership update", buyingSignal: "Partner page expanded", intent: "No reply recorded", evidence: "Illustrative public-site observation", stageAgeDays: 3, createdAtDays: 24,
    website: "cloudharbor.example", description: "Cloud software vendor serving growing technology teams.",
    signal: "Expanded its partner page", signalDate: "Example public-site observation",
    whyNow: "The partnership update could create a relevant reason to learn about their priorities, but the relationship to your offer needs confirmation.",
    person: "Karan Shah", role: "Director, Business Development", email: "karan@cloudharbor.example",
    fit: ["Adjacent industry", "Potential buyer role identified", "Company size is near the upper edge of the example range"],
    source: "Illustrative mock record — not live provider data"
  },
  {
    id: "p5", company: "Evergreen Digital", industry: "Digital Services", location: "Mumbai, India",
    size: "11–50", score: 48, priority: "Low", status: "Research needed", trigger: "No verified trigger", buyingSignal: "Unavailable", intent: "Unknown", evidence: "Insufficient evidence; further research needed", stageAgeDays: 9, createdAtDays: 40,
    website: "evergreen.example", description: "Digital services studio serving small and mid-sized businesses.",
    signal: "No signal supplied", signalDate: "Not available",
    whyNow: "The current record has limited evidence of fit and no timing signal. Research further or deprioritize instead of inventing a reason to contact.",
    person: "Riya Menon", role: "Managing Director", email: "riya@evergreen.example",
    fit: ["Company size may fit", "Industry match is uncertain", "More context needed"],
    source: "Illustrative mock record — not live provider data"
  },
  {
    id: "p6", company: "Fieldnote Tech", industry: "B2B Software", location: "Delhi, India",
    size: "51–200", score: 91, priority: "Hot", status: "Ready to contact", trigger: "Workflow pain signal", buyingSignal: "Manual reporting described", intent: "No reply recorded", evidence: "Illustrative product-page observation", stageAgeDays: 1, createdAtDays: 60,
    website: "fieldnote.example", description: "Software company supporting teams that coordinate field operations.",
    signal: "Product page describes manual reporting workflows", signalDate: "Example website observation",
    whyNow: "Manual reporting is potentially relevant to an automation offer. Treat it as a conversation hypothesis and validate it with the buyer.",
    person: "Dev Malhotra", role: "COO", email: "dev@fieldnote.example",
    fit: ["Relevant operational workflow", "Company size matches", "COO is a plausible stakeholder"],
    source: "Illustrative mock record — not live provider data"
  }
];

const extraCompanies = [
  ["BluePeak Analytics","B2B SaaS","Bengaluru, India","51–200","Data analytics platform for growing revenue teams.","VP of Revenue Operations"],
  ["NovaGrid Systems","Cloud Software","Hyderabad, India","201–500","Cloud infrastructure tooling for digital businesses.","Director of Operations"],
  ["CedarWorks Digital","Digital Services","Chennai, India","11–50","Digital product studio supporting scale-ups.","Founder"],
  ["LumenDesk","HR Technology","Pune, India","51–200","People operations software for distributed teams.","Head of People Operations"],
  ["KiteBridge","FinTech","Mumbai, India","51–200","Workflow tools for finance and compliance teams.","COO"],
  ["SignalNest","Marketing Technology","Delhi, India","11–50","Marketing analytics for B2B teams.","VP of Marketing"],
  ["Ironwood Cloud","Cloud Software","Bengaluru, India","201–500","Cloud cost visibility and governance software.","Head of Engineering"],
  ["MosaicFlow","Business Services","Jaipur, India","51–200","Workflow services for multi-location businesses.","Operations Director"],
  ["OrbitLedger","FinTech","Chennai, India","11–50","Financial operations software for SMEs.","Founder"],
  ["BrightForge AI","AI Software","Hyderabad, India","51–200","AI tools for internal knowledge workflows.","Head of Product"],
  ["CobaltWorks","B2B SaaS","Mumbai, India","201–500","Customer workflow platform for mid-market teams.","VP of Customer Success"],
  ["Pinecone Retail Tech","Retail Technology","Pune, India","51–200","Retail operations software for growing chains.","Retail Operations Head"],
  ["VantageLoop","Logistics Technology","Delhi, India","51–200","Logistics visibility tools for operations teams.","COO"],
  ["TerraMetric","Climate Technology","Bengaluru, India","11–50","Reporting tools for sustainability teams.","Founder"],
  ["HelioStack","Developer Tools","Hyderabad, India","51–200","Developer productivity software for engineering teams.","VP of Engineering"],
  ["MapleLine Services","Professional Services","Kochi, India","11–50","Consulting firm modernizing client delivery.","Managing Partner"],
  ["VertexPath","EdTech","Chennai, India","51–200","Learning operations platform for workforce training.","Head of Growth"],
  ["AmberField Systems","Manufacturing Software","Coimbatore, India","201–500","Production planning software for manufacturers.","Operations Director"],
  ["Northwind Commerce","E-commerce","Bengaluru, India","51–200","Commerce enablement tools for D2C brands.","Head of E-commerce"],
  ["ClearRoute Mobility","Mobility Technology","Delhi, India","201–500","Fleet coordination software for mobility operators.","VP of Operations"],
  ["PrismCloud","Cloud Software","Pune, India","51–200","Cloud migration services for SaaS teams.","Founder"],
  ["Evertrail Data","Data Services","Mumbai, India","11–50","Data quality tooling for analytics teams.","Head of Data"],
  ["AsterLoop","Healthcare Technology","Hyderabad, India","51–200","Administrative workflow software for clinics.","Operations Head"],
  ["Redwood CX","Customer Experience","Bengaluru, India","51–200","Customer support analytics and workflow tools.","VP of Customer Experience"],
  ["Silverline Ops","Business Services","Ahmedabad, India","11–50","Process improvement services for growing companies.","Founder"],
  ["CloudCanvas","Design Software","Chennai, India","51–200","Collaboration tools for product design teams.","Product Director"],
  ["MeridianPay","FinTech","Mumbai, India","201–500","Payments operations platform for digital businesses.","Finance Operations Head"],
  ["FieldSpring","AgriTech","Pune, India","51–200","Digital workflow software for agricultural supply chains.","COO"],
  ["Wavefront Security","Cybersecurity","Bengaluru, India","51–200","Security workflow tools for IT teams.","Security Operations Lead"],
  ["UrbanLedger","Property Technology","Chennai, India","11–50","Property management software for commercial portfolios.","Managing Director"],
  ["SageOrbit","Consulting Technology","Hyderabad, India","51–200","Client delivery systems for consulting teams.","Delivery Director"],
  ["Peakline Software","B2B SaaS","Noida, India","201–500","Business software for distributed sales teams.","VP of Sales Operations"],
  ["Daybreak Systems","IT Services","Kochi, India","51–200","Managed IT and automation services.","Operations Manager"],
  ["FathomWorks","Analytics","Bengaluru, India","11–50","Decision-support dashboards for leadership teams.","Founder"],
  ["OpenHarbor","Supply Chain Technology","Mumbai, India","51–200","Supply chain planning tools for manufacturers.","Supply Chain Director"],
  ["KindredHR","HR Technology","Pune, India","11–50","Hiring coordination and onboarding software.","Head of People"],
  ["SummitDesk","Productivity Software","Chennai, India","51–200","Task and knowledge management for growing teams.","COO"],
  ["Westbridge AI","AI Software","Bengaluru, India","11–50","AI assistants for internal business processes.","Founder"],
  ["BlueOak Networks","Telecommunications","Delhi, India","201–500","Network service operations platform.","Operations Director"],
  ["JuniperWorks","Business Software","Hyderabad, India","51–200","Workflow automation for professional teams.","Head of Business Operations"],
  ["NovaLedger","Accounting Technology","Mumbai, India","11–50","Accounting workflow software for small firms.","Founder"],
  ["GranitePath","Construction Technology","Pune, India","51–200","Project coordination tools for contractors.","Project Operations Head"],
  ["Skyward Commerce","E-commerce","Bengaluru, India","51–200","Tools for marketplace sellers and operators.","Marketplace Director"],
  ["ElmStreet Labs","Research Technology","Chennai, India","11–50","Research workflow software for technical teams.","Research Operations Lead"],
]
const stageCycle = ["Ready to contact","Contacted","Follow-up due","Interested","Research needed","Ready to contact","Contacted","Meeting requested","Follow-up due","Ready to contact"]
const triggerCycle = ["Hiring activity","Product update","Content engagement","Partnership update","No verified trigger","Workflow pain signal","Leadership change","Expansion signal","No verified trigger","New initiative — unconfirmed"]
const signalCycle = ["Relevant role advertised","Product page update","Industry guide published","Partner page update","Unavailable","Manual workflow described","Leadership profile updated","New location listed","Unavailable","Initiative mentioned in public content"]
const intentCycle = ["No reply recorded"]
export const generatedProspects = extraCompanies.map((c, i) => {
  const score = [96,91,87,82,78,73,68,64,59,54,49,45,93,89,84,79,74,69,65,60,56,51,47,42,90,86,81,76,71,66,62,57,52,48,44,39,88,83,77,72,67,61,55,46][i]
  const status = stageCycle[i % stageCycle.length]
  const trigger = triggerCycle[i % triggerCycle.length]
  const signal = signalCycle[i % signalCycle.length]
  return {
    id: `p${i+7}`, company:c[0], industry:c[1], location:c[2], size:c[3], score,
    priority: score >= 90 ? "Hot" : score >= 70 ? "High" : score >= 50 ? "Medium" : "Low",
    status, trigger, buyingSignal:signal, intent:intentCycle[i % intentCycle.length],
    stageAgeDays: (i * 3) % 12 + 1, createdAtDays: (i * 2 + 1) % 90,
    website: c[0].toLowerCase().replace(/[^a-z0-9]/g, "") + ".example",
    description:c[4], signal:signal === "Unavailable" ? "No reliable recent signal available" : signal,
    signalDate: signal === "Unavailable" ? "Not available" : "Illustrative mock observation",
    whyNow: signal === "Unavailable" ? "No reliable timing evidence is available in this sample. Use ICP fit to decide whether more research is worthwhile; do not infer urgency." : `${signal} may provide a relevant conversation opener, but it is illustrative mock evidence and should be validated before assuming active buying intent.`,
    person: ["Aarav Mehta","Isha Nair","Rohan Das","Ananya Rao","Kabir Shah","Diya Menon","Vihaan Patel","Meera Iyer","Aditya Bose","Sara Thomas"][i % 10],
    role:c[5], email:`contact${i+7}@${c[0].toLowerCase().replace(/[^a-z0-9]/g,"")}.example`,
    fit:[`${c[1]} may align with the target market`,`Company size: ${c[3]}`,`${c[5]} is a plausible stakeholder; validate buying authority`],
    evidence: signal === "Unavailable" ? "No reliable recent timing evidence supplied" : `Illustrative ${trigger.toLowerCase()} record; not externally verified`,
    source:"Illustrative mock record — not live provider data"
  }
})
const demoReplies = {
  "Northstar Labs": "Hi, thanks for reaching out. Your approach sounds interesting, and we would be happy to schedule a call next week to discuss how it could support our operations team.",
  "TerraMetric": "Thanks for the note. This is relevant to a project we are exploring. I'd be interested in a short discovery call. Could you share your calendar link so I can choose a suitable time?",
  "Silverline Ops": "Hello, this looks relevant to our current priorities. Happy to discuss this further. Please send a meeting link and I can book a convenient slot.",
  "Fieldnote Tech": "Hi, thanks for the thoughtful note. We are interested in reviewing ways to improve our field operations reporting, and your approach sounds relevant. I would be happy to schedule a discovery call. Could you share your Calendly link so I can choose a time?",
  "VantageLoop": "Thanks for reaching out. We are interested in learning how your solution could support our logistics workflows. A short meeting next week would be useful. Please send your booking link and I will select a suitable slot.",
  "OrbitScale": "Thanks for the note. This is an area we have been thinking about. A short overview would be helpful before deciding whether to set up a call.",
  "CloudHarbor": "Thank you for getting in touch. We are not interested in evaluating a solution in this area at the moment, so please close this out for now."
};
const demoFollowUpOne = new Set(["BrightPath Systems", "Ironwood Cloud", "BrightForge AI", "VantageLoop", "NovaGrid Systems"]);
const demoFollowUpTwo = new Set(["PrismCloud", "OrbitLedger", "ClearRoute Mobility"]);

export const allInitialProspects = [...initialProspects, ...generatedProspects].map(prospect => {
  const reply = demoReplies[prospect.company];
  if (reply) return { ...prospect, incomingReply: reply, replyReceived: true, replyIntent: prospect.company === "CloudHarbor" ? "Negative" : ["Northstar Labs", "TerraMetric", "Silverline Ops", "Fieldnote Tech", "VantageLoop"].includes(prospect.company) ? "Positive" : "Neutral", status: prospect.company === "CloudHarbor" ? "Not interested" : "Interested" };
  if (demoFollowUpTwo.has(prospect.company)) return { ...prospect, followUpCount: 1, followUps: [{ number: 1, sentAt: "2026-10-29T10:00:00.000Z", demo: true }], status: "Follow-up 2 due" };
  if (demoFollowUpOne.has(prospect.company)) return { ...prospect, followUpCount: 0, followUps: [], status: "Follow-up due" };
  return prospect;
})

export const initialOutreach = [
  {
    id: "o1", prospectId: "p1", company: "Northstar Labs", person: "Maya Iyer",
    subject: "A thought on scaling operations at Northstar",
    body: "Hi Maya,\n\nI noticed Northstar is growing its customer operations team. Teams at that stage sometimes start reviewing how repeatable workflows are handled.\n\nWould it be useful to compare notes on where automation could reduce manual work? If this isn't a current priority, no worries.\n\nBest,\n[Founder name]",
    status: "Needs review", step: "Initial email", intent: "Not received"
  },
  {
    id: "o2", prospectId: "p2", company: "OrbitScale", person: "Arjun Raman",
    subject: "Question about scaling internal processes",
    body: "Hi Arjun,\n\nI came across OrbitScale's material on scaling internal processes. It made me curious how your team currently handles repeatable operational work.\n\nIf improving that workflow is on your roadmap, would a short conversation be worthwhile?\n\nBest,\n[Founder name]",
    status: "Approved (demo)", step: "Initial email", intent: "Not received"
  },
  {
    id: "o3", prospectId: "p3", company: "BrightPath Systems", person: "Neha Kapoor",
    subject: "Following up on my earlier note",
    body: "Hi Neha,\n\nI wanted to follow up once on my earlier note about streamlining repeatable delivery workflows. If it is relevant, I can share a short example; if not, I am happy to close the loop.\n\nBest,\n[Founder name]",
    status: "Scheduled (demo)", step: "Follow-up 1", intent: "Not received"
  }
];

export const allInitialOutreach = [
  ...initialOutreach,
  ...allInitialProspects.slice(3,15).map((p, i) => ({
    id:`o${i+4}`, prospectId:p.id, company:p.company, person:p.person,
    subject:`A question about ${p.industry.toLowerCase()} workflows at ${p.company}`,
    body:`Hi ${p.person.split(" ")[0]},\n\nI’m reaching out because ${p.company} operates in ${p.industry.toLowerCase()}. We work with teams looking to make repeatable workflows easier to manage.\n\nIf improving this area is relevant to your team, would a short conversation be useful? If it is not a priority right now, no worries.\n\nBest,\n[Founder name]`,
    status:"Needs review", step:"Initial email", intent:"Not received"
  })),
  ...allInitialProspects.filter(p => ["BrightForge AI", "PrismCloud", "OrbitLedger", "ClearRoute Mobility", "TerraMetric", "Silverline Ops", "VantageLoop"].includes(p.company) && !allInitialProspects.slice(3,15).some(existing => existing.id === p.id)).map((p, i) => ({
    id:`demo-stage-${i+1}`, prospectId:p.id, company:p.company, person:p.person,
    subject:`A question about ${p.industry.toLowerCase()} workflows at ${p.company}`,
    body:`Hi ${p.person.split(" ")[0]},\n\nI’m reaching out because ${p.company} operates in ${p.industry.toLowerCase()}. We work with teams looking to make repeatable workflows easier to manage.\n\nIf improving this area is relevant to your team, would a short conversation be useful? If it is not a priority right now, no worries.\n\nBest,\n[Founder name]`,
    status:"Needs review", step:"Initial email", intent:"Not received"
  }))
].map(item => {
  const prospect = allInitialProspects.find(p => p.id === item.prospectId);
  if (!prospect) return item;
  if (prospect.incomingReply) return { ...item, incomingReply: prospect.incomingReply, replyReceived: true, intent: prospect.replyIntent, status: `Reply received - ${String(prospect.replyIntent).toLowerCase()}`, step: "Initial email" };
  if (demoFollowUpTwo.has(prospect.company)) return {
    ...item,
    subject: `Re: ${item.subject}`,
    body: `Hi ${prospect.person.split(" ")[0]},\n\nI wanted to follow up once more on my earlier note. If improving ${prospect.industry.toLowerCase()} workflows is not a current priority, I completely understand. If it is worth exploring, I would be happy to arrange a short conversation.\n\nWould a brief discussion be useful, or should I close the loop for now?\n\nBest regards,\n[Founder name]`,
    step: "Follow-up 2", status: "Follow-up 2 due", followUps: [{ number: 1, sentAt: "2026-10-29T10:00:00.000Z", demo: true }]
  };
  if (demoFollowUpOne.has(prospect.company) || prospect.company === "BrightPath Systems") return {
    ...item,
    subject: `Re: ${item.subject}`,
    body: `Hi ${prospect.person.split(" ")[0]},\n\nI wanted to follow up on my earlier message about ${prospect.industry.toLowerCase()} workflows. If this is relevant to your team, I can share a concise example of how our approach may help.\n\nWould this be worth a short conversation?\n\nBest regards,\n[Founder name]`,
    step: "Follow-up 1", status: "Follow-up 1 due", followUps: []
  };
  return item;
})

export const initialActivities = [
  { id: 1, title: "ICP approved", detail: "Your example ICP is ready for prospect discovery.", time: "Today", kind: "check" },
  { id: 2, title: "Northstar Labs prioritized", detail: "High ICP fit; timing hypothesis needs validation.", time: "Today", kind: "sparkles" },
  { id: 3, title: "Outreach draft created", detail: "Founder review required before any real sending.", time: "Today", kind: "mail" }
];
