
export interface TopicChild {
  id: string;
  name: string;
  selected: boolean;
}

export interface Topic {
  id: string;
  name: string;
  children: TopicChild[];
  similarity?: number; // Score from 0.0 to 1.0 indicating search relevance
}

// Mock data for topics with hierarchies
export const topicsData: Topic[] = [
  {
    id: "t1",
    name: "Digital payments",
    children: [
      { id: "t1c1", name: "Mobile Wallets", selected: true },
      { id: "t1c2", name: "P2P Transfers", selected: true },
      { id: "t1c3", name: "Payment Processing", selected: true },
    ],
    similarity: 1.0
  },
  {
    id: "t2",
    name: "Blockchain",
    children: [
      { id: "t2c1", name: "Distributed Ledgers", selected: true },
      { id: "t2c2", name: "Consensus Mechanisms", selected: true },
      { id: "t2c3", name: "Digital Assets", selected: true },
    ],
    similarity: 0.97
  },
  {
    id: "t3",
    name: "Neobanks & challenger banks",
    children: [
      { id: "t3c1", name: "Digital-Only Banking", selected: true },
      { id: "t3c2", name: "Branchless Banking", selected: true },
      { id: "t3c3", name: "Mobile Banking", selected: true },
    ],
    similarity: 0.94
  },
  {
    id: "t4",
    name: "Lending platforms",
    children: [
      { id: "t4c1", name: "BNPL Services", selected: true },
      { id: "t4c2", name: "P2P Lending", selected: true },
      { id: "t4c3", name: "Alternative Credit Scoring", selected: true },
    ],
    similarity: 0.91
  },
  {
    id: "t5",
    name: "Personal finance tools",
    children: [
      { id: "t5c1", name: "Budgeting Apps", selected: true },
      { id: "t5c2", name: "Expense Tracking", selected: true },
      { id: "t5c3", name: "Financial Planning", selected: true },
    ],
    similarity: 0.88
  },
  {
    id: "t6",
    name: "Banking-as-a-Service",
    children: [
      { id: "t6c1", name: "White-Label Banking", selected: true },
      { id: "t6c2", name: "Backend Infrastructure", selected: true },
      { id: "t6c3", name: "Financial Platforms", selected: true },
    ],
    similarity: 0.85
  },
  {
    id: "t7",
    name: "Open banking / APIs",
    children: [
      { id: "t7c1", name: "Data Sharing", selected: true },
      { id: "t7c2", name: "Financial Ecosystems", selected: true },
      { id: "t7c3", name: "Third-Party Integration", selected: true },
    ],
    similarity: 0.82
  },
  {
    id: "t8",
    name: "Embedded finance",
    children: [
      { id: "t8c1", name: "Non-Financial Platforms", selected: true },
      { id: "t8c2", name: "Integrated Payment Solutions", selected: true },
      { id: "t8c3", name: "Contextual Banking", selected: true },
    ],
    similarity: 0.79
  },
  {
    id: "t9",
    name: "Insurtech",
    children: [
      { id: "t9c1", name: "Digital Insurance", selected: true },
      { id: "t9c2", name: "Usage-Based Insurance", selected: true },
      { id: "t9c3", name: "Claims Automation", selected: true },
    ],
    similarity: 0.76
  },
  {
    id: "t10",
    name: "WealthTech",
    children: [
      { id: "t10c1", name: "Investment Platforms", selected: true },
      { id: "t10c2", name: "Robo-Advisors", selected: true },
      { id: "t10c3", name: "Wealth Management", selected: true },
    ],
    similarity: 0.73
  },
  {
    id: "t11",
    name: "RegTech",
    children: [
      { id: "t11c1", name: "Compliance Automation", selected: true },
      { id: "t11c2", name: "Risk Management", selected: true },
      { id: "t11c3", name: "Regulatory Reporting", selected: true },
    ],
    similarity: 0.70
  },
  {
    id: "t12",
    name: "Real-time payments & instant settlement",
    children: [
      { id: "t12c1", name: "Immediate Transfers", selected: true },
      { id: "t12c2", name: "24/7 Payment Systems", selected: true },
      { id: "t12c3", name: "Fast Settlement", selected: true },
    ],
    similarity: 0.67
  },
  {
    id: "t13",
    name: "Financial inclusion",
    children: [
      { id: "t13c1", name: "Unbanked Solutions", selected: true },
      { id: "t13c2", name: "Accessible Banking", selected: true },
      { id: "t13c3", name: "Microfinance", selected: true },
    ],
    similarity: 0.64
  },
  {
    id: "t14",
    name: "Digital literacy & financial education",
    children: [
      { id: "t14c1", name: "Financial Learning", selected: true },
      { id: "t14c2", name: "Educational Resources", selected: true },
      { id: "t14c3", name: "Financial Empowerment", selected: true },
    ],
    similarity: 0.61
  },
  {
    id: "t15",
    name: "Gamification of finance",
    children: [
      { id: "t15c1", name: "Rewards Systems", selected: true },
      { id: "t15c2", name: "Financial Goals", selected: true },
      { id: "t15c3", name: "Engagement Mechanics", selected: true },
    ],
    similarity: 0.58
  },
  {
    id: "t16",
    name: "AI financial advice",
    children: [
      { id: "t16c1", name: "Personalized Recommendations", selected: true },
      { id: "t16c2", name: "Financial Assistants", selected: true },
      { id: "t16c3", name: "Automated Planning", selected: true },
    ],
    similarity: 0.55
  },
  {
    id: "t17",
    name: "Cryptocurrency exchanges",
    children: [
      { id: "t17c1", name: "Trading Platforms", selected: true },
      { id: "t17c2", name: "Digital Asset Marketplaces", selected: true },
      { id: "t17c3", name: "Crypto Liquidity", selected: true },
    ],
    similarity: 0.52
  },
  {
    id: "t18",
    name: "Stablecoins",
    children: [
      { id: "t18c1", name: "Fiat-Backed Tokens", selected: true },
      { id: "t18c2", name: "Crypto-Collateralized Assets", selected: true },
      { id: "t18c3", name: "Algorithmic Stablecoins", selected: true },
    ],
    similarity: 0.49
  },
  {
    id: "t19",
    name: "DeFi lending/borrowing platforms",
    children: [
      { id: "t19c1", name: "Decentralized Loans", selected: true },
      { id: "t19c2", name: "Yield Farming", selected: true },
      { id: "t19c3", name: "Liquidity Provision", selected: true },
    ],
    similarity: 0.46
  },
  {
    id: "t20",
    name: "CBDCs",
    children: [
      { id: "t20c1", name: "Central Bank Digital Currencies", selected: true },
      { id: "t20c2", name: "Digital Fiat", selected: true },
      { id: "t20c3", name: "National Digital Assets", selected: true },
    ],
    similarity: 0.43
  },
  {
    id: "t21",
    name: "Smart contracts",
    children: [
      { id: "t21c1", name: "Self-Executing Agreements", selected: true },
      { id: "t21c2", name: "Programmable Money", selected: true },
      { id: "t21c3", name: "Automated Transactions", selected: true },
    ],
    similarity: 0.40
  },
  {
    id: "t22",
    name: "Crypto regulation",
    children: [
      { id: "t22c1", name: "Digital Asset Laws", selected: true },
      { id: "t22c2", name: "Regulatory Frameworks", selected: true },
      { id: "t22c3", name: "Compliance Standards", selected: true },
    ],
    similarity: 0.37
  },
  {
    id: "t23",
    name: "Quantum computing in finance",
    children: [
      { id: "t23c1", name: "Risk Analysis", selected: true },
      { id: "t23c2", name: "Portfolio Optimization", selected: true },
      { id: "t23c3", name: "Cryptographic Security", selected: true },
    ],
    similarity: 0.34
  },
  {
    id: "t24",
    name: "Financial conduct authorities",
    children: [
      { id: "t24c1", name: "Regulatory Bodies", selected: true },
      { id: "t24c2", name: "SEC/FCA Oversight", selected: true },
      { id: "t24c3", name: "Market Supervision", selected: true },
    ],
    similarity: 0.31
  },
  {
    id: "t25",
    name: "Sustainable/green finance",
    children: [
      { id: "t25c1", name: "ESG Investing", selected: true },
      { id: "t25c2", name: "Impact Financing", selected: true },
      { id: "t25c3", name: "Climate Bonds", selected: true },
    ],
    similarity: 0.28
  },
  {
    id: "t26",
    name: "Licensing & cross-border compliance",
    children: [
      { id: "t26c1", name: "International Regulations", selected: true },
      { id: "t26c2", name: "Multi-Jurisdictional Operations", selected: true },
      { id: "t26c3", name: "Passporting Rights", selected: true },
    ],
    similarity: 0.25
  },
  {
    id: "t27",
    name: "Data privacy laws",
    children: [
      { id: "t27c1", name: "GDPR Compliance", selected: true },
      { id: "t27c2", name: "CCPA Standards", selected: true },
      { id: "t27c3", name: "Privacy Frameworks", selected: true },
    ],
    similarity: 0.22
  },
  {
    id: "t28",
    name: "Alternative data for credit & risk scoring",
    children: [
      { id: "t28c1", name: "Non-Traditional Data", selected: true },
      { id: "t28c2", name: "Behavioral Metrics", selected: true },
      { id: "t28c3", name: "Digital Footprints", selected: true },
    ],
    similarity: 0.19
  },
  {
    id: "t29",
    name: "Behavioral economics in finance",
    children: [
      { id: "t29c1", name: "Decision Making", selected: true },
      { id: "t29c2", name: "Consumer Psychology", selected: true },
      { id: "t29c3", name: "Bias Mitigation", selected: true },
    ],
    similarity: 0.16
  },
  {
    id: "t30",
    name: "APIs and microservices",
    children: [
      { id: "t30c1", name: "Financial Infrastructure", selected: true },
      { id: "t30c2", name: "Service Integration", selected: true },
      { id: "t30c3", name: "Modular Architecture", selected: true },
    ],
    similarity: 0.13
  },
  {
    id: "t31",
    name: "Cloud computing",
    children: [
      { id: "t31c1", name: "Financial SaaS", selected: true },
      { id: "t31c2", name: "Cloud Infrastructure", selected: true },
      { id: "t31c3", name: "Scalable Solutions", selected: true },
    ],
    similarity: 0.10
  },
  {
    id: "t32",
    name: "Artificial intelligence & machine learning",
    children: [
      { id: "t32c1", name: "Fraud Detection", selected: true },
      { id: "t32c2", name: "Underwriting", selected: true },
      { id: "t32c3", name: "Predictive Analytics", selected: true },
    ],
    similarity: 0.07
  },
  {
    id: "t33",
    name: "Cybersecurity",
    children: [
      { id: "t33c1", name: "Financial Data Protection", selected: true },
      { id: "t33c2", name: "Fraud Prevention", selected: true },
      { id: "t33c3", name: "Secure Transactions", selected: true },
    ],
    similarity: 0.04
  },
  {
    id: "t34",
    name: "Decentralized identity",
    children: [
      { id: "t34c1", name: "Self-Sovereign Identity", selected: true },
      { id: "t34c2", name: "Blockchain Verification", selected: true },
      { id: "t34c3", name: "Privacy-Preserving ID", selected: true },
    ],
    similarity: 0.03
  },
  {
    id: "t35",
    name: "Digital identity",
    children: [
      { id: "t35c1", name: "eKYC Solutions", selected: true },
      { id: "t35c2", name: "Online Verification", selected: true },
      { id: "t35c3", name: "Identity Management", selected: true },
    ],
    similarity: 0.02
  },
  {
    id: "t36",
    name: "User onboarding and trust",
    children: [
      { id: "t36c1", name: "Customer Experience", selected: true },
      { id: "t36c2", name: "Trust Mechanisms", selected: true },
      { id: "t36c3", name: "Onboarding Flows", selected: true },
    ],
    similarity: 0.01
  }
];
