import { useState, useRef } from 'react';
import { Box, Container, Typography, ThemeProvider, createTheme, Button, Stack, Snackbar } from '@mui/material';
import { TwitterShareButton } from 'react-share';
import html2canvas from 'html2canvas';
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
  const [position, setPosition] = useState<{x: number, y: number} | null>(null);
  const [showCompass, setShowCompass] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  const handlePositionUpdate = (editorPos: number, langPos: number) => {
    setPosition({ x: langPos, y: editorPos });
  };

  const handleCopyImage = async () => {
    if (compassRef.current) {
      const canvas = await html2canvas(compassRef.current);
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            setShowCopyToast(true);
          }
        }, 'image/png');
      } catch (err) {
        console.error('Failed to copy image to clipboard:', err);
      }
    }
  };

  const getTweetText = () => {
    if (!position) return '';
    const quadrant = {
      x: position.x > 0 ? 'Right' : 'Left',
      y: position.y > 0 ? 'Authoritarian' : 'Libertarian'
    };
    return `Check out my programming style! I'm in the ${quadrant.y} ${quadrant.x} quadrant on the Programming Compass! 🧭\nhttps://programming-compass.app`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4, minWidth: '600px' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Your Programming Compass
          </Typography>
          {!showCompass ? (
            <>
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
            </>
          ) : position && (
            <Typography variant="h5" gutterBottom align="center">
              {position.y > 0 ? 'Authoritarian' : 'Libertarian'} {position.x > 0 ? 'Right' : 'Left'}
            </Typography>
          )}

          <InputPanel onPositionUpdate={handlePositionUpdate} hideControl={showCompass} />

          {!showCompass && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowCompass(true)}
                disabled={!position}
              >
                Show My Position on the Compass
              </Button>
            </Box>
          )}

          {showCompass && position && (
            <Box>
              <Box ref={compassRef}>
                <CompassView position={position} />
              </Box>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2, mb: 4 }}>
                <TwitterShareButton url="https://programming-compass.app" title={getTweetText()}>
                  <div style={{ display: 'inline-block' }}>
                    <Button variant="contained" color="primary" component="span">Share on Twitter</Button>
                  </div>
                </TwitterShareButton>
                <Button variant="contained" color="secondary" onClick={handleCopyImage}>
                  Copy Image
                </Button>
              </Stack>
              <Snackbar
                open={showCopyToast}
                autoHideDuration={3000}
                onClose={() => setShowCopyToast(false)}
                message="Image copied to clipboard!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
