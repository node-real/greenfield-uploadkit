import { Long } from '@bnb-chain/greenfield-js-sdk';

export type DragItemProps = {
  items: DataTransferItemList;
};

export type DragMonitorProps = {
  isOver: boolean;
};

export type TransferItemTree = {
  [key: string]: File;
};

export type TransferItemFlat = {
  [key: string]: File;
};

export const isUTF8 = (str: string): boolean => {
  try {
    new TextDecoder('utf-8').decode(new TextEncoder().encode(str));
    return true;
  } catch {
    return false;
  }
};

interface Timestamp {
  seconds: Long;
  nanos: number;
}

export function toTimestamp(date: Date): Timestamp {
  const milliseconds = date.getTime();
  const seconds = new Long(Math.floor(milliseconds / 1000));
  const nanos = date.getMilliseconds() * 1000000;

  return { seconds, nanos };
}

export const validateFile = (file: File, maxSize: number) => {
  if (!file || file.size <= 0) {
    return 'Object is empty';
  }
  if (file.size > maxSize) {
    return 'Object is too large';
  }
  if (file.name.length > 256) {
    return 'The object name must be between 1 and 256 characters long.';
  }
  if (file.name.includes('//')) {
    return 'The object name contains a slash (/).';
  }

  return '';
};

function trimStart(str: string, chars: string) {
  const pattern = new RegExp(`^[${chars}]+`);
  return str.replace(pattern, '');
}

export const isFileEntry = (entry: FileSystemEntry): entry is FileSystemFileEntry => {
  return entry.isFile;
};

export const isDirectoryEntry = (entry: FileSystemEntry): entry is FileSystemDirectoryEntry => {
  return entry.isDirectory;
};

export const traverseEntry = async (
  entry: FileSystemEntry | null,
  tree: TransferItemTree = {},
): Promise<TransferItemTree> => {
  if (!entry) return tree;

  const path = trimStart(entry.fullPath, '/');

  if (isFileEntry(entry)) {
    return new Promise((resolve) => {
      entry.file((file) => {
        tree[path] = file;
        resolve(tree);
      });
    });
  }

  if (isDirectoryEntry(entry)) {
    const newPath = path + '/';
    tree[newPath] = new File([], newPath, { type: 'text/plain' });
    const reader = entry.createReader();
    return new Promise((resolve) => {
      reader.readEntries(async (entries) => {
        const entryTree = await Promise.all(entries.map((entry) => traverseEntry(entry, tree)));
        resolve(entryTree.reduce((r, c) => ({ ...r, ...c }), {}));
      });
    });
  }
  return tree;
};

export const traverseTransferItems = async (items: DataTransferItemList) => {
  const trees = await Promise.all(
    Array.from(items, (item) => traverseEntry(item.webkitGetAsEntry())),
  );
  return trees.reduce((r, c) => ({ ...r, ...c }), {});
};

export const flatEntry = async (
  entry: FileSystemEntry | null,
  flat: TransferItemFlat = {},
): Promise<TransferItemFlat> => {
  if (!entry) return flat;

  if (isFileEntry(entry)) {
    return new Promise((resolve) => {
      entry.file((file) => {
        flat[file.name] = file;
        resolve(flat);
      });
    });
  }

  if (isDirectoryEntry(entry)) {
    const reader = entry.createReader();
    return new Promise((resolve) => {
      reader.readEntries(async (entries) => {
        const entryFlat = await Promise.all(entries.map((entry) => flatEntry(entry, flat)));
        resolve(entryFlat.reduce((r, c) => ({ ...r, ...c }), {}));
      });
    });
  }
  return flat;
};

export const flattenTransferItems = async (items: DataTransferItemList) => {
  const flats = await Promise.all(Array.from(items, (item) => flatEntry(item.webkitGetAsEntry())));
  return flats.reduce((r, c) => ({ ...r, ...c }), {});
};
