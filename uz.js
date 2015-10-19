var uz = root.uz = module.exports = require('fis');

uz.cli.name = 'uz';
uz.cli.info = uz.util.readJSON(__dirname + '/package.json');
uz.require.prefixes = ['uz', 'fis'];

uz.config.merge({
    images: '/images',
    css: '/css',
    js: '/js',
    pack:{
        // 打包不依赖模块加载的库文件
        '/js/pkg/lib.js': /\/js\/lib\/(.*)\.(js)$/i,
        // 打包纯js模块
        '/js/pkg/mods.js': /\/modules\/(.*)\.(js|coffee)$/i,
        // 打包widget模拟数据
        '/js/pkg/json.js': /\/(widget|pages)\/(.*\.(?:json.js))/i,
        // 打包页面和widget模块js文件
        '/js/pkg/page.js': /\/(widget|pages)\/(.*)\.(js|coffee)$/i,
        // 打包模板文件
        '/js/pkg/templates.js': /\/(widget|modules|pages)\/(.*)\.(jade)$/i,
        // 打包css文件
        '/css/home.css': '**.less'
    },
    project: {
        include: 'src/**',
        exclude: ['node_modules/**', 'dest/**', 'dist/**', '_build/**'],
        watch: {
            exclude: ['node_modules', /dest/]
        }
    },
    modules: {
        parser: {
            less: ['less-import', 'less'],
            jade: ['jade-runtime'],
            coffee: ['coffee-script']
        },
        postprocessor: {
            js: "jswrapper, require-async",
            html: "require-async"
        },
        // 因为路径的关系，暂时关闭autoload, simple插件
        // 需要手动维护index.html中的script.js, link.style
        postpackager: ['replace'], // 'autoload', 'simple',
        spriter: 'csssprites',
        lint: {
            js: 'jshint'
        }
    },
    settings: {
        parser: {
            jade: {
                pretty: true
            },
            "replace-path": {
                replace: {
                    "com": "mods"
                }
            },
            "less-import": {
                file: '/src/css/lib/base.less'
            },
            "jade-runtime": {
                pretty: true
            }
        },
        optimizer : {
            'clean-css' : {
                keepBreaks : true
            },
            'png-compressor' : {
                type : 'pngquant'
            }
        },
        spriter: {
            csssprites: {
                margin: 30,
                // layout: 'matrix'
            }
        },
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        },
        postpackager: {
            replace: {
                '/css/home.css': {
                    'url\\(/images/|gi': 'url(../images/',
                    'url\\(\'/images/|gi': 'url(\'../images/'
                }
            }
        },
        lint: {
            jshint: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                node: true
            }
        }
    },
    roadmap: {
        ext: {
            less: 'css',
            coffee: 'js'
        },
        path: [
            {
                reg: 'map.json',
                release: '/'
            },
            {
                reg: 'uzconfig.js',
                release: false
            },
            {
                reg: '**/package.json',
                release: false
            },

            // css/(lib|inc)/*.less
            {
                // 过滤 /css/(lib|inc)/ 目录下的less文件，不参与fis合并
                reg: /\/css\/(lib|inc)\/(.*)\.(less)$/i,
                release: false
            },

            // *.less
            {
                reg: '**.less',
                isCssLike: true,
                // useSprite: true
            },


            /**
             * Modules|Widget start ---
             * 一级同名组件，可以引用短路径
             * @target modules/foo/foo.js
             * @target widget/foo/foo.js
             * @example var foo = require('foo')
             */
            {
                reg: /\/modules\/([^\/]+)\/\1\.(js|coffee)$/i,
                isMod: true,
                id: '$1'
            },
            {
                reg: /\/widget\/([^\/]+)\/\1\.(js|coffee)$/i,
                isMod: true,
                id: '$1'
            },

            /**
             * modules|widget目录下的其他脚本文件
             * @target  modules/foo/bar.js
             * @target  widget/foo/bar.js
             * @example var bar = require('foo/bar')
             */
            {
                reg: /\/modules\/(.*)\.(js|coffee)$/i,
                isMod: true,
                id: '$1'
            },
            {
                reg: /\/widget\/(.*)\.(js|coffee)$/i,
                isMod: true,
                id: '$1'
            },

            /**
             * modules|widget的images目录作为公共图片资源目录
             * @target  modules/*.img
             * @target  widget/*.img
             */
            {
                reg: /\/modules\/(.*\.(?:png|jpg|jpeg))/i,
                release: '${images}/$1'
            },
            {
                reg: /\/widget\/(.*\.(?:png|jpg|jpeg))/i,
                release: '${images}/$1'
            },

            /**
             * modules|widget目录下的jade文件
             * @target  modules/*.jade
             * @target  widget/*.jade
             * @example var comment = require('/widget/comment/comment.jade')
             */
            {
                reg: /\/modules\/(.*)\.(jade)$/i,
                isJsLike: true,
                isMod: true,
                id: '$&'
            },
            {
                reg: /\/widget\/(.*)\.(jade)$/i,
                isJsLike: true,
                isMod: true,
                id: '$&'
            },


            /**
             * Pages start ---
             * @target  pages/init.js
             * @example var init = require('init') // => pages/init.js
             */
            {
                reg: /\/pages\/(init)\.js/i,
                isMod: true,
                id: '$1'
            },

            /**
             * @target  pages/id/id.js
             * @example var home = require('pages/home') // ==> pages/home/home.js
             */
            {
                reg: /\/pages\/([^\/]+)\/\1\.(js|coffee)$/i,
                //是组件化的，会被jswrapper包装
                isMod: true,
                id: 'pages/$1'
            },

            /**
             * pages目录下的其他脚本文件
             * @target  pages/foo/bar.js
             * @example var bar = b = require('pages/foo/bar') // => pages/foo/bar.js
             */
            {
                reg: /\/pages\/(.*)\.(js|coffee)$/i,
                isMod: true,
                id: 'pages/$1'
            },

            /**
             * pages目录下的jade文件
             * @target  pages/foo/foo.jade
             * @example var foo = require('/pages/comment/foo.jade')
             */
            {
                reg: /\/pages\/(.*)\.(jade)$/i,
                isJsLike: true,
                isMod: true,
                id: '$&'
            },

            /**
             * css目录下的静态资源，命中csssprite合并的图片
             */
            {
                reg: /\/css\/(.*\.(?:png|jpg|jpeg))/i,
                release: '${images}/pkg/$1'
            },

            // src目录下的其他文件
            {
                reg: /^\/src\/(.*)/i,
                release: '/$1',
            },

            // /dest
            {
                reg: /^\/dest\//i,
                release: false
            },
            {
                reg: '*',
                release: false
            }
        ]
    }
});
