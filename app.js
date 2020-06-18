const path = require("path")
const express = require('express')
const app = express() 
const PORT = 3030


// view engine setup 
app.set("views", path.join(__dirname, "views") )
app.engine('html', require('ejs').renderFile )
app.set("view engine", "html") 

// setting public folder
app.use(express.static(__dirname+'/public'))

// routers
const indexRoute = require('./controllers/index')


app.use('/', indexRoute)


app.listen(PORT,() => {
    console.log("Barebone created...")
})