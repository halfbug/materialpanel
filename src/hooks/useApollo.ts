/* eslint-disable no-underscore-dangle */

import { useMemo, useState } from 'react';
import {
  ApolloClient, HttpLink, InMemoryCache, createHttpLink, ApolloLink,
} from
  '@apollo/client';
import { setContext } from '@apollo/client/link/context';

let apolloClient:any;

// let token : string | undefined;
// // const [token, settoken] = useState<string | undefined>(undefined);
// // const token = getCookie('token');
// console.log('🚀 ~ file: useApollo.ts ~ line 21 ~ authLink ~ token', token);

const httpLink = createHttpLink({
  uri: process.env.BE_URL,
});

const authMiddleware = (authToken:string) => new ApolloLink((operation, forward) => {
  console.log('🚀 ~ file: useApollo.ts ~ line 22 ~ authMiddleware ~ authToken', authToken);
  // add the authorization to the headers
  if (authToken) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return forward(operation);
});

// const authLink = setContext((_, { headers }) => {
//   console.log('🚀 ~ file: useApollo.ts ~ line 17 ~ authLink ~ headers', headers);
//   // get the authentication token from local storage if it exists
//   // const token = getCookie('token');
//   console.log('🚀 ~ file: useApollo.ts ~ line 21 ~ authLink ~ token', token);
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       Authorization: token ? `Bearer ${token}` : '-',
//     },
//   };
// });
function createApolloClient(authToken:string | undefined) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    link: authMiddleware(authToken).concat(httpLink),
    // uri: process.env.BE_URL,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
}

export function initializeApollo(authToken:string | undefined) {
  const _apolloClient = apolloClient ?? createApolloClient(authToken);

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  // if (initialState) {
  //   // Get existing cache, loaded during client side data fetching
  //   const existingCache = _apolloClient.extract();

  //   // Restore the cache using the data passed from
  //   // getStaticProps/getServerSideProps combined with the existing cached data
  //   _apolloClient.cache.restore({ ...existingCache, ...initialState });
  // }

  // // For SSG and SSR always create a new Apollo Client
  // if (typeof window === 'undefined') return _apolloClient;

  // // Create the Apollo Client once in the client
  // if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(authToken:string | undefined) {
  // token = initialState?.token;
  const store = useMemo(() => initializeApollo(authToken), [authToken]);
  return store;
}
