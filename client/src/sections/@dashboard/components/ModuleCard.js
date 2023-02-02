import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import SyncIcon from '@mui/icons-material/Sync';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
// API calls
import { regenerateModuleBody } from 'src/pages/api/Lesson';

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

export default function ModuleCard({ module, updateModule }) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(module.body);
  const [title, setTitle] = useState(module.title);

  const update = () => {
    console.log('update was called from ModuleCard');

    const newModule = {
      title: title,
      body: text,
      id: module.id,
    };
    updateModule(newModule);
  };

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
    setText(e.target.value);
  };

  const handleTextCut = (text) => {
    const maxLength = 300;
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    } else {
      return text;
    }
  };

  const handleRegenerateClick = async () => {
    console.log('I was clicked');
    const response = await regenerateModuleBody(module.id);
    setText(response.body);
    console.log(response);
  };

  useEffect(() => {
    console.log('I was called');
    update();
  }, [text]);

  return (
    <Card>
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
        title={title}
        subheader={module.description}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {isEditing ? (
            <Box>
              <textarea
                rows="4"
                cols="50"
                value={text}
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
          ) : expanded ? (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Typography paragraph>{text}</Typography>
            </Collapse>
          ) : (
            <Typography paragraph>{handleTextCut(text)}</Typography>
          )}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="regenerate">
          <SyncIcon onClick={handleRegenerateClick} />
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
    </Card>
  );
}
