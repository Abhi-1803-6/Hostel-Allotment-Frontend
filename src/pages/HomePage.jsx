import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './HomePage.css'; // Import the new CSS file

// MUI Imports
import { Button, Typography, Box } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function HomePage() {
  // IMPORTANT: Replace these with the names of your images in the /public folder
  const images = [
    '/Hostel-Background.jpg',
    '/Hostel-Background2.jpg',
    '/Hostel-Background3.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // This function changes the image index every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">
      {/* Render a div for each image to handle the fading */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`background-slideshow ${index === currentImageIndex ? 'current' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      
      <Box className="content-box">
        <Typography 
          component="h1" 
          variant="h2" 
          gutterBottom 
          sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', sm: '3rem', md: '4rem' } }}
        >
          Hostel Allotment System
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          A fair, rank-based system for transparent and efficient room allocation. Form groups with friends and secure your room during your designated time slot.
        </Typography>
        <Box>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<MeetingRoomIcon />}
            sx={{ m: 1, py: 1.5, px: 3 }}
          >
            Student Login / Register
          </Button>
          <Button
            component={RouterLink}
            to="/admin-login"
            variant="outlined"
            size="large"
            startIcon={<AdminPanelSettingsIcon />}
            sx={{ 
              m: 1, 
              py: 1.5, 
              px: 3, 
              color: 'white', 
              borderColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white'
              }
            }}
          >
            Admin Login
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default HomePage;