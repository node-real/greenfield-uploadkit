import { bscTestnet } from 'viem/chains';

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
  bscTestnet,
];
