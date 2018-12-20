const { join } = require('path')

const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/router')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const session = require('koa-session')

// 生成 Koa 实例
const app = new Koa
// koa-session所需
app.keys = ['zgy cool']
// session 配置对象
const CONFIG = {
  key: "Sid",
  maxAge: 36e5,  // 过期时间
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,  // 每操作一次就重新开始计时
}

// 注册日志模块
app.use(logger())
// 注册 session
app.use(session(CONFIG, app))
// 配置 koa-body 处理 post 请求
app.use(koaBody())
// 配置静态资源目录
app.use(static(join(__dirname, "public")))
// 配置视图模板引擎及目录
app.use(views(join(__dirname, "views"), {
  extension: "pug"
}))

// 注册路由信息
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000, () => {
    console.log("正在监听3000端口...")
  })
