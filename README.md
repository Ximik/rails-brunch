# Rails with Brunch
Skeleton React application with Rails 5 and [Brunch](http://brunch.io/) without Sprockets with step-by-step guide.

## Usage

Start brunch in development mode with watcher and [autoreload](https://github.com/brunch/auto-reload-brunch)
```sh
$ ./node_modules/.bin/brunch watch
```

Compile assets for production
```sh
$ ./node_modules/.bin/brunch build --production
```

## Step-by-step creation

### Create Rails app
```sh
$ rails new rails_brunch --skip-sprockets --skip-javascript --skip-listen --skip-javascript --skip-turbolinks
```

### Install npm packages
```sh
$ npm init
$ npm install --save react react-dom
$ npm install --save-dev brunch babel-brunch auto-reload-brunch babel-brunch babel-plugin-transform-object-rest-spread babel-preset-es2015 babel-preset-react fingerprint-brunch postcss-brunch
```

### Create brunch configuration file
`brunch-config.js`
```js
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
```

### Create initializer
Rails app should somehow know the path to compiled assets. So here we add initializer which reads the fingerprint manifest file in production.

`config/initializers/assets_manifest.rb`
```ruby
class AssetsManifest
  def self.manifest
    if Rails.env.production?
      @manifest ||= JSON.parse(File.read("assets.json"))
    end
  end

  def self.asset_path(url)
    if manifest
      manifest[url] || url
    else
      url
    end
  end
end
```

### Add Rails helpers
`app/helpers/assets_helper.js`
```ruby
module AssetsHelper
  def compute_asset_path(source, options={})
    source = AssetsManifest.asset_path(source)
    return File.join('/assets', source)
  end
end
```

`app/helpers/react_helper.rb`
```ruby
module ReactHelper
  def react_component(name, props = {}, &block)
    content = block_given? ? capture(&block) : ''
    js = javascript_tag "document.addEventListener('DOMContentLoaded', function () {
                          ReactDOM.render(
                            React.createElement(
                              require('#{name}').default,
                              #{props.to_json}
                            ),
                            document.getElementById('react_component')
                          );
                        });"
    js + content_tag(:div, content, id: 'react_component')
  end
end
```