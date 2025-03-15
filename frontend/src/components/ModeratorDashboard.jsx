// src/components/ModeratorDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [animals, setAnimals] = useState([]);

  // For editing an animal
  const [editingAnimalId, setEditingAnimalId] = useState(null);
  const [editedAnimal, setEditedAnimal] = useState({});
  const [editedImage, setEditedImage] = useState(null);

  // For adding a new animal
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    species: '',
    age: '',
    description: '',
  });
  const [animalImages, setAnimalImages] = useState([]);
  const [animalVideo, setAnimalVideo] = useState(null);

  // For adding a new post to an animal
  const [addingPostForAnimalId, setAddingPostForAnimalId] = useState(null);
  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [postVideos, setPostVideos] = useState([]);

  // For messages (placeholder)
  const [message, setMessage] = useState({ text: '' });

  // -------------------------------
  // 1. Fetch Animals
  const fetchAnimals = async () => {
    try {
      const response = await fetch('http://localhost:3000/animals');
      const data = await response.json();
      // Sort active animals first
      const sorted = data.sort((a, b) =>
        a.active === b.active ? 0 : a.active ? -1 : 1
      );
      setAnimals(sorted);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // -------------------------------
  // 2. Add New Animal
  const onDropNewAnimalImages = useCallback((acceptedFiles) => {
    setAnimalImages(acceptedFiles);
  }, []);
  const {
    getRootProps: getNewAnimalImagesRootProps,
    getInputProps: getNewAnimalImagesInputProps,
    isDragActive: isNewAnimalImagesDragActive
  } = useDropzone({
    onDrop: onDropNewAnimalImages,
    accept: 'image/*',
    multiple: true,
  });

  const onDropNewAnimalVideo = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setAnimalVideo(acceptedFiles[0]);
    }
  }, []);
  const {
    getRootProps: getNewAnimalVideoRootProps,
    getInputProps: getNewAnimalVideoInputProps,
    isDragActive: isNewAnimalVideoDragActive
  } = useDropzone({
    onDrop: onDropNewAnimalVideo,
    accept: 'video/*',
    multiple: false,
  });

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newAnimal.name);
    formData.append('species', newAnimal.species);
    formData.append('age', newAnimal.age);
    formData.append('description', newAnimal.description);
    animalImages.forEach(file => formData.append('images', file));
    if (animalVideo) {
      formData.append('video', animalVideo);
    }
    try {
      const response = await fetch('http://localhost:3000/upload/newAnimal', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Animal "${data.animal.name}" added successfully.`);
        setNewAnimal({ name: '', species: '', age: '', description: '' });
        setAnimalImages([]);
        setAnimalVideo(null);
        fetchAnimals();
      } else {
        alert(data.error || 'Error adding animal.');
      }
    } catch (error) {
      console.error('Error adding animal:', error);
    }
  };

  // -------------------------------
  // 3. Edit Animal (Text + Replace Photo)
  const handleEdit = (animal) => {
    setEditingAnimalId(animal.id);
    setEditedAnimal({
      name: animal.name,
      species: animal.species,
      age: animal.age,
      description: animal.description,
    });
    setEditedImage(null);
  };

  const onDropEditedImage = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setEditedImage(acceptedFiles[0]);
    }
  }, []);
  const {
    getRootProps: getEditedImageRootProps,
    getInputProps: getEditedImageInputProps,
    isDragActive: isEditedImageDragActive
  } = useDropzone({
    onDrop: onDropEditedImage,
    accept: 'image/*',
    multiple: false,
  });

  const handleSaveEdit = async (animal) => {
    const formData = new FormData();
    formData.append('name', editedAnimal.name);
    formData.append('species', editedAnimal.species);
    formData.append('age', editedAnimal.age);
    formData.append('description', editedAnimal.description);
    if (editedImage) {
      formData.append('images', editedImage);
    }
    try {
      const response = await fetch(`http://localhost:3000/animals/${animal.id}/media`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        alert('Animal updated successfully.');
        setEditingAnimalId(null);
        setEditedAnimal({});
        setEditedImage(null);
        fetchAnimals();
      } else {
        const data = await response.json();
        alert(data.error || 'Error updating animal.');
      }
    } catch (error) {
      console.error('Error updating animal media:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAnimalId(null);
    setEditedAnimal({});
    setEditedImage(null);
  };

  // -------------------------------
  // 4. Toggle Animal Active Status
  const toggleAnimalActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });
      if (response.ok) {
        fetchAnimals();
      } else {
        const data = await response.json();
        alert(data.error || 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating animal status:', error);
    }
  };

  // -------------------------------
  // 5. Add a Post for an Animal
  const onDropPostImages = useCallback((acceptedFiles) => {
    setPostImages(acceptedFiles);
  }, []);
  const {
    getRootProps: getPostImagesRootProps,
    getInputProps: getPostImagesInputProps,
    isDragActive: isPostImagesDragActive
  } = useDropzone({
    onDrop: onDropPostImages,
    accept: 'image/*',
    multiple: true,
  });

  const onDropPostVideos = useCallback((acceptedFiles) => {
    setPostVideos(acceptedFiles);
  }, []);
  const {
    getRootProps: getPostVideosRootProps,
    getInputProps: getPostVideosInputProps,
    isDragActive: isPostVideosDragActive
  } = useDropzone({
    onDrop: onDropPostVideos,
    accept: 'video/*',
    multiple: true,
  });

  const handleAddPost = async (animalId) => {
    try {
      const formData = new FormData();
      formData.append('text', postText);
      postImages.forEach((file) => formData.append('images', file));
      postVideos.forEach((file) => formData.append('videos', file));

      const response = await fetch(`http://localhost:3000/animals/${animalId}/posts`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Post created successfully.');
        setAddingPostForAnimalId(null);
        setPostText('');
        setPostImages([]);
        setPostVideos([]);
      } else {
        alert(data.error || 'Error creating post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleCancelPost = () => {
    setAddingPostForAnimalId(null);
    setPostText('');
    setPostImages([]);
    setPostVideos([]);
  };

  // -------------------------------
  // 6. Tab Change Handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // -------------------------------
  // 7. Placeholder: Send Messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    alert('Message sent (placeholder).');
  };

  // -------------------------------
  // RENDER
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Moderator Dashboard
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Animals" />
          <Tab label="Posts" />
          <Tab label="Messages" />
          <Tab label="Extras" />
        </Tabs>
      </Box>

      {/* TAB 0: Animals */}
      {activeTab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Manage Animals (Tile View)
          </Typography>
          {animals.length === 0 ? (
            <Typography>No animals available.</Typography>
          ) : (
            <Grid container spacing={2}>
              {animals.map((animal) => (
                <Grid item xs={12} sm={6} md={4} key={animal.id}>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: animal.active ? 'white' : '#f0f0f0',
                    }}
                  >
                    {animal.imagePaths && animal.imagePaths.length > 0 && (
                      <img
                        src={`http://localhost:3000/${animal.imagePaths[0]}`}
                        alt={animal.name}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    )}
                    {editingAnimalId === animal.id ? (
                      // EDIT MODE
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          label="Name"
                          value={editedAnimal.name}
                          onChange={(e) =>
                            setEditedAnimal({ ...editedAnimal, name: e.target.value })
                          }
                          fullWidth
                        />
                        <TextField
                          label="Species"
                          value={editedAnimal.species}
                          onChange={(e) =>
                            setEditedAnimal({ ...editedAnimal, species: e.target.value })
                          }
                          fullWidth
                        />
                        <TextField
                          label="Age"
                          value={editedAnimal.age}
                          onChange={(e) =>
                            setEditedAnimal({ ...editedAnimal, age: e.target.value })
                          }
                          fullWidth
                        />
                        <TextField
                          label="Description"
                          value={editedAnimal.description}
                          onChange={(e) =>
                            setEditedAnimal({ ...editedAnimal, description: e.target.value })
                          }
                          fullWidth
                          multiline
                        />

                        {/* Dropzone for new image */}
                        <Box
                          {...getEditedImageRootProps()}
                          sx={{
                            border: '2px dashed #ccc',
                            borderRadius: '4px',
                            p: 2,
                            mt: 2,
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <input {...getEditedImageInputProps()} />
                          {isEditedImageDragActive ? (
                            <Typography>Drop new image here...</Typography>
                          ) : (
                            <Typography>Drag & drop or click to select a new image.</Typography>
                          )}
                        </Box>
                        {editedImage && (
                          <Typography sx={{ mt: 1 }}>
                            New image selected: {editedImage.name}
                          </Typography>
                        )}

                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleSaveEdit(animal)}
                          >
                            Save
                          </Button>
                          <Button variant="outlined" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      // VIEW MODE
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="h6">{animal.name}</Typography>
                        <Typography variant="body2">
                          Species: {animal.species}
                        </Typography>
                        <Typography variant="body2">Age: {animal.age}</Typography>
                        <Typography variant="body2">{animal.description}</Typography>
                        <Typography variant="body2">
                          Status: {animal.active ? 'Active' : 'Inactive'}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => toggleAnimalActive(animal.id, animal.active)}
                          >
                            {animal.active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleEdit(animal)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setAddingPostForAnimalId(animal.id)}
                          >
                            ADD POST
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* Post Form for this animal */}
                    {addingPostForAnimalId === animal.id && (
                      <Box sx={{ mt: 2, border: '1px solid #ccc', p: 2 }}>
                        <Typography variant="subtitle1">Create Post for {animal.name}</Typography>
                        <TextField
                          label="Post Text"
                          multiline
                          fullWidth
                          sx={{ mt: 1 }}
                          value={postText}
                          onChange={(e) => setPostText(e.target.value)}
                        />

                        {/* Dropzone for post images */}
                        <Box
                          {...getPostImagesRootProps()}
                          sx={{
                            border: '2px dashed #ccc',
                            borderRadius: '4px',
                            p: 2,
                            mt: 2,
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <input {...getPostImagesInputProps()} />
                          {isPostImagesDragActive ? (
                            <Typography>Drop images here...</Typography>
                          ) : (
                            <Typography>Drag & drop or click to select images.</Typography>
                          )}
                        </Box>
                        {postImages.length > 0 && (
                          <Typography sx={{ mt: 1 }}>
                            {postImages.length} image(s) selected.
                          </Typography>
                        )}

                        {/* Dropzone for post videos */}
                        <Box
                          {...getPostVideosRootProps()}
                          sx={{
                            border: '2px dashed #ccc',
                            borderRadius: '4px',
                            p: 2,
                            mt: 2,
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <input {...getPostVideosInputProps()} />
                          {isPostVideosDragActive ? (
                            <Typography>Drop videos here...</Typography>
                          ) : (
                            <Typography>Drag & drop or click to select videos.</Typography>
                          )}
                        </Box>
                        {postVideos.length > 0 && (
                          <Typography sx={{ mt: 1 }}>
                            {postVideos.length} video(s) selected.
                          </Typography>
                        )}

                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleAddPost(animal.id)}
                          >
                            Save Post
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleCancelPost}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Form to add a new animal */}
          <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6">Add New Animal</Typography>
            <Box
              component="form"
              onSubmit={handleAddAnimal}
              sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Name"
                value={newAnimal.name}
                onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
                required
              />
              <TextField
                label="Species"
                value={newAnimal.species}
                onChange={(e) => setNewAnimal({ ...newAnimal, species: e.target.value })}
                required
              />
              <TextField
                label="Age"
                value={newAnimal.age}
                onChange={(e) => setNewAnimal({ ...newAnimal, age: e.target.value })}
                required
              />
              <TextField
                label="Description"
                value={newAnimal.description}
                onChange={(e) => setNewAnimal({ ...newAnimal, description: e.target.value })}
                multiline
              />

              {/* Dropzone for new animal images */}
              <Box
                {...getNewAnimalImagesRootProps()}
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <input {...getNewAnimalImagesInputProps()} />
                {isNewAnimalImagesDragActive ? (
                  <Typography>Drop images here...</Typography>
                ) : (
                  <Typography>Drag & drop or click to select images.</Typography>
                )}
              </Box>
              {animalImages.length > 0 && (
                <Typography>{animalImages.length} image(s) selected.</Typography>
              )}

              {/* Dropzone for new animal video */}
              <Box
                {...getNewAnimalVideoRootProps()}
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <input {...getNewAnimalVideoInputProps()} />
                {isNewAnimalVideoDragActive ? (
                  <Typography>Drop video here...</Typography>
                ) : (
                  <Typography>Drag & drop or click to select a video.</Typography>
                )}
              </Box>
              {animalVideo && (
                <Typography>Video selected: {animalVideo.name}</Typography>
              )}

              <Button variant="contained" type="submit">
                Add Animal
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* TAB 1: Manage Posts (Placeholder) */}
      {activeTab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Manage Posts
          </Typography>
          <Typography>Here you can add, edit, and delete posts (placeholder).</Typography>
        </Box>
      )}

      {/* TAB 2: Send Messages (Placeholder) */}
      {activeTab === 2 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Send Messages
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message sent (placeholder).');
            }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Message Text"
              value={message.text}
              onChange={(e) => setMessage({ ...message, text: e.target.value })}
              multiline
              required
            />
            <Button variant="contained" type="submit">
              Send Message
            </Button>
          </Box>
        </Box>
      )}

      {/* TAB 3: Extras (Placeholder) */}
      {activeTab === 3 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Extra Messages
          </Typography>
          <Typography>
            Here you can set up extra donation messages or special campaigns (placeholder).
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default ModeratorDashboard;