const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 4000
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'cartoondog'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response) => {
    db.collection('listofdogs').find().sort({likes: -1}).toArray()
    .then(data => {
        console.log(data)
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})
//  class 40 2h21m. request body
app.post('/addCartoon', (request, response) => {
    db.collection('listofdogs').insertOne({cartoonName: request.body.cartoonName,
    showName: request.body.showName, likes: 0})
    .then(result => {
        console.log('Cartoon Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('listofdogs').updateOne({cartoonName: request.body.cartoonNameS, showName: request.body.showNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deletedog', (request, response) => {
    db.collection('listofdogs').deleteOne({cartoonName: request.body.cartoonNameS})
    .then(result => {
        console.log('Cartoon Deleted')
        response.json('Cartoon Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})