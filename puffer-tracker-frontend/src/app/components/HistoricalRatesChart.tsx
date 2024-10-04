'use client'

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = '1h' | '24h' | '1w' | 'all';
type Interval = 'minute' | 'hour' | 'day';

const HistoricalRatesChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null); // Unfiltered data
  const [timeRange, setTimeRange] = useState<TimeRange>('all'); // Selected time range
  const [interval, setInterval] = useState<Interval>('minute'); // Aggregation interval

  useEffect(() => {
    const fetchHistoricalRates = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/historical-rates');
        const data = response.data;

        setOriginalData(data);
        updateChartData(data, 'all', 'minute'); // Initialize the chart with default values
      } catch (error) {
        console.error('Error fetching historical rates:', error);
      }
    };

    fetchHistoricalRates();
  }, []);

  // Filter and aggregate data based on time range and interval
  const updateChartData = (data: any[], range: TimeRange, interval: Interval) => {
    const filteredData = filterData(data, range);

    const aggregatedData = aggregateData(filteredData, interval);
    // Sort the aggregated data by timestamp in ascending order
    aggregatedData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Extract labels and values for the chart
    const labels = aggregatedData.map((entry: any) => new Date(entry.timestamp).toLocaleString());
    const values = aggregatedData.map((entry: any) => entry.conversion_rate);

    setChartData({
      labels,
      datasets: [
        {
          label: `Conversion Rate Over Time (${interval})`,
          data: values,
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.3)',
          fill: true,
        },
      ],
    });
  };

  const filterData = (data: any[], range: TimeRange) => {
    const now = new Date();

    // Filter data by time range
    let filteredData = data;
    switch (range) {
      case '1h':
        filteredData = data.filter((entry) => new Date(entry.timestamp) >= new Date(now.getTime() - 60 * 60 * 1000));
        break;
      case '24h':
        filteredData = data.filter((entry) => new Date(entry.timestamp) >= new Date(now.getTime() - 24 * 60 * 60 * 1000));
        break;
      case '1w':
        filteredData = data.filter((entry) => new Date(entry.timestamp) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        break;
      default:
        filteredData = data;
    }

    return filteredData;
  }

  // Aggregate data by the selected interval
  const aggregateData = (data: any[], interval: Interval) => {
    // Group data into buckets based on the interval
    const grouped: { [key: string]: any[] } = {};
    data.forEach((entry) => {
      const date = new Date(entry.timestamp);
      let key;

      if (interval === 'minute') {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      } else if (interval === 'hour') {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:00`;
      } else { // group by day
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry.conversion_rate);
    });

    // Aggregate the grouped data
    return Object.keys(grouped).map((key) => {
      const values = grouped[key];
      const averageRate = values.reduce((sum, val) => sum + val, 0) / values.length;
      return { timestamp: key, conversion_rate: averageRate };
    });
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    if (originalData) {
      updateChartData(originalData, range, interval);
    }
  };

  const handleIntervalChange = (interval: Interval) => {
    setInterval(interval);
    if (originalData) {
      updateChartData(originalData, timeRange, interval);
    }
  };

  if (!chartData) {
    return <Typography variant="h6">Loading historical data...</Typography>;
  }

  return (
    <Box sx={{ padding: '20px', height: '500px' }}>
      <Typography variant="h4" gutterBottom>
        Historical Conversion Rates
      </Typography>
      
      {/* Time range buttons */}
      <Typography>Time range</Typography>
      <ButtonGroup sx={{ marginBottom: '20px', marginRight: '10px' }} variant="contained" color="primary">
        <Button onClick={() => handleTimeRangeChange('1h')} disabled={timeRange === '1h'}>Last Hour</Button>
        <Button onClick={() => handleTimeRangeChange('24h')} disabled={timeRange === '24h'}>Last 24 Hours</Button>
        <Button onClick={() => handleTimeRangeChange('1w')} disabled={timeRange === '1w'}>Last Week</Button>
        <Button onClick={() => handleTimeRangeChange('all')} disabled={timeRange === 'all'}>All</Button>
      </ButtonGroup>

      {/* Interval buttons */}
      <Typography>Interval</Typography>
      <ButtonGroup sx={{ marginBottom: '20px' }} variant="outlined" color="secondary">
        <Button onClick={() => handleIntervalChange('minute')} disabled={interval === 'minute'}>Per Minute</Button>
        <Button onClick={() => handleIntervalChange('hour')} disabled={interval === 'hour'}>Per Hour</Button>
        <Button onClick={() => handleIntervalChange('day')} disabled={interval === 'day'}>Per Day</Button>
      </ButtonGroup>

      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </Box>
  );
};

export default HistoricalRatesChart;


