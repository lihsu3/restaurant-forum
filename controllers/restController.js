const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant

const restController = {
	getRestaurants: (req, res) => {
		let whereClause = {}
	 	let categoryId = ''
	 	if(req.query.categoryId) {
	 		categoryId = Number(req.query.categoryId)
	 		whereClause['categoryId'] = categoryId
		}

		Restaurant.findAll({ include: Category, where: whereClause }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
      }))

      Category.findAll().then(categories => {
     		return res.render('restaurants', {
       		restaurants: data,
       		categories: categories,
       		categoryId: categoryId
     		})
   		})
    })
	},

	getRestaurant: (req, res) => {
	  return Restaurant.findByPk(req.params.id, {include: [Category]}).then(restaurant => {
	    return res.render('restaurant', { restaurant: restaurant })
	  })
	},
}

module.exports = restController