const bcrypt = require('bcrypt-nodejs') 
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if(req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({where: {email: req.body.email}}).then(user => {
        if(user){
          req.flash('error_messages', '信箱重複！')
          console.log(res.locals)
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })  
        }
      })    
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  editUser: (req, res) => {
    return User.findAll().then(users => {
        return res.render('admin/users', { users: users })
    })  
  },

  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user.update({
        isAdmin: !user.isAdmin,
      }).then(user => {
<<<<<<< HEAD
        req.flash('success_messages', 'user was successfully to update')
=======
>>>>>>> 32a541cb8da04705c6a28741a0c2ba820c7e415e
        res.redirect('/admin/users')
      })
    })
  }
}

module.exports = userController