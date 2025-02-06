import { useState } from 'react';
import { Box, Container, Typography, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputPanel from './components/InputPanel';

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

const CompassContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
  border: '1px solid #ccc',
  position: 'relative',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const QuadrantBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#666',
  fontSize: '0.9rem',
  textAlign: 'center',
  margin: 0,
  padding: 0
});

const App = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
          <CompassContainer>
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              position: 'relative',
              gap: 0
            }}>
              <QuadrantBox sx={{ backgroundColor: '#ffb3b3' }}>Authoritarian Left</QuadrantBox>
              <QuadrantBox sx={{ backgroundColor: '#b3d9ff' }}>Authoritarian Right</QuadrantBox>
              <QuadrantBox sx={{ backgroundColor: '#b3ffb3' }}>Libertarian Left</QuadrantBox>
              <QuadrantBox sx={{ backgroundColor: '#ffb3ff' }}>Libertarian Right</QuadrantBox>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                borderTop: '2px solid black',
                zIndex: 1,
              }} />
              <Box sx={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                borderLeft: '2px solid black',
                zIndex: 1,
              }} />
              <Box
                sx={{
                  position: 'absolute',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'black',
                  borderRadius: '50%',
                  left: `calc(50% + ${position.x * 250}px - 10px)`,
                  top: `calc(50% + ${position.y * 250}px - 10px)`,
                  transition: 'all 0.3s ease-in-out',
                  zIndex: 2,
                }}
              />
            </Box>
          </CompassContainer>
          <InputPanel onPositionUpdate={handlePositionUpdate} />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App
