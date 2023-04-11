import Head from 'next/head';
import {
  Grid, Container, Card, IconButton, TextField, Button, MenuItem, Select, Snackbar, Alert,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import { ALL_ADMIN_USERS_ROLES, ALL_USERS, CREATE_ADMIN_USER } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminUser } from '@/types/groupshop';

const AddUser = () => {
  const [adminUserList, setAdminUserList] = useState<[]>([]);
  const [adminUserRoles, setAdminUserRoles] = useState<[]>([]);
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
  });
  const [userData, setUserData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    status: 'Active',
    password: '',
    cpassword: '',
    userRole: '',
  });
  const [adminUserCreate, { data }] = useMutation<AdminUser>(CREATE_ADMIN_USER);
  const [userStatus, setUserStatus] = useState('Active');
  const [userAdminRole, setUserAdminRole] = useState('');
  const router = useRouter();
  const {
    loading, data: usersData,
  } = useQuery(ALL_USERS);

  useEffect(() => {
    setAdminUserList(usersData?.getAdminUsers);
  }, [usersData]);

  const {
    data: usersRoles, refetch,
  } = useQuery(ALL_ADMIN_USERS_ROLES);

  useEffect(() => {
    setUserAdminRole(usersRoles?.getAdminRoles[0]?.id);
    setAdminUserRoles(usersRoles?.getAdminRoles);
  }, [usersRoles]);

  const duplicateEmailCheck = (values: string | undefined) => {
    if (values !== '' && values !== undefined) {
      const user:any = adminUserList.filter((item:any) => item.email === values);
      if (user[0]?.id !== '' && user[0]?.id !== undefined) {
        return false;
      }
      return true;
    }
    return true;
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .test('Unique', 'This email is already in use.', (values) => duplicateEmailCheck(values))
      .email('Enter a valid email')
      .required('Email is required'),
    firstName: yup
      .string()
      .required('First Name is required'),
    password: yup
      .string()
      .min(8, 'Password must be 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol')
      .required('Password is required'),
    cpassword: yup.string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Must match "Password" field value'),
  });

  const {
    handleSubmit, values, handleChange, touched, resetForm, errors,
  }: FormikProps<AdminUser> = useFormik<AdminUser>({
    initialValues: userData,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (valz) => {
      try {
        const {
          email, firstName, lastName, status, password,
        } = valz;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        adminUserCreate({
          variables: {
            createAdminUserInput: {
              firstName,
              lastName,
              email,
              password,
              status,
              userRole: userAdminRole,
            },
          },
        });
        setSuccessToast({ toastTog: true, toastMessage: 'User Role added successfully!' });
        resetForm();
        setTimeout(() => {
          router.push('/users');
        }, 2000);
      } catch (error) {
        console.error('An unexpected error happened:', error);
      }
    },
  });

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={successToast.toastTog}
        onClose={() => setSuccessToast({ ...successToast, toastTog: false })}
        autoHideDuration={3000}
        style={{ marginTop: '65px' }}
      >
        <Alert
          onClose={() => setSuccessToast({ ...successToast, toastTog: false })}
          sx={{
            width: '100%',
            background: '#287431',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              display: 'none',
            },
            '& .MuiAlert-action': {
              color: '#FFFFFF',
            },
          }}
        >
          {successToast.toastMessage}
        </Alert>
      </Snackbar>
      <Head>
        <title>Add User</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Add User" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>

            <form noValidate onSubmit={handleSubmit}>
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>First Name</h4>
                  <TextField
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Please enter First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Last Name</h4>
                  <TextField
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Please enter Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Email</h4>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Please enter Email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Password</h4>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Please enter password"
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Confirm Password</h4>
                  <TextField
                    id="cpassword"
                    name="cpassword"
                    type="password"
                    placeholder="Please enter confirm password"
                    value={values.cpassword}
                    onChange={handleChange}
                    error={touched.cpassword && Boolean(errors.cpassword)}
                    helperText={touched.cpassword && errors.cpassword}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Status</h4>
                  <Select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    label="status"
                    id="status"
                    name="status"
                    autoWidth
                  >
                    <MenuItem key="Active" value="Active">Active</MenuItem>
                    <MenuItem key="InActive" value="InActive">InActive</MenuItem>
                  </Select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Role</h4>
                  <Select
                    displayEmpty
                    value={userAdminRole}
                    onChange={(e) => setUserAdminRole(e.target.value)}
                    label="userRole"
                    autoWidth
                  >
                    {adminUserRoles?.map((opt:any, index: number) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <MenuItem key={opt.id} value={opt.id}>{opt.roleName}</MenuItem>
                    ))}

                  </Select>
                </div>
                <Button variant="contained" type="submit" style={{ marginTop: '10px' }}>Save</Button>

              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

AddUser.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AddUser;
