import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SyncIcon from '@mui/icons-material/Sync';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box } from '@mui/system';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ModuleCard() {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [objectiveText, setObjectiveText] = useState(
    'Objective: Students will understand the basic concepts of chemistry and its role in our daily lives.'
  );

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setIsEditing(!isEditing);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleTextEdit = (e) => {
    setObjectiveText(e.target.value);
  };

  return (
    <Card
      
    >
      <CardHeader
        action={
          <IconButton aria-label="settings">
            {isEditing ? (
              <SaveIcon onClick={handleSaveClick} />
            ) : (
              <EditIcon onClick={handleEditClick} />
            )}
          </IconButton>
        }
        title="Introduction to Chemistry"
        subheader="Core Objective"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {isEditing ? (
            <Box>
              <textarea
                rows="4"
                cols="50"
                value={objectiveText}
                onChange={handleTextEdit}
                style={{
                  width: '100%',
                  resize: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'inherit',
                }}
              ></textarea>
            </Box>
          ) : (
            objectiveText
          )}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <SyncIcon />
        </IconButton>
        <IconButton aria-label="share">
          <DeleteIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Introduction (10 minutes):</Typography>
          <Typography paragraph>
            Show pictures of everyday items (e.g. food, cleaning products) and ask students if they
            know what they have in common.
          </Typography>
          <Typography paragraph>
            Write their responses on the board and discuss the presence of chemicals in the items.
          </Typography>
          <Typography paragraph>
            Introduce the topic of chemistry as the study of chemicals and their properties.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
