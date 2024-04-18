import { useState } from 'react';
import { UploadKitButton } from '@/components/UploadKitButton';
import { UploadKitProvider } from '@/components/UploadKitProvider';
import { UploadKitOptions } from '@/components/UploadKitProvider/context';

import { WagmiConfig, createConfig } from 'wagmi';
import {
  SwitchNetworkModal,
  WalletKitButton,
  WalletKitOptions,
  WalletKitProvider,
  getDefaultConfig,
} from '@node-real/walletkit';
import { trustWallet, metaMask, walletConnect } from '@node-real/walletkit/wallets';
import { chains } from './chains';
import '@node-real/walletkit/styles.css';
import { client } from './client';
import ProgressBarExample from './components/ProgressExample';
import { Icons } from './components/Icons';
import { Link } from '@/base/components/Link';
import { VisibilityType } from '@bnb-chain/greenfield-js-sdk';

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'WalletKit',

    // WalletConnect 2.0 requires a projectId which you can create quickly
    // and easily for free over at WalletConnect Cloud https://cloud.walletconnect.com/sign-in
    walletConnectProjectId: 'e68a1816d39726c2afabf05661a32767',

    chains,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

const options: WalletKitOptions = {
  initialChainId: 5600,
};

const uploadOptions: UploadKitOptions = {
  client: client,
  bucketName: 'test-upload-kit',
  delegateUpload: true,
  // seedString: '',
  // checksumFn: async (data: Uint8Array) => {
  //   const rs = new ReedSolomon();
  //   return rs.encode(data);
  // },
  sp: {
    operatorAddress: '0x89A1CC91B642DECbC4789474694C606E0E0c420b',
    endpoint: 'https://gnfd-testnet-sp1.bnbchain.org',
  },
  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
  // onError: console.log,
};

export default function App() {
  const [mode, setMode] = useState<any>('light');
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <WagmiConfig config={config}>
      <div>mode: {mode} </div>
      <button onClick={() => setMode(nextMode)}>switch to {nextMode}</button>
      <div style={{ height: 20 }} />
      <WalletKitProvider options={options} mode="light">
        <UploadKitProvider options={uploadOptions} mode={mode}>
          <WalletKitButton />
          <SwitchNetworkModal />
          <div style={{ height: 16 }}></div>
          <UploadKitButton />
          <Example />
        </UploadKitProvider>
      </WalletKitProvider>
      <div style={{ height: 2000 }}></div>
    </WagmiConfig>
  );
}

function Example() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ProgressBarExample />
      <Icons />
      <Link>Link component</Link>
    </div>
  );
}
