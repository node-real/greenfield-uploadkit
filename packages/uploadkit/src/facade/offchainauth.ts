import {
  Client,
  IGenOffChainAuthKeyPairAndUpload,
  IReturnOffChainAuthKeyPairAndUpload,
} from '@bnb-chain/greenfield-js-sdk';
import { getSps } from './sp';
import { ErrorResponse, UNKNOWN_ERROR } from './error';

export const EXPIRATION_MS = 5 * 24 * 60 * 60 * 1000;
export const onOffChainAuth = async ({
  address,
  provider,
  client,
  chainId,
}: {
  address: string;
  chainId: number;
  provider: any;
  client: Client;
}): Promise<ErrorResponse | [IReturnOffChainAuthKeyPairAndUpload, null]> => {
  const [allSps, error] = await getSps(client);
  if (allSps === null || error) {
    return [null, error];
  }
  const sps = allSps.map((sp) => ({
    address: sp.operatorAddress,
    endpoint: sp.endpoint,
    name: sp.description?.moniker,
  }));
  const configParam: IGenOffChainAuthKeyPairAndUpload = {
    sps: sps,
    chainId: chainId,
    expirationMs: EXPIRATION_MS,
    domain: window.location.origin,
    address,
  };

  const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload(
    configParam,
    provider,
  );

  const { code, body: offChainData } = offchainAuthRes;
  if (code !== 0 || !offChainData) {
    return [null, offchainAuthRes.message || UNKNOWN_ERROR];
  }

  return [offChainData, null];
};
