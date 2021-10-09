import { Rank } from '../models/Rank'
import { Op } from 'sequelize'
/**Inserts rank into the db*/
export async function insertNewRank(
  serverid: string,
  roleid: string,
  entry_rep: number,
  budget: number
): Promise<Rank> {
  return await Rank.create({ serverid, roleid, entry_rep, budget })
}

/**Returns the rank with the highest rep that is below/equal to the passed rep*/
export async function getRankByRep(serverid: string, rep: number): Promise<Rank | null> {
  return await Rank.findOne({
    where: { entry_rep: { [Op.lte]: rep }, serverid },
    order: [['entry_rep', 'DESC']],
    limit: 1
  })
}

/**Returns a list of all the rank in a given server, sorted by entry rep descending
 * @param serverid {string} the snowflake id of the server
 * @return an array of Rank objects */
export async function getAllRanksForServer(serverid: string): Promise<Rank[]> {
  return await Rank.findAll({ where: { serverid }, order: [['entry_rep', 'DESC']] })
}
