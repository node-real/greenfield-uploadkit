import { SpResponse, TxResponse } from '@bnb-chain/greenfield-js-sdk';
import { ErrorResponse, UNKNOWN_ERROR } from './error';

export const resolve = <R>(r: R): [R, null] => [r, null];

export const resolveSpRequest = <R>(r: SpResponse<R>) => {
  if (r.code !== 0) {
    return [null, r.message || UNKNOWN_ERROR];
  }
  return [r.body, null];
};

export type DeliverTxResponse = Awaited<ReturnType<TxResponse['broadcast']>>;

export type BroadcastResponse = Promise<ErrorResponse | [DeliverTxResponse, null]>;
