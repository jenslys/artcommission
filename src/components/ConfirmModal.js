/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Typography } from '@mui/material';

export const ConfirmModal = ({
  selectedRequest,
  setOpenConfirmModal,
  handleConfirmDenyClick,
  isDeletion,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <Typography variant='h6'>
          Are you sure you want to {isDeletion ? 'delete' : 'deny'} the request from:
        </Typography>
        <Typography variant='h6'>
          {`${selectedRequest.firstName} ${selectedRequest.lastName}`}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={() => setOpenConfirmModal(false)} color='primary'>
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
