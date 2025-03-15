// src/components/AnimalDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function AnimalDetailPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Fetch animal details
  useEffect(() => {
    fetch(`http://localhost:3000/animals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimal(data);
      })
      .catch((error) => console.error('Error fetching animal details:', error));
  }, [id]);

  // Fetch posts for this animal
  useEffect(() => {
    fetch(`http://localhost:3000/animals/${id}/posts`)
      .then((res) => res.json())
      .then((data) => {
        // Adjust according to your API response – here we assume { posts: [...] }
        setPosts(data.posts || []);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, [id]);

  if (!animal) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" align="center">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {animal.name}
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        {/* Media: video if available, otherwise first image */}
        {animal.videoPath ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <video
              width="100%"
              height="300"
              controls
              style={{ borderRadius: '8px' }}
            >
              <source src={`http://localhost:3000/${animal.videoPath}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        ) : animal.imagePaths && animal.imagePaths.length > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img
              src={`http://localhost:3000/${animal.imagePaths[0]}`}
              alt={animal.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </Box>
        ) : null}

        {/* Animal Info */}
        <Typography variant="h6">Species: {animal.species}</Typography>
        <Typography variant="body1">Age: {animal.age}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {animal.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => alert(`I want to adopt ${animal.name} (placeholder).`)}
          >
            I want to adopt
          </Button>
        </Box>
      </Paper>

      {/* Posts Section */}
      <Typography variant="h5" align="center" gutterBottom>
        Posts for {animal.name}
      </Typography>
      {posts.length === 0 ? (
        <Typography align="center">No posts available.</Typography>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Paper
                sx={{
                  p: 2,
                  filter: 'blur(3px)',
                  position: 'relative'
                }}
              >
                {post.imagePaths && post.imagePaths.length > 0 && (
                  <img
                    src={`http://localhost:3000/${post.imagePaths[0]}`}
                    alt="Post"
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {post.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default AnimalDetailPage;