const paths = {
  html: {
    in: './src/index.html',
    out: './docs',
  },
  scss: {
    in: './src/scss/*.scss',
    out: './docs/css',
  },
  js: {
    entryFile: './src/js/index.js',
    in: './src/js/*.js',
    out: './docs/js',
  },
};

const server = {
  host: 'localhost',
  port: '8001',
};

exports.paths = paths;
exports.server = server;
