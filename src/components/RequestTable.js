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
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

const RequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true); // set loading state to true
      const q = query(
        collection(db, 'requests'),
        where('stage', '==', 'requests'),
        where('archived', '==', 'false'),
      );
      const snapshot = await getDocs(q);
      const requestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
      setLoading(false); // set loading state to false
    };

    fetchRequests();
  }, []);

  const update = async () => {
    const q = query(
      collection(db, 'requests'),
      where('stage', '==', 'requests'),
      where('archived', '==', 'false'),
    );
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
      status: 'not started',
      stage: 'orders',
    });
    setOpen(false);
    update();
  };

  const handleContactClick = async () => {
    await updateDoc(doc(db, 'requests', selectedRequest.id), {
      status: 'contacted',
    });
    setOpen(false);
    update();
    window.open(
      'mailto:' + selectedRequest.email + '?subject=Response to art commission - ArtByMuland',
    );
  };

  const handleDenyClick = async () => {
    await updateDoc(doc(db, 'requests', selectedRequest.id), {
      status: 'denied',
      archived: 'true',
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
      <Container>
        <Typography variant='h6' align='center' gutterBottom>
          / Requests
        </Typography>
      </Container>
      <>
        {loading ? (
          <CircularProgress />
        ) : (
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
        )}{' '}
        {selectedRequest && (
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Request Details</DialogTitle>
            <DialogContent>
              <Typography>First Name: {selectedRequest.firstName}</Typography>
              <Typography>Last Name: {selectedRequest.lastName}</Typography>
              <Typography>Email: {selectedRequest.email}</Typography>
              <Typography>Address: {selectedRequest.address}</Typography>
              <Typography>Zip Code: {selectedRequest.zipCode}</Typography>
              <Typography>City: {selectedRequest.city}</Typography>
              <Typography>Size: {selectedRequest.size}</Typography>
              <Typography>Description: {selectedRequest.description}</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant='contained' color='primary' onClick={handleContactClick}>
                Contact
              </Button>
              <Button variant='contained' color='success' onClick={handleAcceptClick}>
                Accept
              </Button>
              <Button variant='contained' color='error' onClick={handleDenyClick}>
                Deny
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
