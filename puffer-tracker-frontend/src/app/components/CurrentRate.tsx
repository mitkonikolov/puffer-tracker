'use client'

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

const CurrentRate: React.FC = () => {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/conversion-rate');
        setRate(response.data.conversion_rate);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, []);

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h4">Current Conversion Rate</Typography>
      <Typography variant="h2">{rate ? rate.toFixed(4) : 'Loading...'}</Typography>
    </Box>
  );
};

export default CurrentRate;
