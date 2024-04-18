import { toast } from '@/base/components/toast';
import { UploadKitOptions } from '..';
import { VisibilityType } from '@bnb-chain/greenfield-js-sdk';

export const RECOMMEND_MAX_OBJECT_SIZE = 56 * 1024 * 1024;
export const RECOMMEND_MAX_OBJECT_COUNT = 100;
export const DELEGATE_RECOMMEND_MAX_OBJECT_SIZE = 1024 * 1024 * 1024;
export const DELEGATE_RECOMMEND_MAX_OBJECT_COUNT = 500;

export function getDefaultProviderOptions(options: UploadKitOptions) {
  const { delegateUpload, ...restOptions } = options;
  const maxObjectSize = delegateUpload
    ? DELEGATE_RECOMMEND_MAX_OBJECT_SIZE
    : RECOMMEND_MAX_OBJECT_SIZE;
  const maxObjectCount = delegateUpload
    ? DELEGATE_RECOMMEND_MAX_OBJECT_COUNT
    : RECOMMEND_MAX_OBJECT_COUNT;

  const mergedOptions: UploadKitOptions = {
    delegateUpload,

    maxObjectSize,
    maxObjectCount,

    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,

    taskManagementButton: true,

    closeModalOnEsc: true,
    closeModalOnOverlayClick: true,

    onError,
    ...restOptions,
  };

  return mergedOptions;
}

function onError(errorMsg: string) {
  if (errorMsg) {
    toast.error({
      description: errorMsg,
    });
  }
}
