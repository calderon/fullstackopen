// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
