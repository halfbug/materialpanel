import type { NextApiRequest, NextApiResponse } from 'next/types';
import cookie from 'cookie';

interface Data {
  message : string,
  token : string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // 1. received data from login form
  const { email, password } = await req.body;
  console.log('🚀 ~ file: login.ts ~ line 12 ~ password', password);
  console.log('🚀 ~ file: login.ts ~ line 12 ~ email', email);

  // 2. send request to backend server
  const body = {
    email,
    password,
  };
  try {
    const rawResponse = await fetch(`${process.env.API_URL}/auth/stafflogin `, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // 3. get data from backend server
    const { token } = await rawResponse.json();
    console.log('🚀 ~ file: login.tsx ~ line 85 ~ onSubmit: ~ content', token);
    // 4. create server side cookie.
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
        path: '/',
      }),
    );
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({ message: 'login successfully', token });
  } catch (error) {
    console.error('An unexpected error happened:', error);
    res.status(403).json({ message: 'An unexpected error happened', token: 'fake-token' }); // token: null });
  }
}
