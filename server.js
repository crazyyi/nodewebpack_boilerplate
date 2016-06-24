const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.base');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer();
const io = require('socket.io')(server);
const port = 9999;
const devPort = port - 1;
const domain = 'http://127.0.0.1:' + devPort;

const devServer = new WebpackDevServer(webpack({
  devtool: 'eval',
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      `webpack-dev-server/client?${domain}`,
      config.entry.main
    ]
  },
  output: config.output,
  plugins: config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]),
  module: config.module,
  resolve: config.resolve,
}), {
  publicPath: `${domain}/`,
  hot: true,
  historyApiFallback: true,
  port: devPort,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
});

io.on('connection', function(socket) {
	socket.on('send coordinates', function(data) {
		socket.emit('hello');
	});
});

app.use('/static', express.static(__dirname + '/media'));
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.end(
	    fs.readFileSync('./public/index.html')
	      .toString()
	      .replace(/\.\/dist\//g, `${domain}/`)
	  );
});


app.listen(port, function() {
	console.log('Server is running on port', port);
});

devServer.listen(devPort);
