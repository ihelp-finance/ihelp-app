const Sequelize = require('sequelize');
const config = require('../config/server');
const bcrypt = require('bcrypt')

const forceOverwrite = false;

console.log('loading db');

const seq = new Sequelize(
  'ihelp',
  'postgres', 
  'gisp123',
  {
    host: 'ihelp-db',
    dialect: 'postgres',
    logging: false, //console.log,
    freezeTableName: true,
    operatorsAliases: false
  }
)

seq.authenticate().then((errors) => {
  if (errors === undefined) {
    console.log('Connection successful: ', config.database);
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

const ContribByCharity = seq.define('contrib_by_charity', {
  time: {
    type: Sequelize.DATE,
  },
  charityname: {
    type: Sequelize.TEXT,
  },
  charityaddress: {
    type: Sequelize.TEXT,
  },
  currency: {
    type: Sequelize.TEXT,
  },
  total_contrib: {
    type: Sequelize.FLOAT,
  },
  total_contrib_usd: {
    type: Sequelize.FLOAT,
  }
},{
  freezeTableName: true
});

const ContribByUser = seq.define('contrib_by_user', {
  time: {
    type: Sequelize.DATE,
  },
  useraddress: {
    type: Sequelize.TEXT,
  },
  total_contrib: {
    type: Sequelize.FLOAT,
  },
  total_contrib_usd: {
    type: Sequelize.FLOAT,
  },
  contrib_by_charity: {
    type: Sequelize.TEXT,
  },
  contrib_by_charity_usd: {
    type: Sequelize.TEXT,
  }
},{
  freezeTableName: true
});

const TotalInterestByCharity = seq.define('total_interest_by_charity', {
  time: {
    type: Sequelize.DATE,
  },
  charityname: {
    type: Sequelize.TEXT,
  },
  charityaddress: {
    type: Sequelize.TEXT,
  },
  total_interest: {
    type: Sequelize.FLOAT,
  }
},{
  freezeTableName: true
});

const TotalInterestByUser = seq.define('total_interest_by_user', {
  time: {
    type: Sequelize.DATE,
  },
  username: {
    type: Sequelize.TEXT,
  },
  useraddress: {
    type: Sequelize.TEXT,
  },
  total_interest: {
    type: Sequelize.FLOAT,
  }
},{
  freezeTableName: true
});

const StakingStat = seq.define('staking_stats', {
  time: {
    type: Sequelize.DATE,
  },
  ihelp_interest_generated:{
    type: Sequelize.FLOAT,
  },
  ihelp_circulating:{
    type: Sequelize.FLOAT,
  },
  ihelp_supply:{
    type: Sequelize.FLOAT,
  },
  ihelp_avail_supply:{
    type: Sequelize.FLOAT,
  },
  xhelp_exchange_rate: {
    type: Sequelize.FLOAT,
  },
  xhelp_cash: {
    type: Sequelize.FLOAT,
  },
  xhelp_supply: {
    type: Sequelize.FLOAT,
  },
  xhelp_apy: {
    type: Sequelize.FLOAT,
  },
},{
  freezeTableName: true
});

const DirectDonationByUser = seq.define('direct_donation_by_user', {
  time: {
    type: Sequelize.DATE,
  },
  useraddress: {
    type: Sequelize.TEXT,
  },
  charityaddress: {
    type: Sequelize.TEXT,
  },
  charitycurrency: {
    type: Sequelize.TEXT,
  },
  total_donation: {
    type: Sequelize.FLOAT,
  },
  total_donation_usd: {
    type: Sequelize.FLOAT,
  }
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
  console.log('applying trigger to ' + table.tableName)
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
      console.log('trigger applied')
    })
    .catch((e) => {
      console.log('trigger already exists')
    })
})


ContribByCharity.sync({
  force: forceOverwrite
}).then((table) => {

});

ContribByUser.sync({
  force: forceOverwrite
}).then((table) => {

});

TotalInterestByCharity.sync({
  force: forceOverwrite
}).then((table) => {

});

TotalInterestByUser.sync({
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

DirectDonationByUser.sync({
  force: forceOverwrite
}).then((table) => {

});

CharityAccount.sync({
  force: false
}).then((table) => {

});

const db = {
  ContribByCharity,
  ContribByUser,
  TotalInterestByCharity,
  TotalInterestByUser,
  AddressNickname,
  StakingStat,
  DirectDonationByUser,
  CharityAccount,
  seq,
};

module.exports = db;
