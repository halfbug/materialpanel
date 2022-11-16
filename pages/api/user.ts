import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'GET') {
    if (!req.headers.cookie) {
      res.status(403).json({ message: 'Not Authorized' });
      return;
    }

    const { token } = cookie.parse(req.headers.cookie);

    const gsApiRes = await fetch(`${process.env.API_URL}/auth/user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await gsApiRes.json();
    console.log('🚀 ~ file: user.ts ~ line 20 ~ user', user);
    console.log(`${process.env.API_URL}`);

    if (gsApiRes.ok) {
      res.status(200).json({ user, token });
    } else {
      // delete cookie;
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          expires: new Date(0),
          sameSite: 'strict',
          path: '/',
        }),
      );
      // console.log(user.redirectUrl);
      res.status(401).json({ message: user.response.error, redirectUrl: user.redirectUrl });
      // res.redirect(user.redirectUrl);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method as string} not allowed` });
  }
};
