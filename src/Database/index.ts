import { Model, DataTypes, ModelDefined, Sequelize, ModelAttributes, AttributeType } from 'sequelize'
/**
 * Initialise db connection*/
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
})

/**
 * Class containing methods to access db */
export default class Database {
    constructor() {
        return
    }

    async getServer(serverID: string): Promise<Model<any, any> | null> {
        return await servers.findOne({ where: { serverid: serverID } })
    }

    async getServerPrefix(serverID: string): Promise<string> {
        const server = await this.getServer(serverID)
        return <string>server?.get('prefix')
    }

    sync(): void {
        servers.sync()
        users.sync()
        ranks.sync()
    }
}

/** Stores data about a users reputation*/
const users = sequelize.define('reputation', {
    userid: { type: DataTypes.STRING, unique: false },
    serverid: { type: DataTypes.STRING, unique: false },
    reputation: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    credits: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
    xp: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    level: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }
})

/**
 * Ranks for reputation by [p]award*/
const ranks = sequelize.define('ranks', {
    serverid: { type: DataTypes.STRING, unique: false },
    entry_rep: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    budget: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    name: { type: DataTypes.STRING, allowNull: false },
    roleid: { type: DataTypes.STRING, allowNull: true }
})
/**
 * Stores data about the servers*/
const servers = sequelize.define('servers', {
    serverid: { type: DataTypes.STRING, unique: false },
    prefix: { type: DataTypes.CHAR, allowNull: false, defaultValue: '?' },
    bot_admin_role: { type: DataTypes.STRING, allowNull: true }
})
