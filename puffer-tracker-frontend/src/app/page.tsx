import React from 'react';
import { Container, Box, CssBaseline, Typography } from '@mui/material';
import CurrentRate from './components/CurrentRate';
import HistoricalRatesChart from './components/HistoricalRatesChart';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant='h3'>Puffer Tracker</Typography>
        <CurrentRate />
        <HistoricalRatesChart />
      </Box>
    </Container>
  );
}
