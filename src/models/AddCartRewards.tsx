import { CartRewards } from '@/types/groupshop';
import {
  Box, Button, InputLabel, Modal, TextField,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { DROPS_UPDATE } from '@/graphql/store.graphql';
import { v4 as uuid } from 'uuid';

const AddCartRewards = ({
  show, hide, storeData, editData,
}: any) => {
  const router = useRouter();
  const { sid } = router.query;
  const uniqueId = uuid();
  const [cartRewards, setCartRewards] = useState({
    id: '',
    rewardTitle: '',
    rewardValue: '',
  });

  useEffect(() => {
    if (editData?.id) {
      setCartRewards({
        id: editData.id,
        rewardTitle: editData.rewardTitle,
        rewardValue: editData.rewardValue,
      });
    }
  }, [editData]);

  const [updateStore, {
    data: dropsUpdateData,
    loading: updateLoading,
  }] = useMutation<any>(DROPS_UPDATE, {
    fetchPolicy: 'network-only',
  });

  const validationSchema = yup.object({
    rewardTitle: yup
      .string()
      .required('Reward title is required'),
    rewardValue: yup
      .string()
      .required('Reward value is required')
      .matches(/^[0-9]+$/, 'Please enter only number'),
  });

  useEffect(() => {
    if (dropsUpdateData?.updateStore?.drops) {
      hide('update');
    }
  }, [dropsUpdateData]);

  const {
    handleSubmit, values, handleChange, touched, errors, setFieldValue,
  }: FormikProps<CartRewards> = useFormik<CartRewards>({
    initialValues: cartRewards,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (value) => {
      if (editData?.id) {
        const updateData = storeData?.drops?.cartRewards.map((ele: any) => {
          if (ele.id === editData?.id) {
            return {
              ...ele,
              rewardTitle: value.rewardTitle,
              rewardValue: `${value.rewardValue}`,
            };
          } return ele;
        });
        updateApi(updateData);
      } else {
        const rewardsValue = {
          id: uniqueId,
          rewardTitle: value.rewardTitle,
          rewardValue: `${value.rewardValue}`,
        };
        const temoStoreData = storeData?.drops?.cartRewards?.length
          ? [...storeData.drops.cartRewards, rewardsValue]
          : [rewardsValue];
        updateApi(temoStoreData);
      }
    },
  });

  const updateApi = async (updatingData: any) => {
    try {
      await updateStore({
        variables: {
          updateStoreInput: {
            id: sid,
            drops: {
              ...storeData?.drops,
              cartRewards: updatingData,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeId = (e: any) => {
    const tempVal = e.target.value.trim();
    if (/^(1000|[1-9]?[0-9]?[0-9])$/gm.test(tempVal) || !tempVal) {
      setFieldValue(e.target.name, tempVal);
    }
  };

  return (
    <Modal
      open={show}
      onClose={() => hide()}
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
            <InputLabel htmlFor="component-error" style={{ fontWeight: '600', color: '#000', marginBottom: '10px' }}>Reward Title</InputLabel>
            <TextField
              id="rewardTitle"
              name="rewardTitle"
              placeholder="Please enter reward title"
              value={values.rewardTitle}
              onChange={(e) => e.target.value.length < 16 && handleChange(e)}
              error={touched.rewardTitle && Boolean(errors.rewardTitle)}
              helperText={touched.rewardTitle && errors.rewardTitle}
              style={{ width: '300px' }}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <InputLabel htmlFor="component-error" style={{ fontWeight: '600', color: '#000', marginBottom: '10px' }}>Reward Min Order Value</InputLabel>
            <TextField
              id="rewardValue"
              name="rewardValue"
              placeholder="Please enter reward min order value"
              value={values.rewardValue}
              onChange={(e) => handleChangeId(e)}
              error={touched.rewardValue && Boolean(errors.rewardValue)}
              helperText={touched.rewardValue && errors.rewardValue}
              style={{ width: '300px' }}
            />
          </div>
          <div style={{ textAlign: 'end' }}>
            <Button variant="contained" disabled={updateLoading} type="submit" style={{ marginTop: '10px' }}>{editData?.id ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCartRewards;
