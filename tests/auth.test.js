const request = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')

beforeAll(async () => {
    await User.deleteMany({})
    await request(app)
        .post('/api/auth/register')
        .send({
            email: 'mail@gmail.com',
            name: 'qwerty',
            username: 'user1',
            password: '12345'
        })
    
})

afterAll( async () =>{
    await mongoose.connection.close()
})


describe('Creating new user', () => {
    it('When email already exists, refuse to add new account', async () => {
        const newUser = {
            email: 'mail@gmail.com',
            name: 'qwerty1',
            username: 'user2',
            password: '12345'
        }

        const response = await request(app)
            .post('/api/auth/register')
            .send(newUser)

        expect(response.statusCode).toBe(400)

    })

    it('When email is unique, create new account', async () => {
        
    })

    it('When fields are missing, refuse to add new account', async () => {
        
    })
})