// src/components/AnimalsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  // Fetch animals from backend
  useEffect(() => {
    fetch('http://localhost:3000/animals')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched animals:', data);
        // Filter to show only active animals
        const activeAnimals = data.filter(animal => animal.active === true);
        setAnimals(activeAnimals);
      })
      .catch(error => {
        console.error('Error fetching animals:', error);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Choose an Animal to Adopt
      </Typography>
      {animals.length === 0 ? (
        <Typography align="center">No active animals available.</Typography>
      ) : (
        <Grid container spacing={2}>
          {animals.map(animal => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Paper sx={{ p: 2 }}>
                {/* Animal image */}
                {animal.imagePaths && animal.imagePaths.length > 0 ? (
                  <img
                    src={`http://localhost:3000/${animal.imagePaths[0]}`}
                    alt={animal.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '150px',
                      backgroundColor: '#ccc',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography>No image available</Typography>
                  </Box>
                )}
                {/* Animal details */}
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {animal.name}
                </Typography>
                <Typography variant="body2">Species: {animal.species}</Typography>
                <Typography variant="body2">Age: {animal.age}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {animal.description}
                </Typography>
                {/* Action buttons */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => alert(`Adoption flow for ${animal.name} (placeholder).`)}
                  >
                    ADOPT
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/animals/${animal.id}`)}
                  >
                    SEE MORE
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default AnimalsPage;