const fs = require('fs')
const { join } = require('path')

const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')
const UserSchema = require('../Schema/user')
const CommentSchema = require('../Schema/comment')

const Article = db.model("articles", ArticleSchema)
const User = db.model("users", UserSchema)
const Comment = db.model("comments", CommentSchema)

exports.index = async ctx => {
  if(ctx.session.isNew){
    ctx.status = 404
    return await ctx.render("404", {title: "404"})
  }

  const id = ctx.params.id
  const arr = fs.readdirSync(join(__dirname, "../views/admin"))

  arr.forEach(v => {
    const name = v.replace(/^(admin\-)|(\.pug)$/g, "")
    if(name === id){
      flag = true
    }
  })
  if(flag){
    await ctx.render("./admin/admin-" + id, {
      role: ctx.session.role
    })
  }else{
    ctx.status = 404
    await ctx.render("404", {title: "404"})
  }
}