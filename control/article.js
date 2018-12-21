const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')
const UserSchema = require('../Schema/user')
const CommentSchema = require('../Schema/comment')

const Article = db.model("articles", ArticleSchema)
const User = db.model("users", UserSchema)
const Comment = db.model("comments", CommentSchema)

exports.addPage = async ctx => {
	await ctx.render("add-article", {
		title: '文章发表',
		session: ctx.session
	})
}

exports.add = async ctx => {
	if (ctx.session.isNew) {
		return ctx.body = {
			msg: "用户未登录",
			status: 0
		}
	}
	const data = ctx.request.body
	data.author = ctx.session.uid
	data.commentNum = 0

	await new Promise((resolve, reject) => {
		new Article(data).save((err, data) => {
			if (err) return reject(err)
			User.update({_id: data.author}, {$inc: {articleNum: 1}}, err => {
				if(err) return console.log(err)
			})
			resolve(data)
		})
	})
		.then(data => {
			ctx.body = {
				msg: "发表成功！",
				status: 1,
			}
		})
		.catch(
			ctx.body = {
				msg: "发表失败！",
				status: 0,
			}
		)
}

exports.getList = async ctx => {
	let page = ctx.params.id || 1
	page--

	const maxNum = await Article.estimatedDocumentCount((err, num) => err ? console.log(err) : num)

	const data = await Article
		.find() // 找到所有数据
		.sort("-created") // 降序排序
		.skip(5 * page) // 每翻一页跳过五条
		.limit(5)   // 拿到五条数据
		.populate({
			path: "author", // 关联属性
			select: "username _id avatar"
		}) //mongoose 用于连表查询
		.then(data => data)
		.catch(err => console.log(err))

	await ctx.render("index", {
		session: ctx.session,
		title: "首页",
		artList: data,
		maxNum,
	})
}

exports.details = async ctx => {
	const _id = ctx.params.id

	const article = await Article
		.findById(_id)
		.populate("author", "username")
		.then(data => data)

	const comment = await Comment
		.find({article: _id})
		.sort("-created")
		.populate("form", "username avatar")
		.then(data => data)
		.catch(err => {
			console.log(err)
		})

	await ctx.render("article", {
		title: article.title,
		article,
		comment,
		session: ctx.session,
	})
}