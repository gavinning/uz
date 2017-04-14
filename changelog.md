v1.2.5
---
* 替换``fis-parser-less-import``依赖为``fis-parser-import`` 支持stylus
* 因Nodejs7.x兼容原因，暂时停用sprites功能

v1.2.3
---
* 支持stylus
* csssprites支持rem单位

v1.2.1
---
* Fixbug 添加``fis3-hook-relative``插件，默认构建为相对路径，修正font字体相关样式构建后没有被替换为相对路径的问题
* 关闭``fis-postpackager-replace``插件，路径替换由``fis3-hook-relative``支持
