import { useUpload } from '@/components/UploadProvider';
import { WaitObject } from '@/components/UploadProvider/types';
import { isGnfdChain } from '@/utils/network';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const useUploadDisable = () => {
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(false);
  const [dragAreaDisabled, setDragAreaDisabled] = useState(false);
  const [isGnfd, setIsGnfd] = useState(false);
  const { chain } = useNetwork();
  const {
    state: { loading, waitQueue },
  } = useUpload();

  useEffect(() => {
    const isGnfd = isGnfdChain(chain?.id);
    const buttonDisabled =
      loading ||
      !isGnfd ||
      waitQueue.length === 0 ||
      (waitQueue.length > 0 && waitQueue.every((item: WaitObject) => item.status !== 'WAIT'));

    const dragDisabled = loading || !isGnfd;
    setIsGnfd(isGnfd);
    setUploadButtonDisabled(buttonDisabled);
    setDragAreaDisabled(dragDisabled);
  }, [chain?.id, loading, waitQueue]);

  return {
    isGnfd,
    uploadButtonDisabled,
    dragAreaDisabled,
  };
};
