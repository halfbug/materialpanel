import React, { useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/auth.context';
import useFetch from './useFetch';
// eslint-disable-next-line import/no-extraneous-dependencies

const useDashboardLogin = () => {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const { apiFetch } = useFetch();
  const loginStore = useCallback(async (storeId: string) => {
    if (storeId) {
      const res = await apiFetch(`${process.env.API_URL}/auth/storeLogin`, 'POST', { storeId });
      if (res) {
        console.log('🚀 ~ file: useDashboardLogin.ts ~ line 11 ~ loginStore ~ res', res);
        router.push(res?.redirectUrl);
        console.log('🚀 ~ file: useDashboardLogin.ts ~ line 13 ~ loginStore ~ res.redirectUrl', res.redirectUrl);
      }
    }
  }, [token]);
  return { loginStore };
};
export default useDashboardLogin;
