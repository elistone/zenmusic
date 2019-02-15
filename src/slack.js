'use strict'

const logger = require('./logger')
const nlp = require('compromise')

/**
 * Slack class translates and understands the incoming message from slack api
 * With this information it can then workout what is being requested and will take actions
 *
 * @param message
 * @param user
 * @param channel
 * @constructor
 */
class Slack {
  constructor (message, user, channel) {
    this.command = 'add'
    this.artist = 'Hey Jude'
    this.song = 'The Beatles'

    this.message = message
    this.user = user
    this.channel = channel
  }

  /**
   * start the processing of the input
   */
  processInput () {
    let sentence = this.pos(this.message)
    let response = `(channel:${this.channel}) ${this.user} says: ${this.message} | Processed: ${sentence}`
    logger.info(response)
  }

  /**
   * Return the response from processing
   *
   * @returns {object}
   */
  getResponse () {
    return { 'command': this.command, 'song': this.artist, 'artist': this.song }
  }

  /**
   * Use pos to work out what is being said
   *
   * @param sentence
   * @returns {*}
   */
  pos (sentence) {
    sentence = sentence.trim()
    let doc = nlp(sentence).trim().toLowerCase().match('add').terms().data()
    return JSON.stringify(doc)
  }
}

module.exports = Slack
