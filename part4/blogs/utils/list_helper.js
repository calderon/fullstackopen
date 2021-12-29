// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumLikes = (sum, currentBlog) => sum + currentBlog.likes

  return blogs.reduce(sumLikes, 0)
}

const favoriteBlog = (blogs) => {
  const getLikesMax = (blogs) => Math.max(...blogs.map(blog => blog.likes))

  const likesMax = getLikesMax(blogs)

  return blogs.find(blog => blog.likes === likesMax)
}

const mostBlogs = (blogs) => {
  const countBlogsByAuthor = (groups, currentBlog) => {
    let group = groups.find(group => group.author === currentBlog.author)

    if (!group) {
      group = {}
      group.author = currentBlog.author
      group.blogs = 0
      groups = groups.concat(group)
    }

    group.blogs++

    return groups
  }

  const getBlogsMax = (groups) => {
    return Math.max(...groups.map(group => group.blogs))
  }

  const blogsByAuthor = blogs.reduce(countBlogsByAuthor, [])
  const maxBlogs = getBlogsMax(blogsByAuthor)

  return blogsByAuthor.find(author => author.blogs === maxBlogs);
}

const mostLikes = (blogs) => {
  const countLikesByAuthor = (groups, currentBlog) => {
    let group = groups.find(group => group.author === currentBlog.author)

    if (!group) {
      group = {}
      group.author = currentBlog.author
      group.likes = 0
      groups = groups.concat(group)
    }

    group.likes = group.likes + currentBlog.likes

    return groups
  }

  const getLikesMax = (groups) => {
    return Math.max(...groups.map(group => group.likes))
  }

  const likesByAuthor = blogs.reduce(countLikesByAuthor, [])
  const maxLikes = getLikesMax(likesByAuthor)

  return likesByAuthor.find(author => author.likes === maxLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
