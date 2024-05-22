const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const { describe } = require('node:test')
mongoose.connect(process.env.DB_URL)
const { Schema } = mongoose

const userSchema = new Schema({
  username: String
})
const User = mongoose.model('User', userSchema)

const exerciseSchema = new Schema({
  user_id: {type: String, required: true},
  description: String,
  duration: Number,
  date: Date
})
const Exercise = mongoose.model('Exercise', exerciseSchema)

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

app.get("/api/users", async (req, res)=>{
  const users = await User.find({}).select("_id username")
  if(!users){
    res.send("No Users")
  }else{
    res.json(users)
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req,res)=>{
  const user = new User ({
    username: req.body.username
  })

try{
  const userCreate = await user.save()
  res.json(userCreate)
}catch(err){
  console.log(err)
}

})

app.post("/api/users/:_id/exercises", async (req, res)=>{
  const id = req.params._id
  const {description, duration, date} = req.body

  try{
    const user = await User.findById(id)
    if(!user){
      return res.send("No User")
    }
    const exercise = new Exercise({
      user_id: user._id,
      description,
      duration,
      date: date? new Date(date): new Date()
    })
    const exerciseCreate = await exercise.save()
    res.json({
      _id: user._id,
      username: user.username, 
      description: exerciseCreate.description,
      duration: exerciseCreate.duration,
      date: new Date(exerciseCreate.date).toDateString()
    })
  }catch(err){
    console.log(err)
    res.send("Error")
  }
})

app.get("/api/users/:_id/logs", async (req, res)=>{
  const {from, to, limit} = req.query
  const id = req.params._id
  const user = await User.findById(id)
  if(!user){
    return res.send("No User")
  }
  let date = {}
  if(from){
    date["$gte"] = new Date(from)
  }
  if(to){
    date["$lte"] = new Date(to)
  }
  let filter = {
    user_id: id
  }
  if(from || to){
    filter.date = date
  }

  const exercises = await Exercise.find(filter).limit(+limit ?? 500)
  const log = exercises.map(e=> ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }))

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log
  })

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
