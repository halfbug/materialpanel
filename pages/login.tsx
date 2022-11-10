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
  Alert,
} from '@mui/material';
import Head from 'next/head';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';

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

function Login() {
  const router = useRouter();
  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      message: '',
      token: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const body = {
        email: values.email,
        password: values.password,
      };

      try {
        const rawResponse = await fetch('/api/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const { token, message } = await rawResponse.json();
        await formik.setFieldValue('message', message);
        await formik.setFieldValue('token', token);
        if (token) await router.push('/dashboards/general');
      } catch (error) {
        console.error('An unexpected error happened:', error);
      }
      // alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <>
      <Head>
        <title>GSADMIN</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center" />
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <img alt="logo" height={80} src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/default-logo.png`} />
                {formik.values.message && <Alert severity={formik.values.token ? 'success' : 'error'}>{formik.values.message}</Alert>}

                {/* <FormControl variant="outlined" fullWidth>
                  <Grid mt={2}>
                    <Grid item mb={1}>
                      <TextField id="outlined-basic" label="Username" variant="outlined" />
                    </Grid>
                    <Grid item mb={1}>
                      <TextField id="outlined-basic"
                      label="Password" variant="outlined" type="password" />
                    </Grid>
                    <Grid item>
                      <Button href="/dashboards/general" variant="outlined">
                        Login
                      </Button>

                    </Grid>

                  </Grid>
                </FormControl> */}
                <form onSubmit={formik.handleSubmit}>
                  <Grid mt={2}>
                    <Grid item mb={1}>
                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                    <Grid item mb={1}>
                      <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                      />
                    </Grid>
                    <Grid item>
                      <Button color="primary" variant="contained" fullWidth type="submit">
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Container>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default Login;

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
