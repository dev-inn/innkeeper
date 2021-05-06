import Discord from 'discord.js'

//
import message from './message'
import ready from './ready'
import messageReactionAdd from './messageReactionAdd'
import { Bot } from '../Bot'

export default (client: Bot) => {
    message(client)
    ready(client)
    messageReactionAdd(client)
}
