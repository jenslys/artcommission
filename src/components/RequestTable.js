import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { Grid } from '@mui/material';

const RequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(collection(db, 'requests'), where('status', '==', 'new'));
      const snapshot = await getDocs(q);
      const requestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    };

    fetchRequests();
  }, []);

  const update = async () => {
    const q = query(collection(db, 'requests'), where('status', '==', 'new'));
    const snapshot = await getDocs(q);
    const requestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(requestsData);
  };

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleAcceptClick = async () => {
    await updateDoc(doc(db, 'requests', selectedRequest.id), {
      status: 'accepted',
      stage: 'orders',
    });
    setOpen(false);
    update();
  };

  const handleDenyClick = async () => {
    await updateDoc(doc(db, 'requests', selectedRequest.id), {
      status: 'denied',
      stage: 'archived',
    });
    setOpen(false);
    update();
  };

  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      padding={4}
    >
      <>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{`${request.firstName} ${request.lastName}`}</TableCell>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewClick(request)}>View</Button>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color='primary'
                      style={{ textTransform: 'capitalize' }}
                      label={request.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedRequest && (
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Request Details</DialogTitle>
            <DialogContent>
              <p>First Name: {selectedRequest.firstName}</p>
              <p>Last Name: {selectedRequest.lastName}</p>
              <p>Email: {selectedRequest.email}</p>
              <p>Address: {selectedRequest.address}</p>
              <p>Zip Code: {selectedRequest.zipCode}</p>
              <p>City: {selectedRequest.city}</p>
              <p>Size: {selectedRequest.size}</p>
              <p>Description: {selectedRequest.description}</p>
            </DialogContent>
            <DialogActions>
              <Button variant='contained' color='error' onClick={handleDenyClick}>
                Deny
              </Button>
              <Button variant='contained' color='success' onClick={handleAcceptClick}>
                Accept
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    </Grid>
  );
};

export default RequestTable;
