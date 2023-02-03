import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch';
import { ALGOLIA_API } from '../../../../config-global';

const AlgoliaSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = ALGOLIA_API;
  console.log('ALGOLIA_APP_ID', ALGOLIA_APP_ID);

  const searchClient = algoliasearch('JZDWBAQ1E2', '2dacfa1aed04d6901e466487c8f1b140');

  return (
    <InstantSearch searchClient={searchClient} indexName="demo_ecommerce">
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
};

export default AlgoliaSearch;
