const info = (...params) => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
