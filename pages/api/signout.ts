import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'POST') {
    if (!req.headers.cookie) {
      res.status(403).json({ message: 'Not Authorized' });
      return;
    }

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
    res.status(200).json({ message: 'Logout successfully' });
    // res.redirect(user.redirectUrl);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method as string} not allowed` });
  }
};
