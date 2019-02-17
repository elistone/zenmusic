'use strict'

const config = require('nconf')
const { RTMClient } = require('@slack/client')

const logger = require('./logger')
const utils = require('./utils')
const Slack = require('./slack')

/**
 * The Bot
 * The bot starts everything running
 */
class Bot {
  constructor (isTest = false) {
    config.argv()
      .env()
      .file({ file: './config/config.json' })

    this.slackAPIToken = config.get('slackAPIToken')
    this.isTest = isTest
  }

  run () {
    logger.info('Starting up bot...')

    // run a check to make sure we have a slack API token
    if (!this.slackAPIToken || this.slackAPIToken === '' || typeof this.slackAPIToken === 'undefined') {
      logger.error(`Slack API Token has not been set`)
      process.exit()
    }

    logger.info('Connecting to RTM...')
    // create a connection to slack via RTM
    this.rtm = new RTMClient(this.slackAPIToken)
    this.rtm.start()

    /**
     * Listen for incoming messages
     */
    this.rtm.on('message', (message) => {
      this.incomingMessage(message.text, message.user, message.channel)
    })

    logger.info('Ready to rock & roll!')
  }

  /**
   * React to incoming message
   *
   * @param text
   * @param user
   * @param channel
   */
  incomingMessage (text, user, channel) {
    let sk = new Slack(text, user, channel)
    sk.processInput()
    let output = sk.getResponse()
    this.sendSlackMessage('random message', channel)

    return output
  }

  /**
   * Post a message to slack
   *
   * @param text
   * @param conversationId
   */
  sendSlackMessage (text, conversationId) {
    if (!this.isTest) {
      const self = this
      // send bot is typing
      this.rtm.sendTyping(conversationId)
      let timeToWait = utils.getRandomInt(500, 2500)

      // wrap in a set time out with random time, this gives the illusion of the bot typing
      setTimeout(function () {
        self.rtm.sendMessage(text, conversationId).then((res) => {
          logger.info(`Message sent: ${res.ts}`)
        }).catch(function (error) {
          logger.error(error)
        })
      }, timeToWait)
    }
  }
}

/**
 * Export bot
 *
 * @type {Bot}
 */
module.exports = Bot
