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
import ButtonGroup from '@mui/material/ButtonGroup';

import sendEmail from '../utils/sendEmail';
import { Check, DoDisturb, EmailOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';

const RequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('personal');

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

  const handleViewClick = (request, view) => {
    setSelectedRequest(request);
    setOpen(true);
    setView(view);
  };

  const handleAcceptClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'not started',
      stage: 'orders',
    });
    setOpen(false);
    update();
    sendEmail(
      request.firstName,
      request.email,
      'Your request has been accepted!',
      process.env.REACT_APP_ADMIN_NAME,
    );
  };

  const handleContactClick = async (request) => {
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'contacted',
    });
    setOpen(false);
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
    await updateDoc(doc(db, 'requests', request.id), {
      status: 'denied',
      archived: 'true',
    });
    setOpen(false);
    update();
    sendEmail(
      request.firstName,
      request.email,
      'Your request has been denied!',
      process.env.REACT_APP_ADMIN_NAME,
    );
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
                {requests.map((request) => (
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
                        color='info'
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
          </TableContainer>
        )}
        {selectedRequest && (
          <Dialog open={open} onClose={() => setOpen(false)}>
            {view === 'personal' && (
              <>
                <DialogTitle variant='h4'>Personal information</DialogTitle>
                <DialogContent>
                  <Typography variant='h6'>First Name: {selectedRequest.firstName}</Typography>
                  <Typography variant='h6'>Last Name: {selectedRequest.lastName}</Typography>
                  <Typography variant='h6'>Email: {selectedRequest.email}</Typography>
                  <Typography variant='h6'>Address: {selectedRequest.address}</Typography>
                  <Typography variant='h6'>Zip Code: {selectedRequest.zipCode}</Typography>
                  <Typography variant='h6'>City: {selectedRequest.city}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
              </>
            )}
            {view === 'description' && (
              <>
                <DialogTitle variant='h4'>Description</DialogTitle>
                <DialogContent>
                  <Typography variant='h6'>{selectedRequest.description}</Typography>
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

export default RequestTable;
