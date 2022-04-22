const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    const Writing = sequelize.define('writing', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_identifier: {
            type: Sequelize.STRING(500),
            allowNull : false
        },
        title: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        when_written: {
            type: Sequelize.DATE,
            allowNull: true
        },
        last_updated:{
            type: 'TIMESTAMP',
            allowNull: true,
        },
        doc_identifier: {
            type: Sequelize.STRING(100),
            allowNull: false,
        }
    }, {
        charset: "utf8", 
        collate: "utf8_general_ci", 
        timestamps: false,
        underscored: true,
        tableName: 'writing'
    });


   
    return Writing;
};