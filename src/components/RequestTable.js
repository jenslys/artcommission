import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import Button from '@mui/material/Button';

// Importing necessary components and utilities
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
import ButtonGroup from '@mui/material/ButtonGroup';
import TablePagination from '@mui/material/TablePagination';

import sendEmail from '../utils/sendEmail';
import { ViewModal } from './ViewModal';
import { ConfirmModal } from './ConfirmModal';
import { Check, DoDisturb, EmailOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';

const RequestTable = () => {
  // State variables
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('personal');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Fetch requests from Firestore when the component mounts
    const fetchRequests = async () => {
      setLoading(true); // set loading state to true
      const q = query(
        collection(db, 'requests'),
        where('stage', '==', 'requests'),
        where('archived', '==', 'false'),
        orderBy('date', 'desc'),
      );
      const snapshot = await getDocs(q);
      const requestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
      setLoading(false); // set loading state to false
    };

    fetchRequests();
  }, []);

  const update = async () => {
    // Update requests by fetching from Firestore again
    const q = query(
      collection(db, 'requests'),
      where('stage', '==', 'requests'),
      where('archived', '==', 'false'),
    );
    const snapshot = await getDocs(q);
    const requestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(requestsData);
  };

  const handleViewClick = (request, view) => {
    // Handle click on View button for a request
    setSelectedRequest(request);
    setOpenViewModal(true);
    setView(view);
  };

  const handleAcceptClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'not started',
      stage: 'orders',
    });
    setOpenViewModal(false);
    update();
    try {
      sendEmail(
        request.firstName + ' ' + request.lastName,
        request.email,
        'Your request has been accepted! I will now start planning the project. I will contact you for further status of your project.',
        process.env.REACT_APP_ADMIN_NAME,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'contacted',
    });
    setOpenViewModal(false);
    update();
    window.open(
      'mailto:' +
        request.email +
        '?subject=Response to art commission -' +
        ' ' +
        process.env.REACT_APP_ADMIN_SITE_NAME,
    );
  };

  const handleDenyClick = async (request) => {
    setSelectedRequest(request);
    setOpenConfirmModal(true);
  };

  const handleConfirmDenyClick = async (request) => {
    setOpenConfirmModal(false);
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'denied',
      archived: 'true',
    });
    update();
    try {
      sendEmail(
        request.firstName + ' ' + request.lastName,
        request.email,
        'Your request has been denied! I have considered your request and I cannot fulfill your request. Feel free to submit a new form and we will solve it!',
        process.env.REACT_APP_ADMIN_NAME,
      );
    } catch (error) {
      console.log(error);
    }
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
          Requests
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
                {requests
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
                            onClick={() => handleAcceptClick(request)}
                          >
                            Accept
                          </Button>
                          <Button
                            color='info'
                            endIcon={<EmailOutlined />}
                            onClick={() => handleContactClick(request)}
                          >
                            Contact
                          </Button>

                          <Button
                            color='error'
                            endIcon={<DoDisturb />}
                            onClick={() => handleDenyClick(request)}
                          >
                            Deny
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {requests.length === 0 && (
              <Typography variant='h6' align='center' sx={{ margin: 4 }} gutterBottom>
                No requests found
              </Typography>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              count={requests.length}
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
            handleConfirmDenyClick={handleConfirmDenyClick}
            isDeletion={false}
          />
        )}
      </>
    </Grid>
  );
};

export default RequestTable;
