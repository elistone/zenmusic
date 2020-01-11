'use strict'

const config = require('nconf')
const { RTMClient } = require('@slack/client')

const logger = require('./logger')
const Slack = require('./slack')
const Understand = require('./understand')

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

    // init new slack class
    this.slack = new Slack(this.rtm, this.isTest)

    /**
     * Listen for incoming messages
     */
    this.rtm.on('message', (message) => {
      this.incomingMessage(message.text, message.user, message.channel)
      this.slack.sendMessage('random message', message.user, message.channel)
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
    let understand = new Understand(text)
    understand.process()
    return understand.getResponse()
  }
}

/**
 * Export bot
 *
 * @type {Bot}
 */
module.exports = Bot
