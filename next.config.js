const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboards',
        destination: '/dashboards/crypto',
        permanent: true,
      },
    ];
  },
};

module.exports = withImages({
  redirects, 
  env: {
    BE_URL: process.env.BE_URL,
    API_URL: process.env.API_URL,
    IMAGE_PATH: process.env.IMAGE_PATH,
    ENV: process.env.ENV,
  },
});
