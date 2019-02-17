'use strict'

const expect = require('chai').expect
const Bot = require('../src/bot')

describe('#command_add', function () {
  const user = 'U12345678' // fake user
  const channel = 'D12345678' // fake channel
  const bot = new Bot(true) // set to isTest to true prevents it trying to send messages and such

  it('should be able to detect add command and extract artist and song', function () {
    const strings = [
      'add Hey Jude by The Beatles',
      'add the song Hey Jude by The Beatles'
    ]

    strings.forEach(function (sentence) {
      let result = bot.incomingMessage(sentence, user, channel)

      expect(result).to.have.property('command', 'add')
      expect(result).to.have.property('song', 'Hey Jude')
      expect(result).to.have.property('artist', 'The Beatles')
    })
  })
})
