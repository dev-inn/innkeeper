import { Sequelize, DataTypes } from 'sequelize'

export default (sequelize: Sequelize) => {
    return {
        /** Stores data about a users reputation*/
        users: sequelize.define('reputation', {
            userid: { type: DataTypes.STRING, unique: false },
            serverid: { type: DataTypes.STRING, unique: false },
            reputation: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
            credits: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
            xp: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
            level: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }
        }),

        /**
         * Ranks for reputation by [p]award*/
        ranks: sequelize.define('ranks', {
            serverid: { type: DataTypes.STRING, unique: false },
            entry_rep: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            budget: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
            name: { type: DataTypes.STRING, allowNull: false },
            roleid: { type: DataTypes.STRING, allowNull: true }
        }),
        /**
         * Stores data about the servers*/
        servers: sequelize.define('servers', {
            serverid: { type: DataTypes.STRING, unique: false },
            prefix: { type: DataTypes.CHAR, allowNull: false, defaultValue: '?' },
            bot_admin_role: { type: DataTypes.STRING, allowNull: true }
        })
    }
}
