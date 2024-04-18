import { useFee } from '@/components/FeeProvider/context';
import { useUpload } from '@/components/UploadProvider';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSettlementFee } from './useSettlementFee';
import { BN } from '@/utils/math';
import {
  MsgCreateObjectTypeUrl,
  MsgGrantAllowanceTypeUrl,
  MsgPutPolicyTypeUrl,
} from '@bnb-chain/greenfield-js-sdk';
import { CRYPTOCURRENCY_DISPLAY_PRECISION } from '@/constants';
import BigNumber from 'bignumber.js';
import { WaitObject } from '@/components/UploadProvider/types';
import { getStoreNetflowRate } from '@/utils/fee';
import { useUploadKitContext } from '..';

/**
 * useTotalFee returns the total fee of the upload queue.
 */
export function useTotalFee() {
  const {
    state: { waitQueue },
  } = useUpload();
  const [totalFee, setTotalFee] = useState('0');
  const {
    options: { delegateUpload },
  } = useUploadKitContext();
  const { gasHub, storeParams } = useFee();
  const { gasObjects = {} } = gasHub || {};
  const { address } = useAccount();
  const { settlementFee } = useSettlementFee(address as string);
  const createTmpAccountGasFee = useMemo(() => {
    if (delegateUpload) {
      return '0';
    }
    const grantAllowTxFee = BN(gasObjects[MsgGrantAllowanceTypeUrl]?.gasFee || 0).plus(
      BN(gasObjects[MsgGrantAllowanceTypeUrl]?.perItemFee || 0).times(1),
    );
    const putPolicyTxFee = BN(gasObjects[MsgPutPolicyTypeUrl]?.gasFee);

    return grantAllowTxFee.plus(putPolicyTxFee).dp(CRYPTOCURRENCY_DISPLAY_PRECISION).toString();
  }, [gasObjects]);
  const {
    size,
    num,
    storeFee: rawStoreFee,
  } = useMemo(() => {
    return waitQueue.reduce(
      (acc: { size: number; num: string; storeFee: BigNumber }, cur: WaitObject) => {
        if (cur.status === 'WAIT') {
          acc.size += cur.size;
          acc.num += 1;
          acc.storeFee = acc.storeFee.plus(
            BN(getStoreNetflowRate(cur.size || 0, storeParams)).times(storeParams.reserveTime),
          );
          return acc;
        }
        return acc;
      },
      { size: 0, num: 0, storeFee: BN(0) },
    );
  }, [storeParams, waitQueue]);
  const { gasFee } = gasObjects?.[MsgCreateObjectTypeUrl] || {};

  const storeFee = BN(rawStoreFee)
    .dividedBy(10 ** 18)
    .dp(CRYPTOCURRENCY_DISPLAY_PRECISION)
    .toString();
  const objectsGasFee = delegateUpload
    ? '0'
    : BN(num)
        .times(gasFee || 0)
        .dp(CRYPTOCURRENCY_DISPLAY_PRECISION)
        .toString();

  useEffect(() => {
    const totalFee = BN(objectsGasFee)
      .plus(createTmpAccountGasFee)
      .plus(settlementFee)
      .plus(storeFee)
      .dp(CRYPTOCURRENCY_DISPLAY_PRECISION)
      .toString();
    setTotalFee(totalFee);
  }, [createTmpAccountGasFee, objectsGasFee, settlementFee, storeFee]);

  return {
    objectsCount: num,
    objectsSize: size,
    totalFee,
    settlementFee,
    objectsGasFee,
    createTmpAccountGasFee,
    storeFee,
  };
}
