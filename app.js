const { join } = require('path')

const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/router')
const logger = require('koa-logger')
const koaBody = require('koa-body')

// 生成 Koa 实例
const app = new Koa

// 注册日志模块
app.use(logger())
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
