'use strict';


const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const User = require('./User')(sequelize, Sequelize);
const Writing = require('./Writing')(sequelize, Sequelize);
const Oauth = require('./Oauth')(sequelize, Sequelize);


User.hasMany(Writing, {
  foreignKey: 'user_identifier',
  sourceKey: 'identifier',
  allowNull: false,
  constraints: true,
  onDelete: 'cascade',
});
Writing.belongsTo(User, {
  foreignKey: 'user_identifier',
  targetKey: 'identifier'
});
User.hasMany(Oauth, {
  foreignKey: 'google_user_id',
  sourceKey: 'id',
  allowNull: false,
  constraints: true,
  onDelete: 'cascade',
});
Oauth.belongsTo(User,{
  foreignKey: 'google_user_id',
  targetKey: 'id'
});


db.User = User;
db.Writing = Writing;
db.Oauth = Oauth;

module.exports = db;



// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
