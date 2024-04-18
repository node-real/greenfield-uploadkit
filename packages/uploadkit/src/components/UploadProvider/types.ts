import { VisibilityType } from '@bnb-chain/greenfield-js-sdk';

export type WaitStatus = 'CHECK' | 'WAIT' | 'ERROR';

export type UploadStatus =
  | 'WAIT'
  | 'HASH'
  | 'HASHED'
  | 'SIGN'
  | 'SIGNED'
  | 'UPLOAD'
  | 'FINISH'
  | 'ERROR'
  | 'CANCEL';

export type TTmpAccount = {
  address: string;
  privateKey: string;
};

export type WaitObject = {
  file: File;
  status: WaitStatus;
  id: number;
  time: number;
  msg: string;
  type: string;
  size: number;
  name: string;
  lockFee?: string;
  relativePath: string;
};

export type UploadObject = {
  bucketName: string;
  prefixFolders: string[];
  id: number;
  spAddress: string;
  waitObject: WaitObject;
  checksum: string[];
  status: UploadStatus;
  visibility: VisibilityType;
  createHash: string;
  msg: string;
  progress: number;
  delegateUpload?: boolean;
};

export interface Sp {
  operatorAddress: string;
  endpoint: string;
}

export interface UploadState {
  loading: boolean;
  taskManagement: boolean;
  seedString: string;
  selectedSp: Sp;
  waitQueue: WaitObject[];
  uploadQueue: UploadObject[];
  tmpAccount: TTmpAccount;
}

export type Action =
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_TASK_MANAGEMENT_DISPLAY'; payload: boolean }
  | { type: 'SET_SEED_STRING'; payload: string }
  | { type: 'SET_SELECTED_SP'; payload: Sp }
  | { type: 'SET_TMP_ACCOUNT'; payload: TTmpAccount }
  | { type: 'SET_WAIT_QUEUE'; payload: WaitObject[] }
  | { type: 'RESET_WAIT_QUEUE' }
  | { type: 'REMOVE_WAIT_TASK'; payload: { id: number } }
  | {
      type: 'SET_UPLOAD_QUEUE';
      payload: {
        bucketName: string;
        spAddress: string;
        visibility: VisibilityType;
        delegateUpload?: boolean;
      };
    }
  | { type: 'RESET_UPLOAD_QUEUE' }
  | { type: 'SET_UPLOAD_TASK_PROGRESS'; payload: { id: number; progress: number } }
  | { type: 'SET_UPLOAD_TASK_STATUS'; payload: { id: number; status: UploadStatus } }
  | { type: 'SET_UPLOAD_TASK_CHECKSUM'; payload: { id: number; checksum: string[] } }
  | { type: 'SET_UPLOAD_TASK_CREATE_HASH'; payload: { id: number; createHash: string } }
  | { type: 'SET_UPLOAD_TASK_ERROR_MSG'; payload: { id: number; msg: string } };

export type Reducer = (state: UploadState, action: Action) => UploadState;
