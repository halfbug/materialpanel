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
        {item.type.toLowerCase() !== CollectionType.ALLPRODUCT.toLowerCase() ? (
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

const CollectionTable = ({ settingData, saveData }: any) => {
  const contRef = useRef();
  const [collection, setCollection] = useState([]);
  const [addCollectionIdsModal, setAddCollectionIdsModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>('');
  const [editId, setEditId] = useState<any>('');
  const [deleteIdModal, setDeleteIdModal] = useState<boolean>(false);
  const { store, dispatch } = useContext(StoreContext);

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
      if (editData?.shopifyId) {
        if (data.type.toLowerCase() === CollectionType.ALLPRODUCT
          && collection.length - 1 !== editId) {
          setCollection([
            ...collection.filter((_: any, index: number) => index !== editId),
            data,
          ]);
        } else {
          setCollection(
            collection.map((ele: any, index: number) => (index === editId ? data : ele)),
          );
        }
      } else if (
        !collection.filter((x: any) => x.type.toLowerCase() === CollectionType.ALLPRODUCT).length
        || data.type.toLowerCase() === CollectionType.ALLPRODUCT) {
        collection.push(data);
      } else {
        collection.splice(collection.length - 1, 0, data);
      }
    }
    dispatch({ type: 'UPDATE_EDITID', payload: undefined });
    setEditData('');
    setEditId('');
    setAddCollectionIdsModal(false);
  };

  const remove = (data: any) => {
    if (data === 'delete') {
      setCollection(collection.filter((el: any) => el.name !== store?.removeId?.name));
    }
    dispatch({ type: 'UPDATE_REMOVEID', payload: undefined });
    setDeleteIdModal(false);
  };

  const hanldeSave = () => {
    saveData({
      ...settingData,
      collections: collection.map((ele) => ({ ...ele, shopifyId: `gid://shopify/Collection/${ele.shopifyId}` })),
      status: CategoryStatus.ACTIVE,
    });
  };

  const handleRLDDChange = (newList: any) => {
    setCollection([
      ...newList.filter(
        (ele: any) => ele.type.toLowerCase() !== CollectionType.ALLPRODUCT.toLowerCase(),
      ),
      newList.find(
        (data: any) => data.type.toLowerCase() === CollectionType.ALLPRODUCT.toLowerCase(),
      )]);
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
        {collection.length > 0 ? <Button variant="contained" style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => hanldeSave()}>Save</Button> : ''}
        {addCollectionIdsModal ? (
          <AddCollectionIdModal
            show={addCollectionIdsModal}
            close={(data: any) => handleAddCollectionModal(data)}
            collectionData={collection}
            editData={editData}
          />
        ) : ''}
        {deleteIdModal ? <RemoveIdsModal show={deleteIdModal} close={(data: any) => remove(data)} /> : ''}
      </Card>
    </div>
  );
};

export default CollectionTable;
