const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const db = require('./models')
const port = 3000

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.listen(port, () => { 
	db.sequelize.sync()
	console.log(`Listening ${port}`)
})

require('./routes')(app)