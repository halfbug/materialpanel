/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Modal, TextField, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material';
import { CollectionType, CollectionTypeKey } from 'configs/constant';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import { CollectionIdForm } from '@/types/groupshop';

const AddCollectionIdModal = ({
  show, close, collectionData, editData, updatedDropsCategoryLoading,
}: any) => {
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
    handleSubmit, values, handleChange, touched, errors,
  }: FormikProps<CollectionIdForm> = useFormik<CollectionIdForm>({
    initialValues: collection,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (value) => {
      handleClose(value);
    },
  });

  const handleClose = (data: any) => {
    close(data);
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
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <InputLabel htmlFor="component-error" style={{ fontWeight: '600', color: '#000', marginBottom: '10px' }}>Collection Type</InputLabel>
            <Select
              id="type"
              displayEmpty
              name="type"
              value={values.type}
              onChange={handleChange}
              error={touched.type && Boolean(errors.type)}
              style={{ width: '300px' }}
              placeholder="Please select collection type"
            >
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
              onChange={handleChange}
              error={touched.shopifyId && Boolean(errors.shopifyId)}
              helperText={touched.shopifyId && errors.shopifyId}
              style={{ width: '300px' }}
            />
          </div>
          <div style={{ textAlign: 'end' }}>
            <Button variant="contained" type="submit" disabled={updatedDropsCategoryLoading} style={{ marginTop: '10px' }}>{editData?.shopifyId ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Box>
    </Modal>

  );
};

export default AddCollectionIdModal;
