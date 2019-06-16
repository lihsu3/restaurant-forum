const db = require('../models')
// const Category = db.Category
// const Restaurant = db.Restaurant
const Comment = db.Comment

const commentController = {
	postComment: (req, res) => {
		return Comment.create({
			text: req.body.text,
		  UserId: req.user.id,
		  RestaurantId: req.body.restaurantId
		}).then((comment) => {
		  res.redirect(`/restaurants/${req.body.restaurantId}`)
		})
	}

}

module.exports = commentController