import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
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
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

import sendEmail from '../utils/sendEmail';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('personal');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // set loading state to true
      const q = query(
        collection(db, 'requests'),
        where('stage', '==', 'orders'),
        where('archived', '==', 'false'),
      );
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setLoading(false); // set loading state to false
    };

    fetchOrders();
  }, []);

  const update = async () => {
    const q = query(
      collection(db, 'requests'),
      where('stage', '==', 'orders'),
      where('archived', '==', 'false'),
    );
    const snapshot = await getDocs(q);
    const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);
  };

  const handleViewClick = (request, view) => {
    setSelectedRequest(request);
    setOpen(true);
    setView(view);
  };

  const handleCClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      archived: 'true',
      status: 'completed',
    });
    update();
    sendEmail(
      request.firstName,
      request.email,
      'Your order has been marked as completed!',
      process.env.REACT_APP_ADMIN_NAME,
    );
  };

  const handleIPClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'in progress',
    });
    update();
    sendEmail(
      request.firstName,
      request.email,
      'Your order has been marked as in progress!',
      process.env.REACT_APP_ADMIN_NAME,
    );
  };

  const handleNSClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'not started',
    });
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
          Orders
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
                  <TableCell>Personal info</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{`${request.firstName} ${request.lastName}`}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => handleViewClick(request, 'personal')}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.size}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => handleViewClick(request, 'description')}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color='success'
                        style={{ textTransform: 'capitalize' }}
                        label={request.status}
                      />
                    </TableCell>
                    <TableCell>
                      <ButtonGroup
                        variant='contained'
                        disableElevation
                        aria-label='outlined primary button group'
                      >
                        <Button color='success' onClick={() => handleCClick(request)}>
                          Completed
                        </Button>
                        <Button color='warning' onClick={() => handleIPClick(request)}>
                          In Progress
                        </Button>
                        <Button color='info' onClick={() => handleNSClick(request)}>
                          Not Started
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <Typography variant='h6' align='center' sx={{ margin: 4 }} gutterBottom>
                No requests found
              </Typography>
            )}
          </TableContainer>
        )}
        {selectedRequest && (
          <Dialog open={open} onClose={() => setOpen(false)}>
            {view === 'personal' && (
              <>
                <DialogTitle>Personal information</DialogTitle>
                <DialogContent>
                  <Typography>First Name: {selectedRequest.firstName}</Typography>
                  <Typography>Last Name: {selectedRequest.lastName}</Typography>
                  <Typography>Email: {selectedRequest.email}</Typography>
                  <Typography>Address: {selectedRequest.address}</Typography>
                  <Typography>Zip Code: {selectedRequest.zipCode}</Typography>
                  <Typography>City: {selectedRequest.city}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
              </>
            )}
            {view === 'description' && (
              <>
                <DialogTitle>Description</DialogTitle>
                <DialogContent>
                  <Typography>{selectedRequest.description}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        )}
      </>
    </Grid>
  );
};

export default OrdersTable;
