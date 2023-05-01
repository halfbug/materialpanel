import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import {
  Button, IconButton, Card,
} from '@mui/material';
import { CategoryStatus, CollectionType, CollectionTypeKey } from 'configs/constant';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DraggableList from 'react-draggable-list';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { StoreContext } from '@/store/store.context';
import { DROPS_CATEGORY_UPDATE } from '@/graphql/store.graphql';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import AddCollectionIdModal from './AddCollectionIdModal';
import RemoveIdsModal from './RemoveIdsModal';

const Item: any = ({
  item, dragHandleProps,
}: any) => {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  const { dispatch } = useContext(StoreContext);
  return (
    <div
      className="disable-select"
      style={{
        margin: '4px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        background: '#fff',
        userSelect: 'none',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {item.type !== CollectionType.ALLPRODUCT ? (
          <MenuTwoToneIcon
            fontSize="small"
            className="disable-select dragHandle"
            style={{ cursor: 'pointer' }}
            onTouchStart={(e) => {
              e.preventDefault();
              onTouchStart(e);
            }}
            onMouseDown={(e) => {
              onMouseDown(e);
            }}
          />
        ) : <div style={{ width: '20px' }} />}
        <div className="lable" style={{ width: '135px', wordBreak: 'break-all' }}>{item?.name}</div>
        <div style={{ width: '135px', wordBreak: 'break-all' }}>{item?.shopifyId}</div>
      </div>
      <div style={{ width: '135px' }}>
        {item.type ? <div>{Object.entries(CollectionTypeKey).find((ctk) => ctk[0] === Object.entries(CollectionType).find((ele) => ele[1] === item.type)?.[0])?.[1]}</div> : ''}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <IconButton aria-label="delete" color="error" onClick={() => dispatch({ type: 'UPDATE_REMOVEID', payload: item })}><CancelOutlinedIcon /></IconButton>
        <IconButton aria-label="delete" onClick={() => dispatch({ type: 'UPDATE_EDITID', payload: item })}><EditOutlinedIcon /></IconButton>
      </div>
    </div>
  );
};

const CollectionTable = ({ settingData, saveData, findLatestLog }: any) => {
  const contRef = useRef();
  const [collection, setCollection] = useState([]);
  const [addCollectionIdsModal, setAddCollectionIdsModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>('');
  const [editId, setEditId] = useState<any>('');
  const [deleteIdModal, setDeleteIdModal] = useState<boolean>(false);
  const [updateOrder, setUpdateOrder] = useState<boolean>(false);
  const { store, dispatch } = useContext(StoreContext);

  const router = useRouter();
  const { sid } = router.query;

  const [updateDropsCategory, {
    data: updatedDropsCategoryData,
    loading: updatedDropsCategoryLoading,
  }] = useMutation<any>(
    DROPS_CATEGORY_UPDATE,
  );

  useEffect(() => {
    if (settingData?.collections?.length) {
      setCollection(settingData.collections.map((coll: any) => ({ ...coll, shopifyId: coll.shopifyId.split('/')[4] })));
    } else if (!settingData?.collections?.length) {
      setCollection([]);
    }
  }, [settingData]);

  useEffect(() => {
    if (store?.editId?.name) {
      setEditData(store?.editId);
      setEditId(collection.findIndex((x) => x.name === store.editId.name));
      setAddCollectionIdsModal(true);
    } else if (store?.removeId?.name) {
      setDeleteIdModal(true);
    }
  }, [store]);

  const handleAddCollectionModal = (data: any) => {
    if (data) {
      let collectionUpdateMsg = '';
      let FinalCollectionData = [];
      if (editData?.shopifyId) {
        // LOGS WORK
        if (data.shopifyId === editData.shopifyId && data.type === editData.type) {
          collectionUpdateMsg = '';
        } else {
          collectionUpdateMsg = `${sid}\n`;
          if (data.shopifyId !== editData.shopifyId) {
            collectionUpdateMsg = collectionUpdateMsg.concat('', `ID changed: from ${editData.shopifyId} to ${data.shopifyId} \n`);
          }

          if (data.type !== editData.type) {
            collectionUpdateMsg = collectionUpdateMsg.concat('', `Type changed: from ${editData.type} to ${data.type} \n`);
          }

          if (data.name !== editData.name) {
            collectionUpdateMsg = collectionUpdateMsg.concat('', `Name changed: from ${editData.name} to ${data.name}`);
          } else {
            collectionUpdateMsg = collectionUpdateMsg.concat('', `for ${data.name} collection.`);
          }
        }

        let tempColle = [];
        if (data.type === CollectionType.ALLPRODUCT
          && collection.length - 1 !== editId) {
          tempColle = [
            ...collection.filter((_: any, index: number) => index !== editId),
            data,
          ];
          setCollection(tempColle);
        } else {
          tempColle = collection.map((ele: any, index: number) => (index === editId ? data : ele));
          setCollection(tempColle);
        }
        FinalCollectionData = tempColle.map((coll: any) => ({ ...coll, shopifyId: `gid://shopify/Collection/${coll.shopifyId}` }));
      } else {
        collectionUpdateMsg = `${sid}\n${data.name} collection is created`;
        if (
          !collection.filter((x: any) => x.type === CollectionType.ALLPRODUCT).length
        || data.type === CollectionType.ALLPRODUCT) {
          collection.push(data);
        } else {
          collection.splice(collection.length - 1, 0, data);
        }
        FinalCollectionData = collection.map((coll: any) => ({ ...coll, shopifyId: `gid://shopify/Collection/${coll.shopifyId}` }));
      }
      updateDropsCategory({
        variables: {
          CreateDropsCategoryForFront: {
            id: settingData.storeId,
            categoryData: [{
              categoryId: settingData.categoryId,
              collections: FinalCollectionData,
              parentId: settingData.parentId,
              sortOrder: settingData.sortOrder,
              status: CategoryStatus.ACTIVE,
              storeId: settingData.storeId,
              title: settingData.title,
            }],
            collectionUpdateMsg,
          },
        },
      }).then(() => {
        findLatestLog();
      }).catch((err) => {
        console.log(err);
      });
    } else {
      dispatch({ type: 'UPDATE_EDITID', payload: undefined });
      setEditData('');
      setEditId('');
    }
    setAddCollectionIdsModal(false);
  };

  useEffect(() => {
    if (updatedDropsCategoryData?.updateDropsCategory.length > 0) {
      if (editData?.shopifyId) {
        dispatch({ type: 'UPDATE_EDITID', payload: undefined });
        setEditData('');
        setEditId('');
        saveData('edit');
      } else if (deleteIdModal) {
        dispatch({ type: 'UPDATE_REMOVEID', payload: undefined });
        setDeleteIdModal(false);
        saveData('delete');
      } else if (updateOrder) {
        setUpdateOrder(false);
        saveData('updateOrder');
      } else {
        saveData('add');
      }
      setAddCollectionIdsModal(false);
    }
  }, [updatedDropsCategoryData]);

  const remove = (data: any) => {
    if (data === 'delete') {
      const UpdatedData = collection.filter((el: any) => el.name !== store?.removeId?.name);
      setCollection(UpdatedData);
      updateDropsCategory({
        variables: {
          CreateDropsCategoryForFront: {
            id: settingData.storeId,
            categoryData: [{
              categoryId: settingData.categoryId,
              collections: UpdatedData.length ? UpdatedData.map((coll: any) => ({ ...coll, shopifyId: `gid://shopify/Collection/${coll.shopifyId}` })) : [],
              parentId: settingData.parentId,
              sortOrder: settingData.sortOrder,
              status: UpdatedData.length ? CategoryStatus.ACTIVE : CategoryStatus.DRAFT,
              storeId: settingData.storeId,
              title: settingData.title,
            }],
            collectionUpdateMsg: `${sid}\n${store?.removeId?.name} collection is removed`,
          },
        },
      }).then(() => {
        findLatestLog();
      }).catch((err) => {
        console.log(err);
      });
    } else {
      dispatch({ type: 'UPDATE_REMOVEID', payload: undefined });
      setDeleteIdModal(false);
    }
  };

  const hanldeSave = () => {
    setUpdateOrder(true);
    updateDropsCategory({
      variables: {
        CreateDropsCategoryForFront: {
          id: settingData.storeId,
          categoryData: [{
            categoryId: settingData.categoryId,
            collections: collection.map((coll: any) => ({ ...coll, shopifyId: `gid://shopify/Collection/${coll.shopifyId}` })),
            parentId: settingData.parentId,
            sortOrder: settingData.sortOrder,
            status: CategoryStatus.ACTIVE,
            storeId: settingData.storeId,
            title: settingData.title,
          }],
          collectionUpdateMsg: '',
        },
      },
    }).then(() => {}).catch((err) => {
      console.log(err);
    });
  };

  const handleRLDDChange = (newList: any) => {
    const newOrderData = newList.filter(
      (ele: any) => ele.type !== CollectionType.ALLPRODUCT,
    );
    const tempAllProductData = newList.find(
      (data: any) => data.type === CollectionType.ALLPRODUCT,
    );
    if (tempAllProductData) {
      newOrderData.push(tempAllProductData);
    }
    setCollection(newOrderData);
  };

  return (
    <div>
      <h2 style={{ alignItems: 'center' }}>
        Manage Section Content :
        {' '}
        {settingData?.title}
      </h2>
      <Card style={{ padding: '20px' }}>
        <div
          ref={contRef}
          style={{
            touchAction: 'pan-y', display: 'flex', maxHeight: '550px', overflow: 'auto', flexDirection: 'column',
          }}
        >
          <div
            style={{
              margin: '4px',
              padding: '10px',
              display: 'flex',
              background: '#fff',
              userSelect: 'none',
              paddingLeft: '30px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '135px', wordBreak: 'break-all' }}>Name</div>
              <div style={{ width: '135px', wordBreak: 'break-all' }}>Ids</div>
            </div>
            <div style={{ width: '135px' }}>Type</div>
            <div>Action</div>
          </div>
          <DraggableList
            itemKey="name"
            list={collection}
            onMoveEnd={(newList: any) => handleRLDDChange(newList)}
            container={() => contRef.current}
            template={Item}
          />
        </div>
        <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => setAddCollectionIdsModal(true)}>Add Collection</Button>
        {collection.length > 0 ? <Button variant="contained" style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => hanldeSave()}>Update Sorting Order</Button> : ''}
        {addCollectionIdsModal ? (
          <AddCollectionIdModal
            show={addCollectionIdsModal}
            close={(data: any) => handleAddCollectionModal(data)}
            collectionData={collection}
            editData={editData}
            updatedDropsCategoryLoading={updatedDropsCategoryLoading}
          />
        ) : ''}
        {deleteIdModal ? <RemoveIdsModal show={deleteIdModal} close={(data: any) => remove(data)} removedDropsCategoryLoading={updatedDropsCategoryLoading} /> : ''}
      </Card>
    </div>
  );
};

export default CollectionTable;
