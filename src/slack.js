'use strict'

const logger = require('./logger')
const utils = require('./utils')

/**
 *
 * @param message
 * @param user
 * @param channel
 * @constructor
 */
class Slack {
  constructor (rtm, sendMessages = true) {
    this.rtm = rtm
    this.sendMessages = sendMessages
  }

  /**
   * Sends a message through the slack API
   *
   * @param message
   * @param user
   * @param channel
   */
  sendMessage (message, user, channel) {
    // check we can send
    if (!this.canSend()) {
      return
    }

    const self = this
    // send bot is typing
    this.rtm.sendTyping(channel)
    let timeToWait = utils.getRandomInt(500, 2500)

    // wrap in a set time out with random time, this gives the illusion of the bot typing
    setTimeout(function () {
      self.rtm.sendMessage(message, channel).then((res) => {
        logger.info(`Message sent: ${res.ts}`)
      }).catch(function (error) {
        logger.error(error)
      })
    }, timeToWait)
  }

  /**
   * Checks that we can send messages
   *
   * @returns {boolean}
   */
  canSend () {
    if (!this.sendMessages) {
      logger.info('Send messages set to false, will not be sending messages')
      return false
    }
    return true
  }
}

module.exports = Slack
