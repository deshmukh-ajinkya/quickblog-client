/* eslint-disable complexity */
/* eslint-disable indent */
'use client';
import { Box, Typography, CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import './style.css';
import { useSelector } from 'react-redux';
import { axiosInstance } from '@/config';
import { RootState } from '@/store/store';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

interface Post {
  title: string;
  likeCount: number;
  createdAt: string;
}

interface CategoryLike {
  _id: string;
  totalLikes: number;
  category: string;
}

interface InsightData {
  blogData: Post[];
  likesByCategory: CategoryLike[];
}

function Insight(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InsightData>({
    blogData: [],
    likesByCategory: []
  });

  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const userId = useSelector((state: RootState) => state.blog.userId);

  const getCurrentDate = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const token = localStorage.getItem('token');
      setLoading(true);
      try {
        const response = await axiosInstance.post(
          '/get_blog_insight',
          {
            userID: userId,
            fromDate: fromDate || getCurrentDate(),
            toDate: toDate || getCurrentDate()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setData(response.data);
      } catch (error) {
        setData({
          blogData: [],
          likesByCategory: []
        }); // Fallback state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate, userId]);

  const defaultDoughnutData = {
    labels: ['No Data'],
    datasets: [
      {
        label: 'Likes by Category',
        data: [1],
        backgroundColor: ['#d3d3d3'],
        hoverBackgroundColor: ['#a9a9a9']
      }
    ]
  };

  const doughnutData = data.likesByCategory.length
    ? {
        labels: data.likesByCategory.map((category) => category.category),
        datasets: [
          {
            label: 'Likes by Category',
            data: data.likesByCategory.map((category) => category.totalLikes),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      }
    : defaultDoughnutData;

  const barData = {
    labels: data.blogData.map((post) => post.title) || ['No Data'],
    datasets: [
      {
        label: 'Count',
        data: data.blogData.map((post) => post.likeCount) || [0],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 0.5,
        barThickness: 50
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true, // Ensure the scale starts at 0
        ticks: {
          stepSize: 1, // Force step size to 1 (integer values)
          callback: function (tickValue: string | number): string | number {
            // Adjust type to string | number
            return typeof tickValue === 'number' && tickValue % 1 === 0 ? tickValue : ''; // Handle both string and number types
          }
        }
      }
    }
  };

  const dounotOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <Box className="insight-root-container">
      {/* Date picker */}
      <Box className="date-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            size="small"
            className="select-date"
            label="Start Date"
            variant="standard"
            onChange={(date) => setFromDate(date?.format('DD-MM-YYYY') || '')}
          />
          <DateField
            size="small"
            className="select-date"
            label="End Date"
            variant="standard"
            onChange={(date) => setToDate(date?.format('DD-MM-YYYY') || '')}
          />
        </LocalizationProvider>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Doughnut Chart */}
          <Box className="like-chart-container">
            <Typography color="primary" variant="h6">
              Trends
            </Typography>
            <Box className="liked-chart">
              <Doughnut data={doughnutData} options={dounotOptions} />
            </Box>
          </Box>

          {/* Table */}
          <Box className="post-overview-container">
            <Typography color="primary" variant="h6">
              Post Overview
            </Typography>
            <TableContainer className="table-container">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell align="right">Likes</TableCell>
                    <TableCell align="right">Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.blogData.length ? (
                    data.blogData.map((row) => (
                      <TableRow key={row.title}>
                        <TableCell component="th" scope="row">
                          {row.title}
                        </TableCell>
                        <TableCell align="right">{row.likeCount}</TableCell>
                        <TableCell align="right">{row.createdAt}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No Data Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Bar and Line Charts */}
          <Box className="graph-container">
            <Typography color="primary" variant="h6">
              Most Liked Blog
            </Typography>
            <Box className="most-liked-graph">
              <Bar data={barData} options={chartOptions} />
            </Box>
            <Typography color="primary" variant="h6" className="count-title">
              Visitors
            </Typography>
            <Box className="count-graph">
              <Bar data={barData} options={chartOptions} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Insight;
