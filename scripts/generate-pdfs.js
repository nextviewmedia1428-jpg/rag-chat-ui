#!/usr/bin/env node
/**
 * Generates 5 Stellaris Group knowledge base PDFs.
 * Run: node scripts/generate-pdfs.js
 * Output: public/knowledge-base-pdfs/
 */

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, '../public/knowledge-base-pdfs')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const TEAL = '#0D9488'
const DARK = '#1A1A2E'
const GRAY = '#6B7280'
const BLACK = '#111827'

function pdf(filename, build) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: 'A4' })
    const out = fs.createWriteStream(path.join(OUT, filename))
    doc.pipe(out)
    out.on('finish', resolve)
    out.on('error', reject)
    build(doc)
    doc.end()
  })
}

function cover(doc, title, subtitle, version) {
  doc.rect(0, 0, doc.page.width, 180).fill(DARK)
  doc.fillColor(TEAL).fontSize(22).font('Helvetica-Bold')
    .text('STELLARIS GROUP', 60, 60)
  doc.fillColor('white').fontSize(16).font('Helvetica')
    .text(title, 60, 95)
  doc.fillColor('#94A3B8').fontSize(10)
    .text(subtitle, 60, 120)
  doc.fillColor('#64748B').fontSize(9)
    .text(version, 60, 145)
  doc.fillColor(BLACK).fontSize(11).font('Helvetica').moveDown(8)
}

function h1(doc, text) {
  doc.moveDown(1.2)
  doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold').text(text)
  doc.moveDown(0.3)
  doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).stroke(TEAL)
  doc.moveDown(0.5)
}

function h2(doc, text) {
  doc.moveDown(0.8)
  doc.fillColor(TEAL).fontSize(11).font('Helvetica-Bold').text(text)
  doc.moveDown(0.3)
  doc.fillColor(BLACK).font('Helvetica').fontSize(10)
}

function body(doc, text) {
  doc.fillColor('#374151').font('Helvetica').fontSize(10).text(text, { lineGap: 3 })
  doc.moveDown(0.4)
}

function bullet(doc, items) {
  for (const item of items) {
    doc.fillColor('#374151').font('Helvetica').fontSize(10)
      .text(`• ${item}`, { lineGap: 3, indent: 12 })
  }
  doc.moveDown(0.4)
}

function table(doc, headers, rows) {
  const colW = (doc.page.width - 120) / headers.length
  const x0 = 60
  let y = doc.y

  // Header row
  doc.rect(x0, y, doc.page.width - 120, 20).fill('#F1F5F9')
  headers.forEach((h, i) => {
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9)
      .text(h, x0 + i * colW + 4, y + 5, { width: colW - 8 })
  })
  y += 20

  rows.forEach((row, ri) => {
    if (y > doc.page.height - 100) { doc.addPage(); y = 60 }
    if (ri % 2 === 0) doc.rect(x0, y, doc.page.width - 120, 18).fill('#F9FAFB')
    row.forEach((cell, i) => {
      doc.fillColor('#374151').font('Helvetica').fontSize(9)
        .text(String(cell), x0 + i * colW + 4, y + 4, { width: colW - 8 })
    })
    y += 18
  })

  doc.y = y + 8
  doc.moveDown(0.5)
}

// ─── PDF 1: Customer Support ────────────────────────────────────────────────
async function pdf1() {
  await pdf('stellaris-customer-support-handbook.pdf', (doc) => {
    cover(doc,
      'Customer Experience & Support Policy',
      'Stellaris Consumer Division · Customer Support Operations',
      'Version 4.1 · January 2025 · Internal Classification: Restricted'
    )

    h1(doc, '1. Introduction & Scope')
    body(doc, 'This handbook defines the customer support policies, escalation procedures, and service standards for the Stellaris Consumer Division. It applies to all customer-facing agents, first-response AI systems, and third-party support partners engaged by Stellaris Group Ltd.')
    body(doc, 'Adherence to this handbook is mandatory. Deviation from the escalation matrix or refund policy requires written approval from the Head of Customer Experience (Preethi Subramaniam, VP — Consumer Division).')

    h1(doc, '2. Product Portfolio')

    h2(doc, '2.1 Stellaris HomeConnect Pro')
    bullet(doc, [
      'Smart home automation platform. Three SKUs: HC-Pro-1R (1 room), HC-Pro-3R (3 rooms), HC-Pro-Whole (whole home)',
      'Price: ₹12,999 / ₹32,999 / ₹68,999 inclusive of standard installation',
      'Hardware warranty: 24 months from date of purchase',
      'Software subscription: 12 months included, renewable at ₹1,499/year',
      'Connectivity: Wi-Fi 6, Zigbee 3.0, Z-Wave Plus. Hub model: SG-Hub-X3',
      'Compatible app: Stellaris Home (iOS 14+, Android 10+). Download from App Store / Google Play only.',
      'Support channels: 24/7 in-app chat and WhatsApp (+91 98800 11234). Phone: 9am–9pm IST Mon–Sat.',
    ])

    h2(doc, '2.2 Stellaris AirPure Series')
    bullet(doc, [
      'Models: AirPure 300 (up to 300 sq ft), AirPure 600 (up to 600 sq ft), AirPure Max (up to 1000 sq ft)',
      'Warranty: 24 months on unit, 12 months on filters from date of first filter installation',
      'Filter replacement cycle: Every 6–8 months based on local AQI (app sends automated reminders)',
      'Authorised service centres: 127 locations across India. Locate via service.stellarisgroup.com',
      'Filter ordering: In-app under "Consumables" → "Order Filter". Same-day delivery in 28 cities.',
    ])

    h2(doc, '2.3 Stellaris HealthGuard Wearable Series')
    bullet(doc, [
      'SKUs: HealthGuard Fit (fitness), HealthGuard Pro (health monitoring), HealthGuard Clinical (medical-grade)',
      'Hardware warranty: 12 months. Extended warranty available: ₹799/year for Pro, ₹1,499/year for Clinical',
      'Sync method: Bluetooth 5.3 to Stellaris Health app (iOS 15+, Android 11+)',
      'Clinical models: Require 30-day calibration period before readings are considered stable',
      'Battery life: Fit (7 days), Pro (4 days), Clinical (3 days). Charging: Magnetic dock included',
    ])

    doc.addPage()

    h1(doc, '3. Common Issues & Standard Resolutions')

    h2(doc, '3.1 Device Not Pairing with App')
    body(doc, 'Follow this resolution sequence before raising a ticket:')
    bullet(doc, [
      'Step 1: Confirm Bluetooth is ON and Location permissions are granted to the Stellaris app',
      'Step 2: Force-close the app and reopen. Retry pairing from Devices → Add New Device',
      'Step 3: Restart device (hold power button 8 seconds until LED blinks twice)',
      'Step 4: If pairing still fails, factory reset the device: hold Power + Volume Down for 12 seconds until LED blinks red 3 times',
      'Step 5: If factory reset does not resolve — raise ticket Category: "Hardware Defect". SLA: replacement under warranty within 5 business days.',
    ])

    h2(doc, '3.2 Billing & Subscription Issues')
    bullet(doc, [
      'Invoices: Emailed to registered email on purchase date and on every renewal anniversary',
      'Failed payment: System retries 3 times over 48 hours. After 3 failures, subscription suspends.',
      'Update card: App → Settings → Billing → Payment Method → Update',
      'Cancellation: App → Settings → Subscription → Cancel Plan. Immediate effect. No prorated refund.',
      'Upgrade/downgrade: Effective from next billing cycle. Downgrade credits are applied as wallet balance.',
      'Refund policy: Full refund within 14 days of purchase for hardware defects. No refund for user error or change of mind beyond 7 days.',
    ])

    h2(doc, '3.3 Warranty Claims')
    bullet(doc, [
      'Step 1: Customer raises claim via app: Help → Warranty Claim → Describe issue → Upload photos (minimum 3)',
      'Step 2: Claim reviewed by Quality team within 48 business hours',
      'Step 3: Approved claims: Courier label sent to customer within 24 hours. Reverse pickup scheduled.',
      'Step 4: Replacement dispatched within 5 business days of receiving the defective unit at our Pune warehouse',
      'Step 5: Rejected claims (misuse, physical damage): Customer notified with reasons. Appeal via legal@stellarisgroup.com with supporting evidence.',
    ])

    h1(doc, '4. Escalation Matrix')
    table(doc,
      ['Priority', 'Trigger', 'SLA', 'Contact'],
      [
        ['P1 — Critical', 'Safety risk, data breach, media-reported issue', '15 minutes', '+91-22-6800-0001 / legal@stellarisgroup.com'],
        ['P2 — High', 'Product completely non-functional, no workaround', '2 hours', 'support@stellarisgroup.com'],
        ['P3 — Medium', 'Billing dispute, subscription issue, partial function failure', '24 hours', 'billing@stellarisgroup.com'],
        ['P4 — Low', 'General queries, how-to questions, feature requests', '48 hours', 'Helpdesk portal: support.stellarisgroup.com'],
      ]
    )

    h1(doc, '5. Agent Communication Guidelines')
    bullet(doc, [
      'Always use "our team" — never "I" — when referring to Stellaris as an entity',
      'Never promise delivery timelines, refund timelines, or fix ETAs not explicitly stated in this document',
      'All refund approvals above ₹5,000 require written sign-off from Team Lead or above',
      'Do not acknowledge competitor complaints or social media statements to customers',
      'If a customer becomes aggressive or uses abusive language: one verbal warning, then escalate to P1 and disconnect',
      'All interactions to be logged in Freshdesk within 30 minutes of conversation close',
    ])
  })
  console.log('✓ PDF 1: Customer Support Handbook')
}

// ─── PDF 2: HR & Employee Handbook ──────────────────────────────────────────
async function pdf2() {
  await pdf('stellaris-employee-handbook.pdf', (doc) => {
    cover(doc,
      'Employee Handbook & HR Policy Reference',
      'Stellaris Group People Operations · FY2025 Edition',
      'Version 7.2 · April 2025 · All Employees · Confidential'
    )

    h1(doc, '1. Welcome to Stellaris Group')
    body(doc, 'Stellaris Group was founded in 1989 with a simple thesis: build businesses that outlast their founders. Today, with ₹18,200 Crore in revenue across six verticals and 31,000+ employees in 55 offices worldwide, that thesis has proven out.')
    body(doc, 'This handbook covers every policy you need to navigate your career at Stellaris Group: leave entitlements, compensation, benefits, reimbursements, and the process for your first 30 days. Keep it bookmarked on the People Portal.')

    h1(doc, '2. Leave Policy (Effective April 2025)')

    h2(doc, '2.1 Casual Leave (CL)')
    bullet(doc, [
      'Entitlement: 12 working days per calendar year (January–December)',
      'Non-carry-forward: Unused CL lapses on December 31st each year',
      'Application: Via People Portal, minimum 1 working day prior notice',
      'Maximum consecutive days: 3 days. More than 3 consecutive days treated as EL or LWP.',
      'Approval authority: Reporting manager. Auto-approved if no response within 24 hours.',
    ])

    h2(doc, '2.2 Sick Leave (SL)')
    bullet(doc, [
      'Entitlement: 10 working days per financial year (April–March)',
      'Medical certificate: Required for absences exceeding 2 consecutive working days',
      'Mental health days: Up to 3 SL days per year may be taken via self-declaration (no medical certificate)',
      'Non-encashable: SL balance resets each April 1st. Cannot be converted to EL.',
      'Hospital admission: Additional SL beyond entitlement may be granted by CHRO on a case-by-case basis',
    ])

    h2(doc, '2.3 Earned Leave (EL)')
    bullet(doc, [
      'Accrual: 1.25 days per completed month of service (15 days per year)',
      'Carry-forward: Maximum 45 days across financial years',
      'Annual encashment: Once per year in December, up to 10 days, subject to approval',
      'Encashment at exit: All accumulated EL (up to 45 days) encashed at last drawn basic salary',
      'Application notice: Minimum 7 working days prior for absences of 3+ days',
    ])

    h2(doc, '2.4 Special Leaves')
    table(doc,
      ['Leave Type', 'Entitlement', 'Conditions'],
      [
        ['Maternity Leave', '26 weeks paid', 'As per Maternity Benefit Amendment Act 2017. Adoptive mothers: 12 weeks.'],
        ['Paternity Leave', '10 days paid', 'Within 6 months of child birth or legal adoption'],
        ['Bereavement Leave', '3 days (immediate family)', 'Spouse, children, parents, parents-in-law. 1 day for extended family.'],
        ['Marriage Leave', '5 days paid', 'Once during tenure. Submit marriage certificate within 30 days.'],
        ['Public Holidays', '12 per year', 'List published in People Portal every January. Varies by location.'],
        ['Compensatory Off', 'For weekend/holiday work', 'Approved by manager. Must be availed within 60 days.'],
      ]
    )

    doc.addPage()

    h1(doc, '3. Compensation & Benefits')

    h2(doc, '3.1 Payroll')
    bullet(doc, [
      'Salary credit date: Last working day of the month',
      'Pay slip access: People Portal → My Payslips → Download PDF',
      'Bank account change: Submit Form HR-09 to payroll@stellarisgroup.com. Effective from following month.',
      'Payroll discrepancy: Raise a "Payroll" ticket in People Portal within 5 days of credit. SLA: 3 business days.',
      'Tax declarations: Submit Form 12BB via People Portal by April 30th. Investment proofs by February 28th.',
    ])

    h2(doc, '3.2 Provident Fund (PF)')
    bullet(doc, [
      'Employer contribution: 12% of Basic salary per month',
      'Employee contribution: 12% of Basic salary (statutory deduction)',
      'UAN (Universal Account Number): Activated within 30 days of joining. Available in People Portal.',
      'PF enquiry: Check balance at epfindia.gov.in with your UAN',
      'Partial withdrawal: Allowed after 5 years of service for specified purposes (medical, house purchase, education)',
      'Full withdrawal at exit: Portal-based after EPFO guidelines. Processing time: 15–30 working days.',
    ])

    h2(doc, '3.3 Group Mediclaim (Health Insurance)')
    bullet(doc, [
      'Sum insured: ₹6,00,000 per family per policy year (April 1 – March 31)',
      'Covered members: Employee + Spouse + Up to 2 children (up to age 25) + Parents (up to age 60)',
      'Premium: 100% paid by Stellaris Group for employee and spouse. Dependents at subsidised rate.',
      'Policy provider: Star Health Insurance | TPA: Medi Assist India Pvt. Ltd.',
      'Cashless facility: 12,000+ network hospitals across India. Search: mediassist.in/network',
      'Enrollment deadline: Within 30 days of date of joining. Late enrollment only at next annual cycle.',
      'Reimbursement claims: Submit within 90 days of treatment. Via Medi Assist app or portal.',
      'Emergency hospitalisation: Intimation to Medi Assist within 24 hours of admission: 1800-425-9449',
    ])

    h2(doc, '3.4 Flexi Benefits Basket (₹18,000 per year)')
    body(doc, 'All employees may claim up to ₹18,000 per financial year across these categories:')
    bullet(doc, [
      'Mobile / internet bill reimbursement (personal number used for work)',
      'Books and periodicals (professional development material only)',
      'Fitness membership: Gym, yoga studio, or sports club membership',
      'How to claim: People Portal → Claims → Flexi Benefits → Upload bill → Submit by 25th of each month',
      'Reimbursement: Processed with monthly payroll. No carry-forward across financial years.',
    ])

    h1(doc, '4. Reimbursements')

    h2(doc, '4.1 Travel Entitlements by Grade')
    table(doc,
      ['Grade', 'Domestic Flight', 'Hotel — Tier 1 Cities', 'Hotel — Other', 'DA (per day)'],
      [
        ['Executive / Senior Executive', 'Economy', '₹3,500', '₹2,200', '₹400'],
        ['Assistant Manager / Manager', 'Economy', '₹4,500', '₹3,000', '₹600'],
        ['Senior Manager / DGM', 'Economy (Business if >3hrs)', '₹6,000', '₹4,000', '₹800'],
        ['GM / AVP / VP', 'Business', '₹8,500', '₹6,000', '₹1,200'],
        ['SVP / Director / CXO', 'Business', 'Actuals', 'Actuals', '₹2,000'],
      ]
    )

    h2(doc, '4.2 Expense Claim Process')
    bullet(doc, [
      'Book travel via MakeMyTrip Business (company account: stellarisgroup@mmtbiz.com)',
      'Submit expense claims in Zoho Expense within 30 days of travel. Claims beyond 30 days require CFO approval.',
      'Original receipts mandatory for all amounts above ₹1,000',
      'Reimbursement: With next month payroll if submitted before 20th. Following month otherwise.',
    ])

    doc.addPage()

    h1(doc, '5. First 30 Days — Onboarding Checklist')
    table(doc,
      ['Day', 'Action', 'Owner'],
      [
        ['Day 1 AM', 'Collect ID card, access card, laptop from Facilities. Location: Nariman Point HQ, Floor 3, Reception.', 'Facilities + IT'],
        ['Day 1 PM', 'Set up company email, join Slack workspace via invite in welcome email', 'IT Support'],
        ['Day 1–3', 'Complete KYC for payroll: Bank account, PAN, Aadhaar upload via People Portal', 'Employee'],
        ['Day 3', 'Access Stellaris Learning (learn.stellarisgroup.internal) and complete Orientation Module (3 hrs)', 'Employee'],
        ['Day 5', 'Meet assigned Buddy (HR will send introduction email). Schedule 30-min call.', 'Employee + HR'],
        ['Day 7', 'Complete mandatory compliance training on LMS: POSH, Code of Conduct, Data Security (2.5 hrs)', 'Employee'],
        ['Day 10', 'Health insurance enrollment via People Portal → Benefits → Enroll', 'Employee'],
        ['Day 14', '1:1 goal-setting session with reporting manager', 'Manager'],
        ['Day 21', 'HR check-in call from assigned People Partner', 'HR People Partner'],
        ['Day 30', 'Formal probation review with manager. Confirmation letter issued within 3 business days.', 'Manager + HR'],
      ]
    )

    h1(doc, '6. Key HR Contacts')
    table(doc,
      ['Team', 'Email', 'Phone Ext', 'Scope'],
      [
        ['General HR Queries', 'people@stellarisgroup.com', '101', 'Policy, leave, general questions'],
        ['Payroll', 'payroll@stellarisgroup.com', '103', 'Salary, PF, Form 16, tax'],
        ['Health Insurance', 'insurance@stellarisgroup.com', '105', 'Claims, enrollment, network hospitals'],
        ['Employee Relations', 'er@stellarisgroup.com', '108', 'Grievances, POSH, disciplinary'],
        ['Learning & Development', 'learn@stellarisgroup.com', '110', 'Training, LMS access, certifications'],
        ['IT Setup (Day 1)', 'itsupport@stellarisgroup.com', '200', 'Laptop, email, access setup'],
      ]
    )
  })
  console.log('✓ PDF 2: Employee Handbook')
}

// ─── PDF 3: Sales Enablement ─────────────────────────────────────────────────
async function pdf3() {
  await pdf('stellaris-sales-enablement-guide.pdf', (doc) => {
    cover(doc,
      'Product Portfolio & Sales Enablement Guide',
      'Stellaris Technology Services · Sales Team Internal Document',
      'Version 6.0 · Q1 FY2026 · Confidential — For Sales Use Only'
    )

    h1(doc, '1. About Stellaris Technology Services')
    body(doc, 'Stellaris Technology Services (STS) is the B2B technology division of Stellaris Group. STS builds the StellarOps workflow automation platform, serving 340+ enterprise and mid-market clients across BFSI, healthcare, manufacturing, and retail.')
    body(doc, 'FY2025 metrics: ₹3,100 Crore revenue. 97% renewal rate (Year 1+). Average deal cycle: 8 weeks (Growth tier) / 14 weeks (Enterprise). Win rate vs. WorkflowMax (primary competitor): 62%. NPS: 68.')

    h1(doc, '2. Product Tiers')

    h2(doc, '2.1 StellarOps Starter')
    bullet(doc, [
      'Target: Organisations with 5–24 users',
      'Pricing: ₹2,200/user/month (monthly) | ₹1,799/user/month (annual)',
      'Minimum commitment: No minimum for monthly. 12 months for annual.',
      'Core capabilities: Workflow automation (up to 50 active workflows), 10GB cloud storage, 100 API calls/minute',
      'Integrations: Zoho suite, Slack, Google Workspace, Microsoft 365, Razorpay, Stripe',
      'Support: Email only (SLA: 24 hours). No CSM assigned.',
      'Data residency: India (AWS ap-south-1, Mumbai). Immovable.',
      'Setup time: Self-serve. Typically configured within 1 business day.',
    ])

    h2(doc, '2.2 StellarOps Growth')
    bullet(doc, [
      'Target: Organisations with 25–199 users',
      'Pricing: ₹3,999/user/month (annual only, minimum 25 seats)',
      'Core capabilities: All Starter + Advanced analytics, SSO (SAML 2.0, OAuth 2.0), custom API integrations, 100GB storage, 1,000 API calls/minute',
      'SLA: 99.9% uptime (contractual). P1 response: 2 hours. P2: 8 hours.',
      'Integrations: All Starter + Salesforce, SAP, Oracle, Tally, custom webhooks',
      'Support: Dedicated Customer Success Manager (CSM) + email + phone (9am–7pm IST Mon–Sat)',
      'Setup time: 3–5 business days with CS team assistance',
    ])

    h2(doc, '2.3 StellarOps Enterprise')
    bullet(doc, [
      'Target: Organisations with 200+ users, regulated industries (BFSI, healthcare, government)',
      'Pricing: Custom. Typical: ₹3.8L–₹12L/month for 200–500 seat deployments.',
      'Core capabilities: All Growth + on-premise deployment option, custom SLA (up to 99.99%), white-labelling, dedicated infrastructure, quarterly business reviews',
      'Compliance: HIPAA-ready, DPDP Act 2023, GDPR, STQC (Government of India empanelled)',
      'Support: 24/7 premium support, dedicated Technical Account Manager, named escalation path',
      'Sales cycle: Typically 6–14 weeks. Involves procurement, legal review, CISO sign-off.',
    ])

    doc.addPage()

    h1(doc, '3. Competitive Battle Cards')

    h2(doc, '3.1 vs. WorkflowMax (Most Common Competitor)')
    table(doc,
      ['Dimension', 'StellarOps', 'WorkflowMax'],
      [
        ['Data residency', 'India only (AWS Mumbai). Guaranteed.', 'Defaults to Singapore. India option costs extra.'],
        ['WhatsApp integration', 'Native, included in all tiers', 'Requires Twilio middleware (+₹800/user/month)'],
        ['G2 Rating', '4.6 / 5 (820 reviews)', '3.9 / 5 (340 reviews)'],
        ['Implementation time', '1–14 days depending on tier', '6–8 weeks average'],
        ['India compliance (DPDP)', 'Certified, FY2024', 'Roadmap only, not yet certified'],
        ['Price (25 seats, annual)', '₹3,999/user/month', '₹3,200/user/month (excl. WhatsApp add-on)'],
        ['Renewal rate', '97% (Year 1+)', 'Not published publicly'],
      ]
    )

    h2(doc, '3.2 vs. In-House Build')
    body(doc, 'When a prospect says "we can build it ourselves", use this framework:')
    table(doc,
      ['Factor', 'StellarOps', 'Custom Build'],
      [
        ['Time to first value', '5–14 days', '18–24 months (median)'],
        ['Year 1 cost (50 seats)', '₹28.8L', '₹80–150L (dev + infra + testing)'],
        ['Maintenance overhead', 'Zero (included in subscription)', '1–2 FTE engineers permanently'],
        ['SLA responsibility', 'Ours', 'Yours — every outage is an internal incident'],
        ['Feature velocity', '6 major releases/year', 'Dependent on internal roadmap'],
        ['Risk', 'Low — proven platform', 'High — turnover, technical debt, scope creep'],
      ]
    )

    h1(doc, '4. Top Objections & Responses')

    h2(doc, '"It\'s too expensive"')
    body(doc, 'Response: Let\'s run the ROI calculator together. Across our 340 clients, average payback period is 4.1 months. The NBFC client (8,000 employees) reduced operational costs by 62% in 6 months. I can share that case study — they\'re comfortable being referenced. Would that help move the evaluation forward?')

    h2(doc, '"We\'re evaluating WorkflowMax at the same time"')
    body(doc, 'Response: That\'s common, and we welcome the comparison. We\'ve won 19 of our last 23 competitive evaluations against WorkflowMax. Would you be open to a 30-day parallel run on one use case? You define the evaluation criteria in Week 1, and the data decides. No obligation.')

    h2(doc, '"Data security is a concern"')
    body(doc, 'Response: Understood — and it\'s the right concern. We\'re SOC 2 Type II certified (last KPMG audit: March 2025), ISO 27001:2022 (Certificate #IN-27001-0872), and DPDP Act 2023 compliant. All your data stays in India — AWS ap-south-1, Mumbai. If you\'d like, I can arrange a 30-minute call between your CISO and our Chief Information Security Officer before you proceed. We do this for every Enterprise evaluation.')

    h2(doc, '"We need more time internally"')
    body(doc, 'Response: I understand. Can I offer a 45-day POC instead? A dedicated implementation engineer works with your team, and we establish the evaluation criteria together at the start. It removes the guesswork. POC to close — we typically see a decision by Day 40.')

    doc.addPage()

    h1(doc, '5. Current Promotions (Q1 FY2026)')
    bullet(doc, [
      'Annual plan: 2 months free with any 12-month Growth or Enterprise commitment (effective 16.7% discount)',
      'WorkflowMax migration: Waived implementation fees (standard: ₹80,000 Starter → ₹2,50,000 Enterprise)',
      'SME offer: Starter plan at ₹1,499/user/month for first 6 months (minimum 10 seats, new logos only)',
      'Nonprofit rate: 30% discount on any tier for registered nonprofit organisations (Section 8 / 12A certificate required)',
    ])

    h1(doc, '6. Certifications & Compliance')
    table(doc,
      ['Certification', 'Body', 'Cert Number', 'Valid Until'],
      [
        ['ISO 27001:2022', 'Bureau Veritas', 'IN-27001-0872', 'March 2027'],
        ['SOC 2 Type II', 'KPMG India', 'KPMG-SOC2-2025-STS', 'March 2026 (annual)'],
        ['DPDP Act 2023', 'MEITY (India)', 'MEITY-DPF-2024-11832', 'Annual renewal'],
        ['GDPR', 'EU DPA (Netherlands)', 'EU-GDPR-NL-STS-2024', 'Ongoing'],
        ['STQC (Gov empanelled)', 'STQC India', 'STQC/CE/2024/0441', 'September 2025'],
      ]
    )
  })
  console.log('✓ PDF 3: Sales Enablement Guide')
}

// ─── PDF 4: IT Runbook ────────────────────────────────────────────────────────
async function pdf4() {
  await pdf('stellaris-it-runbook.pdf', (doc) => {
    cover(doc,
      'IT Infrastructure & Support Runbook',
      'Stellaris Group IT Department · Version 8.3',
      'Restricted: IT Staff + Approved AI Systems Only · Last Updated: February 2025'
    )

    h1(doc, '1. Network & Connectivity')

    h2(doc, '1.1 Corporate Network (All Offices)')
    bullet(doc, [
      'SSID: StellarisSecure — WPA3 Enterprise, certificate-based authentication (802.1X)',
      'Guest SSID: Stellaris-Guest — Internet access only. No access to intranet, fileshares, or printers.',
      'VLAN segregation: Corporate (VLAN 10), IoT/Printers (VLAN 20), Guest (VLAN 30), Servers (VLAN 50)',
      'Proxy settings (if required): proxy.stellarisgroup.internal, Port 8080 — auto-configured via GPO on Windows',
    ])

    h2(doc, '1.2 VPN — Cisco AnyConnect Setup')
    bullet(doc, [
      'Download: software.stellarisgroup.internal/vpn (authenticate with employee ID + password)',
      'Supported platforms: Windows 10+, macOS 12+, Ubuntu 20.04+',
      'Server address: vpn.stellarisgroup.com',
      'Select Group: Choose your vertical (Consumer / TechServices / Infrastructure / Corporate / Healthcare / Finance)',
      'Username: your_employee_id@stellarisgroup.com (example: 100234@stellarisgroup.com)',
      'Password: Your Active Directory (Windows login) password',
      'MFA: Microsoft Authenticator app — push notification. Enroll at aka.ms/MFASetup.',
      'Certificate error fix: Download and install Stellaris Root CA from it.stellarisgroup.internal/certificates.',
      'Split tunneling: Intranet traffic routes through VPN. Internet traffic goes direct (by design).',
    ])

    h2(doc, '1.3 Password Policy & Reset')
    bullet(doc, [
      'Policy: Minimum 12 characters. Must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character.',
      'Expiry: 90 days. System forces change. Cannot reuse last 6 passwords.',
      'Self-service reset (when not locked): go.stellarisgroup.com/reset — verify via registered mobile OTP',
      'Account unlock (after 5 failed attempts): go.stellarisgroup.com/unlock — same OTP verification',
      'If mobile OTP fails: Raise Priority 2 ticket with employee ID. IT SLA: 2 hours during business hours.',
      'Password manager: Dashlane Business licensed for all employees. Download from software portal.',
    ])

    doc.addPage()

    h1(doc, '2. Device Troubleshooting')

    h2(doc, '2.1 Laptop Won\'t Connect to Corporate Wi-Fi (StellarisSecure)')
    body(doc, 'Run this sequence before raising a ticket:')
    bullet(doc, [
      'Step 1: Forget the StellarisSecure network (right-click → Forget) and reconnect from scratch',
      'Step 2: Verify device certificate is installed: Settings → Certificates → look for "Stellaris-Device-2025"',
      '  - If missing: Download from it.stellarisgroup.internal/certificates/device-cert.pfx (password in IT portal)',
      'Step 3: Flush DNS:',
      '  - Windows: Open CMD as admin → ipconfig /flushdns',
      '  - macOS: sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder',
      'Step 4: If still failing, plug in via Ethernet and raise ticket: Category = "Network / Wi-Fi". Attach screenshot of error.',
    ])

    h2(doc, '2.2 Microsoft 365 / Outlook Issues')
    bullet(doc, [
      'Outlook not sending/receiving: File → Account Settings → Account Settings → Select account → Repair → Follow wizard',
      'Calendar not syncing on phone: Remove and re-add the Exchange account. Server: outlook.office365.com',
      'Mailbox size warning (>48GB): File → Tools → Mailbox Cleanup → Archive items. Keep last 12 months in primary.',
      'Mobile email setup: Install Microsoft Outlook app → Add account → Enter email → Company portal auto-config (Intune)',
      'Teams audio/video not working: Check audio/video permissions in Windows Settings → Privacy. Reinstall Teams if needed.',
    ])

    h2(doc, '2.3 Printer Setup by Floor (Nariman Point HQ)')
    table(doc,
      ['Floor', 'Model', 'IP Address', 'Capabilities'],
      [
        ['Floor 3', 'HP LaserJet Pro MFP M428fdw', '10.1.3.45', 'B&W + Colour + Scan + Fax'],
        ['Floor 4', 'Xerox VersaLink B405', '10.1.4.12', 'B&W only, high volume'],
        ['Floor 5', 'Canon imageRUNNER ADVANCE C5560', '10.1.5.33', 'Colour + Scan + Fax + Staple'],
        ['Floor 6', 'HP LaserJet Enterprise M607', '10.1.6.18', 'B&W only'],
        ['Floor 7 (Exec)', 'Konica Minolta bizhub C300i', '10.1.7.22', 'Colour + Scan + Secure Print'],
      ]
    )
    body(doc, 'To add a printer: Settings → Printers → Add Printer → "The printer I want isn\'t listed" → Add by TCP/IP address → Enter IP above. Driver download: it.stellarisgroup.internal/printers — select model → install.')

    h1(doc, '3. Software Access & Catalogue')

    h2(doc, '3.1 Self-Serve Software (No Approval Needed)')
    bullet(doc, [
      'Productivity: Microsoft 365, Slack, Zoom, Google Chrome, 7-Zip, Adobe Acrobat Reader',
      'Communication: Teams (pre-installed), WhatsApp Business Desktop (for approved roles)',
      'Security: Dashlane Business, Malwarebytes (auto-installed via MDM)',
      'Download all approved software: software.stellarisgroup.internal',
    ])

    h2(doc, '3.2 Approval-Required Software')
    table(doc,
      ['Software', 'Approver Required', 'Approval SLA', 'Notes'],
      [
        ['Adobe Creative Cloud', 'Department Head', '2 business days', 'Limited licences. Justify creative use.'],
        ['AutoCAD / SolidWorks', 'Dept Head + IT', '3 business days', 'Infrastructure/Real Estate teams only'],
        ['Tableau / Power BI Pro', 'Analytics or Finance Head', '2 business days', 'Data access controls applied separately'],
        ['Salesforce', 'VP Sales', '1 business day', 'Sales team only. Role-based access.'],
        ['SAP GUI', 'Finance Controller', '3 business days', 'Finance/Operations only. Training mandatory.'],
        ['Any unlisted software', 'CISO + Dept Head', '5 business days', 'Security assessment required. No exceptions.'],
      ]
    )

    doc.addPage()

    h1(doc, '4. Security Policies')

    h2(doc, '4.1 Device Security')
    bullet(doc, [
      'Screen lock: 5-minute idle auto-lock enforced via Intune MDM on all company devices',
      'USB storage: Blocked on all company laptops. Use SharePoint, OneDrive, or Dropbox Business for file transfer.',
      'Full disk encryption: BitLocker (Windows) / FileVault (macOS) enabled automatically at setup',
      'Antivirus: Microsoft Defender + Malwarebytes Business. Do not disable. Do not install alternative AV.',
      'VPN mandatory when on public Wi-Fi. No exceptions. IT will be notified of non-VPN external connections.',
    ])

    h2(doc, '4.2 Security Incident Response')
    bullet(doc, [
      'Phishing email received: Do NOT click any link. Forward the email to phishing@stellarisgroup.com. Delete from inbox.',
      'Clicked a phishing link: Immediately disconnect from network → call IT emergency line: +91-22-6800-0002',
      'Lost or stolen device: File police FIR (mandatory) → email ciso@stellarisgroup.com + people@stellarisgroup.com within 24 hours',
      'Data breach suspicion: Report to ciso@stellarisgroup.com within 1 hour. Do not attempt to investigate yourself.',
      'Social engineering attempt (call/email impersonating IT/HR/Management): Report to er@stellarisgroup.com',
    ])

    h1(doc, '5. Hardware Request & Replacement')
    bullet(doc, [
      'Request form: it.stellarisgroup.internal/hardware-request',
      'Approval chain: Reporting manager (auto-notified) + IT team review',
      'Standard replacement SLA: 3 business days from approval',
      'Business critical SLA: Same day (requires written justification + VP approval)',
      'Laptop refresh policy: Every 3 years automatically. Submit refresh request via portal in Month 34 of tenure.',
      'Peripherals (keyboard, mouse, monitor): Self-service request in portal. No manager approval needed below ₹3,000.',
    ])
  })
  console.log('✓ PDF 4: IT Runbook')
}

// ─── PDF 5: Internal Knowledge Directory ─────────────────────────────────────
async function pdf5() {
  await pdf('stellaris-internal-knowledge-directory.pdf', (doc) => {
    cover(doc,
      'Internal Operations & Knowledge Directory',
      'Stellaris Group Corporate Affairs · All Divisions',
      'Version 5.1 · FY2025 · For All Employees · Confidential'
    )

    h1(doc, '1. About Stellaris Group')
    body(doc, 'Stellaris Group Ltd. was founded in 1989 by Vikram Anand Kapoor in Mumbai. What began as a small infrastructure firm now spans six business verticals, employs 31,000+ people across 55 offices worldwide, and generates ₹18,200 Crore in annual revenue (FY2025, audited by Deloitte Haskins & Sells).')
    body(doc, 'Stellaris Group has been listed on the Bombay Stock Exchange (BSE: 532148) since 1994 and on the National Stock Exchange (NSE: STELLARIS) since 1998. Market capitalisation as of March 2025: ₹84,600 Crore.')

    h1(doc, '2. Business Verticals')
    table(doc,
      ['Vertical', 'Revenue FY25', 'Employees', 'Head', 'Offices'],
      [
        ['Stellaris Infrastructure', '₹6,800 Cr', '8,200', 'Rajesh Malhotra', 'Mumbai, Delhi, Hyderabad, Chennai, Ahmedabad'],
        ['Stellaris Real Estate', '₹4,200 Cr', '5,400', 'Sunita Krishnamurthy', 'Mumbai, Pune, Bangalore, Dubai, Singapore'],
        ['Stellaris Technology Services', '₹3,100 Cr', '6,800', 'Amit Verma', 'Mumbai, Bangalore, Hyderabad, London, New York'],
        ['Stellaris Consumer', '₹2,400 Cr', '5,100', 'Preethi Subramaniam', 'Pan India (11 offices)'],
        ['Stellaris Healthcare', '₹900 Cr', '3,200', 'Dr. Arun Mehta', 'Mumbai, Bangalore, Delhi, Chennai'],
        ['Stellaris Financial Services', '₹800 Cr', '2,300', 'Kavita Iyer', 'Mumbai, Delhi, Singapore'],
      ]
    )

    doc.addPage()

    h1(doc, '3. Leadership Directory')
    table(doc,
      ['Name', 'Role', 'Email', 'Ext'],
      [
        ['Aarav Kapoor', 'Group CEO', 'aarav.kapoor@stellarisgroup.com', '001'],
        ['Meenakshi Nair', 'Group CFO', 'meenakshi.nair@stellarisgroup.com', '002'],
        ['Rajan Krishnamurthy', 'Group CHRO & CIO (Interim)', 'rajan.k@stellarisgroup.com', '003'],
        ['Siddharth Roy', 'Group CLO (Legal)', 'siddharth.roy@stellarisgroup.com', '004'],
        ['Pooja Agarwal', 'Group CMO', 'pooja.agarwal@stellarisgroup.com', '005'],
        ['Vivek Shetty', 'Group COO', 'vivek.shetty@stellarisgroup.com', '006'],
        ['Rajesh Malhotra', 'CEO — Infrastructure', 'rajesh.malhotra@stellarisgroup.com', '100'],
        ['Sunita Krishnamurthy', 'CEO — Real Estate', 'sunita.k@stellarisgroup.com', '200'],
        ['Amit Verma', 'CEO — Technology Services', 'amit.verma@stellarisgroup.com', '300'],
        ['Preethi Subramaniam', 'CEO — Consumer', 'preethi.s@stellarisgroup.com', '400'],
        ['Dr. Arun Mehta', 'CEO — Healthcare', 'arun.mehta@stellarisgroup.com', '500'],
        ['Kavita Iyer', 'CEO — Financial Services', 'kavita.iyer@stellarisgroup.com', '600'],
      ]
    )

    h1(doc, '4. Key Processes')

    h2(doc, '4.1 Procurement & Vendor Management')
    bullet(doc, [
      'Raise Purchase Request (PR) in SAP Ariba portal: ariba.stellarisgroup.internal',
      'Approval matrix: ≤₹1L → Dept Head | ₹1L–₹10L → Finance Controller | ₹10L–₹50L → CFO | >₹50L → CEO + Board Sub-Committee',
      'PO issuance: Within 3 business days of final approval',
      'Vendor onboarding steps: Legal vetting → Finance KYC → IT security assessment → Vendor Master entry → Average 12 business days',
      'Approved vendor directory: vendor.stellarisgroup.internal/directory (2,400+ vendors, searchable by category)',
    ])

    h2(doc, '4.2 Travel & Expense')
    bullet(doc, [
      'Booking platform: MakeMyTrip Business. Company account: stellarisgroup@mmtbiz.com',
      'Advance forex: Available via Finance. Apply 7 days before international travel.',
      'Expense claims: Zoho Expense (zoho.stellarisgroup.internal). Submit within 30 days of travel.',
      'International per diem rates: $45/day (USA/UK/Australia) | $38/day (UAE/Singapore) | $30/day (other countries)',
    ])

    h2(doc, '4.3 Project Governance')
    bullet(doc, [
      'All projects with budget >₹10L must be registered in PMO: pmo.stellarisgroup.internal',
      'Mandatory artefacts: Project Charter (Week 1), Risk Register (Week 1), Steering Committee deck (monthly)',
      'Status reporting: Weekly traffic-light update in PMO every Friday by 5pm IST',
      'Change requests: Any scope change affecting budget or timeline requires Steering Committee approval',
      'Retrospectives: Mandatory for all projects lasting >6 months. Output uploaded to Confluence within 2 weeks of project close.',
    ])

    h2(doc, '4.4 Legal & Contract Management')
    bullet(doc, [
      'Contracts >₹5L: Mandatory legal review. SLA: 5 business days (standard) | 10 days (complex)',
      'NDA requests: Use standard template from legal.stellarisgroup.internal. Legal review not needed for standard NDAs.',
      'Contract repository: All signed agreements in DocuSign, mirrored to SharePoint Legal folder (auto-archived)',
      'IP policy: All work product created during employment is the intellectual property of Stellaris Group (Clause 14, Employment Agreement)',
      'Litigation/disputes: Contact siddharth.roy@stellarisgroup.com immediately. Do not commit to settlements without Legal clearance.',
    ])

    doc.addPage()

    h1(doc, '5. Internal Portals Directory')
    table(doc,
      ['Portal Name', 'URL', 'Purpose', 'Owner'],
      [
        ['People Portal (HR)', 'people.stellarisgroup.internal', 'Leave, payroll, benefits, onboarding', 'HR — Rajan K.'],
        ['IT Helpdesk', 'it.stellarisgroup.internal', 'Tickets, software, hardware, VPN', 'IT — Suresh Patel'],
        ['Finance / Expense', 'zoho.stellarisgroup.internal', 'Claims, vendor invoices, reimbursements', 'Finance — Meenakshi Nair'],
        ['Project Management (PMO)', 'pmo.stellarisgroup.internal', 'Project tracking, resource allocation', 'COO — Vivek Shetty'],
        ['Learning Management (LMS)', 'learn.stellarisgroup.internal', 'Courses, compliance training, certifications', 'L&D — Divya Sharma'],
        ['Knowledge Base (Wiki)', 'wiki.stellarisgroup.internal', 'Policies, SOPs, org charts, retrospectives', 'Corporate Affairs'],
        ['Vendor Directory', 'vendor.stellarisgroup.internal', 'Approved vendor search and onboarding', 'Procurement — Anand Rao'],
        ['SAP Ariba (Procurement)', 'ariba.stellarisgroup.internal', 'Purchase requests, PO tracking', 'Finance — Meenakshi Nair'],
      ]
    )

    h1(doc, '6. Communications Policy')

    h2(doc, '6.1 Internal Communication Tools')
    bullet(doc, [
      'Slack: Primary collaboration platform. Use channels, not DMs, for work discussions. Archive policy: 3 years.',
      'Email: For formal communication, external parties, and document sharing. Use sparingly for internal discussion.',
      'Microsoft Teams: Video meetings and calls. Not to be used as a messaging replacement for Slack.',
      'Zoom: External client calls only. Company Zoom account required — do not use personal.',
    ])

    h2(doc, '6.2 Media & External Communication')
    bullet(doc, [
      'All media queries: Route to pooja.agarwal@stellarisgroup.com (CMO) or pr@stellarisgroup.com immediately',
      'Social media posts about work: No mention of client names, project details, or financial information without CMO approval',
      'LinkedIn announcements about promotions/achievements: Encouraged — run through manager once before posting',
      'Press releases, industry articles, keynote invites: Pre-approve with CMO at least 7 days in advance',
    ])
  })
  console.log('✓ PDF 5: Internal Knowledge Directory')
}

// ─── Run all ─────────────────────────────────────────────────────────────────
;(async () => {
  console.log('Generating Stellaris Group knowledge base PDFs...\n')
  await pdf1()
  await pdf2()
  await pdf3()
  await pdf4()
  await pdf5()
  console.log('\n✅ All 5 PDFs generated in public/knowledge-base-pdfs/')
  console.log('\nNext steps:')
  console.log('  1. Upload each PDF to LightRAG via the admin panel or /api/upload')
  console.log('  2. Wait 30–60 seconds for LightRAG to build the knowledge graph')
  console.log('  3. Test all 5 persona chats on /personas/[slug]')
})()
