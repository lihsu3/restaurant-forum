const bcrypt = require('bcrypt-nodejs') 
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Like = db.Like

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
    // console.log(req.session.passport.user)
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
        req.flash('success_messages', 'user was successfully to update')
        res.redirect('/admin/users')
      })
    })
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      // console.log(restaurant)
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }}).then((favorite) => {
      favorite.destroy()
      .then((restaurant) => {
        return res.redirect('back')
      })
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      return res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    return Like.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }}).then((like) => {
      like.destroy()
      .then((restaurant) => {
        return res.redirect('back')
      })
    })
  },
}

module.exports = userController