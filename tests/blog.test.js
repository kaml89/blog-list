const request = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')

let token
//let userId

beforeEach(async () => {
    await User.deleteMany({})
    await request(app)
        .post('/api/auth/register')
        .send({
            email: 'mail@gmail.com',
            name: 'qwerty',
            username: 'user1',
            password: '12345'
        })

    await request(app)
        .post('/api/auth/register')
        .send({
            email: 'mail2@gmail.com',
            name: 'qwerty1',
            username: 'user2',
            password: '12345'
        })
    

    const response = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'user1',
            password: '12345'
        })
    
    let user = await User.findOne({ username: 'user1' })
    
    userId = user.toJSON().id
    token = response.body.data.token
//})

//beforeEach(async () => {
    await Blog.deleteMany({})

    for( const blog of helper.initialBlogs ) {
        const newBlog = new Blog({ 
            ...blog,
            user: userId
        })
        await newBlog.save()
        await User.findOneAndUpdate({ username: 'user1' }, { "$push": { blogs: blog._id } })
    }

})

afterAll( async () =>{
    await mongoose.connection.close()
})


it('should get all blogs', async () => {
    const response = await request(app)
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)

    expect(response.body.length).toBe(2)
    
})

describe('Create new blog' , () => {
    it('When blog is valid add new blog', async () => {

        const blog = {
            title: 'blog1',
            author: 'name1',
            url: 'safd;lsajf',
        }

        const response = await request(app)
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${token}`)

        
        const blogs = await Blog.find({})
        expect(response.statusCode).toBe(200)
        expect(blogs.length).toBe(3)
        expect(response.body.title).toBeTruthy()



    })

    it('When blog is invalid, fail to add blog', async () => {
        const blog = {
            author: 'name1',
            url: 'lasdjflsf'
        }

        const response = await request(app)
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${token}`)

        const blogs = await Blog.find({})
        expect(response.statusCode).toBe(400)
        expect(blogs.length).toBe(2)
    })



    
    
})

describe('Authorizing user', () => {
    it('When user IS NOT authenticated expect to fail request', async () => {
        const response = await request(app)
            .get('/api/blogs')

        expect(response.statusCode).toBe(401)
    })

    it('Should authorize logged user', async () => {
        const response = await request(app)
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
    })
})

describe('Deleting blog', () => {
    it('When user is authenticated and is owner of a blog, expect to remove blog', async () => {
        let blogs = await helper.getBlogsFromDB()
        const blogToRemove = blogs[0]

        const response = await request(app)
            .delete(`/api/blogs/${blogToRemove.id}`)
            .set('Authorization', `Bearer ${token}`)

        blogs = await helper.getBlogsFromDB()
        expect(response.statusCode).toBe(204)
        expect(blogs.length).toBe(1)
    })

    it('When user isnt author, expect to send 401 status', async () => {
        let blogs = await helper.getBlogsFromDB()
        const blogToRemove = blogs[0]
        
        const response = await request(app)
            .delete(`/api/blogs/${blogToRemove.id}`)
            .set('Authorization', `Bearer ${12345}`)
        
        blogs = await helper.getBlogsFromDB()
        expect(response.statusCode).toBe(401)
        expect(blogs.length).toBe(2)

    })

    it('When user isnt authenticated, expect to send 401 status', async () => {
        let blogs = await helper.getBlogsFromDB()
        const blogToRemove = blogs[0]
        
        const response = await request(app)
            .delete(`/api/blogs/${blogToRemove.id}`)
        
        blogs = await helper.getBlogsFromDB()
        expect(response.statusCode).toBe(401)
        expect(blogs.length).toBe(2)
    })
})

describe('Adding comments', () => {
    it('Refuse to add empty comment', async () => {
        let blogs = await helper.getBlogsFromDB()
        const blogId = blogs[0].id

        const response = await request(app)
            .put(`/api/blogs/${blogId}/comments`)
            .send({data: ''})
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.statusCode).toBe(400)
    })


    it('When user is authenticated expect to add valid comment', async () => {
        let blogs = await helper.getBlogsFromDB()
        const blogId = blogs[0].id

        const response = await request(app)
            .put(`/api/blogs/${blogId}/comments`)
            .send({data: 'New comment'})
            .set('Authorization', `Bearer ${token}`)
        
        const updatedBlog = await Blog.findById(blogId)
        console.log(updatedBlog)

        expect(response.statusCode).toBe(202)
        expect(updatedBlog.comments).toContain('New comment')
    })


    it('Refuse to add comment by unauthenticated user', async () => {
        let blogs = await helper.getBlogsFromDB()
        const blogId = blogs[0].id

        const response = await request(app)
            .put(`/api/blogs/${blogId}/comments`)
            .send({data: 'New comment'})
        
        expect(response.statusCode).toBe(401)
    })

    
})

describe('', () => {

})