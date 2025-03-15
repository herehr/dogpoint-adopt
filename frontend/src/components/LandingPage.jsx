// src/components/LandingPage.jsx
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { AppBar, Toolbar, Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Slider settings: 3 images at a time, autoplay etc.
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 960,
      settings: { slidesToShow: 2, slidesToScroll: 1 }
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 1, slidesToScroll: 1 }
    }
  ]
};

function LandingPage() {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  // Fetch animals from the backend
  useEffect(() => {
    fetch('http://localhost:3000/animals')
      .then(response => response.json())
      .then(data => {
        // Only include active animals for the slider
        const activeAnimals = data.filter(animal => animal.active);
        setAnimals(activeAnimals);
      })
      .catch(error => {
        console.error('Error loading animals:', error);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#00b8d4' }}>
      {/* Navigation Bar */}
      <AppBar position="static" color="inherit" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="Dogpoint Logo" style={{ height: '50px', marginRight: '16px' }} />
            <Typography variant="h6" color="textPrimary">Dogpoint</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" href="#animals">Animals</Button>
            <Button color="inherit" href="#adoption">Adopt at a Distance</Button>
            <Button color="inherit" href="#contact">Contact</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          height: '80vh',
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(255,255,255,0.01)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}
      >
        <Container>
          <Typography variant="h2" align="center" gutterBottom>
            Adopt at a Distance
          </Typography>
          <Typography variant="h5" align="center">
            Help animals and find your new best friend.
          </Typography>
        </Container>
      </Box>

      {/* Section: Our Animals (Slider) */}
      <Container id="animals" sx={{ py: 4, backgroundColor: '#fff', borderRadius: '8px', mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Animals
        </Typography>
        <Slider {...sliderSettings}>
          {animals.map(animal => (
            <Box key={animal.id} sx={{ px: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/animals/${animal.id}`)}
            >
              <img
                src={animal.imagePaths && animal.imagePaths[0] 
                      ? `http://localhost:3000/${animal.imagePaths[0]}`
                      : '/images/placeholder.png'}
                alt={animal.name}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
          ))}
        </Slider>
      </Container>

      {/* Section: Adoption Conditions */}
      <Container id="adoption" sx={{ py: 4, backgroundColor: '#fff', borderRadius: '8px', mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Adoption Conditions
        </Typography>
        {/* Your content for conditions here */}
      </Container>

      {/* Section: About Us */}
      <Container sx={{ py: 4, backgroundColor: '#fff', borderRadius: '8px', mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          About Dogpoint
        </Typography>
        <Typography variant="body1" align="center">
          Dogpoint is a platform connecting animal lovers with shelters. Our goal is to support animals and help them find a new home.
        </Typography>
      </Container>

      {/* Section: Contact */}
      <Container id="contact" sx={{ py: 4, backgroundColor: '#fff', borderRadius: '8px', mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Contact
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <iframe
            title="Map - Lhotky 60, 281 63 Malotice, Czechia"
            src="https://maps.google.com/maps?q=Lhotky%2060,%20281%2063%20Malotice&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="300"
            style={{ border: 0, maxWidth: '600px' }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button color="inherit" href="/impressum">Impressum</Button>
          <Button color="inherit" href="/gdpr">GDPR</Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 2, mt: 4 }}>
        <Typography variant="body2" align="center">
          © Dogpoint 2025 | GDPR | Impressum
        </Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;