const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite
const pageLimit = 10

const restController = {
	getRestaurants: (req, res) => {
		let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) { offset = (req.query.page - 1) * pageLimit }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      // console.log(Array.from({ length: pages }))
      // console.log(totalPage)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
	},

	getRestaurant: (req, res) => {
	  return Restaurant.findByPk(req.params.id, {
      include: [
        Category, 
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]}).then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
        restaurant.increment({
          'viewCounts': 1
        }).then(restaurant => {
          return res.render('restaurant', { 
            restaurant: restaurant, 
            isFavorited: isFavorited, 
            isLiked: isLiked 
          })
        })
      })
	},

  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },

  getRestaurantDashboard: (req, res) => {
    Restaurant.findByPk(
      req.params.id, 
      {include: [Category, Comment]}
    ).then(restaurant => {
      Comment.findAndCountAll(
        {where: {RestaurantId: req.params.id}}
      ).then(comments => {
        return res.render('dashboard', {
          restaurant: restaurant,
          comments: comments
        })
      })
    })
  },

  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      limit: pageLimit,
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]}).then(restaurants => {
        restaurants = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50),
          userCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(restaurant.id),
        }))
        restaurants = restaurants.sort((a, b) => b.userCount - a.userCount)
        return res.render('topRestaurant', { restaurants: restaurants })
      })
  },
}

module.exports = restController