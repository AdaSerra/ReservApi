import path from 'path'
import CopyWebpackPlugin from'copy-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    index: './frontend/src/index.js',
    admin: './frontend/src/admin.js',
    login: './frontend/src/login.js'
  }, 
  output: {
    filename: 'bundle.[name].js',
    path: path.resolve(__dirname, 'dist') 
  },
  mode: "development",
  devtool: "source-map",
  plugins:[
    new CopyWebpackPlugin({
      patterns: [
       { from: 'frontend/src/**.css', to: '[name][ext]' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader', 
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'] 
          }
        }
      },

    ]
  },

};
