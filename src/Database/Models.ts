import { Sequelize, DataTypes, Model, BuildOptions } from 'sequelize'

/** Stores data about a users reputation*/
export class User extends Model {
    public userid?: string
    public serverid?: string
    public reputation!: number
    public credits!: number
    public xp!: number
}

/**
 * Ranks for reputation by [p]award*/
export class Rank extends Model {
    public serverid!: string
    public entry_rep!: number
    public budget!: number
    public roleid?: string
}

/**
 * Stores data about the servers*/
export class Server extends Model {
    serverid!: string
    prefix!: string
    bot_admin_role?: string
}

export class RoleReaction extends Model {
    public serverid!: string
    public roleid!: string
    public messageid!: string
    public emoji!: string
    public channelid!: string
}

export default (sequelize: Sequelize) => {
    RoleReaction.init(
        {
            serverid: { type: DataTypes.STRING, unique: false, allowNull: false },
            roleid: { type: DataTypes.STRING, allowNull: false },
            messageid: { type: DataTypes.STRING, allowNull: false },
            emoji: { type: DataTypes.STRING, allowNull: false },
            channelid: { type: DataTypes.STRING, allowNull: false }
        },
        { tableName: 'rolereactions', sequelize: sequelize }
    )

    User.init(
        {
            userid: { type: DataTypes.STRING, unique: false },
            serverid: { type: DataTypes.STRING, unique: false },
            reputation: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
            credits: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
            xp: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }
        },
        { tableName: 'users', sequelize: sequelize }
    )

    Rank.init(
        {
            serverid: { type: DataTypes.STRING, unique: false },
            entry_rep: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            budget: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
            roleid: { type: DataTypes.STRING, allowNull: true }
        },
        { tableName: 'ranks', sequelize: sequelize }
    )

    Server.init(
        {
            serverid: { type: DataTypes.STRING, unique: true, allowNull: false },
            prefix: { type: DataTypes.CHAR, allowNull: false, defaultValue: '?' },
            bot_admin_role: { type: DataTypes.STRING, allowNull: true }
        },
        { tableName: 'servers', sequelize: sequelize }
    )

    // sequelize.sync({ force: true })
}
