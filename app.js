const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.base');
const path = require('path');
const express = require('express');
const app = express();
const io = require('socket.io')(server);
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 9999 : process.env.PORT;
const domain = '0.0.0.0';

export const server = app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  // console.info(server.address());
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.use('/static', express.static(__dirname + '/media'));
  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  console.log('Using production build');
}

io.on('connection', function(socket) {
	socket.on('send coordinates', function(data) {
		socket.emit('hello');
	});
});

