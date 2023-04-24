/* eslint-disable react/prop-types */
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Dialog } from '@mui/material';
import Button from '@mui/material/Button';
import { DialogContentText } from '@mui/material';

export const ViewModal = ({ selectedRequest, view, setOpenViewModal }) => {
  return (
    <>
      <Dialog open={open} onClose={() => setOpenViewModal(false)}>
        {view === 'personal' && <DialogTitle variant='h5'>Personal information</DialogTitle>}
        {view === 'description' && <DialogTitle variant='h5'>Description</DialogTitle>}

        <DialogContent>
          {view === 'personal' && (
            <>
              <DialogContentText>First Name: {selectedRequest.firstName}</DialogContentText>
              <DialogContentText>Last Name: {selectedRequest.lastName}</DialogContentText>
              <DialogContentText>Email: {selectedRequest.email}</DialogContentText>
              <DialogContentText>Address: {selectedRequest.address}</DialogContentText>
              <DialogContentText>Zip Code: {selectedRequest.zipCode}</DialogContentText>
              <DialogContentText>City: {selectedRequest.city}</DialogContentText>
            </>
          )}
          {view === 'description' && (
            <>
              <DialogContentText>{selectedRequest.description}</DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setOpenViewModal(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
