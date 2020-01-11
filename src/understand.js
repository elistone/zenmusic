'use strict'

const logger = require('./logger')
const nlp = require('compromise')
const utils = require('./utils')
const commands = require('../config/commands.json')

class Understand {
  constructor (input) {
    this.commands = commands
    this.input = input
    this.command = false
    this.artist = false
    this.song = false
  }

  /**
   * Use processor to work out what is being said
   *
   * @returns {*}
   */
  process () {
    let doc = nlp(this.input).trim().toLowerCase()

    for (let command in this.commands) {
      if (this.commands.hasOwnProperty(command)) {
        let data = this.commands[command]
        let matcher = data.match
        if (doc.has(matcher)) {
          this.command = command
        }
      }
    }

    this.extractArtistSong(this.input)
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
   * Uses the found command and process it for the results
   *
   * @param command
   * @param message
   */
  runCommand (command, message) {
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
   * Extracts artist and song from a string
   *
   * @param message
   */
  extractArtistSong (message) {
    message = message.replace(this.command, '').trim()
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

module.exports = Understand
