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
    description: 'An AI agent trained on Stellaris Group\'s product documentation, FAQs, and 3 years of resolved tickets — resolving cases before they reach an agent.',
    promptTemplate: `You are {{agent_name}}, a customer support specialist at {{company_name}}. Your tone is {{tone}}. You help customers resolve issues, answer product questions, and guide them through troubleshooting steps using the knowledge base provided. Always be empathetic, concise, and offer a next step. If you cannot resolve an issue, escalate to {{escalation_contact}}.`,
    variables: {
      agent_name: 'Arya',
      company_name: 'Stellaris Group',
      tone: 'professional and empathetic',
      escalation_contact: 'support@stellarisgroup.com',
    },
    caseStudy: {
      problem: "Stellaris Group's consumer division was receiving 4,200 support tickets monthly. Our audit found 71% were repeat questions — the same 38 issues, answered manually by agents day after day. Average first response time: 6.8 hours. CSAT was at 3.1 out of 5.",
      solution: 'We trained a support AI on 480 pages of product documentation, 3 years of resolved ticket logs, and the internal escalation runbook. Deployed as the first-response layer on the Stellaris customer portal and WhatsApp Business (verified account).',
      outcome: 'The AI handles first contact on all incoming queries. Human agents now see only what the AI cannot resolve — complex billing disputes, account-specific issues, and legal escalations. Response time collapsed from hours to seconds.',
      metrics: [
        { label: 'Tickets resolved without agent', value: '68%' },
        { label: 'First response time', value: '6.8hr → 42sec' },
        { label: 'Agent hours saved / month', value: '380 hrs' },
        { label: 'CSAT improvement', value: '3.1 → 4.6' },
      ],
    },
    knowledgeBase: `# Stellaris Group — Customer Support Knowledge Base
Document Version: 4.1 | Last updated: January 2025 | Classification: Internal

## Product Portfolio (Consumer Division)

### Stellaris HomeConnect Pro
- Category: Smart Home Automation System
- SKUs: HC-Pro-1R (1 room), HC-Pro-3R (3 rooms), HC-Pro-Whole (whole home)
- Price: ₹12,999 / ₹32,999 / ₹68,999 (incl. installation)
- Warranty: 2 years on hardware, 1 year on software subscription
- App: Stellaris Home (iOS 14+, Android 10+). Download from official app stores only.
- Hub connectivity: Wi-Fi 6, Zigbee 3.0, Z-Wave Plus
- Support hours: 24/7 via app chat and WhatsApp. Phone support: 9am–9pm IST.

### Stellaris AirPure Series
- Models: AirPure 300 (300 sq ft), AirPure 600 (600 sq ft), AirPure Max (1000 sq ft)
- Warranty: 2 years parts, 1 year filters
- Filter replacement: Every 6–8 months depending on AQI in area. Order via app.
- Service centres: 127 authorised centres across India. Locate at service.stellarisgroup.com

### Stellaris HealthGuard (Wearable)
- SKUs: HealthGuard Fit, HealthGuard Pro, HealthGuard Clinical
- Warranty: 1 year hardware, extended coverage available at ₹799/year
- Sync: Bluetooth 5.3 to Stellaris Health app
- Clinical models require 30-day break-in period for accurate readings

## Common Issues & Resolutions

### Device Not Connecting to App
1. Ensure Bluetooth and Location permissions are enabled for the Stellaris app
2. Restart the device (hold power button 8 seconds)
3. On app: Go to Devices → Remove device → Re-add
4. Still failing? Factory reset device: hold power + volume down for 12 seconds
5. If factory reset does not work → Raise ticket for hardware swap under warranty

### Billing & Subscription
- Invoices emailed on purchase date and on every renewal anniversary
- Subscription cancellation: Settings → Subscription → Cancel. Immediate, no partial refunds.
- Upgrade/downgrade: Effective from next billing cycle. Prorated credit for downgrades.
- Failed payment: 3 retry attempts over 48 hours. Card declined → Update via app → Settings → Billing.
- Refund policy: Full refund within 14 days of purchase if product is defective. No refund for user error.

### Warranty Claims
1. Raise claim via app: Help → Warranty Claim → Upload photos
2. Claim reviewed within 48 business hours
3. If approved: Courier label sent to registered email. Reverse pickup arranged.
4. Replacement dispatched within 5 business days of item receipt at our warehouse
5. Denied claims: Appeal via legal@stellarisgroup.com with photos and purchase proof

## Escalation Matrix
- P1 (Safety concern / data breach): Immediate → +91-22-6800-0001 | legal@stellarisgroup.com
- P2 (Product not working, no workaround): 2hr SLA → support@stellarisgroup.com
- P3 (Billing / subscription dispute): 24hr SLA → billing@stellarisgroup.com
- P4 (General queries): 48hr SLA → helpdesk portal at support.stellarisgroup.com

## Brand Communication Guidelines
- Never promise timelines not in this document
- Use "our team" not "I" when referring to Stellaris
- All refund decisions above ₹5,000 require supervisor approval
- Do not acknowledge any social media reports or news articles to customers`,
  },

  'hr-onboarding': {
    slug: 'hr-onboarding',
    icon: '📋',
    label: 'HR Onboarding Assistant',
    tagline: 'From day 1 to productive — faster.',
    description: 'A policy-aware AI assistant for Stellaris Group\'s 31,000 employees — answers leave queries, benefits questions, and onboarding steps without waiting for an HR email reply.',
    promptTemplate: `You are {{assistant_name}}, the HR assistant at {{company_name}}. You help new joiners and existing employees understand company policies, benefits, leave rules, and onboarding steps. Your tone is {{tone}}. Always reference the specific policy section when answering. If a question requires a human HR decision, direct them to {{hr_contact}}.`,
    variables: {
      assistant_name: 'Priya',
      company_name: 'Stellaris Group',
      tone: 'warm, clear, and encouraging',
      hr_contact: 'people@stellarisgroup.com',
    },
    caseStudy: {
      problem: 'New hires at Stellaris Group averaged 22 days to reach full productivity. The central HR team of 14 people was receiving 230+ repeat queries every month — leave balances, PF status, reimbursement rules, health insurance claims — all answers already in the Employee Handbook. HR was spending 3.5hrs/day on email triage alone.',
      solution: 'We built an onboarding AI trained on the Employee Handbook (312 pages), HR policy repository, and a curated Q&A bank extracted from 2 years of HR support tickets. Deployed on the internal Stellaris People Portal and WhatsApp.',
      outcome: 'New hires now self-serve 85% of their HR questions on Day 1 without raising a ticket. Onboarding TAT dropped from 22 to 13 days. The HR team redirected 60+ hours/month to talent development and manager coaching.',
      metrics: [
        { label: 'Onboarding TAT reduction', value: '22d → 13d' },
        { label: 'Fewer repeat HR queries', value: '85%' },
        { label: 'HR hours reclaimed / month', value: '62 hrs' },
        { label: 'New hire satisfaction (Day 30)', value: '4.8 / 5' },
      ],
    },
    knowledgeBase: `# Stellaris Group — Employee Handbook & HR Policy Reference
Document Version: 7.2 | FY2025 | HR Classification: All Employees

## Leave Policy (Effective April 2025)

### Casual Leave (CL)
- Entitlement: 12 days/year. January to December.
- Non-carry-forward. Lapse on December 31st.
- Application: Minimum 1 working day prior notice via People Portal.
- Approval: Reporting manager. Cannot be more than 3 consecutive days.

### Sick Leave (SL)
- Entitlement: 10 days/year
- Medical certificate required for absences exceeding 2 consecutive days
- Non-encashable. Balance resets each April 1st.
- Mental health days: Up to 3 SL days may be taken without medical certificate (self-declaration).

### Earned Leave (EL)
- Accrual: 1.25 days/month (15 days/year)
- Carry-forward: Maximum 45 days across years
- Encashment: Available at separation or voluntarily once per year in December (max 10 days)
- Application: Minimum 7 working days prior notice for absences over 3 days

### Special Leaves
- Maternity: 26 weeks paid (Per Maternity Benefit Amendment Act 2017)
- Paternity: 10 days paid within 6 months of child birth/adoption
- Bereavement: 3 days (immediate family), 1 day (extended family)
- Marriage: 5 days (once in service tenure)
- Public Holidays: 12 per year (listed in People Portal under Calendar)

## Compensation & Benefits

### Salary & Payroll
- Salary credited on the last working day of the month
- Pay slip: Available in People Portal → My Payslips → Download
- Payroll queries: Raise ticket under "Payroll" category. SLA: 3 business days.
- Bank account change: Submit Form HR-09 to payroll@stellarisgroup.com. Effective next month.

### Provident Fund (PF)
- Employer contribution: 12% of basic salary
- Employee contribution: 12% of basic salary
- UAN activation: Within 30 days of joining. Check People Portal → My PF.
- Withdrawal: Portal-based after exit. Processing time: 15–30 working days.

### Health Insurance (Group Mediclaim Policy)
- Sum insured: ₹6 lakh per family (employee + spouse + 2 children + parents up to 60 yrs)
- Premium: Fully paid by Stellaris Group
- Policy provider: Star Health Insurance | TPA: Medi Assist
- Cashless hospitals: 12,000+ across India. Check network at mediassist.in
- Enrollment: Within 30 days of joining. Late enrollment not permitted until next cycle.
- Claims: Reimbursement claims within 90 days of treatment. Submit via Medi Assist app.

### Flexi Benefits (Annual Basket: ₹18,000)
Claimable categories (any combination):
- Mobile/Internet bill reimbursement
- Books & periodicals (professional)
- Fitness membership (gym / yoga / sports)
- Submit receipts by 25th of each month via People Portal → Claims

## Reimbursements

### Travel
- Domestic flights: Economy class up to Assistant Manager level; Business allowed for Senior Manager+
- Hotel: ₹4,500/night (Tier-1 cities), ₹3,000/night (other cities) for Manager and above
- Claims via Zoho Expense within 30 days of travel. Original receipts mandatory above ₹2,000.

### Relocation Allowance
- New joiners relocating to company city: One-time ₹60,000 (claimable within 90 days of joining)
- Inter-city transfer by company: Actuals up to ₹1,20,000

## Onboarding Checklist: Days 1–30

| Day | Action |
|-----|--------|
| Day 1 | Collect ID card, laptop, access card from Facilities. Set up company email. Join Slack workspace via welcome email. |
| Day 1–3 | Complete KYC for payroll: Bank account, PAN, Aadhaar upload via People Portal |
| Day 3 | Access Stellaris Learning (LMS) at learn.stellarisgroup.com and complete Orientation Module (3 hrs) |
| Day 5 | Meet your designated Buddy (assigned by HR). Schedule 30-min intro call |
| Day 7 | Complete mandatory compliance training: POSH, Code of Conduct, Data Security (2.5 hrs, LMS) |
| Day 14 | 1:1 with reporting manager for 30-day goal setting |
| Day 21 | HR check-in call (People Partner assigned to your BU will reach out) |
| Day 30 | Probation review with manager. Confirmation letter issued if satisfactory |

## Key HR Contacts

| Team | Email | Ext |
|------|-------|-----|
| General HR queries | people@stellarisgroup.com | 101 |
| Payroll | payroll@stellarisgroup.com | 103 |
| Health Insurance | insurance@stellarisgroup.com | 105 |
| IT Setup (Day 1) | itsupport@stellarisgroup.com | 200 |
| Employee Relations | er@stellarisgroup.com | 108 |
| Learning & Development | learn@stellarisgroup.com | 110 |`,
  },

  'sales-intelligence': {
    slug: 'sales-intelligence',
    icon: '💼',
    label: 'Sales Intelligence Bot',
    tagline: 'Every rep, always ready.',
    description: 'An AI co-pilot for Stellaris Technology Services\' sales team — surfaces the right specs, pricing, case studies, and objection responses in real-time during discovery calls.',
    promptTemplate: `You are {{bot_name}}, a sales intelligence assistant at {{company_name}}. You help {{rep_name}} and the sales team answer prospect questions, find the right product tier, handle objections, and craft compelling proposals. Your tone is {{tone}}. Prioritise accuracy over enthusiasm — cite specific numbers, specs, and case studies from the knowledge base.`,
    variables: {
      bot_name: 'Compass',
      company_name: 'Stellaris Technology Services',
      rep_name: 'the sales team',
      tone: 'confident and data-driven',
    },
    caseStudy: {
      problem: "The Stellaris Technology Services sales team was losing 1 in 3 deals not on price — on knowledge gaps. Prospects asked specific questions during discovery calls: integration compatibility, security certifications, SLA details, deployment timelines. Reps either guessed or promised follow-up emails. 42% of those follow-up cycles went cold.",
      solution: "We trained a sales AI on 5 years of product specs, current pricing sheets, 23 competitive battle cards, and the 60 most common objection responses from the sales playbook. Deployed in the CRM sidebar so it's available during live calls without switching context.",
      outcome: "Reps now get instant, accurate answers during discovery without putting prospects on hold. Proposal quality scores increased by 2.3× based on win/loss reviews. Deal cycle shortened by 26% because the follow-up email loop was eliminated.",
      metrics: [
        { label: 'Better proposal quality', value: '2.3×' },
        { label: 'Faster deal closure', value: '26%' },
        { label: 'Follow-up conversion rate', value: '+38%' },
        { label: 'New rep ramp time', value: '−47%' },
      ],
    },
    knowledgeBase: `# Stellaris Technology Services — Sales Enablement Guide
Version 6.0 | Q1 2025 | For Internal Sales Use Only

## Product Portfolio: StellarOps Platform

### StellarOps Starter
- Target: Teams of 5–24 users
- Price: ₹2,200/user/month (monthly) | ₹1,799/user/month (annual)
- Core features: Workflow automation (50 workflows), 10GB storage, email support (24hr SLA), 100 API calls/min
- Integrations: Zoho, Slack, Google Workspace, Microsoft 365
- Data residency: India (Mumbai) — AWS ap-south-1
- Deployment: Cloud only. Setup time: Same day.

### StellarOps Growth
- Target: 25–199 users
- Price: ₹3,999/user/month (annual, min 25 seats)
- Core features: All Starter + Advanced analytics dashboard, SSO (SAML 2.0), custom integrations via API, 100GB storage, 1,000 API calls/min, dedicated Customer Success Manager, 99.9% SLA
- Integrations: All Starter + Salesforce, SAP, Oracle, custom webhooks
- Setup time: 3–5 business days with CS team

### StellarOps Enterprise
- Target: 200+ users, regulated industries
- Price: Custom (typical: ₹3.8L–₹12L/month for 200–500 seat deals)
- Core features: All Growth + On-premise deployment option, custom SLAs (up to 99.99%), white-labelling, dedicated infrastructure, 24/7 premium support, quarterly business reviews
- Compliance: HIPAA, DPDP Act 2023, GDPR ready upon request
- Typical sales cycle: 6–12 weeks. Involves procurement, legal, and CISO.

## Key Differentiators

### vs. WorkflowMax (main competitor)
- We have native WhatsApp Business and RCS integrations. WorkflowMax requires Twilio middleware (+₹800/user/month).
- Our data never leaves India (AWS Mumbai). WorkflowMax defaults to Singapore region (compliance risk for BFSI clients).
- StellarOps has a 4.6/5 rating on G2 vs. WorkflowMax's 3.9/5.
- Our implementation timeline: 5–14 days. WorkflowMax avg: 6–8 weeks.

### vs. In-house build
- 12-week deployment vs. 18–24 month build timeline
- No DevOps overhead. No SLA responsibility.
- ROI case: Share the "Build vs. Buy" calculator with CFO-level contacts (link in CRM)

## Top Objections & Responses

**"It's too expensive"**
→ Run the ROI calculator together on the call. Average payback period across our 340 clients: 4.1 months. Share the NBFC case study (62% cost reduction in 6 months).

**"We're already evaluating [WorkflowMax / competitor]"**
→ Offer a free 30-day parallel run: both platforms on a single use case. Let the data speak. We've won 19 of 23 parallel evaluations in FY25.

**"Data security / compliance concerns"**
→ SOC 2 Type II (last audit: March 2025), ISO 27001:2022, DPDP Act 2023 compliant. Data residency: India only. Offer to sign NDA first, then share the Security Whitepaper and schedule a CISO call.

**"We need time to evaluate internally"**
→ Offer a 45-day POC with a dedicated implementation engineer (free). Set evaluation criteria together in week 1. Close date before POC end.

**"We had a bad experience with our last vendor"**
→ Ask specifically what went wrong. We have a 97% renewal rate for clients past Year 1. Offer reference calls with 3 clients in their industry (arrange via CS team).

## Certifications
- ISO 27001:2022 (Cert #IN-27001-0872, valid until March 2027)
- SOC 2 Type II (Annual KPMG audit. Last report: March 2025)
- DPDP Act 2023 — Data Fiduciary compliant
- GDPR — EU representative designated
- STQC certified (Government of India empanelled vendor)

## Current Promotions (Q1 FY2026)
- Annual plan: 2 months free (effectively 16.7% discount)
- Migration from WorkflowMax: Waived implementation fees (standard: ₹80,000–₹2,50,000)
- SME offer: Starter plan at ₹1,499/user/month for first 6 months (min 10 seats)`,
  },

  'it-helpdesk': {
    slug: 'it-helpdesk',
    icon: '💻',
    label: 'IT Helpdesk',
    tagline: 'Fix it before it becomes a ticket.',
    description: 'An AI-first L1 support layer trained on Stellaris Group\'s IT runbook — resolving 55% of tickets instantly so the IT team can work on infrastructure, not password resets.',
    promptTemplate: `You are {{bot_name}}, the IT helpdesk assistant at {{company_name}}. You help employees resolve technical issues, request software access, and follow IT policies. Your tone is {{tone}}. Always provide step-by-step instructions when guiding through a fix. For issues requiring admin access or hardware replacement, escalate to {{it_contact}}.`,
    variables: {
      bot_name: 'Resolve',
      company_name: 'Stellaris Group',
      tone: 'clear, calm, and step-by-step',
      it_contact: 'itsupport@stellarisgroup.com',
    },
    caseStudy: {
      problem: "Stellaris Group's 6-person central IT team was spending 72% of their time on L1 tickets — password resets, VPN setup, printer connectivity, software access requests. The same 44 issues, documented in their runbook, answered manually over and over. Critical infrastructure projects were perpetually delayed.",
      solution: 'We trained an IT AI on the full internal IT runbook (89 documented issues), software request catalogue, and 20 months of resolved helpdesk tickets categorised by resolution type. Deployed on the internal IT portal (it.stellarisgroup.internal) and company Slack as /helpdesk.',
      outcome: '55% of all helpdesk tickets now resolved without IT team involvement. Average resolution time dropped from 4.5 hours to 11 minutes. The IT team reclaimed 31 hours/week — enough to ship 3 major infrastructure upgrades that had been in backlog for 8 months.',
      metrics: [
        { label: 'L1 tickets auto-resolved', value: '55%' },
        { label: 'Avg resolution time', value: '4.5hr → 11min' },
        { label: 'IT hours reclaimed / week', value: '31 hrs' },
        { label: 'Employee helpdesk rating', value: '4.8 / 5' },
      ],
    },
    knowledgeBase: `# Stellaris Group — IT Infrastructure & Support Runbook
Version 8.3 | IT Department | Restricted: IT Staff + Approved AI Systems

## Network & Access

### Corporate Network (Offices)
- SSID: StellarisSecure (WPA3, certificate-based auth)
- Guest SSID: Stellaris-Guest (internet only, no intranet access)
- VPN Required: For all remote access to internal systems

### VPN Setup — Cisco AnyConnect (Standard)
1. Download: software.stellarisgroup.internal/vpn (use your employee ID to authenticate)
2. Installer: Windows (.exe), macOS (.dmg), Linux (.tar.gz)
3. Server address: vpn.stellarisgroup.com
4. Group: Select your vertical (Consumer / Tech / Infrastructure / Corporate)
5. Username: your_employee_id@stellarisgroup.com
6. Password: Your Windows/AD password
7. MFA: Microsoft Authenticator (push notification). Set up via aka.ms/MFASetup
8. Common issue: If prompted for "Certificate error" — download Stellaris Root CA from it.stellarisgroup.internal/certificates and install manually.

### Password Management
- Windows password: Ctrl+Alt+Del → Change Password (when on network or VPN)
- Self-service reset (no IT needed): go.stellarisgroup.com/reset — verify via registered mobile OTP
- Account locked (5 failed attempts): Self-unlock at go.stellarisgroup.com/unlock
- Password policy: Min 12 characters, 1 uppercase, 1 number, 1 special char. Expires every 90 days.
- Password manager: Dashlane Business (all employees). Download from software portal.

## Device Support

### Laptop Won't Connect to Corporate Wi-Fi
1. Forget the StellarisSecure network and reconnect from scratch
2. Ensure device certificate is installed: Settings → Certificates → check for "Stellaris-Device-2025"
3. Flush DNS:
   - Windows: run "ipconfig /flushdns" in an admin command prompt
   - macOS: run "sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder" in Terminal
4. Still failing → Plug in via Ethernet, raise ticket: Category = "Network / Wi-Fi"

### Outlook / Microsoft 365 Issues
- Outlook not sending/receiving: File → Account Settings → Repair → Follow wizard
- Calendar not syncing: Remove account from Outlook and re-add using Autodiscover
- Mailbox size warning (>48GB): Archive emails older than 1 year via Archive tool in Outlook
- Mobile email setup: Use Microsoft Outlook app. Server: outlook.office365.com. Enroll via Company Portal app first.

### Printer Setup
Available printers by floor (Nariman Point HQ):
- Floor 3: HP LaserJet Pro MFP (IP: 10.1.3.45) — B&W + Colour + Scan
- Floor 4: Xerox VersaLink (IP: 10.1.4.12) — B&W only, high volume
- Floor 5: Canon imageRUNNER (IP: 10.1.5.33) — Colour + Scan + Fax
- Driver download: it.stellarisgroup.internal/printers — Select model → Install

Add printer: Settings → Printers → Add → "The printer I want isn't listed" → Add by TCP/IP address → Enter IP above

### Hardware Replacement / Repair
1. Submit request: it.stellarisgroup.internal/hardware-request
2. Approvals required: Reporting manager (auto-notified)
3. SLA: Standard — 3 business days | Business Critical (documented) — Same day
4. Lost or stolen device: File FIR within 24 hours → Email ciso@stellarisgroup.com + HR within 24 hours → Remote wipe initiated by IT

## Software Access

### Approved Software Catalogue (Self-serve via portal)
- Productivity: Microsoft 365, Slack, Zoom, Google Chrome, Notion
- Design: Figma, Adobe CC (requires DH approval)
- Dev tools: VS Code, Git, Docker, Postman (Dev team only)
- Analytics: Tableau, Power BI (requires Finance/Analytics head approval)
- CRM: Salesforce (Sales team, approved by VP Sales)

### Software Request Process
1. Submit: it.stellarisgroup.internal/software-request
2. Approvals: Dept head (auto-email) → IT review (security assessment for new software)
3. SLA: Approved catalogue → 4 hours | New software (security review) → 5 business days
4. Unlicensed/pirated software: Zero-tolerance policy. Immediate escalation to CISO and HR.

## Security Policies (Key Points)
- No personal USB storage devices on company laptops. Use SharePoint or Dropbox Business.
- Phishing email: Do not click — forward to phishing@stellarisgroup.com immediately
- Social engineering attempt: Report to ciso@stellarisgroup.com within 1 hour
- Working from public Wi-Fi: VPN is mandatory. No exceptions.
- Screen lock: 5-minute idle lock policy enforced via MDM (Intune)`,
  },

  'knowledge-hub': {
    slug: 'knowledge-hub',
    icon: '🏢',
    label: 'Internal Knowledge Hub',
    tagline: 'Stop asking. Start knowing.',
    description: 'A company-wide AI assistant that makes Stellaris Group\'s institutional knowledge searchable — from org charts to project history to vendor contracts — in under 30 seconds.',
    promptTemplate: `You are {{bot_name}}, the internal knowledge assistant at {{company_name}}. You help employees find information about company processes, teams, projects, and institutional knowledge. Your tone is {{tone}}. Be concise. If you are unsure, say so rather than guessing — direct the employee to {{fallback_contact}} for information you cannot find.`,
    variables: {
      bot_name: 'Atlas',
      company_name: 'Stellaris Group',
      tone: 'helpful, direct, and neutral',
      fallback_contact: 'the relevant department head',
    },
    caseStudy: {
      problem: "At Stellaris Group, institutional knowledge lived in the heads of 23 employees with 10+ years of tenure, buried Confluence pages last edited in 2021, and Outlook threads nobody could find. New projects spent 3–5 days in kickoff just figuring out who owns what, what was tried before, and which vendor to contact. Knowledge loss from attrition was accelerating.",
      solution: "We consolidated 6 years of Confluence documentation, process SOPs, org charts, vendor contracts (non-confidential terms), and project retrospectives into a unified AI knowledge base. Accessible via chat from the Stellaris intranet homepage and Slack /atlas command.",
      outcome: 'The bot handles 3,400 queries per day across 450+ active users in 6 verticals. Cross-team collaboration increased measurably — teams stopped hoarding knowledge when they could retrieve it from anywhere. Three years of institutional knowledge is now accessible to a Day-1 employee.',
      metrics: [
        { label: '"Ask a colleague" interruptions', value: '−90%' },
        { label: 'Daily active queries', value: '3,400+' },
        { label: 'Knowledge retrieval time', value: '8hr → 28sec' },
        { label: 'Employee adoption (Month 3)', value: '94%' },
      ],
    },
    knowledgeBase: `# Stellaris Group — Internal Operations & Knowledge Directory
Version 5.1 | Corporate Affairs | For All Employees

## Company Overview

**Stellaris Group**
- Founded: 1989 by Vikram Anand Kapoor in Mumbai
- Registered: Stellaris Holdings Pvt. Ltd. → Listed as Stellaris Group Ltd. (BSE: 532148, NSE: STELLARIS) in 1994
- Headquarters: Stellaris House, Nariman Point, Mumbai 400021
- Revenue: ₹18,200 Crore (FY2025, audited)
- EBITDA: 21.4% (FY2025)
- Employees: 31,000+ (India: 26,800 | International: 4,200)
- Offices: 47 (India) + 8 (UAE, Singapore, UK, USA, Australia)

## Business Verticals

| Vertical | Revenue (FY25) | Head |
|----------|---------------|------|
| Stellaris Infrastructure | ₹6,800 Cr | Rajesh Malhotra |
| Stellaris Real Estate | ₹4,200 Cr | Sunita Krishnamurthy |
| Stellaris Technology Services | ₹3,100 Cr | Amit Verma |
| Stellaris Consumer Goods | ₹2,400 Cr | Preethi Subramaniam |
| Stellaris Healthcare | ₹900 Cr | Dr. Arun Mehta |
| Stellaris Financial Services | ₹800 Cr | Kavita Iyer |

## Leadership Directory

| Name | Role | Email | Ext |
|------|------|-------|-----|
| Aarav Kapoor | Group CEO | aarav.kapoor@stellarisgroup.com | 001 |
| Meenakshi Nair | Group CFO | meenakshi.nair@stellarisgroup.com | 002 |
| Rajan Krishnamurthy | Group CHRO & CIO (Interim) | rajan.k@stellarisgroup.com | 003 |
| Siddharth Roy | Group CLO (Legal) | siddharth.roy@stellarisgroup.com | 004 |
| Pooja Agarwal | Group CMO | pooja.agarwal@stellarisgroup.com | 005 |
| Vivek Shetty | Group COO | vivek.shetty@stellarisgroup.com | 006 |

## Key Internal Processes

### Procurement & Vendor Management
1. Raise Purchase Request (PR) in SAP Ariba
2. Approval thresholds:
   - Up to ₹1 lakh: Department head
   - ₹1–10 lakh: Finance Controller
   - ₹10–50 lakh: CFO
   - Above ₹50 lakh: CEO + Board committee
3. PO issued within 3 business days post-approval
4. Vendor onboarding: Legal → Finance → IT Security → Vendor Master. Average 12 business days.
5. Existing approved vendors: Check vendor.stellarisgroup.internal/directory (2,400+ vendors listed)

### Travel & Expense Policy
- Book via MakeMyTrip Business (company account: stellarisgroup@mmtbiz.com)
- Flight class: Economy for all up to DGM level | Business for GM+ on flights >3 hours
- Hotel limits: ₹5,500/night (Mumbai/Delhi/Bangalore) | ₹4,000/night (other Tier-1) | ₹2,800/night (Tier-2)
- Daily allowance (DA): ₹800/day domestic | $45/day international
- Expense claims: Via Zoho Expense within 30 days of travel. Original receipts mandatory above ₹1,000.
- International travel: Forex advances available via Finance. Apply 7 days before travel.

### Project Governance
1. All projects above ₹10L budget: Register in Project Management Office (PMO) system
2. PMO portal: pmo.stellarisgroup.internal
3. Mandatory artefacts: Project Charter, Risk Register, Steering Committee deck
4. Status reporting: Weekly traffic-light update in PMO system every Friday by 5pm
5. Project retrospectives: Mandatory for all projects >6 months. Output saved in Confluence.

### Legal & Contracts
- All contracts above ₹5L: Legal review mandatory (SLA: 5 business days for standard, 10 for complex)
- NDA requests: Submit template via legal.stellarisgroup.internal (turnaround: 2 business days)
- Contract repository: All signed agreements in DocuSign → SharePoint Legal Folder
- IP ownership: All work product created during employment belongs to Stellaris Group (Clause 14, Employment Agreement)

## Important Internal Portals

| Portal | URL | Purpose |
|--------|-----|---------|
| People Portal (HR) | people.stellarisgroup.internal | Leave, payroll, benefits |
| IT Helpdesk | it.stellarisgroup.internal | Tickets, software, hardware |
| Finance / Expense | zoho.stellarisgroup.internal | Claims, vendor invoices |
| PMO | pmo.stellarisgroup.internal | Project tracking |
| Learning (LMS) | learn.stellarisgroup.internal | Courses, compliance training |
| Knowledge Base | wiki.stellarisgroup.internal | Policies, SOPs, org info |
| Vendor Directory | vendor.stellarisgroup.internal | Approved vendor list |`,
  },
}

export function resolvePrompt(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (prompt, [key, value]) => prompt.replaceAll(`{{${key}}}`, value),
    template
  )
}
