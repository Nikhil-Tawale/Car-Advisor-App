import Hapi from '@hapi/hapi';
import inert from '@hapi/inert';
import path from 'path';
import shortlistRoutes from './routes/shortlist';

const init = async () => {
  const server = Hapi.server({
    port: 5001,
    host: '0.0.0.0',
    routes: { cors: { origin: ['*'] } }
  });

  // Register the static files plugin
  await server.register(inert);

  // YOUR API ROUTE
  server.route(shortlistRoutes);

  // CATCH-ALL: serve the built React frontend (from ../frontend/dist)
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        // Resolve path correctly: from process.cwd() (backend), go to frontend/dist
        path: path.join(__dirname, '../../frontend/dist'),
        redirectToSlash: true,
        index: true
      }
    }
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});