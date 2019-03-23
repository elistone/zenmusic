'use strict'

module.exports = {
  /**
   * Generate random int
   *
   * @param min
   * @param max
   * @returns {*}
   */
  getRandomInt: function (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /**
   * Split by multiple different separators
   * Returns the first split that contains more than one item
   *
   * @param string
   * @param separators
   */
  splitBy: function (string, separators) {
    for (let id in separators) {
      let separator = separators[id]
      let split = string.split(separator)
      if (Array.isArray(split) && split.length > 1) {
        return split
      }
    }
    return false
  },

  /**
   * Uppercase first
   *
   * @param string
   * @returns {string}
   */
  ucfirst: function (string) {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}
