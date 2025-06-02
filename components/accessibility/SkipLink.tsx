import React from 'react';
import { Box } from '@mui/material';

export default function SkipLink(): React.ReactElement {
  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '1rem',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        zIndex: 'tooltip',
        '&:focus': {
          width: 'auto',
          height: 'auto',
          clip: 'auto',
          outline: '2px solid',
          outlineColor: 'primary.main',
          textDecoration: 'none'
        }
      }}
    >
      Skip to main content
    </Box>
  );
} 