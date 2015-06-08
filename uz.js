var fis = module.exports = require('fis');

fis.cli.name = 'uz';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');
fis.require.prefixes = ['uz', 'fis'];

fis.config.merge({
	csslib: '/css/lib',
	statics: '/static',
	pack:{
		'css/home.css': ['**.less']
	},
	project: {
		exclude: ['node_modules/**', 'dest/**', 'dist/**', '_build/**'],
		watch: {
			exclude: ['node_modules', /dest/]
		}
	},
	modules: {
		parser: {
			less: ['less-import', 'less'],
			jade: ['replace-path', 'jade']
		},
		postprocessor: {
			js: "jswrapper, require-async",
			html: "require-async"
		},
		postpackager: ['autoload', 'simple'],
		spriter: 'csssprites',
		lint: {
			js: 'jshint'
		}
	},
	roadmap: {
		ext: {
			less: 'css',
			jade: 'html'
		},
		path: [
			{
				reg: 'uzconfig.js',
				release: false
			},
			{
				// 涉及less合并先后顺序
				// 不处理css/lib下的less文件，由common.less或home.less使用import语法加载
				reg: /\/css\/lib\/(.*)\.(less)$/i,
				release: false
			},
			{
				// 涉及less合并先后顺序
				// 不处理css/lib下的less文件，由common.less或home.less使用import语法加载
				reg: /\/css\/inc\/(.*)\.(less)$/i,
				release: false
			},
			{
				// widget目录下的其他脚本文件
				reg: /\/widget\/(.*)\.(js)$/i,
				// 是组件化的，会被jswrapper包装
				isMod: true,
				// id是去掉widget和.js后缀中间的部分
				id: '$1',
				release: '${statics}/$&'
			},
			{
				reg: /^\/src\/(.*)/i,
				release: '/$1',
				useStandard: false
			},
			{
				reg: /^\/dest\//i,
				release: false
			},
			{
				reg: 'readme.md',
				release: false
			}
		]
	},
	settings: {
		parser: {
			jade: {
				pretty: true
			},
			"replace-path": {
				replace: {
					"com": "Modules"
				}
			},
			"less-import": {
				file: 'src/css/lib/base.less'
			}
		},
		spriter: {
			csssprites: {
				scale: 0.5,
				margin: 20
			}
		},
		postprocessor: {
			jswrapper: {
				type: 'amd'
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
	}
});