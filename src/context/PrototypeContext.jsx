
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  allInitialOutreach,
  allInitialProspects,
  initialActivities
} from "../data/mockData";

const PrototypeContext = createContext(null);
const STORAGE_KEY = "aiSalesCopilotPrototypeV1";

const DEFAULT_FOUNDER_NAME = "";
const SALES_OBJECTIVE = "Book Qualified Discovery Conversations";

// Normalize current and legacy ICP shapes so custom criteria survive refreshes
// and remain available to the Step 3 review screen.
const normalizeIcpRecord = record => {
  if (!record || typeof record !== "object") return null;
  const nested = record.discoveryCriteria || {};
  const industries = Array.isArray(record.industries) && record.industries.length
    ? record.industries
    : (Array.isArray(nested.industry) ? nested.industry : Array.isArray(nested.industries) ? nested.industries : []);
  const roles = Array.isArray(record.roles) && record.roles.length
    ? record.roles
    : (Array.isArray(nested.decisionMakerRoles) ? nested.decisionMakerRoles : Array.isArray(nested.roles) ? nested.roles : []);
  return {
    ...record,
    industries: [...new Set(industries.map(value => String(value).trim()).filter(Boolean))],
    roles: [...new Set(roles.map(value => String(value).trim()).filter(Boolean))],
    objective: SALES_OBJECTIVE,
    discoveryCriteria: {
      ...nested,
      industry: [...new Set(industries.map(value => String(value).trim()).filter(Boolean))],
      decisionMakerRoles: [...new Set(roles.map(value => String(value).trim()).filter(Boolean))]
    }
  };
};

const defaultState = {
  account: {
    name: DEFAULT_FOUNDER_NAME,
    email: "founder@example.com"
  },
  startup: {
    companyName: "",
    website: "",
    product: "",
    problemSolved: "",
    geography: "India",
    documents: [],
    objective: SALES_OBJECTIVE,

    // Demo access for reports
    trialCompleted: true,
    completedBillingMonths: 1
  },
  icp: null,
  icpDraft: null,
  prospects: allInitialProspects,
  outreach: allInitialOutreach,
  activities: initialActivities,
  bookingUrl: "",
  selectedPlan: "Starter",
  accountCreated: false,
  selectedProspectId: "p1",
  setupComplete: false,
  icpApproved: false
};

const addActivity = (activities, title, detail, kind = "mail") => [
  {
    id: Date.now(),
    title,
    detail,
    time: "Just now",
    kind
  },
  ...activities
];

// Convert the old username-style display name to the founder's name.
const normalizeFounderName = (name, email = "") => {
  const trimmedName = typeof name === "string" ? name.trim().replace(/\\s+/g, " ") : "";
  const emailLocalPart = String(email || "").split("@")[0].trim().toLowerCase();
  const looksLikeUsername =
    /\\d/.test(trimmedName) ||
    /[._-]/.test(trimmedName) ||
    (emailLocalPart && trimmedName.toLowerCase() === emailLocalPart);

  if (!trimmedName || looksLikeUsername) {
    return DEFAULT_FOUNDER_NAME;
  }

  return trimmedName;
};

const personalizeFounderName = (body, founderName) => {
  if (typeof body !== "string") return body;

  const safeName = normalizeFounderName(founderName);

  return body
    .replace(/\[Founder name\]/gi, safeName);
};


const buildInitialEmail = (prospect, startup, icp, founderName) => {
  const firstName = (prospect.person || "there").trim().split(/\s+/)[0];
  const companyName = startup?.companyName?.trim() || "our company";
  const product = startup?.product?.trim() || "our product and service";
  const problemSolved = startup?.problemSolved?.trim() || icp?.painPoints?.trim() || "the business challenges teams are working to solve";
  const score = Number(prospect.score ?? prospect.icpFitScore ?? 0);
  const verifiedContext = prospect.businessContextVerified === true && prospect.businessContext
    ? `I also found this verified company context: ${prospect.businessContext}${prospect.businessContextSource ? ` (Source: ${prospect.businessContextSource})` : ""}.`
    : "";
  const portfolioAvailable = Array.isArray(startup?.documents) && startup.documents.some(doc =>
    /portfolio|case study/i.test(`${doc.category || ""} ${doc.name || ""}`)
  );

  const opening = score >= 90
    ? `I’m reaching out because there may be a possible fit between ${prospect.company} and the work we are doing at ${companyName}.`
    : score >= 70
      ? `I’m reaching out to explore whether our work at ${companyName} may be relevant to your team at ${prospect.company}.`
      : `I’m contacting you with a brief question to understand whether our work at ${companyName} is relevant to ${prospect.company}.`;

  const context = verifiedContext
    ? `${verifiedContext}\n\n`
    : `I don’t want to assume that this is an active priority for your team, so I wanted to ask rather than make an unsupported claim about your current plans.\n\n`;

  const value = score >= 85
    ? `Our ${product} is designed to help teams address ${problemSolved}. If this is an area your team is reviewing, I’d be glad to share how the approach works and discuss whether it maps to your requirements.`
    : `We provide ${product} to help with ${problemSolved}. If this challenge is relevant to your team, I can share a little more about the approach and learn whether it is worth exploring.`;

  const portfolioLine = portfolioAvailable
    ? `I can also share a relevant portfolio or case-study example to give you a clearer view of our work.`
    : `If useful, I can share more detail about our approach and the work behind the product.`;

  return `Hi ${firstName},\n\n${opening}\n\nAt ${companyName}, we provide ${product}. The problem we focus on is ${problemSolved}. ${context}${value}\n\n${portfolioLine}\n\nWould you be open to a 20-minute qualified discovery conversation to see whether there is a genuine fit? If this is not relevant right now, no problem at all.\n\nBest regards,\n${founderName}`;
};

export function PrototypeProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        const loadedState = {
          ...defaultState,
          ...parsed,
          account: {
            ...defaultState.account,
            ...(parsed.account || {}),
            name: normalizeFounderName(parsed.account?.name, parsed.account?.email)
          },
          startup: {
            ...defaultState.startup,
            ...(parsed.startup || {}),
            objective: SALES_OBJECTIVE,
            documents: Array.isArray(parsed.startup?.documents)
              ? parsed.startup.documents
              : []
          },
          icp: normalizeIcpRecord(parsed.icp),
          icpDraft: normalizeIcpRecord(parsed.icpDraft),
          setupComplete: Boolean(
            parsed.setupComplete ||
            parsed.startup?.companyName ||
            parsed.icp
          ),
          prospects:
            Array.isArray(parsed.prospects) && parsed.prospects.length >= 50
              ? parsed.prospects.map(item => {
                  const seed = allInitialProspects.find(p => p.id === item.id);
                  return seed ? {
                    ...item,
                    incomingReply: item.incomingReply || seed.incomingReply,
                    replyReceived: Boolean(item.replyReceived || seed.replyReceived),
                    replyIntent: item.replyIntent || seed.replyIntent,
                    followUpCount: Number.isFinite(item.followUpCount) ? item.followUpCount : seed.followUpCount,
                    followUps: Array.isArray(item.followUps) && item.followUps.length ? item.followUps : (seed.followUps || []),
                    status: item.status === "Ready to contact" || item.status === "Needs review" ? seed.status : item.status
                  } : item;
                })
              : allInitialProspects,
          outreach: (() => {
            const savedOutreach = Array.isArray(parsed.outreach) && parsed.outreach.length >= 15 ? parsed.outreach : allInitialOutreach;
            const combined = [
              ...savedOutreach,
              ...allInitialOutreach.filter(seed => !savedOutreach.some(item => String(item.prospectId) === String(seed.prospectId)))
            ];
            return combined.map(item => {
              const seed = allInitialOutreach.find(o => String(o.prospectId) === String(item.prospectId));
              if (!seed) return item;
              return {
                ...item,
                incomingReply: item.incomingReply || seed.incomingReply,
                replyReceived: Boolean(item.replyReceived || seed.replyReceived),
                intent: item.intent === "Not received" && seed.intent !== "Not received" ? seed.intent : item.intent,
                followUps: Array.isArray(item.followUps) && item.followUps.length ? item.followUps : (seed.followUps || []),
                step: item.step === "Initial email" && seed.step !== "Initial email" ? seed.step : item.step,
                status: ["Needs review", "Ready to contact", "Scheduled (demo)"].includes(item.status) && seed.status !== "Needs review" ? seed.status : item.status
              };
            });
          })()
        };

        const founderName = loadedState.account.name;

        return {
          ...loadedState,
          outreach: loadedState.outreach.map(item => ({
            ...item,
            body: personalizeFounderName(
              item.body,
              founderName
            )
          }))
        };
      }
    } catch {
      // Fall back to initial demo data if saved data is invalid.
    }

    return {
      ...defaultState,
      account: {
        ...defaultState.account
      },
      startup: {
        ...defaultState.startup,
        objective: SALES_OBJECTIVE,
        documents: []
      },
      prospects: [...allInitialProspects],
      outreach: allInitialOutreach.map(item => ({
        ...item,
        body: personalizeFounderName(
          item.body,
          DEFAULT_FOUNDER_NAME
        )
      })),
      activities: [...initialActivities]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Continue if browser storage is unavailable.
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      updateAccount: account =>
        setState(s => {
          const updatedAccount = {
            ...s.account,
            ...account
          };

          const founderName = normalizeFounderName(
            updatedAccount.name,
            updatedAccount.email
          );

          updatedAccount.name = founderName;

          return {
            ...s,
            account: updatedAccount,
            outreach: s.outreach.map(item => ({
              ...item,
              body: personalizeFounderName(
                item.body,
                founderName
              )
            }))
          };
        }),

      markAccountCreated: () =>
        setState(s => ({
          ...s,
          accountCreated: true
        })),
      startOnboarding: () =>
  setState(s => ({
    ...s,
    accountCreated: true,
    startup: { ...defaultState.startup, objective: SALES_OBJECTIVE, documents: [] },
    setupComplete: false,
    icp: null,
    icpDraft: null,
    icpApproved: false,
    bookingUrl: ""
  })),

      selectPlan: selectedPlan =>
        setState(s => ({
          ...s,
          selectedPlan
        })),

      updateStartup: startup =>
        setState(s => ({
          ...s,
          startup: {
            ...s.startup,
            ...startup,
            objective: SALES_OBJECTIVE,
            documents: Array.isArray(startup.documents)
              ? startup.documents
              : s.startup.documents || []
          },
          icp: s.icp ? {
            ...s.icp,
            companyDocuments: (Array.isArray(startup.documents)
              ? startup.documents
              : s.startup.documents || []).map(({ id, name, type, size, category }) => ({ id, name, type, size, category }))
          } : s.icp,
          icpDraft: s.icpDraft ? {
            ...s.icpDraft,
            companyDocuments: (Array.isArray(startup.documents)
              ? startup.documents
              : s.startup.documents || []).map(({ id, name, type, size, category }) => ({ id, name, type, size, category }))
          } : s.icpDraft
        })),

      saveStartup: startup =>
        setState(s => ({
          ...s,
          startup: {
            ...s.startup,
            ...startup,
            objective: SALES_OBJECTIVE,
            documents: Array.isArray(startup.documents)
              ? startup.documents
              : s.startup.documents || []
          },
          icp: s.icp ? {
            ...s.icp,
            companyDocuments: (Array.isArray(startup.documents)
              ? startup.documents
              : s.startup.documents || []).map(({ id, name, type, size, category }) => ({ id, name, type, size, category }))
          } : s.icp,
          icpDraft: s.icpDraft ? {
            ...s.icpDraft,
            companyDocuments: (Array.isArray(startup.documents)
              ? startup.documents
              : s.startup.documents || []).map(({ id, name, type, size, category }) => ({ id, name, type, size, category }))
          } : s.icpDraft,
          setupComplete: true
        })),

      updateIcpDraft: icpDraft =>
        setState(s => ({
          ...s,
          icpDraft: {
            ...normalizeIcpRecord({ ...(s.icpDraft || {}), ...icpDraft }),
            companyDocuments: (s.startup.documents || []).map(({ id, name, type, size, category }) => ({ id, name, type, size, category }))
          }
        })),

      saveIcp: icp =>
        setState(s => ({
          ...s,
          icp: {
            ...normalizeIcpRecord(icp),
            companyDocuments: (s.startup.documents || []).map(({ id, name, type, size, category }) => ({ id, name, type, size, category }))
          },
          icpDraft: null,
          icpApproved: false
        })),

      approveIcp: () =>
        setState(s => ({
          ...s,
          icpDraft: null,
          icpApproved: true,
          activities: addActivity(
            s.activities,
            "ICP approved",
            "Your approved ICP is now used for this demo workflow.",
            "check"
          )
        })),

      selectProspect: id =>
        setState(s => ({
          ...s,
          selectedProspectId: id
        })),

      updateProspectStatus: (id, status) =>
        setState(s => ({
          ...s,
          prospects: s.prospects.map(p =>
            p.id === id
              ? {
                  ...p,
                  status,
                  stageAgeDays: 0
                }
              : p
          )
        })),

      updateReplyIntent: (outreachId, intent) =>
        setState(s => {
          const item = s.outreach.find(
            o => o.id === outreachId
          );

          if (!item) return s;

          const normalizedIntent = String(intent).toLowerCase();

          const status =
            normalizedIntent === "positive"
              ? "Interested"
              : normalizedIntent === "negative"
                ? "Not interested"
                : "Contacted";

          return {
            ...s,
            outreach: s.outreach.map(o =>
              o.id === outreachId
                ? {
                    ...o,
                    intent,
                    replyReceived: true,
                    status: `Reply received - ${normalizedIntent}`
                  }
                : o
            ),
            prospects: s.prospects.map(p =>
              p.id === item.prospectId
                ? {
                    ...p,
                    intent,
                    replyIntent: intent,
                    replyReceived: true,
                    status
                  }
                : p
            ),
            activities: addActivity(
              s.activities,
              `${intent} reply recorded (demo)`,
              `Reply intent recorded for ${item.company}. No inbox is connected.`,
              "mail"
            )
          };
        }),

      updateOutreach: (id, changes) =>
        setState(s => {
          const existing = s.outreach.find(o => o.id === id);
          const statusChanged = Boolean(changes.status && changes.status !== existing?.status);
          return {
            ...s,
            outreach: s.outreach.map(o =>
              o.id === id
                ? {
                    ...o,
                    ...changes
                  }
                : o
            ),
            activities: statusChanged
              ? addActivity(
                  s.activities,
                  changes.status,
                  `Demo workflow updated for ${existing?.company || "prospect"}.`,
                  "mail"
                )
              : s.activities
          };
        }),

      handoffOutreach: id =>
        setState(s => ({
          ...s,
          outreach: s.outreach.map(o =>
            o.id === id
              ? {
                  ...o,
                  status: "Queued for prospecting (demo)"
                }
              : o
          ),
          activities: addActivity(
            s.activities,
            "Prospecting handoff preview",
            `${
              s.outreach.find(o => o.id === id)?.company ||
              "Prospect"
            } queued locally. No live sequence was created.`,
            "mail"
          )
        })),

      createOutreachForProspects: ids =>
        setState(s => {
          const selected = s.prospects.filter(
            p =>
              ids.includes(p.id) &&
              !s.outreach.some(o => o.prospectId === p.id)
          );

          const founderName = normalizeFounderName(
            s.account?.name
          );

          const drafts = selected.map((p, i) => ({
            id: `o${Date.now()}${i}`,
            prospectId: p.id,
            ownerEmail: s.account?.email || "",
            company: p.company,
            person: p.person,
            subject: `Exploring ${s.startup?.product ? "a potential fit" : "a possible business fit"} for ${p.company}`,
            body: buildInitialEmail(p, s.startup, s.icp, founderName),
            initialEmailCustomized: false,
            subjectCustomized: false,
            selectedAttachments: [],
            extraAttachments: [],
            status: "Needs review",
            step: "Initial email",
            intent: "Not received",
            followUps: []
          }));

          return {
            ...s,
            outreach: [...drafts, ...s.outreach],
            activities: drafts.length
              ? addActivity(
                  s.activities,
                  "Outreach drafts created",
                  `${drafts.length} selected prospect(s) added to the review queue.`,
                  "mail"
                )
              : s.activities
          };
        }),

      updateBookingUrl: bookingUrl =>
        setState(s => ({
          ...s,
          bookingUrl
        })),

      markBookingLinkSentDemo: id =>
        setState(s => {
          const item = s.outreach.find(
            o => o.id === id
          );

          if (!item) return s;

          const sentAt = new Date().toISOString();

          return {
            ...s,
            outreach: s.outreach.map(o =>
              o.id === id
                ? {
                    ...o,
                    bookingLinkSent: true,
                    bookingLinkSentAt: sentAt,
                    status: "Booking link sent (demo)"
                  }
                : o
            ),
            prospects: s.prospects.map(p =>
              p.id === item.prospectId
                ? {
                    ...p,
                    bookingLinkSent: true,
                    bookingLinkSentAt: sentAt,
                    status: "Booking link sent"
                  }
                : p
            ),
            activities: addActivity(
              s.activities,
              "Booking link recorded (demo)",
              `Booking link action recorded for ${item.company}. No real email was sent.`,
              "mail"
            )
          };
        }),

      markFollowUpSentDemo: prospectId =>
        setState(s => {
          const prospect = s.prospects.find(
            p => p.id === prospectId
          );

          if (!prospect) return s;

          const existing = Array.isArray(prospect.followUps)
            ? prospect.followUps
            : [];

          const count = Math.max(
            existing.length,
            Number(prospect.followUpCount) || 0,
            prospect.followUp2Sent
              ? 2
              : prospect.followUp1Sent
                ? 1
                : 0
          );

          const status = String(
            prospect.status || ""
          ).toLowerCase();

          const intent = String(
            prospect.replyIntent || prospect.intent || ""
          ).toLowerCase();

          const stopped =
            prospect.meetingBooked === true ||
            prospect.bookingLinkSent === true ||
            [
              "not interested",
              "rejected",
              "do not contact"
            ].includes(status) ||
            intent === "negative";

          if (stopped || count >= 2) return s;

          const number = count + 1;

          const followUp = {
            number,
            sentAt: new Date().toISOString(),
            demo: true
          };

          return {
            ...s,
            prospects: s.prospects.map(p =>
              p.id === prospectId
                ? {
                    ...p,
                    followUps: [...existing, followUp],
                    followUpCount: number,
                    followUp1Sent: number >= 1,
                    followUp2Sent: number >= 2,
                    status: `Follow-up ${number} recorded (demo)`
                  }
                : p
            ),
            outreach: s.outreach.map(o =>
              o.prospectId === prospectId
                ? {
                    ...o,
                    followUps: [
                      ...(Array.isArray(o.followUps)
                        ? o.followUps
                        : []),
                      followUp
                    ],
                    status: `Follow-up ${number} recorded (demo)`
                  }
                : o
            ),
            activities: addActivity(
              s.activities,
              `Follow-up ${number} recorded (demo)`,
              `Follow-up ${number} recorded for ${prospect.company}. No real email was sent.`,
              "mail"
            )
          };
        }),

      resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState({
          ...defaultState,
          account: {
            ...defaultState.account
          },
          startup: {
            ...defaultState.startup
          },
          prospects: [...allInitialProspects],
          outreach: allInitialOutreach.map(item => ({
            ...item,
            body: personalizeFounderName(
              item.body,
              DEFAULT_FOUNDER_NAME
            )
          })),
          activities: [...initialActivities]
        });
      }
    }),
    []
  );

  return (
    <PrototypeContext.Provider value={{ ...state, ...actions }}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const context = useContext(PrototypeContext);

  if (!context) {
    throw new Error(
      "usePrototype must be used inside PrototypeProvider"
    );
  }

  return context;
}
