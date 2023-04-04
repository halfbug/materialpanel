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
import { ALL_ADMIN_USERS_ROLES, ALL_USERS, UPDATE_ADMIN_USER } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import { AdminUserUpdate } from '@/types/groupshop';

const UserEdit = () => {
  const [adminUserList, setAdminUserList] = useState<[]>([]);
  const [userStatus, setUserStatus] = useState('Active');
  const [userAdminRole, setUserAdminRole] = useState('');
  const [adminUserRoles, setAdminUserRoles] = useState<[]>([]);
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
  });
  const [adminUserUpdate, { data }] = useMutation<AdminUserUpdate>(UPDATE_ADMIN_USER);

  const { query: { sid } } = useRouter();
  const [userData, setUserData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    status: '',
  });

  const {
    data: usersRoles,
  } = useQuery(ALL_ADMIN_USERS_ROLES);

  useEffect(() => {
    setAdminUserRoles(usersRoles?.getAdminRoles);
  }, [usersRoles]);

  const {
    loading, data: usersData, refetch,
  } = useQuery(ALL_USERS);

  useEffect(() => {
    setAdminUserList(usersData?.getAdminUsers);
    const user:any = usersData?.getAdminUsers.filter((item:any) => item.id === sid);
    setUserStatus(user?.[0]?.status);
    setUserAdminRole(user?.[0]?.roleName);
    setUserData({
      firstName: user?.[0]?.firstName,
      lastName: user?.[0]?.lastName,
      email: user?.[0]?.email,
      status: user?.[0]?.status,
    });
  }, [usersData, sid]);

  const duplicateEmailCheck = (values: string | undefined) => {
    if (values !== '' && values !== undefined) {
      const user:any = adminUserList.filter((item:any) => item.email === values && item.id !== sid);
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
  });

  const {
    handleSubmit, values, handleChange, touched, errors,
  }: FormikProps<AdminUserUpdate> = useFormik<AdminUserUpdate>({
    initialValues: userData,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (valz) => {
      try {
        const {
          email, firstName, lastName, status,
        } = valz;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        adminUserUpdate({
          variables: {
            updateAdminUserInput: {
              id: sid,
              email,
              firstName,
              lastName,
              status,
              userRole: userAdminRole,
            },
          },
        });
        refetch();
        setSuccessToast({ toastTog: true, toastMessage: 'User updated successfully!' });
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
        <title>Edit User</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Edit User" />
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
                  <h4 className="lable" style={{ width: '135px' }}>Status</h4>
                  <Select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    label="status"
                    autoWidth
                  >
                    <MenuItem key="Active" value="Active">Active</MenuItem>
                    <MenuItem key="InActive" value="InActive">InActive</MenuItem>
                  </Select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Role</h4>
                  <Select
                    value={userAdminRole}
                    onChange={(e) => setUserAdminRole(e.target.value)}
                    label="userRole"
                    autoWidth
                  >
                    {adminUserRoles?.map((opt:any, index: number) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <MenuItem key={opt.roleName} value={opt.roleName}>{opt.roleName}</MenuItem>
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

UserEdit.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default UserEdit;
