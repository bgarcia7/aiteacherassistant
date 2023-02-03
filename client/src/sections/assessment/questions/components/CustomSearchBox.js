import { connectSearchBox } from 'react-instantsearch-dom';
import { TextField } from '@mui/material';

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
  <TextField
    label="Search for any national learning objective or select from the suggestions below"
    variant="outlined"
    value={currentRefinement}
    onChange={(event) => refine(event.currentTarget.value)}
    fullWidth
  />
);

const CustomSearchBox = connectSearchBox(SearchBox);

export default CustomSearchBox;

//
