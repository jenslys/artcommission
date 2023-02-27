import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function NotFound() {
  return (
    <div>
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={3}>
          <Typography variant='h1' component='h2' padding={4}>
            Page not found
          </Typography>
          <Typography align='center'>
            <Link href='/' underline='hover' variant='body1' color='gray'>
              Go Back
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
