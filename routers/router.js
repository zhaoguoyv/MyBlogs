const Router = require('koa-router')
const user = require('../control/user')

const router = new Router

router.get("/", async ctx =>{
	// 需要：title 
  await ctx.render("index", {
		title: "首页",
	})
})

// 动态路由，主要用来处理用户登录及注册
router.get(/^\/user\/(?=reg|login)/, async ctx => {
	// show 为 true 时注册，为 false 是登录
	const show = /reg$/.test(ctx.path)
	await ctx.render("register", {show})
})

// 处理用户登录的 post
router.post("/user/login", async ctx => {
	const data = ctx.request.body
})

// 处理用户注册的 post
router.post("/user/reg", user.reg)

module.exports = router
