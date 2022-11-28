import React, { useCallback, useContext } from 'react';
import { AuthContext } from '@/contexts/auth.context';
// eslint-disable-next-line import/no-extraneous-dependencies

const useFetch = () => {
  const { token } = useContext(AuthContext);
  console.log('🚀 ~ file: useFetch.ts ~ line 7 ~ useFetch ~ token', token);
  const apiFetch = useCallback(async (url:string, method:'POST'|'GET', body: any): Promise<any> => {
    console.log('🚀 ~ file: useFetch.ts ~ line 21 ~ useFetch ~ token', token);
    if (token) {
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      };

      const res = await fetch(url, requestOptions);
      const resJson = await res.json();
      return resJson;
    }
    return false;
  }, [token]);

  return { apiFetch };
};
export default useFetch;
