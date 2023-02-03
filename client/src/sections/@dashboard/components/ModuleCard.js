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
import { useMemo, useState } from 'react';
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
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [text, setText] = useState('');

  const id1 = useRandomId();

  // const update = () => {
  //   console.log('update was called from ModuleCard');

  //   const newModule = {
  //     title: title,
  //     body: text,
  //     id: module.id,
  //   };
  //   updateModule(newModule);
  // };

  const handleEditClick = () => {
    setText(module.body);
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

  const cutText = (text) => {
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

  const handleDeleteClick = async () => {
    console.log('Handle delete');
  };

  // useEffect(() => {
  //   console.log('I was called');
  //   update();
  // }, [text]);

  return (
    <Card>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={isEditing ? handleSaveClick : handleEditClick}>
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        }
        title={module.title}
        subheader={module.description}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {isEditing ? (
            <Box>
              <textarea
                rows="4"
                cols="50"
                value={module.body}
                onChange={handleTextEdit}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'inherit',
                }}
              ></textarea>
            </Box>
          ) : expanded ? (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              {module.body.split('\n').map((splitText, i) => (
                <Typography paragraph key={i}>
                  {splitText}
                </Typography>
              ))}
            </Collapse>
          ) : (
            <>
              {cutText(module.body)
                .split('\n')
                .map((splitText, i) => (
                  <Typography paragraph key={i}>
                    {splitText}
                  </Typography>
                ))}
            </>
          )}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="regenerate" onClick={handleRegenerateClick}>
          <SyncIcon />
        </IconButton>
        <IconButton aria-label="share" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          data-for={id1}
          data-tip="Event Organizer"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
}

function useRandomId() {
  const randomId = useMemo(() => {
    return '_' + Math.random().toString(36).slice(2, 9);
  }, []);

  return randomId;
}
