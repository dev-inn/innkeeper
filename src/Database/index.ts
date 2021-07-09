import { Op, Sequelize } from 'sequelize'
import Models, { Rank, RoleReaction, Server, User } from './Models'
import { logger } from '@noodlewrecker7/logger'

const log = logger.Logger

/**
 * Initialise db connection*/
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
})

Models(sequelize)
/**
 * Class containing methods to access db */
export default class Database {
    constructor() {
        return
    }

    getSequelizeObj() {
        return sequelize
    }

    async getServer(serverID: string): Promise<Server> {
        let server = await Server.findOne({ where: { serverid: serverID } })
        if (!server) {
            server = await this.registerServer(serverID)
        }
        return server
    }

    async getServerPrefix(serverID: string): Promise<string> {
        const server = await this.getServer(serverID)
        return <string>server?.get('prefix')
    }

    /**Returns the specified user, if no user exists then one is created*/
    async getUserInServer(userID: string, serverID: string): Promise<User> {
        log.debug('get user in server')
        let user = await User.findOne({ where: { userid: userID, serverid: serverID } })
        if (!user) {
            user = await this.registerUserInServer(userID, serverID)
        }
        return user
    }

    /**Registers a new user to the database*/
    async registerUserInServer(userID: string, serverID: string): Promise<User> {
        return await User.create({ userid: userID, serverid: serverID })
    }

    async registerServer(serverID: string): Promise<Server> {
        return await Server.create({ serverid: serverID })
    }

    async getTopTenUsersByRep(serverID: string): Promise<User[]> {
        return await User.findAll({
            where: { serverid: serverID },
            order: [['reputation', 'DESC']],
            limit: 10
        })
    }

    async setUserCredits(userID: string, serverID: string, amount: number): Promise<void> {
        const user = await this.getUserInServer(userID, serverID)
        await user.update({ credits: amount })
        await user.save()
    }

    /**Inserts rank into the db*/
    async insertNewRank(serverid: string, roleid: string, entry_rep: number, budget: number): Promise<Rank> {
        return await Rank.create({ serverid, roleid, entry_rep, budget })
    }

    /**Returns the rank with the highest rep that is below/equal to the passed rep*/
    async getRankByRep(serverid: string, rep: number): Promise<Rank | null> {
        return await Rank.findOne({
            where: { entry_rep: { [Op.lte]: rep }, serverid },
            order: [['entry_rep', 'DESC']],
            limit: 1
        })
    }

    async nukeUserFromServer(userID: string, serverID: string): Promise<number> {
        return await User.destroy({ where: { userid: userID, serverid: serverID }, force: true })
    }

    /**Creates a tie between a messageid, roleid, and the reaction emoji
     * @param serverid - Discord snowflake of the server its in
     * @param messageid - Discord snowflake of the message
     * @param roleid - Discord snowflake of the role
     * @param emoji - emoji name string
     * @param channelid - Discord snowflake of the channel its in
     */
    async insertRoleReaction(
        serverid: string,
        messageid: string,
        roleid: string,
        emoji: string,
        channelid: string
    ): Promise<RoleReaction> {
        log.debug('Inserting rolereaction')
        log.debug(JSON.stringify({ serverid, messageid, roleid, emoji, channelid }))
        return RoleReaction.create({ serverid, messageid, roleid, emoji, channelid })
    }

    /**Returns all rolereaction ties for a given messageid*/
    async getAllRoleReactionsForMessage(messageid: string): Promise<RoleReaction[]> {
        return RoleReaction.findAll({ where: { messageid } })
    }

    async getRoleReactionByEmoji(messageid: string, emoji: string): Promise<RoleReaction | null> {
        return await RoleReaction.findOne({ where: { messageid, emoji } })
    }

    /**Removes the role reaction connection on the specified emoji*/
    async removeRoleReactionByEmoji(messageid: string, emoji: string): Promise<number> {
        return await RoleReaction.destroy({ where: { messageid, emoji } })
    }

    /**Sets the admin role for the specified server
     * @param serverid {string} the snowflake id of the server
     * @param roleid {string} the snowflake id of the role*/
    async setServerAdminRole(serverid: string, roleid: string) {
        await Server.update({ bot_admin_role: roleid }, { where: { serverid } })
    }

    /**Returns a list of all the rank in a given server, sorted by entry rep descending
     * @param serverid {string} the snowflake id of the server
     * @return an array of Rank objects */
    async getAllRanksForServer(serverid: string): Promise<Rank[]> {
        return await Rank.findAll({ where: { serverid }, order: [['entry_rep', 'DESC']] })
    }

    async getAllMessagesWithRoleReactions(): Promise<RoleReaction[]> {
        return await RoleReaction.findAll()
    }

    /**Calls sync() on the database to create any empty tables*/
    async sync(): Promise<void> {
        await sequelize.sync()
    }
}
