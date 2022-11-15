export const ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_KEY;
export const BLOCKNATIVE_DAPPID = process.env.REACT_APP_BLOCKNATIVE_DAPPID;
export const GOOGLEANALYTICS_ID = process.env.REACT_APP_GOOGLEANALYTICS_ID;

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "https://snowtrace.io/",
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockTime: 4000,
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockExplorer: "https://etherscan.io/",
    blockTime: 15000,
  },
  avalanche: {
    name: "avalanche",
    color: "#ff8b9e",
    chainId: 43114,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockExplorer: "https://snowtrace.io/",
    blockTime: 4000,
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    chainId: 42,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
    blockTime: 4000,
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
    blockTime: 15000,
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: process.env.REACT_APP_RPC_URL,
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: process.env.REACT_APP_RPC_URL,
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  matic: {
    name: "matic",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://explorer-mainnet.maticvigil.com//",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://mumbai-explorer.matic.today/",
  },
  localArbitrum: {
    name: "localArbitrum",
    color: "#50a0ea",
    chainId: 153869338190755,
    blockExplorer: "",
    rpcUrl: `http://localhost:8547`,
  },
  localArbitrumL1: {
    name: "localArbitrumL1",
    color: "#50a0ea",
    chainId: 44010,
    blockExplorer: "",
    rpcUrl: `http://localhost:7545`,
  },
  rinkebyArbitrum: {
    name: "Arbitrum Testnet",
    color: "#50a0ea",
    chainId: 421611,
    blockExplorer: "https://rinkeby-explorer.arbitrum.io/#/",
    rpcUrl: `https://rinkeby.arbitrum.io/rpc`,
  },
  arbitrum: {
    name: "Arbitrum",
    color: "#50a0ea",
    chainId: 42161,
    blockExplorer: "https://explorer.arbitrum.io/#/",
    rpcUrl: `https://arb1.arbitrum.io/rpc`,
    gasPrice: 0,
  },
  localOptimismL1: {
    name: "localOptimismL1",
    color: "#f01a37",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: `http://${window.location.hostname}:9545`,
  },
  localOptimism: {
    name: "localOptimism",
    color: "#f01a37",
    chainId: 420,
    blockExplorer: "",
    rpcUrl: `http://${window.location.hostname}:8545`,
    gasPrice: 0,
  },
  kovanOptimism: {
    name: "kovanOptimism",
    color: "#f01a37",
    chainId: 69,
    blockExplorer: "https://kovan-optimistic.etherscan.io/",
    rpcUrl: `https://kovan.optimism.io`,
    gasPrice: 0,
  },
  optimism: {
    name: "optimism",
    color: "#f01a37",
    chainId: 10,
    blockExplorer: "https://optimistic.etherscan.io/",
    rpcUrl: `https://mainnet.optimism.io`,
  },
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

export const statsData = [
  {
    icon: "/assets/icons/diamond.svg",
    text: "$23,771",
    subText: "Total Value Locked (TVL)",
  },
  {
    icon: "/assets/icons/money-plant.svg",
    text: "$169.63",
    subText: "Total Yield Donated",
  },
  {
    icon: "/assets/icons/heart.svg",
    text: "46",
    subText: "Total Yield Donors",
  },
];

export const categories = [
  "Animal Related",
  "Arts, Culture & Humanities",
  "Crime & Legal-Related",
  "Education",
  "Employment",
  "Enviroment",
];

export const companyCard = [
  {
    cardInfo: {
      logo: "/assets/kidney-fund.png",
      foundedIn: "1962",
      revenue: "29.31M",
      country: "AFRICA",
      frame: "https://www.youtube.com/embed/4KL_Gzy3NvM",
    },
    companyName: "Childrens Miracle Network",
    description:
      "Children's Miracle Network saves the lives of children by raising funds and awareness for local children's ...",
    icons: ["/assets/icons/healthcare.svg"],
    name: "children",
  },
  {
    cardInfo: {
      logo: "/assets/awf.png",
      foundedIn: "1962",
      revenue: "29.31M",
      country: "AFRICA",
      frame: "https://www.youtube.com/embed/NNQLJcJEzv0",
    },
    companyName: "African Wildlife Foundation",
    description: "The African Wildlife Foundation works to ensure wildlife and wild lands thrive in modern Africa.",
    icons: ["/assets/icons/animal-paw.svg", "/assets/icons/eco-friendly.svg", "/assets/icons/network.svg"],
    name: "wildlife",
  },
  {
    cardInfo: {
      logo: "/assets/kidney-fund.png",
      foundedIn: "1999",
      revenue: "29.31M",
      country: "COLUMBIA - ECUDOR - PERU - BRAZIL",
      frame: "https://www.youtube.com/embed/4KL_Gzy3NvM",
    },
    companyName: "Amazon Watch",
    description:
      "Since 1996, Amazon Watch has protected the rainforest and advanced the rights of indigenous peoples ...",
    icons: ["/assets/icons/animal-paw.svg", "/assets/icons/eco-friendly.svg", "/assets/icons/network.svg"],
    name: "amazon",
  },
  {
    cardInfo: {
      logo: "/assets/awf.png",
      foundedIn: "1971",
      revenue: "29.31M",
      country: "UNITED STATES",
      frame: "https://www.youtube.com/embed/NNQLJcJEzv0",
    },
    companyName: "American Kidney Fund, Inc.",
    description:
      "AKF works on behalf of the 37 million Americans living with kidney disease, and the millions more at risk ...",
    icons: ["/assets/icons/animals.svg", "/assets/icons/enviroment-friendly.svg"],
    name: "kidney",
  },
  {
    cardInfo: {
      logo: "/assets/kidney-fund.png",
      foundedIn: "2001",
      revenue: "29.31M",
      country: "UNITED STATES",
      frame: "https://www.youtube.com/embed/4KL_Gzy3NvM",
    },
    companyName: "Baby2Baby",
    description:
      "Baby2Baby provides children living in poverty with diapers, clothing and all the basic necessities that ...",
    icons: [],
    name: "baby",
  },
  {
    cardInfo: {
      logo: "/assets/awf.png",
      foundedIn: "2001",
      revenue: "29.31M",
      country: "SOMALIA - KENYA - ETHOPIA - SUDAN",
      frame: "https://www.youtube.com/embed/NNQLJcJEzv0",
    },
    companyName: "American Relief Agency for The ...",
    description:
      "ARAHA strives to alleviate human suffering and build self-reliant communities, by providing humanitarian ...",
    icons: ["/assets/icons/animal-paw.svg", "/assets/icons/eco-friendly.svg", "/assets/icons/network.svg"],
    name: "relief",
  },
];
