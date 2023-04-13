import {
  Box, Button, Modal,
} from '@mui/material';
import { useEffect, useState } from 'react';

const RemoveIdsModal = ({
  show, close, childData = [], removedDropsCategoryLoading = false,
}: any) => {
  const [child, setChild] = useState<any[]>([]);

  useEffect(() => {
    if (childData?.length) {
      setChild(childData);
    }
  }, [childData]);

  return (
    <Modal
      open={show}
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
        borderRadius: 2,
      }}
      >
        <div style={{ fontWeight: '700' }}>{`Are you sure you want to delete it? ${child.length ? 'it will also delete its child' : ''}`}</div>
        {child.length ? (
          <div>
            {child.map((ele: any) => (
              <>
                {ele.title}
                <br />
              </>
            ))}
          </div>
        ) : ''}
        <div style={{ textAlign: 'end' }}>
          <Button variant="contained" style={{ height: '30px', marginTop: '20px' }} onClick={() => close('')}>Cancel</Button>
          <Button variant="contained" disabled={removedDropsCategoryLoading} style={{ height: '30px', marginTop: '20px', marginLeft: '10px' }} onClick={() => close('delete')}>Delete</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RemoveIdsModal;
