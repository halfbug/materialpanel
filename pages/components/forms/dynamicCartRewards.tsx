/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable max-len */
import { DROPS_UPDATE } from '@/graphql/store.graphql';
import AddCartRewards from '@/models/AddCartRewards';
import RemoveIdsModal from '@/models/RemoveIdsModal';
import { useMutation } from '@apollo/client';
import {
  Button,
  Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

const DynamicCartRewards = ({ storeData, getStore, showToast }: any) => {
  const CartRewardAddMessage = 'Cart reward added successfully';
  const CartRewardUpdateMessage = 'Cart reward updated successfully';
  const CartRewardRemoveMessage = 'Cart reward removed successfully';
  const [cartRewards, setCartRewards] = useState<any[]>([]);
  const [cartRewardFlag, setCartRewardFlag] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [editData, setEditData] = useState<any>('');

  const [updateStore, { data: dropsUpdateData, loading: updateLoading }] = useMutation<any>(DROPS_UPDATE, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (dropsUpdateData?.updateStore?.drops) {
      getStore();
      if (deleteId) {
        showToast({
          toastTog: true,
          toastMessage: CartRewardRemoveMessage,
          toastColor: 'success',
        });
        setDeleteId('');
      }
    }
  }, [dropsUpdateData]);

  const handleCartReward = (data: any) => {
    if (data) {
      getStore();
      if (editData) {
        showToast({
          toastTog: true,
          toastMessage: CartRewardUpdateMessage,
          toastColor: 'success',
        });
      } else {
        showToast({
          toastTog: true,
          toastMessage: CartRewardAddMessage,
          toastColor: 'success',
        });
      }
    }
    setEditData('');
    setCartRewardFlag(false);
  };

  useEffect(() => {
    if (storeData?.drops?.cartRewards?.length) {
      setCartRewards(storeData.drops.cartRewards);
    }
  }, [storeData]);

  const hanleRemove = (data: any) => {
    if (data) {
      (async () => {
        await updateStore({
          variables: {
            updateStoreInput: {
              id: storeData.id,
              drops: {
                ...storeData?.drops,
                cartRewards: cartRewards.filter((reward: any) => reward.id !== deleteId),
              },
            },
          },
        });
      })();
    } else {
      setDeleteId('');
    }
  };

  return (
    <div>
      <h2 style={{ alignItems: 'center' }}>
        Cart Rewards Management
      </h2>
      <Card style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" disabled={cartRewards.length > 2} style={{ marginBottom: '10px' }} onClick={() => setCartRewardFlag(true)}>Add Reward</Button>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sr.no</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartRewards.map((row, index) => (
                <TableRow
                  key={row.title}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.rewardTitle}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.rewardValue}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button onClick={() => { setEditData(row); setCartRewardFlag(true); }}>Edit</Button>
                    <Button onClick={() => setDeleteId(row.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {cartRewardFlag ? <AddCartRewards show={cartRewardFlag} hide={(data: any) => handleCartReward(data)} storeData={storeData} editData={editData} /> : ''}
      {deleteId ? <RemoveIdsModal show={deleteId} close={async (data: any) => hanleRemove(data)} removedDropsCategoryLoading={updateLoading} /> : ''}
    </div>
  );
};

export default DynamicCartRewards;
