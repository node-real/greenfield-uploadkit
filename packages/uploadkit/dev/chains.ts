import { bsc, bscTestnet } from 'wagmi/chains';

export const chains = [
  {
    id: 5600,
    name: 'BNB Greenfield Chain Testnet',
    network: 'BNB Greenfield Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'],
      },
      public: {
        http: ['https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'],
      },
    },
    blockExplorers: {
      etherscan: {
        name: `BNB Greenfield Chain Testnet Scan`,
        url: 'https://greenfield-chain.bnbchain.org',
      },
      default: {
        name: `BNB Greenfield Chain Testnet Scan`,
        url: 'https://greenfield-chain.bnbchain.org',
      },
    },
  },
  {
    id: 1017,
    name: 'BNB Greenfield Chain',
    network: 'BNB Greenfield Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://greenfield-chain.bnbchain.org'],
      },
      public: {
        http: ['https://greenfield-chain.bnbchain.org'],
      },
    },
    blockExplorers: {
      etherscan: {
        name: `BNB Greenfield Mainnet Scan`,
        url: 'https://greenfieldscan.com',
      },
      default: {
        name: `BNB Greenfield Mainnet Scan`,
        url: 'https://greenfieldscan.com',
      },
    },
  },
  bscTestnet,
  bsc,
];
