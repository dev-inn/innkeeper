import { Model, Sequelize } from 'sequelize'
import { User, Rank, Server } from './Models'
import Models from './Models'
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

    async nukeUserFromServer(userID: string, serverID: string): Promise<number> {
        return await User.destroy({ where: { userid: userID, serverid: serverID }, force: true })
    }
    sync(): void {
        sequelize.sync()
    }
}
