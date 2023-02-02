import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

const AlgoliaSearch = () => {
  const searchClient = algoliasearch('JZDWBAQ1E2', '2dacfa1aed04d6901e466487c8f1b140');

  return (
    <InstantSearch searchClient={searchClient} indexName="demo_ecommerce">
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
};

export default AlgoliaSearch;
