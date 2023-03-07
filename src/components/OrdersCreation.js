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
import { Box } from '@mui/system';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, 'orders'), where('status', '==', 'new'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  const update = async () => {
    const q = query(collection(db, 'orders'), where('status', '==', 'new'));
    const snapshot = await getDocs(q);
    const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleAcceptClick = async () => {
    await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'accepted' });
    setOpen(false);
    update();
  };

  const handleDenyClick = async () => {
    await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'denied' });
    setOpen(false);
    update();
  };

  return (
    <Box
      sx={{
        width: '80%',
        height: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '100px',
      }}
    >
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <button onClick={() => handleViewClick(order)}>View</button>
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedOrder && (
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              <p>First Name: {selectedOrder.firstName}</p>
              <p>Last Name: {selectedOrder.lastName}</p>
              <p>Email: {selectedOrder.email}</p>
              <p>Address: {selectedOrder.address}</p>
              <p>Zip Code: {selectedOrder.zipCode}</p>
              <p>City: {selectedOrder.city}</p>
              <p>Size: {selectedOrder.size}</p>
              <p>Description: {selectedOrder.description}</p>
            </DialogContent>
            <DialogActions>
              <Button variant='contained' onClick={handleDenyClick} sx={{ backgroundColor: 'red' }}>
                Deny
              </Button>
              <Button
                variant='contained'
                onClick={handleAcceptClick}
                sx={{ backgroundColor: 'green' }}
              >
                Accept
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    </Box>
  );
};

export default OrdersTable;
