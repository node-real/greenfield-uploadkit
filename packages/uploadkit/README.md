# Greenfield UploadKit

Greenfield UploadKit is a React component library for easily uploading objects to BNB Greenfield.

## Features

- 💡 Typescript — Get types straight out of the box.
- 🌱 Ecosystem Standards — Built on top of [@bnb-chain/greenfield-js-sdk](https://github.com/bnb-chain/greenfield-js-sdk/tree/main/packages/js-sdk), [wagmi](https://wagmi.sh/) and [viem](https://viem.sh/).
- 🎨 Customization — Easily customizing themes.

## Documentation

For full documentation, visit [here](https://node-real.github.io/greenfield-toolkit).

## Examples

The following examples are provided in the [examples](../../examples/) folder of this repo.

- [uploadkit-with-nextjs-walletkit](../../examples/uploadkit-with-nextjs-walletkit/)
- [uploadkit-with-nextjs-rainbowkit](../../examples/uploadkit-with-nextjs-rainbowkit/)
- [uploadkit-with-vite-walletkit](../../examples/uploadkit-with-vite-walletkit/)
- [uploadkit-with-remix-rainbowkit](../../examples/uploadkit-with-remix-rainbowkit/)


## Installation

```bash
npm i wagmi@1 viem@1 @node-real/greenfield-uploadkit @bnb-chain/greenfield-js-sdk@2.0.0-alpha.7 @bnb-chain/greenfield-cosmos-types@0.4.0-alpha.32 @bnb-chain/reed-solomon
```
- wagmi >= 1.0.0
- viem >= 1.0.0
- @bnb-chain/greenfield-js-sdk = 2.0.0-alpha.7
- @bnb-chain/greenfield-cosmos-types = 0.4.0-alpha.32
- @bnb-chain/reed-solomon >= 1.1.3

## Usage
Before using Greenfield UploadKit, you need to switch your network to the BNB Greenfield Chain. We recommend using [@node-real/walletkit](https://github.com/node-real/walletkit) to connect your wallet and manage the network. This integration will ensure a seamless experience when working with Greenfield UploadKit.

```tsx
import { WagmiConfig, createConfig } from 'wagmi';
import {
  SwitchNetworkModal,
  WalletKitButton,
  WalletKitOptions,
  WalletKitProvider,
  getDefaultConfig,
} from '@node-real/walletkit';
import { trustWallet, metaMask, walletConnect } from '@node-real/walletkit/wallets';
import { UploadKitButton, UploadKitOptions, UploadKitProvider } from '@node-real/greenfield-uploadkit';
import { chains } from './chains';
import { client } from './client';

import '@node-real/greenfield-uploadkit/styles.css';
import '@node-real/walletkit/styles.css';

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'WalletKit',

    /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
    walletConnectProjectId: '22d482af814af0b8d5ba3d394a28c5fc',

    chains,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

const options: WalletKitOptions = {
  initialChainId: 5600,
};

const uploadKitOptions: UploadKitOptions = {
  client: client,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <WalletKitProvider options={options} mode="light">
        <UploadKitProvider options={uploadKitOptions} mode="light">
          <WalletKitButton />
          <UploadKitButton />
          <Component {...pageProps} />
          <SwitchNetworkModal />
        </UploadKitProvider>
      </WalletKitProvider>
    </WagmiConfig>
  );
}
```

## Contributing

Please follow our [Greenfield UploadKit Contribution Guide](./CONTRIBUTING.md).

## License

See [LICENSE](./LICENSE) for more information.
