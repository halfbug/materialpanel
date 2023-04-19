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
  signout: () => void;
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
    const data: {user : IUser, token : string} = await res.json();

    if (res.ok) {
      setUser({
        ...data.user,
        name: `${data.user.first_name} ${data.user.last_name}`,
        avatar: '/static/images/avatars/1.jpg',
        jobtitle: data.user.jobtitle,
      });
      setToken(data.token);
    } else {
      setUser(undefined);
      console.log('🚀 ~ file: auth.context.tsx ~ line 53 ~ verify ~ router', router);
      if (!['/', '/login'].includes(router.pathname)) { await router.push('/'); }
    }
  };

  const signout = async () => {
    const rawResponse = await fetch('/api/signout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('logout user'),
    });
    const data = await rawResponse.json();
    setUser(undefined);
    setToken(undefined);
    console.log('🚀 ~ file: auth.context.tsx ~ line 65 ~ signout ~ data', data);
    void router.push('/');
    return data;
  };

  const ctx = useMemo(() => ({
    user, error, token, signout,
  }), [error, token, user]);
  console.log('🚀 ~ file: auth.context.tsx ~ line 48 ~ ctx', ctx);

  return (
    <AuthContext.Provider value={ctx}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </AuthContext.Provider>
  );
};
