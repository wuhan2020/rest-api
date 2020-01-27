# 援助武汉 RESTful API

基于 [Koa][1]、[TypeScript][2] 和 [LeanCloud][3] 的 **Node.js 后端**项目脚手架

[![NPM Dependency](https://david-dm.org/wuhan2020/rest-api.svg)][4]
[![Build Status](https://travis-ci.com/wuhan2020/rest-api.svg?branch=master)][5]

## 主要特性

1. [LeanCloud 手机短信验证码登录](source/controller/Session.ts)
2. [角色管理](source/controller/Role.ts)
3. [用户管理](source/controller/User.ts)
4. [文件管理](source/controller/File.ts)
5. [物资需求管理](source/controller/SuppliesRequirement.ts)

## 环境变量

|     变量名     |         作用         |
| :------------: | :------------------: |
| `ROOT_ACCOUNT` | 超级管理员（手机号） |

## 本地开发

1. 注册 [LeanCloud][3] 账号后，发邮件给 shiy2008@gmail.com 申请协作权限

2. 安装 [LeanCloud CLI](https://leancloud.cn/docs/leanengine_cli.html#hash1443149115)

3. 安装 [Node.js](https://nodejs.org/en/download/package-manager/)

4. `git clone https://github.com/wuhan2020/rest-api.git`

5. 在本项目文件夹执行安装命令，并登录 LeanCloud 账号，再切换到 `WuHan-2020` 应用后启动

```shell
npm install

lean login
lean switch
lean up
```

6. 建议安装 [NIM 调试扩展](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj)

[1]: https://koajs.com/
[2]: https://www.typescriptlang.org/
[3]: https://leancloud.cn/
[4]: https://david-dm.org/wuhan2020/rest-api
[5]: https://travis-ci.com/wuhan2020/rest-api
