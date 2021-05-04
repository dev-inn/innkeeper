import { Model, Sequelize } from 'sequelize'

/**
 * Initialise db connection*/
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
})
import Models from './Models'

const models = Models(sequelize)
/**
 * Class containing methods to access db */
export default class Database {
    constructor() {
        return
    }

    async getServer(serverID: string): Promise<Model<any, any> | null> {
        return await models.servers.findOne({ where: { serverid: serverID } })
    }

    async getServerPrefix(serverID: string): Promise<string> {
        const server = await this.getServer(serverID)
        return <string>server?.get('prefix')
    }

    sync(): void {
        models.servers.sync()
        models.users.sync()
        models.ranks.sync()
    }
}
