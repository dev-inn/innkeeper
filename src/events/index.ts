import message from './message'
import ready from './ready'
import { Bot } from '../Bot'

export default (client: Bot): void => {
  message(client)
  ready(client)
}
