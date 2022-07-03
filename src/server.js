/* eslint-disable linebreak-style */
const Hapi = require('@hapi/hapi');
const { routes } = require('./routes');

const serverHost = {
  port: 5000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
};

const init = async () => {
  const server = Hapi.server({
    ...serverHost,
  });
  server.route(routes);
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};
init();
