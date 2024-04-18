import { WagmiConfig, createConfig } from 'wagmi';
import { chainList } from './chains';
import {
  WalletKitButton,
  WalletKitProvider,
  getDefaultConfig,
  WalletKitOptions,
  SwitchNetworkModal,
} from '@node-real/walletkit';
import { trustWallet, metaMask, walletConnect } from '@node-real/walletkit/wallets';
import {
  UploadKitButton,
  UploadKitOptions,
  UploadKitProvider,
} from '@node-real/greenfield-uploadkit';
import { VisibilityType } from '@bnb-chain/greenfield-js-sdk';
import { client } from './client';
import '@node-real/greenfield-uploadkit/styles.css';
import '@node-real/walletkit/styles.css';

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'WalletKit',

    /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
    walletConnectProjectId: '22d482af814af0b8d5ba3d394a28c5fc',

    chains: chainList,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

const options: WalletKitOptions = {
  initialChainId: 5600,
};

const uploadOptions: UploadKitOptions = {
  client: client,
  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
  delegateUpload: true,
};

export default function App() {
  return (
    <WagmiConfig config={config}>
      <WalletKitProvider options={options} mode="light">
        <UploadKitProvider options={uploadOptions} mode="light">
          <WalletKitButton />
          <div style={{ height: 16 }}></div>
          <UploadKitButton />
          <SwitchNetworkModal />
        </UploadKitProvider>
      </WalletKitProvider>
    </WagmiConfig>
  );
}
