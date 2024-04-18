import {
  Client,
  METHOD_PUT,
  SpMetaInfo,
  verifyBucketName,
  verifyObjectName,
  PutObjectRequest,
  DelegatedPubObjectRequest,
} from '@bnb-chain/greenfield-js-sdk';
import { resolve } from './common';
import { createTxFault } from './error';
import { AuthType } from '@/facade/tx';
import { MsgCreateObject } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { UploadObject } from '@/components/UploadProvider/types';

export const getCreateObjectTx = async (configParam: MsgCreateObject, client: Client) => {
  return client.object.createObject(configParam).then(resolve, createTxFault);
};

export type TMakePutObjectHeaders = PutObjectRequest & {
  endpoint: string;
};

export const makePutObjectHeaders = async (
  configParam: TMakePutObjectHeaders,
  authType: AuthType,
  client: Client,
) => {
  const { bucketName, objectName, txnHash, body, endpoint } = configParam;
  verifyBucketName(bucketName);
  verifyObjectName(objectName);

  if (!txnHash) {
    throw new Error('Transaction hash is empty, please check.');
  }
  const method = METHOD_PUT;
  const params = new URLSearchParams();
  const payload = {
    objectName,
    bucketName,
    txnHash,
    contentType: body.type || 'text/plain',
    body,
  };
  const { reqMeta, url } = await SpMetaInfo.getPutObjectMetaInfo(endpoint, payload);
  const headers = await client.spClient.signHeaders(reqMeta, authType);

  return {
    url,
    headers,
    method,
    params,
  };
};

export const makeDelegatePutObjectHeaders = async (
  delegateConfig: DelegatedPubObjectRequest,
  authType: AuthType,
  endpoint: string,
  client: Client,
) => {
  const { bucketName, objectName, body, delegatedOpts } = delegateConfig;
  verifyBucketName(bucketName);
  verifyObjectName(objectName);

  const method = METHOD_PUT;
  const params = new URLSearchParams();
  const contentType = body?.type || 'text/plain';
  const payload = { objectName, bucketName, contentType, body, delegatedOpts };
  const { reqMeta, url } = await SpMetaInfo.getPutObjectMetaInfo(endpoint, payload);
  const headers = await client.spClient.signHeaders(reqMeta, authType);

  return { url, headers, method, params };
};

export const getPutObjectRequestConfig = async ({
  task,
  loginAccount,
  seedString,
  endpoint,
  file,
  client,
}: {
  task: UploadObject;
  loginAccount: string;
  seedString: string;
  endpoint: string;
  file: File;
  client: Client;
}) => {
  const fullObjectName = [...task.prefixFolders, task.waitObject.relativePath, task.waitObject.name]
    .filter((item) => !!item)
    .join('/');
  const authType = {
    type: 'EDDSA',
    seed: seedString,
    domain: window.location.origin,
    address: loginAccount,
  } as AuthType;

  if (!task.delegateUpload) {
    const payload: TMakePutObjectHeaders = {
      bucketName: task.bucketName,
      objectName: fullObjectName,
      body: task.waitObject.file,
      txnHash: task.createHash,
      endpoint,
    };

    return makePutObjectHeaders(payload, authType, client);
  }

  const payload: DelegatedPubObjectRequest = {
    bucketName: task.bucketName,
    objectName: fullObjectName,
    body: file,
    delegatedOpts: {
      visibility: task.visibility,
    },
  };

  return makeDelegatePutObjectHeaders(payload, authType, endpoint, client);
};
