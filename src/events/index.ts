import Discord from 'discord.js'

//
import message from './message'
import ready from './ready'
import messageReactionAdd from './messageReactionAdd'
import mesageReactionRemove from './mesageReactionRemove'
import { Bot } from '../Bot'

export default (client: Bot) => {
    message(client)
    ready(client)
    messageReactionAdd(client)
    mesageReactionRemove(client)
}
