import { useUpload } from '@/components/UploadProvider';
import { ButtonProps, Button } from '@/base/components/Button';
import { clsUploadButton } from './styles.css';
import { cx } from '@/base/utils/css';
import { useNetwork, useAccount } from 'wagmi';
import { getCreateBucketTx } from '@/facade/bucket';
import { getSps } from '@/facade/sp';
import { onOffChainAuth } from '@/facade/offchainauth';
import { useUploadKitContext } from '@/components/UploadKitProvider/context';
import { getCreateTmpAccountTx } from '@/facade/payment';
import { broadcastMulTxs } from '@/facade/tx';
import { useRouter } from '@/components/RouteProvider/context';
import { routes } from '@/components/RouteProvider';
import { Loading } from '@/base/components/Loading';
import { useTotalFee } from '@/hooks/useTotalFee';
import { toast } from '@/base/components/toast';
import { bucketIsExist, getRandomBucketName } from '@/utils/bucket';
import { BN } from '@/utils/math';
import { useUploadDisable } from '@/hooks/useUploadDisable';
import { MsgCreateBucket } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { Long, TxResponse, VisibilityType } from '@bnb-chain/greenfield-js-sdk';
import { Sp } from '../UploadProvider/types';
import { ErrorResponse, UNKNOWN_ERROR } from '@/facade/error';

export const DEFAULT_UPLOAD_BUTTON_TEXT = 'Upload';
export const TEMP_ACCOUNT_SAFE_RATE = 1.05;
export const CHARGED_READ_QUOTA = 0;

export const UploadButton = (props: ButtonProps) => {
  const { className, children, ...restProps } = props;
  const router = useRouter();
  const { chain } = useNetwork();
  const { totalFee } = useTotalFee();
  const { address, connector } = useAccount();
  const {
    options: { client, seedString, sp, visibility, bucketName, delegateUpload, onError },
  } = useUploadKitContext();
  const { isGnfd, uploadButtonDisabled } = useUploadDisable();
  const {
    state: { loading },
    dispatch,
  } = useUpload();
  const setLoading = (show: boolean) => {
    dispatch({
      type: 'SET_IS_LOADING',
      payload: show,
    });
  };

  const errorHandler = (errorMsg: string) => {
    setLoading(false);
    onError && onError(errorMsg);
    toast.error({
      description: errorMsg,
    });
  };

  const initSelectSP = async (): Promise<ErrorResponse | [Sp, null]> => {
    let selectedSP;
    if (sp?.operatorAddress && sp?.endpoint) {
      selectedSP = sp;
    } else {
      const [sps, error] = await getSps(client);
      if (!sps || error) {
        return [null, error];
      }
      const randomSP = sps[Math.floor(Math.random() * sps.length)];
      selectedSP = {
        operatorAddress: randomSP.operatorAddress,
        endpoint: randomSP.endpoint,
      };
    }
    dispatch({
      type: 'SET_SELECTED_SP',
      payload: selectedSP,
    });

    return [selectedSP, null];
  };

  const initOffChain = async (): Promise<ErrorResponse | [string, null]> => {
    if (!chain) return [null, UNKNOWN_ERROR];
    let seed;
    if (seedString) {
      seed = seedString;
    } else {
      const provider = await connector?.getProvider();
      const [offChainData, error] = await onOffChainAuth({
        address: address as string,
        provider,
        client,
        chainId: chain.id,
      });
      if (!offChainData || error) {
        return [null, error];
      }
      seed = offChainData.seedString;
    }
    dispatch({
      type: 'SET_SEED_STRING',
      payload: seed,
    });

    return [seed, null];
  };

  const createBucket = async (
    selectSP?: Sp,
  ): Promise<ErrorResponse | [{ tx: TxResponse | null; bucketName: string }, null]> => {
    if (!address || !selectSP) return [null, UNKNOWN_ERROR];
    let isExisted = false;
    if (bucketName) {
      isExisted = await bucketIsExist({ bucketName, endpoint: selectSP.endpoint }, client);
    }
    const createBucketName = bucketName || getRandomBucketName();
    if (!isExisted) {
      const createBucketPayload: MsgCreateBucket = {
        bucketName: createBucketName,
        creator: address,
        paymentAddress: address,
        visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
        chargedReadQuota: Long.fromNumber(CHARGED_READ_QUOTA),
        primarySpAddress: selectSP.operatorAddress,
      };
      const [createBucketTx, ctError] = await getCreateBucketTx(createBucketPayload, client);
      if (!createBucketTx || ctError) {
        return [null, ctError];
      }
      return [{ tx: createBucketTx, bucketName: createBucketName }, null];
    }
    return [{ tx: null, bucketName: createBucketName }, null];
  };

  const onSubmit = async () => {
    if (!connector || !address || !chain || !visibility) {
      return errorHandler('No connector, please connect wallet first');
    }

    // 1. get sp Address;
    setLoading(true);
    const [selectedSP, error1] = await initSelectSP();
    if (!selectedSP || error1) {
      return errorHandler(error1);
    }

    // 2. get offchainauth
    const [seed, error2] = await initOffChain();
    if (error2) {
      return errorHandler(error2);
    }

    // 3. gen a create bucket tx
    const txs = [];
    const [res3, error3] = await createBucket(selectedSP);
    if (!res3 || error3) {
      return errorHandler(error3);
    }
    const { tx: createBucketTx, bucketName: createBucketName } = res3;
    createBucketTx && txs.push(createBucketTx);

    // 4. create tmp account for batch upload
    let createTempAccountRes;
    if (!delegateUpload) {
      const [ctaRes, ctaError] = await getCreateTmpAccountTx({
        address: address as string,
        bucketName: createBucketName,
        amount: BN(totalFee).times(TEMP_ACCOUNT_SAFE_RATE).toNumber(),
        client,
      });
      if (!ctaRes || ctaError) {
        return errorHandler(ctaError);
      }
      createTempAccountRes = ctaRes;
      txs.push(...ctaRes.txs);
    }

    if (txs.length > 0) {
      const [res, mtError] = await broadcastMulTxs({
        txs: txs,
        address,
        client,
        connector,
      });
      if (res === null || mtError) {
        return errorHandler(mtError);
      }
    }

    setLoading(false);

    if (!delegateUpload) {
      if (!createTempAccountRes) return;
      dispatch({
        type: 'SET_TMP_ACCOUNT',
        payload: createTempAccountRes.tmpAccount,
      });
    }

    dispatch({
      type: 'SET_UPLOAD_QUEUE',
      payload: {
        bucketName: createBucketName,
        spAddress: selectedSP.operatorAddress,
        visibility,
        delegateUpload,
      },
    });
    router.push(routes.UPLOAD);
  };

  return (
    <>
      <Button
        className={cx('uk-upload-button', clsUploadButton, className)}
        onClick={() => onSubmit()}
        disabled={uploadButtonDisabled}
        {...restProps}
      >
        {loading ? (
          <Loading />
        ) : !isGnfd ? (
          'Please switch to BNB Greenfield first.'
        ) : children ? (
          children
        ) : (
          DEFAULT_UPLOAD_BUTTON_TEXT
        )}
      </Button>
    </>
  );
};

UploadButton.displayName = 'UploadButton';
