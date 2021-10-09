import { Server } from '../models/Server'
/**Find the server object from the database, or creates one if none exists
 * @param serverID The id of the server to find
 * @returns the sequelize Server object of the server
 */
export async function getServer(serverID: string): Promise<Server> {
  let server = await Server.findOne({ where: { serverid: serverID } })
  if (!server) {
    server = await registerServer(serverID)
  }
  return server
}

/**Gets the currently set prefix of a server
 * @param serverID - ID of the server
 * @returns The prefix as a string
 */
export async function getServerPrefix(serverID: string): Promise<string> {
  const server = await getServer(serverID)
  return <string>server?.get('prefix')
}

/**Creates a new server record and saves it*/
export async function registerServer(serverID: string): Promise<Server> {
  return await Server.create({ serverid: serverID })
}

/**Sets the admin role for the specified server
 * @param serverid {string} the snowflake id of the server
 * @param roleid {string} the snowflake id of the role*/
export async function setServerAdminRole(serverid: string, roleid: string): Promise<void> {
  await Server.update({ bot_admin_role: roleid }, { where: { serverid } })
}
