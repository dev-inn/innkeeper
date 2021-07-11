import { Bot } from '../../Bot'
import Play from './commands/Play'
import Queue from './commands/Queue'
import QueueItem from './models/QueueItem'
export default (bot: Bot): void => {
  QueueItem(bot.DB)
  bot.addCommand(Play)
  bot.addCommand(Queue)
}
