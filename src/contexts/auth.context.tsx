import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { IUser } from '@/types/groupshop';
import { useApollo } from '@/hooks/useApollo';
import { ApolloProvider } from '@apollo/client';

interface AuthContextType {
  user: IUser | undefined;
  error?: string;
  token: string | undefined;
//   verify()?: any;
}

const initialState: {user: IUser | undefined} = {
  user: undefined,

};

export const AuthContext = React.createContext<AuthContextType>(
  initialState as AuthContextType,
);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<IUser| undefined>(undefined);
  const [token, setToken] = useState<string| undefined>(undefined);
  const [error, setError] = useState<string| undefined>(undefined);
  const router = useRouter();
  //   console.log('🚀 ~ file: auth.context.tsx ~ line 30 ~ router', router);
  const apolloClient = useApollo(token);
  useEffect(() => { verify(); }, [router.asPath]);
  useEffect(() => { verify(); }, []);
  const verify = async () => {
    const res = await fetch('/api/user');
    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      setToken(data.token);
    } else {
      setUser(undefined);
    //   await router.push(data.redirectUrl);
    }
  };
  const ctx = useMemo(() => ({ user, error, token }), [error, token, user]);
  console.log('🚀 ~ file: auth.context.tsx ~ line 48 ~ ctx', ctx);

  return (
    <AuthContext.Provider value={ctx}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </AuthContext.Provider>
  );
};
