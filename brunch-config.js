exports.config = {
  paths: {
    watched: [ 'app/assets' ],
    public: 'public'
  },

  files: {
    javascripts: {
      joinTo: {
        'assets/vendor.js': /^(?!app)/,
        'assets/app.js': /^app\/assets/
      }
    },
    stylesheets: { joinTo: 'assets/app.css' }
  },

  plugins: {
    babel: {
      presets: ['es2015', 'react'],
      plugins: ['transform-object-rest-spread']
    },
    fingerprint: {
      autoClearOldFiles: true,
      srcBasePath: 'public/assets/',
      destBasePath: 'public/assets/',
      manifest: 'assets.json'
    },
    watcher: { // makes watcher work in Docker
      awaitWriteFinish: true,
      usePolling: true
    },
    autoReload: {
      enabled: true
    }
  },

  conventions: {
    assets: Function.prototype // you don't want to _just_ copy files from assets
  },

  modules: {
    nameCleaner: function (path) {
      return path.replace(/^app\/assets\//, '');
    }
  },

  npm: {
    globals: {
      React: 'react',
      ReactDOM: 'react-dom'
    }
  }
};