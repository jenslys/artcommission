import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import Button from '@mui/material/Button';
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
import TablePagination from '@mui/material/TablePagination';

import sendEmail from '../utils/sendEmail';
import { ViewModal } from './ViewModal';

import {
  Check,
  PlayArrowOutlined,
  RemoveRedEyeOutlined,
  StopCircleOutlined,
} from '@mui/icons-material';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]); // State to hold the orders
  const [selectedRequest, setSelectedRequest] = useState(null); // State to hold the selected request for viewing
  const [openViewModal, setOpenViewModal] = useState(false); // State to control the visibility of the view modal
  const [loading, setLoading] = useState(true); // State to indicate if data is currently being loaded
  const [view, setView] = useState('personal'); // State to determine the current view mode ('personal' or 'description')
  const [page, setPage] = useState(0); // State to hold the current page number for pagination
  const [rowsPerPage, setRowsPerPage] = useState(10); // State to determine the number of rows per page for pagination

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Set loading state to true before fetching orders
      const q = query(
        collection(db, 'requests'),
        orderBy('date', 'desc'),
        where('stage', '==', 'orders'),
        where('archived', '==', 'false'),
      );
      const snapshot = await getDocs(q); // Fetch orders from Firestore
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map the fetched data to an array of orders
      setOrders(ordersData); // Update the orders state with the fetched data
      setLoading(false); // Set loading state to false after fetching orders
    };

    fetchOrders(); // Fetch orders when the component mounts
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
    setSelectedRequest(request); // Set the selected request for viewing
    setOpenViewModal(true); // Open the view modal
    setView(view); // Set the current view mode ('personal' or 'description')
  };

  const handleCClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      archived: 'true',
      status: 'completed',
    });
    update();
    try {
      sendEmail(
        request.firstName + ' ' + request.lastName,
        request.email,
        'Your order has been marked as completed! I will now create an invoice for the project with delivery to the address registered to you.',
        process.env.REACT_APP_ADMIN_NAME,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleIPClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'in progress',
    });
    update();
    try {
      sendEmail(
        request.firstName + ' ' + request.lastName,
        request.email,
        'Your order has been marked as in progress!',
        process.env.REACT_APP_ADMIN_NAME,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleNSClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'not started',
    });
    update();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not started':
        return 'info';
      case 'in progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'denied':
        return 'error';
      case 'contacted':
        return 'info';
      case 'new':
        return 'secondary';
      default:
        return 'info';
    }
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
        {loading ? ( // If loading state is true, show loading indicator
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
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                  (
                    request, // Map through the orders array and render a table row for each order
                  ) => (
                    <TableRow key={request.id}>
                      <TableCell>{`${request.firstName} ${request.lastName}`}</TableCell>
                      <TableCell>
                        <Button
                          variant='outlined'
                          color='primary'
                          size='small'
                          endIcon={<RemoveRedEyeOutlined />}
                          onClick={() => handleViewClick(request, 'personal')}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.size}</TableCell>
                      <TableCell>
                        <Button
                          variant='outlined'
                          color='primary'
                          size='small'
                          endIcon={<RemoveRedEyeOutlined />}
                          onClick={() => handleViewClick(request, 'description')}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(request.status)}
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
                          <Button
                            color='success'
                            endIcon={<Check />}
                            onClick={() => handleCClick(request)}
                          >
                            Completed
                          </Button>
                          <Button
                            color='warning'
                            endIcon={<PlayArrowOutlined />}
                            onClick={() => handleIPClick(request)}
                          >
                            In Progress
                          </Button>
                          <Button
                            color='info'
                            endIcon={<StopCircleOutlined />}
                            onClick={() => handleNSClick(request)}
                          >
                            Not Started
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <Typography variant='h6' align='center' sx={{ margin: 4 }} gutterBottom>
                No requests found
              </Typography>
            )}
            <TablePagination // Pagination component
              rowsPerPageOptions={[5, 10, 25, 50, 100]} // Options for number of rows per page
              count={orders.length} // Total number of rows
              rowsPerPage={rowsPerPage} // Number of rows per page
              page={page} // Current page
              onPageChange={(e, newPage) => setPage(newPage)} // Update the page state when the page changes
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10)); // Update the rowsPerPage state when the number of rows per page changes
                setPage(0); // Reset the page state when the number of rows per page changes
              }}
            />
          </TableContainer>
        )}
        {openViewModal && (
          <ViewModal
            selectedRequest={selectedRequest}
            view={view}
            setOpenViewModal={setOpenViewModal}
          />
        )}
      </>
    </Grid>
  );
};

export default OrdersTable;
