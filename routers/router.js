const Router = require('koa-router')
const user = require('../control/user')
const article = require('../control/article')

const router = new Router

router.get("/", user.keepLog, article.getList)

// 动态路由，主要用来处理用户登录及注册
router.get(/^\/user\/(?=reg|login)/, async ctx => {
	// show 为 true 时注册，为 false 是登录
	const show = /reg$/.test(ctx.path)
	await ctx.render("register", {show})
})

// 处理用户登录的 post
router.post("/user/login", user.login)

// 处理用户注册的 post
router.post("/user/reg", user.reg)

// 处理用户登出的 get
router.get("/user/logout", user.logout)

// 文章添加页面 get
router.get("/article", user.keepLog, article.addPage)

// 文章添加页面 post
router.post("/article", user.keepLog, article.add)

// 文章分页动态路由，经典在于有请求再去数据库取值
router.get("/page/:id", article.getList)

module.exports = router
