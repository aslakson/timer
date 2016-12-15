// Configuration file

/**
 * Gulp
 * => Paths
 * 'in' and 'out' keys are your input and output folders
 * e.g: 'in': './src/js/*.babel.js', 'out': './dist/js'
 */
const paths = {
  scss: {
    in: './src/scss/*.scss',
    out: './dist/css',
  },
  js: {
    entryFile: './src/js/index.js',
    in: './src/js/*.js',
    out: './dist/js',
  },
};

const server = {
  host: 'localhost',
  port: '8001',
};

exports.paths = paths;
exports.server = server;
