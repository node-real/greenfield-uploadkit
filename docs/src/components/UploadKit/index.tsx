import { WagmiConfig, createConfig } from 'wagmi';

import {
  WalletKitButton,
  WalletKitProvider,
  getDefaultConfig,
  WalletKitOptions,
  SwitchNetworkModal,
} from '@node-real/walletkit';
import { metaMask, trustWallet, walletConnect } from '@node-real/walletkit/wallets';
import {
  UploadKitProvider,
  UploadKitOptions,
  UploadKitButton,
} from '@node-real/greenfield-uploadkit';

import { chains } from './chains';
import { Box, useColorMode } from '@node-real/uikit';
import { client } from './client';
import { VisibilityType } from '@bnb-chain/greenfield-js-sdk';

const config = createConfig(
  getDefaultConfig({
    appName: 'WalletKit',
    chains,
    walletConnectProjectId: 'e68a1816d39726c2afabf05661a32767', //
    autoConnect: false,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

const options: WalletKitOptions = {
  initialChainId: 5600, // Once connected to the wallet, which chain you want to use
};

const uploadOptions: UploadKitOptions = {
  client: client,
  delegateUpload: true,
  sp: {
    operatorAddress: '0x89A1CC91B642DECbC4789474694C606E0E0c420b',
    endpoint: 'https://gnfd-testnet-sp1.bnbchain.org',
  },
  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
};

export default function App() {
  const { colorMode } = useColorMode();

  return (
    <Box borderRadius={8} border="1px solid readable.border" p={16}>
      <WagmiConfig config={config}>
        <WalletKitProvider options={options} mode={colorMode}>
          <UploadKitProvider options={uploadOptions} mode={colorMode}>
            <WalletKitButton />
            <div style={{ height: 16 }}></div>
            <UploadKitButton />
            <SwitchNetworkModal />
          </UploadKitProvider>
        </WalletKitProvider>
      </WagmiConfig>
    </Box>
  );
}
