export interface PersonaDef {
  slug: string
  icon: string
  label: string
  tagline: string
  description: string
  promptTemplate: string
  variables: Record<string, string>
  caseStudy: {
    problem: string
    solution: string
    outcome: string
    metrics: { label: string; value: string }[]
  }
  knowledgeBase: string
}

export const PERSONAS: Record<string, PersonaDef> = {
  'customer-support': {
    slug: 'customer-support',
    icon: '🎧',
    label: 'Customer Support Agent',
    tagline: 'Zero wait. Right answer. Every time.',
    description: 'An AI agent trained on your product documentation, FAQs, and support history — resolving tickets before they become escalations.',
    promptTemplate: `You are {{agent_name}}, a customer support specialist at {{company_name}}. Your tone is {{tone}}. You help customers resolve issues, answer product questions, and guide them through troubleshooting steps using the knowledge base provided. Always be empathetic, concise, and offer a next step. If you cannot resolve an issue, escalate to {{escalation_contact}}.`,
    variables: {
      agent_name: 'Alex',
      company_name: 'Meridian Corp',
      tone: 'professional and friendly',
      escalation_contact: 'support@meridiancorp.com',
    },
    caseStudy: {
      problem: "Meridian Corp's support team was drowning. 73% of incoming tickets were repeat questions — same product FAQs, same troubleshooting steps, answered manually by agents every single day. Average first response time: 6.2 hours.",
      solution: 'We trained a support AI on 340 pages of product documentation, 2 years of resolved tickets, and the internal troubleshooting runbook. Deployed as a first-response layer on their customer portal and WhatsApp Business.',
      outcome: 'The AI now handles first contact on all incoming queries. Human agents only see what the AI cannot resolve — complex edge cases and account-specific issues.',
      metrics: [
        { label: 'Tickets resolved without agent', value: '68%' },
        { label: 'Faster first response', value: '3.2×' },
        { label: 'Agent hours saved / month', value: '340 hrs' },
        { label: 'Customer satisfaction', value: '+22 NPS' },
      ],
    },
    knowledgeBase: `# Meridian Corp — Customer Support Knowledge Base

## Products

### MeridianEdge Pro (Enterprise Software)
- Version: 4.2.1
- Licensing: Per-seat, annual subscription. Min 10 seats.
- Platforms: Windows 10+, macOS 12+, Linux (Ubuntu 20.04+)
- Support hours: 24/7 for P1 issues; 9am–6pm IST for standard

### MeridianEdge Lite (SMB)
- Version: 4.1.0
- Licensing: Monthly subscription, 1–9 seats
- Cloud-only deployment

## Common Issues & Resolutions

### Login / Authentication
- Forgot password: Direct to /reset-password. Email arrives within 2 minutes. Check spam.
- SSO not working: Confirm IdP metadata is updated. Admin panel → Security → SSO Config.
- Account locked after 5 failed attempts: Unlock via admin console or contact support.

### Billing
- Invoices sent on the 1st of each month to the billing email on file.
- Upgrade/downgrade takes effect on next billing cycle.
- Refund policy: Pro-rated refund within 14 days of annual renewal.

### Integration & API
- REST API docs: docs.meridiancorp.com/api
- API rate limit: 1,000 req/min (Pro), 100 req/min (Lite)
- Webhook support: Available on Pro tier only.

### Data & Security
- Data stored in ISO 27001 certified AWS Mumbai region.
- GDPR compliant. Data export available under Settings → Data.
- Retention: Active data indefinitely; deleted data purged in 30 days.

## Escalation Matrix
- P1 (System down): Immediate → +91-22-4001-7890
- P2 (Feature broken): 4hr SLA → support@meridiancorp.com
- P3 (General query): 24hr SLA → helpdesk portal`,
  },

  'hr-onboarding': {
    slug: 'hr-onboarding',
    icon: '📋',
    label: 'HR Onboarding Assistant',
    tagline: 'From day 1 to productive — faster.',
    description: 'A knowledge assistant for new hires and HR teams — answers policy questions, explains benefits, and guides employees through onboarding without HR email chains.',
    promptTemplate: `You are {{assistant_name}}, the HR assistant at {{company_name}}. You help new joiners and existing employees understand company policies, benefits, leave rules, and onboarding steps. Your tone is {{tone}}. Always reference the specific policy section when answering. If a question requires a human HR decision, direct them to {{hr_contact}}.`,
    variables: {
      assistant_name: 'Priya',
      company_name: 'Meridian Corp',
      tone: 'warm, clear, and encouraging',
      hr_contact: 'hr@meridiancorp.com',
    },
    caseStudy: {
      problem: 'New hires at Meridian Corp averaged 19 days to reach full productivity. HR received 200+ repeat queries every month — leave balances, reimbursement rules, PF forms — all answers already in the employee handbook. HR was spending 3hrs/day on email triage.',
      solution: 'We built an onboarding AI trained on the employee handbook, HR policy documents, and a curated Q&A bank from 2 years of HR tickets. Deployed on the internal HR portal and WhatsApp.',
      outcome: 'New hires self-serve 85% of their HR questions on day 1. Onboarding TAT dropped by 40%. HR team now focuses on strategic work instead of answering routine policy questions.',
      metrics: [
        { label: 'Reduction in onboarding TAT', value: '40%' },
        { label: 'Fewer repeat HR queries', value: '85%' },
        { label: 'HR hours saved / month', value: '60 hrs' },
        { label: 'New hire satisfaction score', value: '4.7 / 5' },
      ],
    },
    knowledgeBase: `# Meridian Corp — HR Policy & Onboarding Guide

## Leave Policy
- Casual Leave (CL): 12 days/year. Non-carry-forward. Apply 1 day prior.
- Sick Leave (SL): 8 days/year. Medical cert required for 3+ consecutive days.
- Earned Leave (EL): 15 days/year. Can carry forward up to 30 days. Encashable at separation.
- Maternity Leave: 26 weeks paid (as per Maternity Benefit Act).
- Paternity Leave: 5 days paid within 6 months of birth.
- Leave Without Pay (LWP): Approved by department head + HR. Max 30 days/year.

## Compensation & Benefits
- Salary credited on the last working day of the month.
- Performance bonus: Twice a year (April and October). Based on ratings.
- PF: 12% employer + 12% employee. UAN activated within 30 days of joining.
- Gratuity: Applicable after 5 years of continuous service.
- Health insurance: Family floater of Rs 5 lakhs. Cashless at 500+ hospitals. Enroll within 30 days.
- Flexi benefits: Rs 15,000/year for phone, broadband, or books. Submit receipts via expense portal.

## Reimbursements
- Travel: Economy class for domestic. Claims within 30 days. Via Zoho Expense.
- Mobile: Up to Rs 1,000/month. Submit bill by 25th of each month.
- Relocation: Up to Rs 50,000 for new joiners relocating to office city. One-time, within 90 days.

## Onboarding Checklist (Day 1–30)
- Day 1: ID card, laptop setup, email access, Slack invite
- Day 3: Complete KYC for payroll (bank account, PAN, Aadhaar)
- Day 7: Complete compliance training (2 hrs, on LMS)
- Day 14: Buddy meeting with HR
- Day 30: Probation review with reporting manager

## Contacts
- HR queries: hr@meridiancorp.com | Ext: 101
- Payroll: payroll@meridiancorp.com | Ext: 103
- IT setup: itsupport@meridiancorp.com | Ext: 200`,
  },

  'sales-intelligence': {
    slug: 'sales-intelligence',
    icon: '💼',
    label: 'Sales Intelligence Bot',
    tagline: 'Every rep, always ready.',
    description: 'An AI co-pilot for sales teams — instantly surfaces the right product specs, pricing, case studies, and objection responses so reps close faster.',
    promptTemplate: `You are {{bot_name}}, a sales intelligence assistant at {{company_name}}. You help {{rep_name}} and the sales team answer prospect questions, find the right product tier, handle objections, and craft compelling proposals. Your tone is {{tone}}. Prioritise accuracy over enthusiasm — cite specific numbers, specs, and case studies from the knowledge base.`,
    variables: {
      bot_name: 'Compass',
      company_name: 'Meridian Corp',
      rep_name: 'the sales team',
      tone: 'confident and data-driven',
    },
    caseStudy: {
      problem: "Meridian's sales reps were losing deals not on price, but on knowledge. Prospects asked specific questions — integration compatibility, security certifications, SLA details — and reps either guessed or promised to follow up by email. 40% of those follow-up cycles never converted.",
      solution: "We trained a sales AI on product specs, pricing sheets, competitive battle cards, and the top 50 objection responses from the sales playbook. Available in the CRM sidebar during live calls.",
      outcome: "Reps now get real-time answers during discovery calls. Proposal quality scores improved by 2.1×. Average deal cycle shortened by 23% because the follow-up loop was eliminated.",
      metrics: [
        { label: 'Better proposal quality', value: '2.1×' },
        { label: 'Faster deal closure', value: '23%' },
        { label: 'Follow-up conversion rate', value: '+31%' },
        { label: 'Ramp time for new reps', value: '−45%' },
      ],
    },
    knowledgeBase: `# Meridian Corp — Sales Intelligence Knowledge Base

## Product Tiers & Pricing

### MeridianEdge Lite
- Price: Rs 2,499/seat/month (monthly) | Rs 1,999/seat/month (annual)
- Seats: 1–9
- Features: Core workflow automation, 5GB storage, email support, 100 API calls/min
- Best for: Startups, small teams

### MeridianEdge Pro
- Price: Rs 4,999/seat/month (annual, min 10 seats)
- Features: All Lite + Advanced analytics, SSO, custom integrations, 1TB storage, 1000 API calls/min, dedicated CSM, SLA: 99.9%
- Best for: Mid-market, growing enterprises

### MeridianEdge Enterprise
- Price: Custom (avg Rs 3.2L/month for 50-seat deals)
- Features: All Pro + On-prem option, custom SLAs, white-labelling, dedicated infrastructure
- Best for: BFSI, healthcare, government

## Key Differentiators vs Competition
- vs. CompetitorX: We have native WhatsApp and email integrations. They require third-party middleware.
- vs. CompetitorY: Our data never leaves India (AWS Mumbai). They default to US East region.
- vs. in-house builds: 12-week deployment vs. 12-month build. No maintenance overhead.

## Top Objections & Responses
- "It's too expensive": ROI calculator shows average payback in 4.2 months. Share the Fintech Case Study.
- "We already have a solution": Offer a free 2-week parallel run. Let the data speak.
- "Data security concerns": ISO 27001, SOC 2 Type II certified. Data residency in India. Sign NDA first, then share security whitepaper.
- "We need time to evaluate": Offer a 30-day POC with a dedicated implementation engineer.

## Certifications & Compliance
- ISO 27001:2022 certified
- SOC 2 Type II (annual audit, last: March 2026)
- GDPR, DPDP Act 2023 compliant
- Available on: AWS, Azure (on-prem option for Enterprise)`,
  },

  'it-helpdesk': {
    slug: 'it-helpdesk',
    icon: '💻',
    label: 'IT Helpdesk',
    tagline: 'Fix it before it becomes a ticket.',
    description: 'An AI-first IT support layer that resolves common issues from your runbooks instantly — so your IT team handles what actually needs a human.',
    promptTemplate: `You are {{bot_name}}, the IT helpdesk assistant at {{company_name}}. You help employees resolve technical issues, request software access, and follow IT policies. Your tone is {{tone}}. Always provide step-by-step instructions when guiding through a fix. For issues requiring admin access or hardware replacement, escalate to {{it_contact}}.`,
    variables: {
      bot_name: 'Resolve',
      company_name: 'Meridian Corp',
      tone: 'clear, calm, and step-by-step',
      it_contact: 'itsupport@meridiancorp.com',
    },
    caseStudy: {
      problem: "Meridian's 3-person IT team was spending 70% of their time on L1 tickets — password resets, VPN setup, printer issues, software install requests. Actual infrastructure work kept getting deprioritised.",
      solution: 'We trained an IT AI on the internal runbook, software request processes, and 18 months of resolved helpdesk tickets. Deployed on the internal IT portal. The AI handles L1; humans handle L2+.',
      outcome: '55% of all tickets now resolved without IT team involvement. Average resolution time dropped from 4.5 hours to 12 minutes. IT team reclaimed 28 hours/week for infrastructure projects.',
      metrics: [
        { label: 'L1 ticket reduction', value: '55%' },
        { label: 'Resolution time', value: '4.5hr → 12min' },
        { label: 'IT hours reclaimed / week', value: '28 hrs' },
        { label: 'Employee satisfaction', value: '4.8 / 5' },
      ],
    },
    knowledgeBase: `# Meridian Corp — IT Helpdesk Runbook

## Password & Access

### Reset Windows Password
1. Press Ctrl+Alt+Del and select "Change a password"
2. If locked out: Go to login screen, click "Reset password", verify with phone OTP
3. Still stuck? Raise ticket with employee ID

### VPN Setup (Cisco AnyConnect)
1. Download from software portal: software.meridiancorp.internal
2. Server: vpn.meridiancorp.com
3. Group: Select your department (Sales / Tech / HR / Ops)
4. Username: your email. Password: your Windows password
5. MFA: Authenticate via Microsoft Authenticator app

### Software Access Requests
- Submit via IT portal: it.meridiancorp.internal/request
- Approval: Dept head + IT. SLA: 2 business days
- Licensed software: Adobe CC, AutoCAD, Tableau, Slack (Pro), Zoom

## Common Issues

### Laptop Not Connecting to Wi-Fi
1. Forget network and reconnect
2. Flush DNS: Run ipconfig /flushdns (Windows) or sudo dscacheutil -flushcache (Mac)
3. Still failing? Try Ethernet and raise a ticket for Wi-Fi card check

### Outlook Not Syncing
1. File → Account Settings → Repair account
2. If recurring: Delete Outlook profile and recreate
3. Check mailbox size: If over 50GB, archiving is required

### Printer Not Found
1. Open printer settings → Add printer → Search network
2. Use printer IP: 10.0.1.45 (Floor 1), 10.0.1.46 (Floor 2), 10.0.1.47 (Floor 3)
3. Driver: Download from it.meridiancorp.internal/printers

## Hardware Replacement
- Request via IT portal. Manager approval required.
- Replacement SLA: 3 business days (standard) / Same day (business critical)
- Lost/stolen: File police complaint + email ciso@meridiancorp.com within 24 hrs`,
  },

  'knowledge-hub': {
    slug: 'knowledge-hub',
    icon: '🏢',
    label: 'Internal Knowledge Hub',
    tagline: 'Stop asking. Start knowing.',
    description: 'A company-wide AI assistant that makes your institutional knowledge searchable and conversational — from org charts to project history to process docs.',
    promptTemplate: `You are {{bot_name}}, the internal knowledge assistant at {{company_name}}. You help employees find information about company processes, teams, projects, and institutional knowledge. Your tone is {{tone}}. Be concise. If you are unsure, say so rather than guessing — direct the employee to {{fallback_contact}} for information you cannot find.`,
    variables: {
      bot_name: 'Atlas',
      company_name: 'Meridian Corp',
      tone: 'helpful, direct, and neutral',
      fallback_contact: 'the relevant department head',
    },
    caseStudy: {
      problem: 'At Meridian Corp, institutional knowledge lived in the heads of long-tenured employees, buried Confluence pages, and email threads no one could find. New projects spent 3–5 days just figuring out who owns what and how things were done last time.',
      solution: 'We consolidated 4 years of Confluence pages, process documents, org charts, and project retrospectives into a single AI knowledge base. Accessible via chat, deployed on the intranet homepage.',
      outcome: 'The bot now handles 3,200 queries a day across 450 employees. Onboarding speed improved. Cross-team collaboration increased because people stopped hoarding knowledge in siloed channels.',
      metrics: [
        { label: 'Fewer "ask a colleague" interruptions', value: '90%' },
        { label: 'Daily active queries', value: '3,200' },
        { label: 'Knowledge retrieval time', value: '8hr → 30sec' },
        { label: 'Employee adoption rate', value: '94%' },
      ],
    },
    knowledgeBase: `# Meridian Corp — Internal Knowledge Base

## Company Overview
- Founded: 2014, Mumbai
- HQ: Bandra Kurla Complex, Mumbai 400051
- Offices: Mumbai (HQ), Bangalore, Hyderabad, Delhi NCR, Singapore
- Employees: ~850 (India) + 120 (international)
- FY2025 Revenue: Rs 142 crore
- Primary business: Enterprise software (MeridianEdge suite) + implementation services

## Leadership Team
- CEO: Rohit Sharma (rohit.sharma@meridiancorp.com)
- CTO: Ananya Krishnan (ananya.krishnan@meridiancorp.com)
- CFO: Vikram Mehta
- CPO: Deepika Nair
- VP Sales: Arjun Pillai

## Key Processes

### Procurement (Vendor / Software)
1. Raise PR in Zoho Books
2. Approvals: under Rs 50K = dept head; Rs 50K–5L = Finance; above 5L = CFO
3. PO issued within 3 business days post-approval
4. Vendor onboarding: Legal → Finance → IT. Average 10 business days

### Travel & Expense
- Book via Cleartrip for Business (company account)
- Economy domestic, business international for directors+
- Submit expense claims within 30 days of travel
- Reimbursement: Next payroll cycle

### Project Kickoff Checklist
- Assign PM and DM in Jira
- Create project Slack channel (#proj-[name])
- Set up shared folder in Google Drive
- Schedule weekly standup (Monday 10am)
- Risk register in Confluence within Week 1

## Org Structure (simplified)
- Engineering: Reports to CTO. 3 pods: Platform, Product, Infrastructure
- Sales: Reports to VP Sales. Split: Enterprise, Mid-Market, SMB
- HR: Reports to CEO. Sub-teams: Talent, L&D, Payroll, Admin
- Finance: Reports to CFO. Sub-teams: Accounting, FP&A, Legal

## Important Portals
- HR: hr.meridiancorp.internal
- IT: it.meridiancorp.internal
- Finance / Expense: zoho.meridiancorp.internal
- Project Mgmt: jira.meridiancorp.internal
- Knowledge Base: wiki.meridiancorp.internal`,
  },
}

export function resolvePrompt(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (prompt, [key, value]) => prompt.replaceAll(`{{${key}}}`, value),
    template
  )
}
