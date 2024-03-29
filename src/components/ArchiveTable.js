import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import Button from '@mui/material/Button';
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
import Container from '@mui/material/Container';
import TablePagination from '@mui/material/TablePagination';
import { DeleteOutline, RemoveRedEyeOutlined, Replay } from '@mui/icons-material';
import { ViewModal } from './ViewModal';
import { ConfirmModal } from './ConfirmModal';

const ArchiveTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('personal');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // set loading state to true
      const q = query(
        collection(db, 'requests'),
        where('archived', '==', 'true'),
        orderBy('date', 'desc'),
      );
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setLoading(false); // set loading state to false
    };

    fetchOrders();
  }, []);

  const update = async () => {
    const q = query(collection(db, 'requests'), where('archived', '==', 'true'));
    const snapshot = await getDocs(q);
    const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);
  };

  const handleViewClick = (request, view) => {
    setSelectedRequest(request);
    setOpenViewModal(true);
    setView(view);
  };

  const handleDeleteClick = async (request) => {
    setSelectedRequest(request);
    setOpenConfirmModal(true);
  };

  const handleConfirmDeleteClick = async (request) => {
    setOpenConfirmModal(false);
    await deleteDoc(doc(db, 'requests', request.id));
    update();
  };

  const handleRecoverClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      archived: 'false',
    });
    update();
  };

  const getStatusColor = (status) => {
    // function to get color of status chip
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
          Archive
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
                  <TableCell>Stage</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
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
                          color='default'
                          variant='outlined'
                          style={{ textTransform: 'capitalize' }}
                          label={request.stage}
                        />
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
                          aria-label='outlined button group'
                        >
                          <Button
                            color='success'
                            endIcon={<Replay />}
                            onClick={() => handleRecoverClick(request)}
                            disabled={request.status === 'completed'}
                          >
                            Recover
                          </Button>
                          <Button
                            color='error'
                            endIcon={<DeleteOutline />}
                            onClick={() => handleDeleteClick(request)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <Typography variant='h6' align='center' sx={{ margin: 4 }} gutterBottom>
                No archived requests found
              </Typography>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
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
        {openConfirmModal && (
          <ConfirmModal
            selectedRequest={selectedRequest}
            setOpenConfirmModal={setOpenConfirmModal}
            handleConfirmDenyClick={handleConfirmDeleteClick}
            isDeletion={true}
          />
        )}
      </>
    </Grid>
  );
};

export default ArchiveTable;
