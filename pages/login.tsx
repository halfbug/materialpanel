/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Card,
  Container,
  Button,
  FormControl,
  OutlinedInput,
  styled,
  TextField,
  Grid,
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

// const OutlinedInputWrapper = styled(OutlinedInput)(
//   ({ theme }) => `
//     background-color: ${theme.colors.alpha.white[100]};
// `,
// );

// const ButtonSearch = styled(Button)(
//   ({ theme }) => `
//     margin-right: -${theme.spacing(1)};
// `,
// );

function Status404() {
  return (
    <>
      <Head>
        <title>Status - 404</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center" />
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <img alt="404" height={80} src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/default-logo.png`} />
                <FormControl variant="outlined" fullWidth>
                  <Grid mt={2}>
                    <Grid item mb={1}>
                      <TextField id="outlined-basic" label="Username" variant="outlined" />
                    </Grid>
                    <Grid item mb={1}>
                      <TextField id="outlined-basic" label="Password" variant="outlined" type="password" />
                    </Grid>
                    <Grid item>
                      <Button href="/dashboards/general" variant="outlined">
                        Login
                      </Button>

                    </Grid>

                  </Grid>
                </FormControl>

              </Card>
            </Container>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default Status404;

Status404.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
