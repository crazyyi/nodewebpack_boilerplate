const path = require('path');
const express = require('express');
const app = express();
app.isDeveloping = process.env.NODE_ENV !== 'production';

const helmet = require('helmet');
app.use(helmet());

if (app.isDeveloping) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.base');
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
  // app.use(express.static(__dirname + '/dist'));
  app.disable('x-powered-by');
  console.log('Using production build');
}

const port = app.isDeveloping ? 8080 : process.env.PORT;

app.listen(port, () => {
  console.log("Starting server at port ", port);
})

export default app;
