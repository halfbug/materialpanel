/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import type { ReactElement, ReactNode } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProviderWrapper from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'src/hooks/useApollo';
import { StoreContextProvider } from '@/store/store.context';
import { AuthContextProvider } from '@/contexts/auth.context';
import '@/styles/global.css';
import 'react-sortable-tree/style.css';
import '../styles/app.css';
import { PermissionContextProvider } from '@/contexts/permission.context';

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface TokyoAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
  pageProps: any;
}

function TokyoApp(props: TokyoAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <AuthContextProvider>
      {/* <ApolloProvider client={apolloClient}> */}
      <StoreContextProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>GSADMIN</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
          </Head>
          <PermissionContextProvider>
            <SidebarProvider>
              <ThemeProviderWrapper>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CssBaseline />
                  {getLayout(<Component {...pageProps} />)}
                </LocalizationProvider>
              </ThemeProviderWrapper>
            </SidebarProvider>
          </PermissionContextProvider>
        </CacheProvider>
      </StoreContextProvider>
      {/* </ApolloProvider> */}
    </AuthContextProvider>
  );
}

export default TokyoApp;
