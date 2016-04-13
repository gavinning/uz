var fis, url;

url = process.cwd();
fis = module.exports = require('fis3');
fis.cli.name = 'uz';
fis.require.prefixes.unshift('uz');
fis.cli.info = require('./package.json');
// 排除某些文件
// set 为覆盖不是叠加
fis.set('project.ignore', ['node_modules/**', 'output/**', 'fis-conf.js', 'uzconfig.js', 'dest/**'])

// ======================== other ========================

// For index.html
.match(/^\/src\/(index)\.html/, {
    release: '/$1'
})

// Filter files
// aimee.json
// bower.json
// package.json
// fis-conf.js
// uzconfig.js
// gruntfile.js
// gulpfile.js
// LICENSE
.match(/.*\.md|(aimee|package|test|bower).json|(uzconfig|fis-conf|gruntfile|gulpfile).js|node_modules|LICENSE/i, {
    release: false
})

.match(/\/css\/(lib|inc)\/(.*)(less|css)/, {
    release: false
})

// ======================== less =========================

.match('*.less', {
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

// 样式采用keepBreaks模式进行压缩
.match('*.{css,less}', {
    optimizer: fis.plugin('clean-css', {
        keepBreaks : true
    })
})

// 用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用。
.match('common.less', {
    packTo: '/css/home.css',
    packOrder: -100
})

// 已在common.less中自动添加reset.less, 程序不再合并reset.less
.match('reset.less', {
    packTo: null,
    packOrder: -100
})

// ======================== image ========================

// 默认所有图片产出到 images 目录下
.match(/\/images\/(.*\.(?:png|jpg|jpeg|gif|svg|webp))/i, {
    release: 'images/$1'
})

// modules 下的图片资源产出到 images 目录下
.match(/\/modules\/(.*\.(?:png|jpg|jpeg|gif|svg|webp))/i, {
    release: 'images/$1'
})

// widget 下的图片资源产出到 images 目录下
.match(/\/widget\/(.*\.(?:png|jpg|jpeg|gif|svg|webp))/i, {
    release: 'images/$1'
})

// pages 下的图片资源产出到 images 目录下
// 不推荐在虚拟页里放置多媒体资源，建议放到app目录下或放置在/images目录下
.match(/\/pages\/(.*\.(?:png|jpg|jpeg|gif|svg|webp))/i, {
    release: 'images/pages/$1'
})

// 所有 png 执行压缩
.match('*.png', {
    optimizer: fis.plugin('png-compressor', {
        type : 'pngquant'
    })
})

// ======================== js ===========================

// 所有 jade 模板执行 runtime 编译
.match('*.jade', {
    parser: fis.plugin('jade-runtime', {
        pretty: true
    }),
    rExt: '.js',
    isMod: true,
    wrap: false,
})

// js 文件默认打包到 lib.js
.match('*.js', {
    isMod: true,
})

// js/lib 下的js文件不执行define包装
.match('js/lib/*.js', {
    wrap: false
})

// pages 目录下的其他js
.match(/\/pages\/(.*)\.(js|coffee|es6)$/i, {
    id: 'pages/$1',
    isMod: true
})

// modules 目录下的其他js
.match(/\/modules\/(.*)\.(js|coffee|es6)$/i, {
    id: '$1',
    isMod: true
})

// widget 目录下的其他js
.match(/\/widget\/(.*)\.(js|coffee|es6)$/i, {
    id: '$1',
    isMod: true
})

// 同名短位id pages
.match(/\/pages\/([^\/]+)\/\1\.(js|coffee|es6)$/, {
    id: 'pages/$1',
    isMod: true
})

// 同名短位id modules
.match(/\/modules\/([^\/]+)\/\1\.(js|coffee|es6)$/, {
    id: '$1',
    isMod: true
})

// 同名短位id widget
.match(/\/widget\/([^\/]+)\/\1\.(js|coffee|es6)$/, {
    id: '$1',
    isMod: true
})

.match(/\/pages\/(init)\.js/i, {
    id: 'init',
    isMod: true
})

// 使用commonjs标准
.hook('commonjs', {
    baseUrl: './src',
    paths: {
        $: '/modules/zepto/zepto.js'
    }
})

// ======================== es6 ==========================

.set('project.fileType.text', 'es6')

.match('*.es6', {
    rExt: '.js',
    parser: fis.plugin('es6-babel', {})
})

// ======================== pack =========================

// 开启同名依赖
.match('/{modules,widget}/**', {
    useSameNameRequire: true
})

.match('*.{css,less}', {
    packTo: '/css/home.css'
})

// js 文件默认打包到 lib.js
.match('*.js', {
    packTo: '/js/pkg/lib.js'
})

// 打包功能
.match(/\/(modules|widget|pages)\/(.*)\.(js|coffee|es6)$/, {
    packTo: '/js/pkg/mods.js'
})

// 打包模板
.match('*.jade', {
    packTo: '/js/pkg/templates.js',
})

// 单独打包首页
.match(/\/pages\/home\/(.*)\.(js|jade|coffee|es6)$/, {
    packTo: '/js/pkg/page.js'
})

// 打包模拟数据
.match('*.json.js', {
    packTo: '/js/pkg/json.js'
})

// ======================== post =========================

// // 假设以纯前端（没有后端模板）的项目为例，对于依赖组件的加载就靠插件 fis3-postpackager-loader 。
// // 其是一种基于构建工具的加载组件的方法，构建出的 html 已经包含了其使用到的组件以及依赖资源的引用。
// fis.match('::package', {
//     postpackager: fis.plugin('loader', {})
// });


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
// 启用打包插件，必须匹配 ::package
.match('::package', {
    packager: fis.plugin('map')//,
    // spriter: fis.plugin('csssprites', {
    //     layout: 'matrix',
    //     margin: '15'
    // })
})

.match('**', {
    deploy: [
        fis.plugin('skip-packed'),
        fis.plugin('local-deliver', {
            to: require('path').join(process.env.HOME, '.uz-tmp/www')
        })
    ]
})

// ======================== 环境配置 =========================

// For dest
fis.media('dest').match('*.js', {
    optimizer: fis.plugin('uglify-js'),
})

fis.media('dest').match('**', {
    deploy: [
        fis.plugin('skip-packed'),
        fis.plugin('local-deliver', {
            to: require('path').join(url, 'dest')
        })
    ]
})
