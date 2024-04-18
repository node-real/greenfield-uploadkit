import { BroadcastResponse, resolve } from '@/facade/common';
import { ErrorResponse, broadcastFault, createTxFault, simulateFault } from '@/facade/error';
import { signTypedDataCallback } from '@/facade/wallet';
import { MsgCreateBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { Client, ISimulateGasFee, TxResponse } from '@bnb-chain/greenfield-js-sdk';
import { Connector } from 'wagmi';

export const simulateCreateBucket = async (
  params: MsgCreateBucket,
  client: Client,
): Promise<[ISimulateGasFee, null, TxResponse] | ErrorResponse> => {
  const [createBucketTx, error1] = await client.bucket
    .createBucket(params)
    .then(resolve, createTxFault);

  if (!createBucketTx) return [null, error1];

  const [simulateInfo, error2] = await createBucketTx
    .simulate({
      denom: 'BNB',
    })
    .then(resolve, simulateFault);

  if (!simulateInfo) return [null, error2];

  return [simulateInfo, null, createBucketTx];
};

export const createBucket = async (
  params: MsgCreateBucket,
  connector: Connector,
  client: Client,
): BroadcastResponse => {
  const [simulateInfo, error, createBucketTx] = await simulateCreateBucket(params, client);
  if (!simulateInfo) return [null, error];

  const payload = {
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: params.creator,
    granter: '',
    signTypedDataCallback: signTypedDataCallback(connector),
  };

  return createBucketTx.broadcast(payload).then(resolve, broadcastFault);
};
