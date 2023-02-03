import React, { useState } from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import CustomHits from './CustomHits';
import CustomSearchBox from './CustomSearchBox';
import algoliasearch from 'algoliasearch';
import { Typography, Box, Button, Divider, Grid, IconButton } from '@mui/material';
import { ALGOLIA_API } from '../../../../config-global';
import DeleteIcon from '@mui/icons-material/Delete';

const SelectedHits = ({ selectedHits, onHitRemove }) => {
  return (
    <div>
      {selectedHits.map((hit) => (
        <Grid container>
          <Grid item xs={10}>
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
              variant="contained"
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
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Button onClick={() => onHitRemove(hit)}>
              <DeleteIcon />
            </Button>
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

const AlgoliaSearch = () => {
  const { appId, apiKey } = ALGOLIA_API;

  const searchClient = algoliasearch(appId, apiKey);

  // store the search results in state
  const [selectedHits, setselectedHits] = useState([]);

  const onHitSelect = (hit) => {
    setselectedHits([...selectedHits, hit]);
  };

  const onHitRemove = (hit) => {
    setselectedHits(selectedHits.filter((h) => h.objectID !== hit.objectID));
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="standards">
      <CustomSearchBox />
      {selectedHits.length > 0 && (
        <SelectedHits selectedHits={selectedHits} onHitRemove={onHitRemove} />
      )}
      <Hits hitComponent={(props) => <CustomHits {...props} onHitSelect={onHitSelect} />} />
    </InstantSearch>
  );
};

export default AlgoliaSearch;
