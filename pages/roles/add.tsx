import Head from 'next/head';
import {
  Grid, Container, Card, TextField, Button, Snackbar, Alert,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import { ALL_ADMIN_USERS_ROLES, CREATE_ADMIN_USER_ROLE, FIND_ADMIN_PERMISSION } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Multiselect from 'multiselect-react-dropdown';
import { AdminUserRoles } from '@/types/groupshop';
import { createIdentifier } from 'typescript';

const AddRole = () => {
  const [adminUserList, setAdminUserList] = useState<[]>([]);
  const [permissionList, setPermissionList] = useState([]);
  const [createAdminRole, { data }] = useMutation<AdminUserRoles>(CREATE_ADMIN_USER_ROLE);
  const [selectedValue, setSelectedValue] = useState([]);
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
  });
  const userData = {
    roleName: '',
  };

  const {
    loading, data: usersRoles, refetch,
  } = useQuery(ALL_ADMIN_USERS_ROLES);

  const {
    data: permissions, refetch: permissionRefresh,
  } = useQuery(FIND_ADMIN_PERMISSION);

  useEffect(() => {
    setAdminUserList(usersRoles?.getAdminRoles);
  }, [usersRoles]);

  useEffect(() => {
    const tempPer = [];
    permissions?.getAdminPermissions.forEach((cid: any) => {
      tempPer.push({ name: cid.title, category: cid.category });
    });
    setPermissionList(tempPer);
  }, [permissions]);

  const duplicateRoleCheck = (values: string | undefined) => {
    if (values !== '' && values !== undefined) {
      const user:any = adminUserList.filter((item:any) => item.roleName === values);
      if (user[0]?.id !== '' && user[0]?.id !== undefined) {
        return false;
      }
      return true;
    }
    return true;
  };

  const validationSchema = yup.object({
    roleName: yup
      .string()
      .test('Unique', 'Role Name is already in use.', (values) => duplicateRoleCheck(values))
      .required('Role Name is required'),
  });

  const {
    handleSubmit, values, handleChange, touched, resetForm, errors,
  }: FormikProps<AdminUserRoles> = useFormik<AdminUserRoles>({
    initialValues: userData,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (valz) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        createAdminRole({
          variables: {
            createAdminRoleInput: {
              roleName: valz.roleName,
              permission: selectedValue,
            },
          },
        });
        setSuccessToast({ toastTog: true, toastMessage: 'User Role added successfully!' });
        setSelectedValue([]);
        resetForm();
        // router.push('/roles');
      } catch (error) {
        console.error('An unexpected error happened:', error);
      }
    },
  });

  const MultihandleChange = (e) => {
    setSelectedValue(e);
  };

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
        <title>Add Admin Role</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Add Admin Role" />
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
              <Card style={{ padding: '20px', height: '525px' }}>
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
                  <h4 className="lable" style={{ width: '135px' }}>User Permission</h4>

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

AddRole.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AddRole;
