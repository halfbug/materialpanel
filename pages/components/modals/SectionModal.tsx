import {
  Box, Button, Modal, TextField, InputLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';

const SectionModal = ({
  show, close, sectionData, collectionEditData,
}: any) => {
  const [sectionName, setSectionName] = useState('');
  const [sectionNameData, setSectionNameData] = useState([]);
  const [validationError, setValidationError] = useState({
    flag: false,
    msg: '',
  });

  useEffect(() => {
    if (collectionEditData) {
      setSectionName(collectionEditData);
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
      close(sectionName);
      setSectionName('');
      setValidationError({
        flag: false,
        msg: '',
      });
    } else {
      setValidationError({
        flag: true,
        msg: 'Please enter valid section name',
      });
    }
  };
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
          <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleClick()}>{collectionEditData ? 'Save' : 'Create'}</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SectionModal;
