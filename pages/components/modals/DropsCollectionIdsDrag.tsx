/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Box, Button, Modal,
} from '@mui/material';
import DraggableList from 'react-draggable-list';
import { useEffect, useState, useRef } from 'react';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

const Item: any = ({ item, dragHandleProps }: any) => {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  return (
    <div
      className="disable-select"
      style={{
        border: '1px solid black',
        margin: '4px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        background: '#fff',
        userSelect: 'none',
      }}
    >
      {item?.name}
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
    </div>
  );
};

const DropsCollectionIdsDrag = ({ dragFlag, close, dropsIds }: any) => {
  const contRef = useRef();
  const [dragData, setDragData] = useState<any>([]);
  const handleSave = () => {
    if (dropsIds.length) {
      close([...dragData, dropsIds.find((coll: any) => coll.name === 'All Products')]);
    }
  };

  useEffect(() => {
    if (dropsIds.length) {
      setDragData(dropsIds.filter((el: any) => el.name !== 'All Products' && el.shopifyId));
    }
  }, [dropsIds]);

  const handleRLDDChange = (newList) => {
    setDragData(newList);
  };

  return (
    <Modal
      open={dragFlag}
      onClose={() => close('')}
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
      }}
      >
        <div style={{
          height: '500px', border: '2px solid black', padding: '12px', overflow: 'auto',
        }}
        >
          <div
            ref={contRef}
            style={{ touchAction: 'pan-y' }}
          >
            <DraggableList
              itemKey="name"
              list={dragData}
              onMoveEnd={(newList) => handleRLDDChange(newList)}
              container={() => contRef.current}
              template={Item}
            />
          </div>
        </div>
        <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleSave()}>Save</Button>
      </Box>
    </Modal>
  );
};

export default DropsCollectionIdsDrag;
