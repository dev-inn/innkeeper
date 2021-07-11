import { TextChannel } from 'discord.js'
import { Bot } from '../../Bot'
import AddRank from './commands/AddRank'
import AddRoleReaction from './commands/AddRoleReaction'
import Award from './commands/Award'
import CreateEmbed from './commands/CreateEmbed'
import DelMessage from './commands/DelMessage'
import DelRank from './commands/DelRank'
import Help from './commands/Help'
import Leaderboard from './commands/Leaderboard'
import ListRanks from './commands/ListRanks'
import Nuke from './commands/Nuke'
import Ping from './commands/Ping'
import Reload from './commands/Reload'
import RemoveRoleReaction from './commands/RemoveRoleReaction'
import Reputation from './commands/Reputation'
import SetBotAdminRole from './commands/SetBotAdminRole'
import SetCredits from './commands/SetCredits'
import SetEmbedDescription from './commands/SetEmbedDescription'
import SetEmbedTitle from './commands/SetEmbedTitle'
import messageReactionAdd from './events/messageReactionAdd'
import messageReactionRemove from './events/messageReactionRemove'
import ready from './events/ready'
import rinit from './models/Rank'
import rrinit from './models/RoleReaction'
import sinit from './models/Server'
import uinit from './models/User'

export default (bot: Bot): void => {
  // defines database models
  rinit(bot.DB)
  rrinit(bot.DB)
  sinit(bot.DB)
  uinit(bot.DB)
  // defines commands
  bot.addCommand(AddRank)
  bot.addCommand(AddRoleReaction)
  bot.addCommand(Award)
  bot.addCommand(CreateEmbed)
  bot.addCommand(DelMessage)
  bot.addCommand(DelRank)
  bot.addCommand(Help)
  bot.addCommand(Leaderboard)
  bot.addCommand(ListRanks)
  bot.addCommand(Nuke)
  bot.addCommand(Ping)
  bot.addCommand(Reload)
  bot.addCommand(RemoveRoleReaction)
  bot.addCommand(Reputation)
  bot.addCommand(SetBotAdminRole)
  bot.addCommand(SetCredits)
  bot.addCommand(SetEmbedDescription)
  bot.addCommand(SetEmbedTitle)
  // adds event hooks
  messageReactionAdd(bot)
  messageReactionRemove(bot)
  ready(bot)
}
