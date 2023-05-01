/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Modal, TextField, InputLabel, Select, MenuItem, FormHelperText, CircularProgress,
} from '@mui/material';
import { CollectionType, CollectionTypeKey } from 'configs/constant';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import { CollectionIdForm } from '@/types/groupshop';
import { useQuery } from '@apollo/client';
import { GET_INVENTORY_BY_ID } from '@/graphql/store.graphql';

const AddCollectionIdModal = ({
  show, close, collectionData, editData, updatedDropsCategoryLoading,
}: any) => {
  const [getByIdFlag, setGetByIdFlag] = useState<string>('');
  const {
    data: getByInventoryId, loading: getByInventoryLoading,
  } = useQuery(GET_INVENTORY_BY_ID, {
    skip: !getByIdFlag,
    variables: {
      id: getByIdFlag,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [collection, setCollection] = useState({
    name: '',
    type: '',
    shopifyId: '',
  });
  const [addedCollection, setAddedCollection] = useState({
    name: [],
    type: [],
  });

  useEffect(() => {
    if (collectionData.length) {
      setAddedCollection({
        name: collectionData.map((ele: any) => ele.name.toLocaleLowerCase()),
        type: collectionData.filter((ele: any) => ele.type !== CollectionType.REGULAR).map((el: any) => el.type),
      });
    }
  }, [collectionData]);

  useEffect(() => {
    if (editData?.shopifyId) {
      setCollection({
        name: editData.name,
        type: editData.type,
        shopifyId: editData.shopifyId,
      });
    }
  }, [editData]);

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Collection name is required')
      .test('not-duplicate', 'Value already added', (value) => (editData?.name === value ? true : !addedCollection.name.includes(value?.toLocaleLowerCase()))),
    type: yup
      .string()
      .required('Collection type is required')
      .test('not-duplicate', 'Collection type already added', (value) => (editData?.type === value ? true : !addedCollection.type.includes(value))),
    shopifyId: yup
      .string()
      .required('Collection id is required'),
  });

  const {
    handleSubmit, values, handleChange, touched, errors, setFieldValue, setFieldError,
  }: FormikProps<CollectionIdForm> = useFormik<CollectionIdForm>({
    initialValues: collection,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (value) => {
      handleClose(value);
    },
  });

  const handleClose = async (data: any) => {
    if (data) {
      setGetByIdFlag(`gid://shopify/Collection/${data.shopifyId}`);
    } else {
      close(data);
    }
  };

  useEffect(() => {
    if (getByInventoryId?.findById?.length > 0) {
      close(values);
    } else if (getByInventoryId?.findById?.length < 1) {
      setFieldError('shopifyId', 'Collection ID is either incorrect or not synced.');
    }
  }, [getByInventoryId]);

  const handleChangeId = (e: any) => {
    setFieldError('shopifyId', '');
    const tempVal = e.target.value.trim();
    if (/^[0-9]+$/.test(tempVal) || !tempVal) {
      setFieldValue(e.target.name, tempVal);
    }
  };

  return (
    <Modal
      open={show}
      onClose={() => { handleClose(''); setCollection({ name: '', type: '', shopifyId: '' }); }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
      >
        <form noValidate onSubmit={handleSubmit}>
          <div>
            <InputLabel htmlFor="component-error" style={{ fontWeight: '600', color: '#000', marginBottom: '10px' }}>Collection Name</InputLabel>
            <TextField
              id="name"
              name="name"
              placeholder="Please enter collection name"
              value={values.name}
              onChange={handleChange}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              style={{ width: '300px' }}
              autoComplete="off"
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <InputLabel placeholder="Add collection" htmlFor="component-error" style={{ fontWeight: '600', color: '#000', marginBottom: '10px' }}>Collection Type</InputLabel>

            <Select
              id="type"
              displayEmpty
              name="type"
              value={values.type}
              onChange={handleChange}
              error={touched.type && Boolean(errors.type)}
              style={{ width: '300px' }}
            >
              <MenuItem value="">Please select collection type</MenuItem>
              <MenuItem value={CollectionType.ALLPRODUCT}>{CollectionTypeKey.ALLPRODUCT}</MenuItem>
              <MenuItem value={CollectionType.SPOTLIGHT}>{CollectionTypeKey.SPOTLIGHT}</MenuItem>
              <MenuItem value={CollectionType.VAULT}>{CollectionTypeKey.VAULT}</MenuItem>
              <MenuItem value={CollectionType.REGULAR}>{CollectionTypeKey.REGULAR}</MenuItem>
            </Select>
            {touched?.type && errors?.type && <FormHelperText style={{ color: 'red' }}>{errors.type}</FormHelperText>}
          </div>
          <div style={{ marginTop: '10px' }}>
            <InputLabel htmlFor="component-error" style={{ fontWeight: '600', color: '#000', marginBottom: '10px' }}>Collection ID</InputLabel>
            <TextField
              id="shopifyId"
              name="shopifyId"
              placeholder="Please enter collection ID"
              value={values.shopifyId}
              onChange={(e) => handleChangeId(e)}
              error={touched.shopifyId && Boolean(errors.shopifyId)}
              helperText={touched.shopifyId && errors.shopifyId}
              style={{ width: '300px' }}
              autoComplete="off"
            />
          </div>
          <div style={{ textAlign: 'end' }}>
            <Button variant="contained" type="submit" style={{ marginTop: '10px', height: '40px', width: '75px' }}>
              {
              (updatedDropsCategoryLoading || getByInventoryLoading) ? <CircularProgress style={{ color: '#ffffff' }} size="0.875rem" /> : ((editData?.shopifyId && 'Save') || 'Create')
            }
            </Button>
          </div>
        </form>
      </Box>
    </Modal>

  );
};

export default AddCollectionIdModal;
