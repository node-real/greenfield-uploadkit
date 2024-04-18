import { useState } from 'react';
import {
  Meta,
  Links,
  Outlet,
  Scripts,
  LiveReload,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';

import { RainbowKitProvider, ConnectButton, getDefaultWallets } from '@rainbow-me/rainbowkit';
import type { Chain } from 'wagmi';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { arbitrum, base, mainnet, optimism, polygon, sepolia, zora } from 'wagmi/chains';
import {
  UploadKitButton,
  UploadKitOptions,
  UploadKitProvider,
} from '@node-real/greenfield-uploadkit';

import globalStylesUrl from './styles/global.css';
import uploadKitStyleUrl from '@node-real/greenfield-uploadkit/styles.css';
import rainbowStylesUrl from '@rainbow-me/rainbowkit/styles.css';
import { client } from './client';
import { chainList } from './chains';
import { VisibilityType } from '@bnb-chain/greenfield-js-sdk';

type Env = { PUBLIC_ENABLE_TESTNETS?: string };

type LoaderData = { ENV: Env };

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'RainbowKit Remix Example',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStylesUrl },
  { rel: 'stylesheet', href: rainbowStylesUrl },
  { rel: 'stylesheet', href: uploadKitStyleUrl },
];

// Note: These environment variables are hard coded for demonstration purposes.
// See: https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables
export const loader: LoaderFunction = () => {
  const data: LoaderData = {
    ENV: {
      PUBLIC_ENABLE_TESTNETS: process.env.PUBLIC_ENABLE_TESTNETS || 'false',
    },
  };

  return json(data);
};

const uploadOptions: UploadKitOptions = {
  client: client,
  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
  delegateUpload: true,
};
export default function App() {
  const { ENV } = useLoaderData<LoaderData>();

  // Remix modules cannot have side effects so the initialization of `wagmi`
  // client happens during render, but the result is cached via `useState`
  // and a lazy initialization function.
  // See: https://remix.run/docs/en/v1/guides/constraints#no-module-side-effects
  const [{ config, chains }] = useState(() => {
    const { chains, publicClient } = configureChains(chainList, [publicProvider()]);

    const { connectors } = getDefaultWallets({
      appName: 'RainbowKit Remix Example',
      projectId: 'YOUR_PROJECT_ID',
      chains,
    });

    const config = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });

    return {
      config,
      chains,
    };
  });

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {config && chains ? (
          <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains as Chain[]}>
              <UploadKitProvider options={uploadOptions} mode="light">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '12px',
                  }}
                >
                  <ConnectButton />
                  <UploadKitButton />
                </div>
              </UploadKitProvider>
            </RainbowKitProvider>
            <Outlet />
          </WagmiConfig>
        ) : null}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
