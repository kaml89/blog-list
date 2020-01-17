const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')



beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

})

describe('there are already initial blogs', () => {
  test('blogs are returned as json', async () => {
    await request(app)
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
    const response = await request(app).get('/api/blogs')
  
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })
  
  test('author of the first blog is kamil', async () => {
    const response = await request(app).get('/api/blogs')
  
    expect(response.body[0].author).toBe('kamil')
  })
})


describe('adding new blog post', () => {
  test('valid blog can be added', async () => {
    const newBlog = {
      title: 'blog3',
      author: 'bogusia',
      url: 'sdf',
      likes: 11
    }
    await request(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogs = await helper.blogsInDB()

    const titles = blogs.map(blog => blog.title)
    const authors = blogs.map(blog => blog.author)
    
    expect(blogs.length).toBe(helper.initialBlogs.length + 1)
    expect(titles).toContain('blog3')
    expect(authors).toContain('bogusia')
  })

  test('if "likes" property is missing, it is set to 0', async () => {
    const newBlog = {
      title: 'blog3',
      author: 'bogusia',
      url: 'asdfsdf'
    }

    await request(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogs = await helper.blogsInDB()
    const likes = blogs.map(blog => blog.likes)
    expect(likes).toContain(0)
  })

  test('respond with status code 400 if title or url are missing from req data', async () => {
    const newBlog1 = {
      title: 'blog6',
      author: 'bogusia',
      likes: 11
    }

    const newBlog2 = {
      author: 'olek',
      url: 'ldskfasldf',
      likes: 33
    }

    await request(app)
      .post('/api/blogs')
      .send(newBlog1)
      .expect(400)

    await request(app)
      .post('/api/blogs')
      .send(newBlog2)
      .expect(400)
  })

})

describe('deleting blog post', () => {
  test('succeds with status code 204', async () => {
    let blogs = await helper.blogsInDB()
    const id = blogs[0].id
    await request(app)
      .delete(`/api/blogs/${id}`)
      .expect(204)
    
    blogs = await helper.blogsInDB()
    const blogIds = blogs.map(blog => blog.id)

    expect(blogIds.length).toBe(helper.initialBlogs.length - 1)
    expect(blogIds).not.toContain(id)
  })
})

describe('updating blog post', () => {
  test('post is succesfully updated with status code 200', async () => {
    let blogs = await helper.blogsInDB()
    const id = blogs[0].id

    const newBlog = {
      likes: 100
    }

    await request(app)
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(200)
    
    const updatedBlog = await Blog.findById(id)
    expect(updatedBlog.likes).toBe(newBlog.likes)
  })

  
  test('fails with status code 404 if blog post doesn\'t exist', async () => {
    const newBlog = {
      title: 'blogblog',
      author: 'marek',
      url: 'asdlfjsf',
      likes: 11
    }
    
    const blogObject = new Blog(newBlog)
    const blogInDB = await blogObject.save()
    await Blog.findByIdAndDelete(blogInDB.id)
    
    await request(app)
      .put(`/api/blogs/${blogInDB.id}`)
      .send(newBlog)
      .expect(404)
  })
})

afterAll(()=> {
  mongoose.connection.close()
})
