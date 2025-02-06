import { useState } from 'react';
import { Box, Container, Typography, ThemeProvider, createTheme, Button } from '@mui/material';
import InputPanel from './components/InputPanel';
import CompassView from './components/CompassView';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});


const App = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showCompass, setShowCompass] = useState(false);

  const handlePositionUpdate = (editorPos: number, langPos: number) => {
    setPosition({ x: langPos, y: editorPos });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Programming Compass
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ mb: 1, textWrap: 'balance' }}>
            The Programming Compass helps you visualize your development style based on your choice of editors and programming languages.
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ mb: 1, textWrap: 'balance' }}>
            The vertical axis represents the spectrum from Liberal (bottom) to Authoritative (top) development editors,
            while the horizontal axis shows the range from Community-driven (left) to Corporate (right) language.
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ mb: 1, textWrap: 'balance' }}>
            Add your preferred editors and languages below, then adjust their usage percentages to see where you stand in the programming paradigm space.
          </Typography>

          <InputPanel onPositionUpdate={handlePositionUpdate} hideButtons={showCompass} />
          
          {!showCompass && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowCompass(true)}
                disabled={!position.x && !position.y}
              >
                Show My Position on the Compass
              </Button>
            </Box>
          )}

          {showCompass && (
            <CompassView position={position} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
