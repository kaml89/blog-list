const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  
  const sum = blogs
    .map(item => item.likes)
    .reduce((a, b) => {
      return a + b
    }, 0)

  return sum;
}

const favouriteBlog = blogs => {
  blogs.sort((a, b) => {
    return b.likes - a.likes
  })

  return blogs[0]
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
