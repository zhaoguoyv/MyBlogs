const Router = require('koa-router')
const router = new Router

router.get("/", async ctx =>{
	// 需要：title 
  await ctx.render("index", {
		title: "首页"
	})
})

// 动态路由，主要用来处理：用户登录及注册
router.get(/^\/user\/(?=reg|login)/, async ctx => {
	const show = /reg$/.test(ctx.path)
	await ctx.render("register", {show})
})

module.exports = router
