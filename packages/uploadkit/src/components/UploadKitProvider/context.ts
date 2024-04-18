import { createContext, useContext } from 'react';
import { Client, VisibilityType } from '@bnb-chain/greenfield-js-sdk';
import { Sp } from '@/components/UploadProvider/types';

/**
 * UploadKitOptions is the options of the Greenfield UploadKit.
 *
 * @property {Client} client - The Greenfield js sdk client, Reference: https://docs.bnbchain.org/greenfield-js-sdk/client/greenfield-client
 *
 * @property {string} seedString -seedString is used to authenticate yourself to the provider. If not specified, the provider will generate one.
 * @property {(data: Uint8Array) => Promise<string[]>} [checksumFn] - The function to calculate the checksum of the object. If not specified, the provider will use the default checksum function.
 *
 * @property {boolean} delegateUpload - Specifies whether to use the delegate upload mode. If not specified, the default is set to true.
 *
 * @property {string} bucketName - The name of the bucket. If not specified, the default bucket will be used.
 * @property {Sp} [sp] - The storage service provider. If not specified, a random one will be selected.
 * @property {VisibilityType} [visibility=VisibilityType.VISIBILITY_TYPE_PUBLIC_READ] - visibility - The visibility of the object. If not specified, {VisibilityType.VISIBILITY_TYPE_PUBLIC_READ} will be used.
 *
 * @property {number} [maxObjectSize=56 * 1024 * 1024] - If the delegateUpload is false and this field not specified, the default is set to 56MB, resulting in an encoding time of under 6 seconds. Larger files may experience extended encoding times, and it is recommended to utilize a web worker for encoding large files. Reference: https://github.com/bnb-chain/greenfield-js-sdk/blob/main/packages/reed-solomon/examples/web-worker.html. But if the delegateUpload is true, the default is set to 1GB.
 * @property {number} [maxObjectCount=100] - The maximum count of objects. If the delegateUpload is false and this field not specified, the default is set to 100. But if the delegateUpload is true, the default is set to 500.
 *
 * @property {boolean} [taskManagementButton=true] - Specifies whether to show the task management button.
 *
 * @property {(errorMsg: string) => void} [onError] - The callback function when an error occurs.
 */
export interface UploadKitOptions {
  client: Client;

  seedString?: string;
  checksumFn?: (data: Uint8Array) => Promise<string[]>;

  delegateUpload?: boolean;

  bucketName?: string;
  sp?: Sp;
  visibility?: VisibilityType;

  maxObjectSize?: number;
  maxObjectCount?: number;

  taskManagementButton?: boolean;

  closeModalOnEsc?: boolean;
  closeModalOnOverlayClick?: boolean;

  onError?: (errorMsg: string) => void;
}

export interface UploadKitContextProps {
  options: UploadKitOptions;
}

export const UploadKitContext = createContext({} as UploadKitContextProps);

export function useUploadKitContext() {
  const context = useContext(UploadKitContext);
  return context;
}
