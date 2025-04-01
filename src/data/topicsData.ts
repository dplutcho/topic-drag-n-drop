export interface TopicChild {
  id: string;
  name: string;
  selected: boolean;
}

export interface Topic {
  id: string;
  name: string;
  children: TopicChild[];
  similarityScore?: number;
}

// Mock data for topics with hierarchies and similarity scores
export const topicsData: Topic[] = [
  {
    id: "t1",
    name: "E-commerce",
    children: [
      { id: "t1c1", name: "Online Shopping", selected: true },
      { id: "t1c2", name: "Digital Payments", selected: true },
      { id: "t1c3", name: "Shopping Cart Systems", selected: true },
    ],
    similarityScore: 0.8,
  },
  {
    id: "t2",
    name: "Digital Marketing",
    children: [
      { id: "t2c1", name: "SEO", selected: true },
      { id: "t2c2", name: "Content Marketing", selected: true },
      { id: "t2c3", name: "Social Media Marketing", selected: true },
    ],
    similarityScore: 0.7,
  },
  {
    id: "t3",
    name: "Software Development",
    children: [
      { id: "t3c1", name: "Web Development", selected: true },
      { id: "t3c2", name: "Mobile App Development", selected: true },
      { id: "t3c3", name: "Cloud Computing", selected: true },
    ],
    similarityScore: 0.6,
  },
  {
    id: "t4",
    name: "Data Analytics",
    children: [
      { id: "t4c1", name: "Business Intelligence", selected: true },
      { id: "t4c2", name: "Predictive Analytics", selected: true },
      { id: "t4c3", name: "Data Visualization", selected: true },
    ],
    similarityScore: 0.9,
  },
  {
    id: "t5",
    name: "Artificial Intelligence",
    children: [
      { id: "t5c1", name: "Machine Learning", selected: true },
      { id: "t5c2", name: "Natural Language Processing", selected: true },
      { id: "t5c3", name: "Computer Vision", selected: true },
    ],
    similarityScore: 0.5,
  },
  {
    id: "t6",
    name: "Cybersecurity",
    children: [
      { id: "t6c1", name: "Network Security", selected: true },
      { id: "t6c2", name: "Cloud Security", selected: true },
      { id: "t6c3", name: "Data Privacy", selected: true },
    ],
    similarityScore: 0.4,
  },
  {
    id: "t7",
    name: "Blockchain",
    children: [
      { id: "t7c1", name: "Cryptocurrencies", selected: true },
      { id: "t7c2", name: "Smart Contracts", selected: true },
      { id: "t7c3", name: "Decentralized Finance", selected: true },
    ],
    similarityScore: 0.3,
  },
  {
    id: "t8",
    name: "Fintech",
    children: [
      { id: "t8c1", name: "Digital Banking", selected: true },
      { id: "t8c2", name: "Payment Processing", selected: true },
      { id: "t8c3", name: "Investment Platforms", selected: true },
    ],
    similarityScore: 0.2,
  },
  {
    id: "t9",
    name: "Healthcare Technology",
    children: [
      { id: "t9c1", name: "Telemedicine", selected: true },
      { id: "t9c2", name: "Health Informatics", selected: true },
      { id: "t9c3", name: "Medical Devices", selected: true },
    ],
    similarityScore: 0.1,
  },
  {
    id: "t10",
    name: "Sustainable Technology",
    children: [
      { id: "t10c1", name: "Renewable Energy", selected: true },
      { id: "t10c2", name: "Green Computing", selected: true },
      { id: "t10c3", name: "Circular Economy", selected: true },
    ],
    similarityScore: 0.0,
  },
];