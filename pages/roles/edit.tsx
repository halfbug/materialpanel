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
import { ALL_ADMIN_USERS_ROLES, FIND_ADMIN_PERMISSION, UPDATE_ADMIN_USER_ROLE } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Multiselect from 'multiselect-react-dropdown';
import { AdminUserRolesUpdate } from '@/types/groupshop';

const RoleEdit = () => {
  const [adminUserList, setAdminUserList] = useState<[]>([]);
  const [permissionList, setPermissionList] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [permissiomError, setPermissiomError] = useState('');
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
  });
  const [adminUserRoleUpdate, { data }] = useMutation<AdminUserRolesUpdate>(UPDATE_ADMIN_USER_ROLE);
  const router = useRouter();
  const { query: { sid } } = useRouter();
  const [userData, setUserData] = useState<any>({
    roleName: '',
    permission: {
      name: '',
      category: '',
    },
  });

  const {
    loading, data: usersRoles, refetch,
  } = useQuery(ALL_ADMIN_USERS_ROLES);

  const {
    data: permissions, refetch: permissionRefresh,
  } = useQuery(FIND_ADMIN_PERMISSION);

  useEffect(() => {
    const tempPer = [];
    permissions?.getAdminPermissions.forEach((cid: any) => {
      tempPer.push({ name: cid.title, category: cid.category });
    });
    setPermissionList(tempPer);
  }, [permissions]);

  useEffect(() => {
    setAdminUserList(usersRoles?.getAdminRoles);
    const user:any = usersRoles?.getAdminRoles.filter((item:any) => item.id === sid);
    setUserData({
      roleName: user?.[0].roleName,
      permission: user?.[0].permission,
    });
    setSelectedValue(user?.[0].permission);
  }, [usersRoles, sid]);

  const duplicateRoleCheck = (values: string | undefined) => {
    if (values !== '' && values !== undefined) {
      // eslint-disable-next-line max-len
      const user:any = adminUserList.filter((item:any) => item.roleName === values && item.id !== sid);
      if (user[0]?.id !== '' && user[0]?.id !== undefined) {
        return false;
      }
      return true;
    }
    return true;
  };

  const MultihandleChange = (e) => {
    setSelectedValue(e);
  };

  const validationSchema = yup.object({
    roleName: yup
      .string()
      .test('Unique', 'Role Name is already in use.', (values) => duplicateRoleCheck(values))
      .required('Role Name is required'),
  });

  const {
    handleSubmit, values, handleChange, touched, errors,
  }: FormikProps<AdminUserRolesUpdate> = useFormik<AdminUserRolesUpdate>({
    initialValues: userData,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (valz) => {
      try {
        if (selectedValue.length > 0) {
          setPermissiomError('');
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          adminUserRoleUpdate({
            variables: {
              updateAdminRoleInput: {
                id: sid,
                roleName: valz.roleName,
                permission: selectedValue,
              },
            },
          });
          refetch();
          setSuccessToast({ toastTog: true, toastMessage: 'User updated successfully!' });
          setTimeout(() => {
            router.push('/roles');
          }, 2000);
        } else {
          setPermissiomError('Permission is required');
        }
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
        <title>Edit Role</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Edit Role" />
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
              <Card style={{ padding: '20px 20px 280px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Role Name</h4>
                  <TextField
                    id="roleName"
                    name="roleName"
                    type="text"
                    placeholder="Please enter Role Name"
                    value={values.roleName}
                    onChange={handleChange}
                    error={touched.roleName && Boolean(errors.roleName)}
                    helperText={touched.roleName && errors.roleName}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable text-nowrap" style={{ width: '135px' }}>User Permission</h4>

                  <Multiselect
                    options={permissionList}
                    showCheckbox
                    displayValue="name"
                    selectedValues={selectedValue}
                    onSelect={MultihandleChange}
                    onRemove={MultihandleChange}
                    groupBy="category"
                  />
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '145px',
                }}
                >
                  <p className="permissiom-error">{permissiomError}</p>
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

RoleEdit.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default RoleEdit;
