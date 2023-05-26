import {
  Box, Button, Modal,
} from '@mui/material';
import { useEffect, useState } from 'react';

const LogsDetailModal = ({
  show, close, logMessage, stackMessage,
}: any) => (
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
      width: 600,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
    >
      <div>
        <b>Message :</b>
        {' '}
        {logMessage}
        <br />
        <br />
        <b>Stack Message :</b>
        {' '}
        {stackMessage}
      </div>
    </Box>
  </Modal>
);

export default LogsDetailModal;
