const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    const Oauth = sequelize.define("oauth", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        google_user_id: {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        refresh_token: {
            type: Sequelize.STRING(500),
            allowNull: true
        },
    }, {
        charset: "utf8", 
        collate: "utf8_general_ci", 
        timestamps: false,
        underscored: true,
        tableName: 'oauth'

    });


   
    return Oauth;
};