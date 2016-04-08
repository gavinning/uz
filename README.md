#UZ

[Aimee](https://github.com/Aimeejs/aimee)框架御用构建工具
前端构建工具，基于[fis3](https://github.com/fex-team/fis)封装，[fis官方文档](https://github.com/fex-team/fis/wiki)  


#### Install
```
npm install -g uz
```


#### 帮助文档
如需详细文档请参照 [fis](https://github.com/fex-team/fis)
```
uz -h
```

#### 常用命令
```
// 查看测试服务器相关帮助
uz server -h

// 启动测试服务器
uz server start

// 清理测试服务器
uz server clean

// 停止测试服务器
uz server stop

// 重启测试服务器
uz server restart

// 合并编译
uz release -p

// 监听项目文件并自动刷新浏览器
uz release -pwL

// 合并压缩编译到 dev 配置
uz release -pod dev

// 刷新缓存
uz release -pc
```
