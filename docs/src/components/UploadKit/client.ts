import { Client } from '@bnb-chain/greenfield-js-sdk';

const GRPC_URL = 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org';

const GREEN_CHAIN_ID = 5600;

export const client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID));
