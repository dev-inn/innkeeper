import { Model, Sequelize } from 'sequelize'
import { User, Rank, Server } from './Models'
import Models from './Models'

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
        let user = await User.findOne({ where: { userid: userID, serverid: serverID } })
        if (!user) {
            user = await this.registerUserInServer(userID, serverID)
        }
        return user
    }

    async registerUserInServer(userID: string, serverID: string): Promise<User> {
        return await User.create({ userid: userID, serverid: serverID })
    }

    async registerServer(serverID: string) {
        return await Server.create({ serverid: serverID })
    }

    sync(): void {
        sequelize.sync()
    }
}
