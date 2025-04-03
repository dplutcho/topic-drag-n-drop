
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
    id: "t7",
    name: "Blockchain",
    children: [
      { id: "t7c1", name: "Cryptocurrencies", selected: true },
      { id: "t7c2", name: "Smart Contracts", selected: true },
      { id: "t7c3", name: "Decentralized Finance", selected: true },
    ],
  },
  {
    id: "t8",
    name: "Fintech",
    children: [
      { id: "t8c1", name: "Digital Banking", selected: true },
      { id: "t8c2", name: "Payment Processing", selected: true },
      { id: "t8c3", name: "Investment Platforms", selected: true },
    ],
  },
  {
    id: "t1",
    name: "Banking-as-a-Service (BaaS)",
    children: [
      { id: "t1c1", name: "Open Banking APIs", selected: true },
      { id: "t1c2", name: "Third-party Integration", selected: true },
      { id: "t1c3", name: "Platform Banking", selected: true },
    ],
  },
  {
    id: "t2",
    name: "Digital Payments",
    children: [
      { id: "t2c1", name: "Mobile Wallets", selected: true },
      { id: "t2c2", name: "P2P Transfers", selected: true },
      { id: "t2c3", name: "Real-time Payments", selected: true },
    ],
    similarity: 1.0
  },
  {
    id: "t3",
    name: "Neobanks & Challenger Banks",
    children: [
      { id: "t3c1", name: "Mobile-only Banking", selected: true },
      { id: "t3c2", name: "Digital-first Services", selected: true },
      { id: "t3c3", name: "Customer-centric Design", selected: true },
    ],
    similarity: 0.95
  },
  {
    id: "t4",
    name: "Lending Platforms",
    children: [
      { id: "t4c1", name: "Buy Now Pay Later", selected: true },
      { id: "t4c2", name: "P2P Lending", selected: true },
      { id: "t4c3", name: "Alternative Credit Scoring", selected: true },
    ],
    similarity: 0.9
  },
  {
    id: "t5",
    name: "Personal Finance Tools",
    children: [
      { id: "t5c1", name: "Budgeting Apps", selected: true },
      { id: "t5c2", name: "Robo-advisors", selected: true },
      { id: "t5c3", name: "Financial Planning", selected: true },
    ],
    similarity: 0.85
  },
  {
    id: "t6",
    name: "Open Banking / APIs",
    children: [
      { id: "t6c1", name: "Data Sharing", selected: true },
      { id: "t6c2", name: "Third-party Access", selected: true },
      { id: "t6c3", name: "Financial Ecosystems", selected: true },
    ],
    similarity: 0.8
  },
  {
    id: "t9",
    name: "Embedded Finance",
    children: [
      { id: "t9c1", name: "Non-financial Platforms", selected: true },
      { id: "t9c2", name: "Integrated Services", selected: true },
      { id: "t9c3", name: "Banking-as-a-Feature", selected: true },
    ],
    similarity: 0.75
  },
  {
    id: "t10",
    name: "Insurtech",
    children: [
      { id: "t10c1", name: "Digital Insurance", selected: true },
      { id: "t10c2", name: "Claims Automation", selected: true },
      { id: "t10c3", name: "Usage-based Insurance", selected: true },
    ],
    similarity: 0.7
  },
  {
    id: "t11",
    name: "WealthTech",
    children: [
      { id: "t11c1", name: "Investment Platforms", selected: true },
      { id: "t11c2", name: "Robo-advisors", selected: true },
      { id: "t11c3", name: "Portfolio Management", selected: true },
    ],
    similarity: 0.65
  },
  {
    id: "t12",
    name: "APIs and Microservices",
    children: [
      { id: "t12c1", name: "Integration Services", selected: true },
      { id: "t12c2", name: "Modular Architecture", selected: true },
      { id: "t12c3", name: "Developer Tools", selected: true },
    ],
    similarity: 0.6
  },
  {
    id: "t13",
    name: "Cloud Computing",
    children: [
      { id: "t13c1", name: "Financial SaaS", selected: true },
      { id: "t13c2", name: "Scalable Infrastructure", selected: true },
      { id: "t13c3", name: "Distributed Systems", selected: true },
    ],
    similarity: 0.55
  },
  {
    id: "t14",
    name: "Artificial Intelligence & Machine Learning",
    children: [
      { id: "t14c1", name: "Fraud Detection", selected: true },
      { id: "t14c2", name: "Underwriting", selected: true },
      { id: "t14c3", name: "Predictive Analytics", selected: true },
    ],
    similarity: 0.5
  },
  {
    id: "t15",
    name: "Blockchain & DLT",
    children: [
      { id: "t15c1", name: "Distributed Ledgers", selected: true },
      { id: "t15c2", name: "Smart Contracts", selected: true },
      { id: "t15c3", name: "Tokenization", selected: true },
    ],
    similarity: 0.45
  },
  {
    id: "t16",
    name: "Cybersecurity",
    children: [
      { id: "t16c1", name: "Financial Data Protection", selected: true },
      { id: "t16c2", name: "Fraud Prevention", selected: true },
      { id: "t16c3", name: "Secure Transactions", selected: true },
    ],
    similarity: 0.4
  },
  {
    id: "t17",
    name: "Digital Identity & KYC/AML",
    children: [
      { id: "t17c1", name: "Identity Verification", selected: true },
      { id: "t17c2", name: "Compliance Technology", selected: true },
      { id: "t17c3", name: "Anti-Money Laundering", selected: true },
    ],
    similarity: 0.35
  },
  {
    id: "t18",
    name: "RegTech",
    children: [
      { id: "t18c1", name: "Compliance Automation", selected: true },
      { id: "t18c2", name: "Regulatory Reporting", selected: true },
      { id: "t18c3", name: "Risk Management", selected: true },
    ],
    similarity: 0.3
  },
  {
    id: "t19",
    name: "Cryptocurrency",
    children: [
      { id: "t19c1", name: "Digital Exchanges", selected: true },
      { id: "t19c2", name: "Crypto Wallets", selected: true },
      { id: "t19c3", name: "Stablecoins", selected: true },
    ],
    similarity: 0.25
  },
  {
    id: "t20",
    name: "DeFi",
    children: [
      { id: "t20c1", name: "Lending/Borrowing Platforms", selected: true },
      { id: "t20c2", name: "Decentralized Exchanges", selected: true },
      { id: "t20c3", name: "Yield Farming", selected: true },
    ],
    similarity: 0.2
  }
];
