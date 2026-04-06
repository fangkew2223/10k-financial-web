export interface NasdaqCompany {
  rank: number;
  ticker: string;
  name: string;
  sector: string;
  marketCap: string;
  description: string;
}

export const top10NasdaqCompanies: NasdaqCompany[] = [
  {
    rank: 1,
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    marketCap: "$3.0T",
    description: "Designs and sells consumer electronics, software, and online services.",
  },
  {
    rank: 2,
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    marketCap: "$2.9T",
    description: "Develops and supports software, services, devices, and solutions worldwide.",
  },
  {
    rank: 3,
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    marketCap: "$2.2T",
    description: "Designs graphics processing units and system-on-chip units for AI and gaming.",
  },
  {
    rank: 4,
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    sector: "Consumer Discretionary",
    marketCap: "$1.9T",
    description: "Engages in e-commerce, cloud computing, digital streaming, and AI.",
  },
  {
    rank: 5,
    ticker: "META",
    name: "Meta Platforms, Inc.",
    sector: "Communication Services",
    marketCap: "$1.4T",
    description: "Builds technologies that help people connect, find communities, and grow businesses.",
  },
  {
    rank: 6,
    ticker: "TSLA",
    name: "Tesla, Inc.",
    sector: "Consumer Discretionary",
    marketCap: "$800B",
    description: "Designs, develops, manufactures, and sells electric vehicles and energy solutions.",
  },
  {
    rank: 7,
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Communication Services",
    marketCap: "$2.1T",
    description: "Provides online advertising services, search engine, cloud computing, and more.",
  },
  {
    rank: 8,
    ticker: "AVGO",
    name: "Broadcom Inc.",
    sector: "Technology",
    marketCap: "$780B",
    description: "Designs, develops, and supplies semiconductor and infrastructure software solutions.",
  },
  {
    rank: 9,
    ticker: "COST",
    name: "Costco Wholesale Corporation",
    sector: "Consumer Staples",
    marketCap: "$390B",
    description: "Operates membership warehouses offering a wide selection of merchandise.",
  },
  {
    rank: 10,
    ticker: "NFLX",
    name: "Netflix, Inc.",
    sector: "Communication Services",
    marketCap: "$380B",
    description: "Provides subscription streaming entertainment service worldwide.",
  },
  {
    rank: 11,
    ticker: "GS",
    name: "Goldman Sachs Group, Inc.",
    sector: "Financial Services",
    marketCap: "$185B",
    description: "Global investment banking, securities, and investment management firm providing financial services worldwide.",
  },
  {
    rank: 12,
    ticker: "MS",
    name: "Morgan Stanley",
    sector: "Financial Services",
    marketCap: "$195B",
    description: "Global financial services firm providing investment banking, securities, wealth management, and investment management services.",
  },
];
