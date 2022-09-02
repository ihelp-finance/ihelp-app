const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')

const forceOverwrite = false;

// console.log('loading db');

const seq = new Sequelize(
  'ihelp',
  'postgres', 
  'gisp123',
  {
    host: 'ihelp-db',
    logging: false, //console.log,
    freezeTableName: true,
    dialect: "postgres"
  }
)

seq.authenticate().then((errors) => {
  if (errors === undefined) {
   // console.log('Connection successful');
  }
  else {
    console.log('Error connecting to database: ', errors);
  }
});

const AddressNickname = seq.define('address_nickname', {
  nickname: {
    type: Sequelize.TEXT,
  },
  address: {
    type: Sequelize.TEXT,
  },
},{
  freezeTableName: true
});

const CharityStats = seq.define('charity_stats', {
  address: {
    type: Sequelize.TEXT,
    primaryKey: true,
  },
  name:{
    type: Sequelize.TEXT,
  },
  contributions:{
    type: Sequelize.FLOAT,
  },
  donations:{
    type: Sequelize.FLOAT,
  },
  interests:{
    type: Sequelize.FLOAT,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
},{
  freezeTableName: true
});

const UserStats = seq.define('user_stats', {
  address: {
    type: Sequelize.TEXT,
    primaryKey: true,
  },
  name:{
    type: Sequelize.TEXT,
  },
  contributions:{
    type: Sequelize.FLOAT,
  },
  donations:{
    type: Sequelize.FLOAT,
  },
  interests:{
    type: Sequelize.FLOAT,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
},{
  freezeTableName: true
});


const StakingStat = seq.define('staking_stats', {
  time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()')
  },
  reward:{
    type: Sequelize.FLOAT,
  },
  total_reward:{
    type: Sequelize.FLOAT,
  },
  help_circulating:{
    type: Sequelize.FLOAT,
  },
  help_supply:{
    type: Sequelize.FLOAT,
  },
  xhelp_supply:{
    type: Sequelize.FLOAT,
  },
},{
  freezeTableName: true
});

const CharityAccount = seq.define('charity_accounts', {
  email: {
    type: Sequelize.TEXT,
    primaryKey: true,
  },
  password: {
    type: Sequelize.TEXT,
  },
  coinbase_refresh: {
    type: Sequelize.TEXT,
  },
  binance_api: {
    type: Sequelize.TEXT,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
},{
  freezeTableName: true
});

const Event = seq.define('events', {
  id: {
    type: Sequelize.TEXT,
    primaryKey: true,
  },
  name: {
    type: Sequelize.TEXT,
  },
  sender: {
    type: Sequelize.TEXT,
  },
  from: {
    type: Sequelize.TEXT,
  },
  memo: {
    type: Sequelize.TEXT,
  },
  lendingAddress: {
    type: Sequelize.TEXT,
  },
  currency: {
    type: Sequelize.TEXT,
  },
  provider: {
    type: Sequelize.TEXT,
  },
  underlyingToken: {
    type: Sequelize.TEXT,
  },
  amount: {
    type: Sequelize.FLOAT,
  },
  price: {
    type: Sequelize.FLOAT,
  },
  amountUSD: {
    type: Sequelize.FLOAT,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()'),
  },
},{
  freezeTableName: true
});

CharityAccount.prototype.validPassword = function (password) {
  if (this.password == null) {
    this.password = ''
  }
  return bcrypt.compare(password, this.password)
}

const passwordTriggerFunction =
  'CREATE OR REPLACE FUNCTION encrypt_password() RETURNS TRIGGER AS $$' +
  '    DECLARE ' +
  '        data json;' +
  '        notification json;' +
  '    BEGIN' +
  "        NEW.password := crypt(NEW.password, gen_salt('bf',8));" +
  '        RETURN NEW; ' +
  '    END;' +
  '$$ LANGUAGE plpgsql;'

CharityAccount.sync({
  force: false,
}).then((table) => {
  //console.log('applying trigger to ' + table.tableName)
  const tableTrigger =
    'CREATE TRIGGER encrypt_password BEFORE INSERT OR UPDATE OF password ON ' +
    table.tableName +
    ' FOR EACH ROW EXECUTE PROCEDURE public.encrypt_password();'
  seq
    .query(passwordTriggerFunction)
    .then((e) => {
      return seq.query(tableTrigger)
    })
    .then((e) => {
     // console.log('trigger applied')
    })
    .catch((e) => {
      //console.log('trigger already exists')
    })
})

CharityStats.sync({
  force: forceOverwrite
}).then((table) => {

});

UserStats.sync({
  force: forceOverwrite
}).then((table) => {

});

AddressNickname.sync({
  force: false
}).then((table) => {

});

StakingStat.sync({
  force: forceOverwrite
}).then((table) => {

});

CharityAccount.sync({
  force: false
}).then((table) => {

});

Event.sync({
  force: forceOverwrite
}).then((table) => {

});

const db = {
  CharityStats,
  UserStats,
  AddressNickname,
  StakingStat,
  CharityAccount,
  Event,
  seq,
};

module.exports = db;
