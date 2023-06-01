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
  Typography,
  ButtonProps,
} from '@mui/material';
import Head from 'next/head';
import { ReactElement, useContext, useEffect } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/auth.context';
import * as React from 'react';
import { purple } from '@mui/material/colors';

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
        if (token) await router.push('/merchant');
      } catch (error) {
        console.error('An unexpected error happened:', error);
      }
      // alert(JSON.stringify(values, null, 2));
    },
  });

  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user?.first_name) { console.log(user.first_name); void router.push('/merchant'); }
  }, [router, user]);

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    height: '53.13px',
    backgroundColor: '#5429FF',
    '&:hover': {
      backgroundColor: '#4320CD',
    },
  }));

  return (
    <>
      <Head>
        <title>GSADMIN</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Box textAlign="center" />
            <Container maxWidth="sm">
              <Card sx={{
                textAlign: 'center', mt: 0, px: 5, py: 3, borderRadius: 2,
              }}
              >
                <img alt="logo" height={138} src="./images/logo/logo-shadow.svg" />
                {/* <img alt="logo"
                height={80} src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/default-logo.png`} /> */}
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
                <Typography mt={1} variant="h3" component="h4">
                  Super Administration
                </Typography>
                <Typography mt={1} mb={3} variant="h5" component="h6" color="#667085" fontWeight={500}>
                  Enter your credentials to continue
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                  <Grid mt={2}>
                    <Grid item mb={3}>
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
                    <Grid item mb={3}>
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
                    <Grid item mb={2}>
                      <ColorButton variant="contained" fullWidth type="submit">
                        Sign In
                      </ColorButton>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Container>
            <Typography
              sx={{
                textAlign: 'center', mt: 1, p: 1, borderRadius: 3,
              }}
              py={1}
              variant="h5"
              component="h6"
              color="#5429FF"
            >
              Version 1.0
            </Typography>
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
