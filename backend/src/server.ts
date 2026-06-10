import Hapi from '@hapi/hapi';
import inert from '@hapi/inert';          // <-- new
import path from 'path';                  // <-- new
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

  // CATCH‑ALL: serve the built React frontend (from ../frontend/dist)
  server.route({
    method: 'GET',
    path: '/{param*}',                     // any path not matched by previous routes
    handler: {
      directory: {
        // Adjust this path: from backend/src/ go up two levels to project root,
        // then into frontend/dist
        path: path.join(process.cwd(), 'frontend/dist'),
        redirectToSlash: true,
        index: true
      }
    }
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();