module.exports = {
  entry: [
    './src/start.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'main.js'
  },
  module: {
    rules: [
        {
        }
    ],
    loaders: [
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015', 'stage-1']
            }
        }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
