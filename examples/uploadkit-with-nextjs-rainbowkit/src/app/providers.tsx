'use client';
import { chainList } from './chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { UploadKitOptions, UploadKitProvider } from '@node-real/greenfield-uploadkit';
import { client } from './client';

import '@node-real/greenfield-uploadkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { publicProvider } from 'wagmi/providers/public';
import { VisibilityType } from '@bnb-chain/greenfield-js-sdk';

const { chains, publicClient } = configureChains(chainList, [publicProvider()]);

const { wallets } = getDefaultWallets({
  /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
  projectId: '22d482af814af0b8d5ba3d394a28c5fc',
  appName: 'greenfield js sdk demo',
  chains: chains,
});

const connectors = connectorsForWallets([...wallets]);

const wagmiConfig = createConfig({
  // autoConnect: true,
  connectors,
  publicClient,
});

const uploadOptions: UploadKitOptions = {
  client: client,
  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
  delegateUpload: true,
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} initialChain={5600}>
        <UploadKitProvider options={uploadOptions} mode="light">
          {children}
        </UploadKitProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
