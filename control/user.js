const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/encrypt')

// 通过 db 对象创建操作 user 数据库的模型对象
const User = db.model("users", UserSchema)

// 用户注册
exports.reg = async ctx => {
	// 用户注册时 post 发过来的数据
	const user = ctx.request.body
	const username = user.username
	const password = user.password
	// 检测 username 是否存在
	await new Promise((resolve, reject) => {
		// 去 users 数据库查询
		User.find({username}, (err, data) => {
			// 如果出错返回错误
			if(err) return reject(err)
			// 如果已存在
			if(data.length !== 0){
				return resolve("")
			}
			// user 模型对象实例
			const _user = new User({
				username,
				password: encrypt(password)
			})
			// 保存到数据库
			_user.save((err, data) => {
				if(err){
					reject(err)
				}else{
					resolve(data)
				}
			})
		})
	})
	// 处理 resolve
	.then(async data => {
		if(data){
			await ctx.render("isOK", {
				status: "注册成功！"
			})
		}else{
			await ctx.render("isOK", {
				status: "用户名已存在！"
			})
		}
	})
	// 处理 reject
	.catch(async err => {
		await ctx.render("isOK", {
			status: "注册失败！"
		})
	})
}

// 用户登录
exports.login = async ctx => {
	const user = ctx.request.body
	const username = user.username
	const password = user.password

	await new Promise((resolve, reject) => {
		User.find({username}, (err, data) => {
			if(err) return reject(err)
			if(data.length === 0) return reject("用户名不存在")
			if(data[0].password === encrypt(password)){
				return resolve(data)
			}
			resolve("")
		})
	})
	.then(async data => {
		if(!data){
			return ctx.render('isOK', {
				status: "密码不正确！"
			})
		}
		// 保存 username 到 cookie
		ctx.cookies.set("username", username, {
			domain: "localhost",	// 设置 cookie 通用路由
			path: "/",
			maxAge: 36e5,	// 过期时间
			httpOnly: true,	// 不让前端操作 cookie
			overwrite: false,	// 是否可以覆盖
			// signed: true,	// 签名，为了数据安全
		})
		// 保存 数据库中_uid 到 cookie
		ctx.cookies.set("uid", data[0]._id, {
			domain: "localhost",	// 设置 cookie 通用路由
			path: "/",
			maxAge: 36e5,	// 过期时间
			httpOnly: true,
			overwrite: false,	// 是否可以覆盖
		})
		ctx.session = {	// 同时将数据保存到 session
			username,
			uid: data[0]._id,
			avatar: data[0].avatar,
		}
		await ctx.render("isOK", {
			status: "登陆成功！"
		})
	})
	.catch(async err => {
		await ctx.render("isOK", {
			status: "登录失败！"
		})
	})
}

exports.keepLog = async (ctx, next) => {
	// 如果前端 cookie 还在，但 session 已经过期
	if(ctx.session.isNew){
		if(ctx.cookies.get("username")){
			ctx.session = {
				username: ctx.cookies.get("username"),
				uid: ctx.cookies.get("uid"),
			}
		}
	}
	await next()
}

exports.logout = async ctx => {
	// 清空 session 和 cookie
	ctx.session = null
	ctx.cookies.set("username", null, {
		maxAge: 0
	})
	ctx.cookies.set("username", null, {
		maxAge: 0
	})
	ctx.redirect("/")
}