import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled,
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import { useContext, useEffect } from 'react';
import Link from 'src/components/Link';
import Head from 'next/head';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import { AuthContext } from '@/contexts/auth.context';
import { useRouter } from 'next/router';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`,
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`,
);

function Overview() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (user?.first_name) {
      console.log(user.first_name);
      void router.push('/merchant');
    } else {
      void router.push('/login');
    }
  }, [router, user]);

  // return (
  //   <OverviewWrapper>
  //     <Head>
  //       <title>GSADMIN</title>
  //     </Head>
  //     <HeaderWrapper>
  //       <Container maxWidth="lg">
  //         <Box display="flex" alignItems="center">
  //           <Logo />
  //           <Box
  //             display="flex"
  //             alignItems="center"
  //             justifyContent="space-between"
  //             flex={1}
  //           >
  //             <Box />
  //             <Box>
  //               <Button
  //                 component={Link}
  //                 href="/login" // "/dashboards/crypto"
  //                 variant="contained"
  //                 sx={{ ml: 2 }}
  //               >
  //                 Login
  //               </Button>
  //             </Box>
  //           </Box>
  //         </Box>
  //       </Container>
  //     </HeaderWrapper>

  //     <Hero />
  //     <Box
  //       display="flex"
  //       alignItems="center"
  //       justifyContent="space-between"
  //       flex={1}
  //     />
  //     <Container maxWidth="lg" sx={{ mt: 8 }}>
  //       <Typography textAlign="center" variant="subtitle1">

  //         <Link
  //           href="https://groupshop.co"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           groupshop.co
  //         </Link>
  //       </Typography>
  //     </Container>
  //   </OverviewWrapper>
  // );
  return (
    <div />
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
