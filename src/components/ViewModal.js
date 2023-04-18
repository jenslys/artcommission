/* eslint-disable react/prop-types */
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Dialog } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export const ViewModal = ({ selectedRequest, view, setOpenViewModal }) => {
  return (
    <>
      <Dialog open={open} onClose={() => setOpenViewModal(false)}>
        {view === 'personal' && <DialogTitle variant='h4'>Personal information</DialogTitle>}
        {view === 'description' && <DialogTitle variant='h4'>Beskrivelse</DialogTitle>}

        <DialogContent>
          {view === 'personal' && (
            <>
              <Typography variant='h6'>First Name: {selectedRequest.firstName}</Typography>
              <Typography variant='h6'>Last Name: {selectedRequest.lastName}</Typography>
              <Typography variant='h6'>Email: {selectedRequest.email}</Typography>
              <Typography variant='h6'>Address: {selectedRequest.address}</Typography>
              <Typography variant='h6'>Zip Code: {selectedRequest.zipCode}</Typography>
              <Typography variant='h6'>City: {selectedRequest.city}</Typography>
            </>
          )}
          {view === 'description' && (
            <>
              <Typography variant='h6'>{selectedRequest.description}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
