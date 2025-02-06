import React from 'react';
import { Box, Typography, Stack, Button, Snackbar } from '@mui/material';
import { TwitterShareButton } from 'react-share';
import html2canvas from 'html2canvas';
import { styled } from '@mui/material/styles';

interface CompassViewProps {
  position: { x: number; y: number };
}

const CompassContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
  padding: '20px 0',
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

const CompassView = ({ position }: CompassViewProps) => {
  const [showCopyToast, setShowCopyToast] = React.useState(false);
  const compassRef = React.useRef<HTMLDivElement>(null);

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
    const quadrant = {
      x: position.x > 0 ? 'Right' : 'Left',
      y: position.y > 0 ? 'Authoritarian' : 'Libertarian'
    };
    return `Check out my programming style! I'm in the ${quadrant.y} ${quadrant.x} quadrant on the Programming Compass! 🧭\nhttps://programming-compass.app`;
  };

  return (
    <Box ref={compassRef}>
      <CompassContainer>
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          position: 'relative',
          border: '1px solid #ccc',
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
          <Typography
            sx={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translate(-120%, -50%)',
              whiteSpace: 'nowrap',
              color: '#666',
              textWrap: 'balance'
            }}
          >
            Lang Left
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translate(120%, -50%)',
              whiteSpace: 'nowrap',
              color: '#666',
              textWrap: 'balance'
            }}
          >
            Lang Right
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              right: '50%',
              top: '0',
              transform: 'translate(50%, -120%)',
              whiteSpace: 'nowrap',
              color: '#666',
              textWrap: 'balance'
            }}
          >
            Authoritative Editor
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              right: '50%',
              bottom: '0',
              transform: 'translate(50%, 120%)',
              whiteSpace: 'nowrap',
              color: '#666',
              textWrap: 'balance'
            }}
          >
            Liberal Editor
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              backgroundColor: 'black',
              borderRadius: '50%',
              left: `${(position.x / 2 + 0.5) * 100}%`,
              bottom: `${(position.y / 2 + 0.5) * 100}%`,
              transition: 'all 0.3s ease-in-out',
              transform: 'translate(-50%, 50%)',
              zIndex: 2,
            }}
          />
        </Box>
      </CompassContainer>
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
  );
};

export default CompassView;
