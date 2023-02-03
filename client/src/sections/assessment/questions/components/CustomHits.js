import { connectHits } from 'react-instantsearch-dom';
import { Typography, Box, Button, Divider } from '@mui/material';

const CustomHit = ({ hit, onHitSelect }) => {
  return (
    <Button
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        minWidth: 1,
        margin: '0 auto',
        borderRadius: 1,
        m: 2,
        listStyle: 'none',
      }}
      onClick={() => onHitSelect(hit)}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
        }}
      >
        <Typography variant="h6" gutterBottom component="div">
          {hit.standard_title}, {hit.jurisdiction.title}
        </Typography>
        <Typography variant="body2" gutterBottom component="div">
          {hit.description}
        </Typography>
      </Box>
      <Divider />
    </Button>
  );
};

const CustomHits = connectHits(CustomHit);

export default CustomHits;
