const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant

const adminService = {
	getRestaurants: (req, res, callback) => {
		return Restaurant
		.findAll({include: [Category]})
		.then(restaurants => {
			callback({ restaurants: restaurants })
    })	
  },
}

module.exports = adminService