import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useState } from 'react';
// API calls
import LoadingIcon from 'src/components/loading-screen/LoadingIcon';
import { deleteModule, regenerateModuleBody } from 'src/pages/api/Lesson';
import { useSnackbar } from '../../../components/snackbar';

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

export default function ModuleCard({ module, refreshLessonPlan }) {
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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
    enqueueSnackbar('Regenerating module, this may take up to a minute');
    try {
      setAnchorEl(null);
      setIsRegenerating(true);
      const response = await regenerateModuleBody(module.id);
      console.log('Regenerated', response);
      await refreshLessonPlan();
    } catch (err) {
      console.log('Error regenerating module: ', err);
      enqueueSnackbar('Failed to regenerate module, please try again later');
    }
    setIsRegenerating(false);
  };

  const handleDeleteClick = async () => {
    try {
      console.log('Deleting module', module.id);
      const response = await deleteModule(module.id);
      console.log('Deleted', response);
      refreshLessonPlan();
    } catch (err) {
      console.log('Error regenerating module: ', err);
      enqueueSnackbar('Failed to delete module, please try again later');
    }
    console.log('Handle delete');
  };

  const handleMoreOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   console.log('I was called');
  //   update();
  // }, [text]);

  let content = (
    <>
      {cutText(module.body)
        .split('\n')
        .map((splitText, i) => (
          <Typography paragraph key={i}>
            {splitText}
          </Typography>
        ))}
    </>
  );

  if (isRegenerating) {
    content = (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <LoadingIcon />
      </div>
    );
  } else if (isEditing) {
    content = (
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
    );
  } else if (expanded) {
    content = (
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {module.body.split('\n').map((splitText, i) => (
          <Typography paragraph key={i}>
            {splitText}
          </Typography>
        ))}
      </Collapse>
    );
  }

  return (
    <Card>
      <CardHeader
        action={
          <>
            <IconButton aria-label="more options" onClick={handleMoreOptionsClick}>
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleRegenerateClick} disabled={isRegenerating}>
                Regenerate Module
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
          </>

          // <IconButton aria-label="settings" onClick={isEditing ? handleSaveClick : handleEditClick}>
          //   {isEditing ? <SaveIcon /> : <EditIcon />}
          // </IconButton>
        }
        title={module.title}
        subheader={module.description}
      />
      <CardContent onClick={handleExpandClick}>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="regenerate" onClick={handleRegenerateClick}>
          <SyncIcon />
        </IconButton>
        <IconButton aria-label="share" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton> */}
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
