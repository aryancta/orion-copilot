export const DEMO_WORKSPACES = {
  ENTERPRISE: {
    name: "Acme Corp Operations",
    description: "Support tickets, policy updates, and operational requests for Acme Corporation",
    type: "ENTERPRISE" as const
  },
  EDUCATION: {
    name: "University Administration",
    description: "Student requests, faculty communications, and administrative processes",
    type: "EDUCATION" as const
  }
}

export const DEMO_ITEMS = {
  ENTERPRISE: [
    {
      title: "Customer Escalation - Payment Processing Issue",
      sourceType: "TEXT" as const,
      filename: null,
      mimeType: "text/plain",
      rawContent: `Subject: URGENT - Payment processing down for premium customers

Hi Support Team,

We're getting multiple calls from premium customers who can't process payments through our main gateway. This started about 30 minutes ago and is affecting approximately 200+ users.

Customer reports:
- "Payment failed" errors on checkout
- Credit cards being declined despite valid accounts  
- Unable to complete subscription renewals

This is a high-revenue impact situation. Our premium customers generate $50K+ monthly and we're losing transactions every minute this continues.

Please escalate to engineering immediately and provide ETA for resolution.

Thanks,
Sarah Martinez
Customer Success Manager`,
      extractedText: "Customer Escalation - Payment Processing Issue. URGENT - Payment processing down for premium customers. Multiple calls from premium customers who can't process payments through main gateway. Started 30 minutes ago affecting 200+ users. Customer reports: Payment failed errors on checkout, Credit cards being declined despite valid accounts, Unable to complete subscription renewals. High-revenue impact situation. Premium customers generate $50K+ monthly and losing transactions every minute. Please escalate to engineering immediately and provide ETA for resolution.",
      status: "COMPLETED" as const,
      category: "Technical Issue",
      priority: "CRITICAL" as const,
      riskLevel: "HIGH" as const,
      summary: "Critical payment gateway outage affecting 200+ premium customers causing significant revenue loss. Issue started 30 minutes ago with payment failures and declined transactions.",
      recommendation: "Immediately escalate to engineering team for emergency resolution. Establish incident response protocol and provide customer communication plan."
    },
    {
      title: "Security Policy Update - Remote Access",
      sourceType: "FILE" as const,
      filename: "security-policy-update-2024.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      rawContent: `SECURITY POLICY UPDATE
Effective Date: April 15, 2024

New Remote Access Requirements:

1. All remote connections must use company-approved VPN
2. Multi-factor authentication required for all cloud services
3. Personal devices require security software installation
4. Weekly security training completion mandatory

Compliance Timeline:
- Week 1: IT department rollout of new VPN configurations
- Week 2: MFA implementation across all systems  
- Week 3: Personal device security software deployment
- Week 4: Complete compliance audit

Non-compliance will result in access revocation.

Questions should be directed to security@acmecorp.com

Best regards,
IT Security Team`,
      extractedText: "Security Policy Update effective April 15, 2024. New Remote Access Requirements: All remote connections must use company-approved VPN, Multi-factor authentication required for all cloud services, Personal devices require security software installation, Weekly security training completion mandatory. Compliance Timeline over 4 weeks covering VPN rollout, MFA implementation, device security deployment, and compliance audit. Non-compliance results in access revocation.",
      status: "COMPLETED" as const,
      category: "Policy Update",
      priority: "HIGH" as const,
      riskLevel: "MEDIUM" as const,
      summary: "New security policy requiring VPN, MFA, device security software, and weekly training. 4-week implementation timeline with compliance audit.",
      recommendation: "Create implementation checklist for IT teams and schedule user training sessions. Monitor compliance metrics weekly."
    },
    {
      title: "Budget Request - Q2 Marketing Campaign",
      sourceType: "TEXT" as const,
      filename: null,
      mimeType: "text/plain",
      rawContent: `Budget Request: Q2 Digital Marketing Campaign

Requesting approval for $75,000 budget allocation for Q2 marketing initiatives:

Campaign Components:
- Social media advertising: $30,000
- Google Ads campaign: $25,000  
- Content creation and design: $15,000
- Analytics and tracking tools: $5,000

Expected Outcomes:
- 40% increase in lead generation
- 25% improvement in conversion rates
- Brand awareness boost in target demographics

ROI projections show 3.2x return within 6 months based on current conversion metrics.

Approval needed by April 20th to meet campaign launch timeline.

Marketing Team Lead
Jennifer Walsh`,
      extractedText: "Budget Request for Q2 Digital Marketing Campaign requesting $75,000 allocation. Components: Social media advertising $30,000, Google Ads $25,000, Content creation $15,000, Analytics tools $5,000. Expected outcomes: 40% increase in lead generation, 25% improvement in conversion rates, Brand awareness boost. ROI projections show 3.2x return within 6 months. Approval needed by April 20th for campaign launch timeline.",
      status: "COMPLETED" as const,
      category: "Budget Request",
      priority: "MEDIUM" as const,
      riskLevel: "LOW" as const,
      summary: "$75K budget request for Q2 marketing campaign with projected 3.2x ROI and 40% lead generation increase. Approval deadline April 20th.",
      recommendation: "Review ROI projections and past campaign performance. Schedule budget committee meeting for approval before April 20th deadline."
    }
  ],
  EDUCATION: [
    {
      title: "Grade Appeal - Computer Science Course",
      sourceType: "TEXT" as const,
      filename: null,
      mimeType: "text/plain",
      rawContent: `Subject: Formal Grade Appeal - CS 301 Data Structures

Dear Academic Appeals Committee,

I am submitting a formal appeal for my final grade in CS 301 Data Structures (Fall 2023, Professor Johnson).

Background:
- Received final grade of C+ (77%)
- Believe there were scoring errors on final project
- Project submission timestamp shows on-time delivery
- Two assignments appear to have been graded incorrectly

Supporting Evidence:
- Email confirmation of project submission
- Screenshots of gradebook discrepancies  
- Peer review feedback supporting higher scores
- Professor's written comments don't match numeric scores

This grade impacts my GPA significantly and affects my eligibility for honors program and graduate school applications.

I have attempted to resolve this directly with Professor Johnson but received no response to three separate emails over two weeks.

Requesting formal review and grade recalculation.

Student ID: 12345678
Sarah Chen
Computer Science Major`,
      extractedText: "Formal Grade Appeal for CS 301 Data Structures course. Student received C+ (77%) but believes scoring errors occurred on final project and assignments. Supporting evidence includes email confirmations, gradebook screenshots, peer reviews, and professor comments that don't match scores. Grade impacts GPA and honors program eligibility. Professor unresponsive to student emails over two weeks. Requesting formal review and recalculation.",
      status: "COMPLETED" as const,
      category: "Academic Appeal",
      priority: "HIGH" as const,
      riskLevel: "MEDIUM" as const,
      summary: "Student grade appeal for CS 301 with evidence of potential scoring errors affecting GPA and program eligibility. Professor non-responsive to direct contact.",
      recommendation: "Schedule formal appeals committee review. Contact department chair regarding professor responsiveness. Gather all supporting documentation for review."
    },
    {
      title: "Facility Request - Lab Equipment Upgrade",
      sourceType: "FILE" as const,
      filename: "lab-equipment-request.pdf",
      mimeType: "application/pdf",
      rawContent: `FACILITIES REQUEST FORM

Department: Engineering
Submitted by: Dr. Michael Rodriguez
Date: March 15, 2024

Request Summary:
Upgrade Chemistry Lab C-204 equipment for advanced analytical chemistry courses

Equipment Needed:
1. High Performance Liquid Chromatography (HPLC) system - $45,000
2. Gas Chromatography-Mass Spectrometry (GC-MS) - $85,000  
3. Spectrophotometer with UV-Vis capability - $25,000
4. Laboratory safety equipment upgrades - $15,000

Total Budget: $170,000

Justification:
Current equipment is 15+ years old and no longer meets industry standards. Students need exposure to modern analytical techniques for career readiness. Equipment failures have increased by 300% this semester, disrupting lab schedules.

Impact:
- Affects 450+ students annually across 6 courses
- Required for ABET accreditation maintenance
- Industry partnerships depend on modern facilities
- Graduate research projects currently limited

Funding Sources:
- Department budget allocation: $50,000
- Seeking additional funding: $120,000

Timeline: Equipment needed for Fall 2024 semester`,
      extractedText: "Facilities Request for Chemistry Lab C-204 equipment upgrade. Requesting HPLC system ($45K), GC-MS ($85K), Spectrophotometer ($25K), and safety equipment ($15K) for total $170K budget. Current equipment 15+ years old with 300% increase in failures. Affects 450+ students annually across 6 courses. Required for ABET accreditation and industry partnerships. Department has $50K, seeking additional $120K funding. Needed for Fall 2024 semester.",
      status: "COMPLETED" as const,
      category: "Facility Request",
      priority: "HIGH" as const,
      riskLevel: "HIGH" as const,
      summary: "$170K chemistry lab equipment upgrade request affecting 450+ students and ABET accreditation. Current equipment failing frequently with Fall 2024 deadline.",
      recommendation: "Prioritize funding approval given accreditation requirements and student impact. Explore grant opportunities and donor funding for $120K gap."
    },
    {
      title: "Student Support - Financial Hardship",
      sourceType: "TEXT" as const,
      filename: null,
      mimeType: "text/plain",
      rawContent: `Confidential Student Support Request

Student: Alex Thompson (ID: 87654321)
Academic Standing: Junior, Biology Major, 3.4 GPA

Situation:
Student experiencing severe financial hardship due to family emergency. Parent hospitalized, unable to work, affecting student's ability to continue enrollment.

Current Status:
- Outstanding tuition balance: $8,500
- Living expenses becoming unmanageable  
- Working 30+ hours/week affecting academics
- Considering withdrawal to support family

Support Requested:
- Emergency financial aid consideration
- Work-study program placement
- Academic counseling for course load adjustment
- Mental health support referral

Student is highly motivated and has strong academic record. Previous scholarship recipient with community service involvement.

Submitted by: Maria Gonzalez, Student Success Coordinator
Date: March 22, 2024

Note: Time-sensitive situation requiring prompt intervention to prevent withdrawal.`,
      extractedText: "Confidential Student Support Request for Alex Thompson, Junior Biology Major with 3.4 GPA experiencing severe financial hardship due to family emergency. Parent hospitalized, unable to work. Student has $8,500 outstanding tuition balance, working 30+ hours affecting academics, considering withdrawal. Requesting emergency financial aid, work-study placement, academic counseling, and mental health support. Student has strong academic record and previous scholarship recipient. Time-sensitive situation requiring prompt intervention.",
      status: "COMPLETED" as const,
      category: "Student Support",
      priority: "CRITICAL" as const,
      riskLevel: "HIGH" as const,
      summary: "Critical student financial hardship case requiring immediate intervention to prevent withdrawal. Strong student with family emergency needs comprehensive support.",
      recommendation: "Schedule emergency financial aid review meeting. Connect with work-study coordinator and academic advisors immediately. Provide mental health resources."
    }
  ]
}

export const DEMO_ANALYSIS_RESULTS = {
  ENTERPRISE: [
    {
      summary: "Critical payment gateway outage affecting 200+ premium customers causing significant revenue loss. Issue started 30 minutes ago with payment failures and declined transactions.",
      actionItems: JSON.stringify([
        "Escalate to engineering team immediately",
        "Establish incident response protocol", 
        "Create customer communication plan",
        "Monitor revenue impact metrics",
        "Prepare status page update"
      ]),
      entities: JSON.stringify([
        { type: "PERSON", value: "Sarah Martinez", confidence: 0.95 },
        { type: "ORGANIZATION", value: "Customer Success", confidence: 0.88 },
        { type: "OTHER", value: "Payment Gateway", confidence: 0.92 }
      ]),
      signals: JSON.stringify({
        urgencyKeywords: ["URGENT", "immediately", "emergency"],
        revenueImpact: ["$50K+ monthly", "losing transactions"],
        timeConstraints: ["30 minutes ago", "every minute"],
        customerCount: ["200+ users", "premium customers"]
      }),
      priorityScore: 95,
      riskScore: 88,
      category: "Technical Issue",
      recommendation: "Immediately escalate to engineering team for emergency resolution. Establish incident response protocol and provide customer communication plan."
    },
    {
      summary: "New security policy requiring VPN, MFA, device security software, and weekly training. 4-week implementation timeline with compliance audit.",
      actionItems: JSON.stringify([
        "Review implementation timeline",
        "Schedule IT team coordination meeting",
        "Plan user training sessions", 
        "Set up compliance monitoring",
        "Create communication rollout plan"
      ]),
      entities: JSON.stringify([
        { type: "ORGANIZATION", value: "IT Security Team", confidence: 0.92 },
        { type: "DATE", value: "April 15, 2024", confidence: 0.98 },
        { type: "OTHER", value: "VPN", confidence: 0.85 }
      ]),
      signals: JSON.stringify({
        complianceRequirements: ["mandatory", "required", "must use"],
        timeConstraints: ["4-week timeline", "Week 1", "Week 2"],
        consequences: ["access revocation", "non-compliance"]
      }),
      priorityScore: 82,
      riskScore: 65,
      category: "Policy Update",
      recommendation: "Create implementation checklist for IT teams and schedule user training sessions. Monitor compliance metrics weekly."
    },
    {
      summary: "$75K budget request for Q2 marketing campaign with projected 3.2x ROI and 40% lead generation increase. Approval deadline April 20th.",
      actionItems: JSON.stringify([
        "Review ROI projections and methodology",
        "Analyze past campaign performance data",
        "Schedule budget committee meeting",
        "Verify timeline and deliverables",
        "Assess risk vs. projected returns"
      ]),
      entities: JSON.stringify([
        { type: "PERSON", value: "Jennifer Walsh", confidence: 0.92 },
        { type: "DATE", value: "April 20th", confidence: 0.95 },
        { type: "OTHER", value: "$75,000", confidence: 0.98 }
      ]),
      signals: JSON.stringify({
        budgetAmount: ["$75,000", "$30,000", "$25,000"],
        projectedReturns: ["3.2x return", "40% increase", "25% improvement"],
        deadline: ["April 20th", "campaign launch timeline"]
      }),
      priorityScore: 68,
      riskScore: 35,
      category: "Budget Request",
      recommendation: "Review ROI projections and past campaign performance. Schedule budget committee meeting for approval before April 20th deadline."
    }
  ],
  EDUCATION: [
    {
      summary: "Student grade appeal for CS 301 with evidence of potential scoring errors affecting GPA and program eligibility. Professor non-responsive to direct contact.",
      actionItems: JSON.stringify([
        "Schedule appeals committee review meeting",
        "Contact department chair about professor responsiveness", 
        "Gather and verify all supporting documentation",
        "Review gradebook and assignment scores",
        "Establish timeline for resolution"
      ]),
      entities: JSON.stringify([
        { type: "PERSON", value: "Sarah Chen", confidence: 0.95 },
        { type: "PERSON", value: "Professor Johnson", confidence: 0.88 },
        { type: "OTHER", value: "CS 301", confidence: 0.92 }
      ]),
      signals: JSON.stringify({
        academicImpact: ["GPA significantly", "honors program", "graduate school"],
        evidence: ["email confirmation", "screenshots", "peer review"],
        unresponsiveness: ["no response", "three separate emails", "two weeks"]
      }),
      priorityScore: 85,
      riskScore: 72,
      category: "Academic Appeal",
      recommendation: "Schedule formal appeals committee review. Contact department chair regarding professor responsiveness. Gather all supporting documentation for review."
    },
    {
      summary: "$170K chemistry lab equipment upgrade request affecting 450+ students and ABET accreditation. Current equipment failing frequently with Fall 2024 deadline.",
      actionItems: JSON.stringify([
        "Prioritize funding approval process",
        "Explore grant opportunities for equipment",
        "Contact potential donors for lab funding",
        "Review ABET accreditation requirements",
        "Develop contingency plan for Fall semester"
      ]),
      entities: JSON.stringify([
        { type: "PERSON", value: "Dr. Michael Rodriguez", confidence: 0.92 },
        { type: "ORGANIZATION", value: "Engineering Department", confidence: 0.88 },
        { type: "OTHER", value: "$170,000", confidence: 0.95 }
      ]),
      signals: JSON.stringify({
        budgetAmount: ["$170,000", "$45,000", "$85,000"],
        studentImpact: ["450+ students", "6 courses", "annually"],
        accreditation: ["ABET accreditation", "industry standards", "career readiness"],
        urgency: ["Fall 2024", "equipment failures", "300% increase"]
      }),
      priorityScore: 88,
      riskScore: 85,
      category: "Facility Request", 
      recommendation: "Prioritize funding approval given accreditation requirements and student impact. Explore grant opportunities and donor funding for $120K gap."
    },
    {
      summary: "Critical student financial hardship case requiring immediate intervention to prevent withdrawal. Strong student with family emergency needs comprehensive support.",
      actionItems: JSON.stringify([
        "Schedule emergency financial aid review",
        "Connect with work-study coordinator immediately", 
        "Arrange academic advisor meeting",
        "Provide mental health support resources",
        "Monitor academic progress closely"
      ]),
      entities: JSON.stringify([
        { type: "PERSON", value: "Alex Thompson", confidence: 0.95 },
        { type: "PERSON", value: "Maria Gonzalez", confidence: 0.88 },
        { type: "OTHER", value: "3.4 GPA", confidence: 0.92 }
      ]),
      signals: JSON.stringify({
        financialStress: ["$8,500 outstanding", "unmanageable expenses", "30+ hours/week"],
        academicRisk: ["affecting academics", "considering withdrawal", "course load"],
        strengths: ["3.4 GPA", "scholarship recipient", "community service"]
      }),
      priorityScore: 92,
      riskScore: 88,
      category: "Student Support",
      recommendation: "Schedule emergency financial aid review meeting. Connect with work-study coordinator and academic advisors immediately. Provide mental health resources."
    }
  ]
}