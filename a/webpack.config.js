var webpack = require("webpack"),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    klass = require('klass');

var WebpackConfig = klass({
    initialize: function(args) {
        if (typeof args.src !== 'string')
            throw new Error('WebpackConfig.src is not a valid path');
        this.__src = args.src;
        if (typeof args.dest !== 'string')
            this.__dest = path.join(this.__src, 'public');

        // Set configs
        this.entry = {};
        var entries = {
            app: path.join(this.__src, 'index.js'),
            sw: path.join(this.__src, 'sw.js')
        };
        _(entries).map(function(p, name) {
            if(fs.existsSync(p)) this.entry[name] = p;
        }.bind(this)).value();

        this.output = {
            path: path.join(this.__dest),
            filename: '[name].bundle.js',
            libraryTarget: 'this',
            recordsPath: path.join(this.__dest, 'webpack.records.json')
        };
        this.module = {};
        this.plugins = [];
        this.noInfo = true;
        this.colors = true;

        this.resolveLoader = {
            root: path.join(__dirname, '../node_modules'),
        };

        //Set other stuff
        this.useModule();
        this.useDedupePlugin();
        this.useIgnorePlugins();
        this.useUglifyJsPlugin();

    },
    useModule: function() {
        this.module = {
            // Disable handling of unknown requires
            unknownContextRegExp: /$^/,
            exprContextRegExp: /$^/,
            exprContextRecursive: false,
            unknownContextCritical: false,

            // Warn for every expression in require
            wrappedContextCritical: true,

            loaders: [
                // Pass *.jsx files through jsx-loader transform
                {
                    test: /components\/.*\.js$/,
                    loader: 'jsx-loader'
                }, {
                    test: /\.json$/,
                    loader: 'json-loader'
                }
            ],
            noParse: [/\.css$/]
        };
    },
    useIgnorePlugins: function() {
        this.plugins.push(
            new webpack.IgnorePlugin(/\.css$/),
            new webpack.optimize.OccurenceOrderPlugin(false /* preferEntry */ )
        );
    },
    useUglifyJsPlugin: function() {
        if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
            this.plugins.push(new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": JSON.stringify("production")
                }
            }), new webpack.optimize.UglifyJsPlugin());
        }
    },
    useDedupePlugin: function() {
        this.plugins.push(new webpack.optimize.DedupePlugin());
    }
});

module.exports = WebpackConfig;
