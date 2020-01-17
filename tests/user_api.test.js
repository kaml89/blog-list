const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

let initialUsers = []

beforeEach(async () => {
  await User.deleteMany({})
  initialUsers = await helper.createInitialUsers()
  // let newUser = new User({
  //   username: 'kamil',
  //   name: 'kamil ravba',
  //   passwordHash: 'lasdkjfsalfjasfd'
  // })
  
  for(let i = 0; i < initialUsers.length; i++) {
    const newUser = new User(initialUsers[i])
    await newUser.save()
  }
  // let newUser = new User(user[0])
  // await newUser.save()
  // newUser = new User(user[1])
  // await newUser.save()
  // newUser = new User(user[2])
  // await newUser.save()
  // for (let i =0; i < initialUsers.length; i++) {
  //   const newUser = new User(user[i])
  //   await newUser.save()
  // }
})

test('initial users are saved in db', async () => {
  //const initialUsers = helper.createInitialUsers()
  const users = await User.find({})
  expect(users.length).toBe(initialUsers.length)
  const usernames = users.map(user => user.username)
  expect(usernames).toContain('username0')
  expect(usernames).toContain('username1')
  expect(usernames).toContain('username2')
})

describe('adding new user', () => {
  test('valid user can be added', async () => {
    
    const newUser = {
      username: 'kmloo',
      name: 'bob bob',
      password: 'somePassword'
    }

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    

    const users = await helper.usersInDB()
    const usernames = users.map(user => user.username)

    expect(users.length).toBe(initialUsers.length + 1)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.disconnect()
})