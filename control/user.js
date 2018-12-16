const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/encrypt')

// 通过 db 对象创建操作 user 数据库的模型对象
const User = db.model("users", UserSchema)

exports.reg = async ctx => {
	// 用户注册时 post 发过来的数据
	const user = ctx.request.body
	const username = user.username
	const password = user.password
	// 检测 username 是否存在
	await new Promise((resolve, rejrct) => {
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
