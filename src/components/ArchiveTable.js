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
import { ButtonGroup, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const ArchiveTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // set loading state to true
      const q = query(collection(db, 'requests'), where('stage', '==', 'orders'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setLoading(false); // set loading state to false
    };

    fetchOrders();
  }, []);

  const update = async () => {
    const q = query(collection(db, 'requests'), where('stage', '==', 'orders'));
    const snapshot = await getDocs(q);
    const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);
  };

  const handleViewClick = (request) => {
    setSelectedOrder(request);
    setOpen(true);
  };

  const handleDeleteClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      orderProgress: 'not started',
    });
    update();
  };

  const handleRecoverClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      orderProgress: 'not started',
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
                  <TableCell>Description</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{`${request.firstName} ${request.lastName}`}</TableCell>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewClick(request)}>View</Button>
                    </TableCell>
                    <TableCell>{request.size}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      <Chip
                        color='primary'
                        style={{ textTransform: 'capitalize' }}
                        label={request.status}
                      />
                    </TableCell>
                    <TableCell>
                      <ButtonGroup variant='outlined' aria-label='outlined button group'>
                        <Button color='success' onClick={() => handleRecoverClick(request)}>
                          Recover
                        </Button>
                        <Button color='error' onClick={() => handleDeleteClick(request)}>
                          Delete
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {selectedOrder && (
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Description:</DialogTitle>
            <DialogContent>
              <Typography>{selectedOrder.description}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    </Grid>
  );
};

export default ArchiveTable;
