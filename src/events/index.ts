import Discord from 'discord.js'

//
import message from './message'
import ready from './ready'
import messageReactionAdd from './messageReactionAdd'
import messageReactionRemove from './messageReactionRemove'
import { Bot } from '../Bot'

export default (client: Bot) => {
    message(client)
    ready(client)
    messageReactionAdd(client)
    messageReactionRemove(client)
}
