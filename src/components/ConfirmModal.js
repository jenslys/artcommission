/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Typography } from '@mui/material';

export const ConfirmModal = ({ selectedRequest, setOpenConfirmModal, handleConfirmDenyClick }) => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <Typography variant='h6'>
          Are you sure you want to deny the request from{' '}
          <strong>{`${selectedRequest.firstName} ${selectedRequest.lastName}`}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={() => setOpenConfirmModal(false)} color='secondary'>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => handleConfirmDenyClick(selectedRequest)}
          color='error'
        >
          Deny
        </Button>
      </DialogActions>
    </Dialog>
  );
};
