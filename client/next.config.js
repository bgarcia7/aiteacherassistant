const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
]);

module.exports = withTM({
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST
    HOST_API_KEY: 'https://api-dev-minimal-v4.vercel.app',

    // AUTH0
    AUTH0_DOMAIN: 'dev-lng23s6cjze2c0fq.us.auth0.com',
    AUTH0_CLIENT_ID: 'VsCl7COCCoKazUJzF0ESVxoHbFQnX20q',

    // ALGOLIA
    ALGOLIA_APP_ID: 'JZDWBAQ1E2',
    ALGOLIA_SEARCH_API_KEY: '2dacfa1aed04d6901e466487c8f1b140',
  },
});
