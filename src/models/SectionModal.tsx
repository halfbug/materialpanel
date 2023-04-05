/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { DROPS_CATEGORY_UPDATE } from '@/graphql/store.graphql';
import { useMutation } from '@apollo/client';
import {
  Box, Button, Modal, TextField, InputLabel,
} from '@mui/material';
import { CategoryStatus } from 'configs/constant';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

const SectionModal = ({
  show, close, sectionData, collectionEditData,
}: any) => {
  const router = useRouter();
  const { sid } = router.query;
  const [sectionName, setSectionName] = useState('');
  const [sectionNameData, setSectionNameData] = useState([]);
  const [validationError, setValidationError] = useState({
    flag: false,
    msg: '',
  });

  const [updateDropsCategory, {
    data: updatedDropsCategoryData,
    loading: updatedDropsCategoryLoading,
  }] = useMutation<any>(
    DROPS_CATEGORY_UPDATE,
  );

  useEffect(() => {
    if (collectionEditData) {
      setSectionName(collectionEditData.title);
    }
  }, [collectionEditData]);

  useEffect(() => {
    if (sectionData.length) {
      const temp = [];
      sectionData.forEach((el: any) => {
        temp.push(el?.title?.toLocaleLowerCase());
        if (el?.children?.length) {
          el.children.forEach((child: any) => {
            temp.push(child.title.toLocaleLowerCase());
          });
        }
      });
      setSectionNameData(temp);
    }
  }, [sectionData]);

  const handleClick = () => {
    if (sectionName && !sectionNameData.includes(sectionName.toLocaleLowerCase())) {
      let updatedCategoryData = [];
      if (collectionEditData) {
        updatedCategoryData = [{
          title: sectionName,
          collections: collectionEditData.collections,
          categoryId: collectionEditData.categoryId,
          storeId: collectionEditData.collections,
          sortOrder: collectionEditData.sortOrder,
          status: collectionEditData.status,
          parentId: collectionEditData.parentId,
        }];
      } else {
        const uniqueId = uuid();
        updatedCategoryData = [{
          title: sectionName,
          collections: [],
          categoryId: uniqueId,
          storeId: sid,
          sortOrder: sectionData.length + 1,
          status: CategoryStatus.DRAFT,
          parentId: null,
        }];
      }
      updateDropsCategory({
        variables: {
          CreateDropsCategoryForFront: {
            id: sid,
            categoryData: updatedCategoryData,
            isCollectionUpdate: false,
          },
        },
      }).then(() => {}).catch((err) => {
        console.log(err);
      });
    } else {
      setValidationError({
        flag: true,
        msg: 'Please enter valid section name',
      });
    }
    return false;
  };

  useEffect(() => {
    if (updatedDropsCategoryData?.updateDropsCategory.length > 0) {
      setSectionName('');
      setValidationError({
        flag: false,
        msg: '',
      });
      if (collectionEditData?.title) {
        close('Edit');
      } else {
        close('Add');
      }
    }
  }, [updatedDropsCategoryData]);

  return (
    <Modal
      open={show}
      onClose={() => { close(''); setValidationError({ flag: false, msg: '' }); setSectionName(''); }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
      >
        <InputLabel htmlFor="component-error" style={{ fontWeight: '600', color: '#000', marginBottom: '10px' }}>Enter name</InputLabel>
        <TextField
          name="addField"
          placeholder="Please enter name"
          value={sectionName}
          autoComplete="off"
          onChange={(e) => (e.target.value.length < 20 ? setSectionName(e.target.value) : '')}
          style={{ width: '100%' }}
          error={validationError.flag}
          helperText={validationError.msg}
        />
        <div style={{ textAlign: 'end' }}>
          <Button variant="contained" disabled={collectionEditData.title === sectionName || updatedDropsCategoryLoading} style={{ marginTop: '10px' }} onClick={() => handleClick()}>{collectionEditData.title ? 'Save' : 'Create'}</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SectionModal;
