import {
  Box,
  Typography,
  Container,
  Divider,
  styled,
} from '@mui/material';
import Head from 'next/head';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`,
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`,
);

function AccessDenied() {
  return (
    <>
      <Head>
        <title>Access Denied 403</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography variant="h2" sx={{ my: 2 }}>
                Access Denied
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                You dont have permission to view this page.
              </Typography>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default AccessDenied;

AccessDenied.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
