const express = require ('express')
const cors = require ('cors')

const db = require('./config/db/index')
const route = require('./routes')
require('dotenv').config({path:__dirname+'/.env'})

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({
    extended: true
  }));
app.use(cors())

db.connect()
route(app)


app.listen(PORT,()=>{console.log(`server listen at http://localhost:${PORT}`)})
