//vi foo/index.js
var fis = module.exports = require('fis3');
fis.require.prefixes.unshift('uz');
fis.cli.name = 'uz';
fis.cli.info = require('./package.json');

// 排除某些文件
// set 为覆盖不是叠加
fis.set('project.ignore', ['node_modules/**', 'output/**', 'fis-conf.js', 'uzconfig.js', 'dest/**']);

// ======================== other ========================

fis.match(/^\/src\/(index)\.html/, {
    release: '/$1'
})

fis.match('*.{md, MD}', {
    release: false
})

fis.match('LICENSE', {
    release: false
})

fis.match('uzconfig.js', {
    release: false
})

fis.match(/\/pages\/(init)\.js/i, {
    id: 'init',
    isMod: true
})

fis.match('/css/{base,reset}.less', {
    release: false
})

fis.match('{aimee, package}.json', {
    release: false
})

fis.match('/css/{lib,inc}/*.less', {
    release: false
})


// ======================== less =========================
fis.match('*.less', {
    parser: [
        fis.plugin('less-preprocessor', {
            config: {
                id: 'src/css/common.less',
                import: '/src/modules/reset/reset.less'
            }
        }),
        fis.plugin('less-import', {
            file: [
                '/src/css/base.less',
                '/src/modules/base/base.less'
            ]
        }),
        fis.plugin('less')
    ],
    rExt: '.css'
})

fis.match('*.{css,less}', {
    useHash: true,
    optimizer: fis.plugin('clean-css', {
        keepBreaks : true
    })
})

// 用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用。
fis.match('reset.less', {
    packTo: 'home.css',
    packOrder: -100
})
// ======================== image ========================

// 所有图片加 hash
fis.match('image', {
    useHash: true
})

fis.match(/\/modules\/(.*\.(?:png|jpg|jpeg|gif|svg))/i, {
    release: 'images/$1'
})

fis.match(/\/widget\/(.*\.(?:png|jpg|jpeg|gif|svg))/i, {
    release: 'images/$1'
})

fis.match('*.png', {
    optimizer: fis.plugin('png-compressor', {
        type : 'pngquant'
    })
})

// ======================== jade =========================

fis.match('*.jade', {
    parser: fis.plugin('jade-runtime', {
        pretty: true
    }),
    rExt: '.js',
    isMod: true,
    wrap: false
})

// ======================== js ===========================

fis.match('*.js', {
    isMod: true,
    // useHash: true,
    optimizer: fis.plugin('uglify-js')
})

fis.match('js/lib/*.js', {
    wrap: false
})

fis.match('/{modules,widget}/**.js', {
    moduleId: '$1'
})

// 同名短位id pages
fis.match(/\/pages\/([^\/]+)\/\1\.(js|coffee|es6)$/, {
    id: 'pages/$1',
    isMod: true
})

// pages/app/app.json
fis.match(/\/pages\/(.*)\.(cson|json)$/i, {
    id: 'pages/$2',
    isMod: true,
    important: true
})

// modules, widget
fis.match(/\/modules\/(.*)\.(cson|json)$/i, {
    id: '$&',
    isMod: true
})

// modules, widget
fis.match(/\/widget\/(.*)\.(cson|json)$/i, {
    id: '$1',
    isMod: true
})

// modules, widget
fis.match(/\/modules\/(.*)\.(js|coffee|es6)$/i, {
    id: '$1',
    isMod: true
})
// modules, widget
fis.match(/\/widget\/(.*)\.(js|coffee|es6)$/i, {
    id: '$1',
    isMod: true
})

// 同名短位id modules, widget
fis.match(/\/modules\/([^\/]+)\/\1\.(js|coffee|es6)$/, {
    id: '$1',
    isMod: true
})

// 同名短位id modules, widget
fis.match(/\/widget\/([^\/]+)\/\1\.(js|coffee|es6)$/, {
    id: '$1',
    isMod: true
})

fis.hook('commonjs', {
    baseUrl: './src',
    paths: {
        $: '/modules/zepto/zepto.js'
    }
});

fis.match('/{modules,widget}/**', {
    useSameNameRequire: true
});


// ======================== post =========================

// // 假设以纯前端（没有后端模板）的项目为例，对于依赖组件的加载就靠插件 fis3-postpackager-loader 。
// // 其是一种基于构建工具的加载组件的方法，构建出的 html 已经包含了其使用到的组件以及依赖资源的引用。
// fis.match('::package', {
//     postpackager: fis.plugin('loader', {})
// });

fis.media('debug').match('*.{js,css,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
})

// // 启用 fis-spriter-csssprites 插件
// fis.match('::package', {
//   spriter: fis.plugin('csssprites')
// })
//
// // 对 CSS 进行图片合并
// fis.match('*.css', {
//   // 给匹配到的文件分配属性 `useSprite`
//   useSprite: true
// });
// CssSprites 详细配置参见 fis-spriter-csssprites


// pack
fis
    // 启用打包插件，必须匹配 ::package
    .match('::package', {
        packager: fis.plugin('map')//,
        // spriter: fis.plugin('csssprites', {
        //     layout: 'matrix',
        //     margin: '15'
        // })
    })
    .match('*.{css,less}', {
        packTo: '/css/home.css'
    })
    .match('*.js', {
        packTo: '/js/pkg/lib.js'
    })
    .match(/\/(modules|widget|pages)\/(.*)\.(js)$/, {
        packTo: '/js/pkg/app.js'
    })
    .match(/\/(modules|widget|pages)\/(.*)\.(jade)$/, {
        packTo: '/js/pkg/template.js'
    })
    .match('*.json.js', {
        packTo: '/js/pkg/json.js'
    })
