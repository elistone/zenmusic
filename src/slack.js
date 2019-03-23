'use strict'

const logger = require('./logger')
const utils = require('./utils')
const nlp = require('compromise')
const commands = require('../config/commands.json')

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
    this.commands = commands

    this.command = false
    this.artist = false
    this.song = false

    this.message = message
    this.user = user
    this.channel = channel
  }

  /**
   * start the processing of the input
   */
  processInput () {
    let sentence = this.pos(this.message)
    if (this.command) {
      this.processCommand(this.command, this.message)
    }
    // let response = `(channel:${this.channel}) ${this.user} says: ${this.message} | Processed: ${sentence}`
    // logger.info(response)
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
    let doc = nlp(sentence).trim().toLowerCase()

    for (let command in this.commands) {
      if (this.commands.hasOwnProperty(command)) {
        let data = this.commands[command]
        let matcher = data.match
        if (doc.has(matcher)) {
          this.command = command
        }
      }
    }
  }

  /**
   * Uses the found command and process it for the results
   *
   * @param command
   * @param message
   */
  processCommand (command, message) {
    // remove the found command and clean up the string a bit
    message = message.replace(command, '').trim()
    let processFunction = 'commandProcess' + utils.ucfirst(command)

    // check if this function exists
    if (typeof this[processFunction] === 'function') {
      this[processFunction](message)
    } else {
      logger.error('The command ' + processFunction + ' does not exist')
    }
  }

  /**
   * Processes the add function
   *
   * @param message
   */
  commandProcessAdd (message) {
    // set that we have no song or artist
    let artist = false
    let song = false

    // check if we have a string of song
    // if we have song we want to split
    // and also set the song and message
    if (message.indexOf('song') !== -1) {
      let afterSong = message.split('song')
      if (afterSong.length > 1) {
        message = artist = afterSong[1].trim()
        song = afterSong[0].trim()
      }
    }

    // look to find song and artist spliting the songs using
    // 'by' and/or '-'
    message = utils.splitBy(message, ['by', '-'])

    // if we have successfully split the message we should use this as song and message
    if (message) {
      artist = message[0] ? message[0].trim() : false
      song = message[1] ? message[1].trim() : false
    }

    // set the artist and song
    this.artist = artist
    this.song = song
  }
}

module.exports = Slack
