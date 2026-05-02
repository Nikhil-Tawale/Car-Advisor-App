import Hapi from '@hapi/hapi';
import shortlistRoutes from './routes/shortlist';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5001,
    host: '0.0.0.0',
    routes: { cors: { origin: ['*'] } }
  });

  server.route(shortlistRoutes);
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
