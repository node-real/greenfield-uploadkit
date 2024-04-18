import { BroadcastResponse, resolve } from './common';
import { ErrorResponse, broadcastFault, createTxFault, simulateFault } from './error';
import { Client, ISimulateGasFee, TxResponse } from '@bnb-chain/greenfield-js-sdk';
import { Connector } from 'wagmi';
import { signTypedDataCallback } from './wallet';
import { commonFault } from './error';
import { MsgCreateBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';

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

export const getCreateBucketTx = async (
  msgCreateBucket: MsgCreateBucket,
  client: Client,
): Promise<[TxResponse, null] | ErrorResponse> => {
  return client.bucket.createBucket(msgCreateBucket).then(resolve, createTxFault);
};

export const getBucketMeta = (
  options: { bucketName: string; endpoint: string },
  client: Client,
) => {
  return client.bucket.getBucketMeta(options).then(resolve, commonFault);
};
