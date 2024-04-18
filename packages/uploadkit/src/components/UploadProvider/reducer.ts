import { Reducer, UploadState, TTmpAccount, UploadObject, Sp } from './types';

export const initialState: UploadState = {
  loading: false,
  taskManagement: true,
  seedString: '',
  selectedSp: {} as Sp,
  waitQueue: [],
  uploadQueue: [],
  tmpAccount: {} as TTmpAccount,
};

export const reducer: Reducer = (state, action) => {
  // Ensure the initial state is set if it's not available
  state = state || initialState;

  switch (action.type) {
    // Set loading state
    case 'SET_IS_LOADING': {
      return {
        ...state,
        loading: action.payload,
      };
    }
    // Set task management button display state
    case 'SET_TASK_MANAGEMENT_DISPLAY': {
      return {
        ...state,
        taskManagement: action.payload,
      };
    }
    // Set seedString from offchainAuth
    case 'SET_SEED_STRING': {
      return {
        ...state,
        seedString: action.payload,
      };
    }
    case 'SET_SELECTED_SP': {
      return {
        ...state,
        selectedSp: action.payload,
      };
    }
    case 'SET_TMP_ACCOUNT': {
      return {
        ...state,
        tmpAccount: action.payload,
      };
    }
    // Add items to waitQueue
    case 'SET_WAIT_QUEUE': {
      return {
        ...state,
        waitQueue: [...state.waitQueue, ...action.payload],
      };
    }
    case 'RESET_WAIT_QUEUE': {
      return {
        ...state,
        waitQueue: [],
      };
    }
    // Remove specific item from waitQueue
    case 'REMOVE_WAIT_TASK': {
      return {
        ...state,
        waitQueue: state.waitQueue.filter((item) => item.id !== action.payload.id),
      };
    }
    // Set uploadQueue based on waitQueue items
    case 'SET_UPLOAD_QUEUE': {
      const { bucketName, spAddress, visibility, delegateUpload } = action.payload;
      const waitQueue = state.waitQueue;
      const uploadTasks = waitQueue.map((task) => {
        const uploadTask: UploadObject = {
          bucketName: bucketName,
          prefixFolders: [''],
          spAddress: spAddress,
          id: task.id,
          waitObject: task,
          msg: '',
          status: 'WAIT',
          progress: 0,
          checksum: [],
          visibility: visibility,
          createHash: '',
          delegateUpload,
        };
        return uploadTask;
      });

      return {
        ...state,
        uploadQueue: uploadTasks,
      };
    }
    case 'RESET_UPLOAD_QUEUE': {
      return {
        ...state,
        uploadQueue: [],
      };
    }
    // Update uploadQueue item with checksum
    case 'SET_UPLOAD_TASK_CHECKSUM': {
      const { id, checksum } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state;
      task.status = task.status !== 'CANCEL' ? 'HASHED' : 'CANCEL';
      task.checksum = checksum;
      return {
        ...state,
        uploadQueue: [...queue],
      };
    }
    // Update uploadQueue item with createHash
    case 'SET_UPLOAD_TASK_CREATE_HASH': {
      const { id, createHash } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state;
      task.createHash = createHash;
      task.status = task.status !== 'CANCEL' ? 'SIGNED' : 'CANCEL';
      return {
        ...state,
        uploadQueue: [...queue],
      };
    }
    // Update uploadQueue item with progress
    case 'SET_UPLOAD_TASK_PROGRESS': {
      const { id, progress } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state; // Return state instead of undefined
      task.progress = progress;

      return {
        ...state,
        uploadQueue: [...queue],
      };
    }
    // Update uploadQueue item with error message
    case 'SET_UPLOAD_TASK_ERROR_MSG': {
      const { id, msg } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state; // Return state instead of undefined
      task.status = 'ERROR';
      task.msg = msg;
      return {
        ...state,
        uploadQueue: [...queue],
      };
    }
    // Update uploadQueue item with status
    case 'SET_UPLOAD_TASK_STATUS': {
      const { id, status } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state;
      task.status = status;
      return {
        ...state,
        uploadQueue: [...queue],
      };
    }

    // Default case: return the unchanged state
    default: {
      return state;
    }
  }
};
