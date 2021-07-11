import { Bot } from '../../Bot'
import Play from './commands/Play'
import Queue from './commands/Queue'
export default (bot: Bot): void => {
  bot.addCommand(Play)
  bot.addCommand(Queue)
}
