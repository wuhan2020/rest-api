# NodeTS LeanCloud

基于 [Koa][1]、[TypeScript][2] 和 [LeanCloud][3] 的 **Node.js 后端**项目脚手架

[![NPM Dependency](https://david-dm.org/TechQuery/NodeTS-LeanCloud.svg)][4]

## 主要特性

1. [LeanCloud 手机短信验证码登录](source/controller/Session.ts)
2. [角色管理](source/controller/Role.ts)
3. [用户管理](source/controller/User.ts)
4. [文件管理](source/controller/File.ts)

## 环境变量

|     变量名     |         作用         |
| :------------: | :------------------: |
| `ROOT_ACCOUNT` | 超级管理员（手机号） |

## 本地开发

```shell
npm install

lean login
lean switch
lean up
```

[1]: https://koajs.com/
[2]: https://www.typescriptlang.org/
[3]: https://leancloud.cn/
[4]: https://david-dm.org/TechQuery/NodeTS-LeanCloud
