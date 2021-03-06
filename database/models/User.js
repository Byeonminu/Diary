const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.STRING(100),
            allowNull : true
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        identifier: {
            type: Sequelize.STRING(500),
            unique: true,
            allowNull: false
        },
        nickname: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        when_created:{
            type: 'TIMESTAMP',
            allowNull: true,
        },
        provider: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
    }, {
        charset: "utf8", 
        collate: "utf8_general_ci", 
        timestamps: false,
        underscored: true,
        tableName: 'users'

    });


   
    return Users;
};