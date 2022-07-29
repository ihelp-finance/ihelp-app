const express = require('express');
const fs = require('fs');
const csv = require('csvtojson');
const request = require('request');
const requestPromise = require('request-promise');
const Client = require('coinbase').Client;
const Sequelize = require('sequelize');
const _ = require('underscore');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    charities: '/api/v1/data/charities',
    stats: '/api/v1/data/stats',
    //totalinterestbycharities: '/api/v1/data/totalinterestbycharities',
    nickname: '/api/v1/data/nickname',
    //allnicknames: '/api/v1/data/allnicknames',
    //totalinterestbycharities: '/api/v1/data/totalinterestbycharities',
    //topcharities: '/api/v1/data/topcharities',
    leaderboard: '/api/v1/data/leaderboard',
    stakingstats: '/api/v1/data/stakingstats',
    //contribovertime: '/api/v1/data/contribovertime',
    events: '/api/v1/data/events',
    contracts: '/api/v1/data/contracts',
  });
});


const getCharityStats = (req, contractAddress) => {

  let latestCharityInterest = 0;
  let latestCharityContribution = 0;
  return {
    interest: latestCharityInterest,
    contribution: latestCharityContribution,
  }
  // return req.app.db.TotalInterestByCharity.findOne({
  //     where: { charityaddress: contractAddress },
  //     order: [
  //       ['updatedAt', 'DESC']
  //     ],
  //   })
  //   .then((data) => {
  //     try {
  //       latestCharityInterest = data['total_interest'];
  //     }
  //     catch (e) {}
  //     return req.app.db.ContribByCharity.findOne({
  //       where: { charityaddress: contractAddress },
  //       order: [
  //         ['updatedAt', 'DESC']
  //       ],
  //     })
  //   })
  //   .then((data) => {
  //     try {
  //       latestCharityContribution = data['total_contrib_usd'];
  //     }
  //     catch (e) {}
  //     return {
  //       interest: latestCharityInterest,
  //       contribution: latestCharityContribution,
  //     }
  //   });
}



const charityMapAddress = {}
const charityMapName = {}

const setCharityMap = () => {

  const contractFile = `/build/${process.env.REACT_APP_NETWORK}_charities.json`

  let d = fs.readFileSync(contractFile, 'utf8')
  d = JSON.parse(d);

  let deployTestCharities = false

  d.map((k) => {
    if (k['charityName'] == 'Charity Pool 1') {
      deployTestCharities = true
    }
  })

  const charityContracts = [];
  if (deployTestCharities == true) {

    d.map((k) => {
      charityContracts.push(k['address']);
    })

    var long_id = "1KQ7kzA2T8nDED8vo9XjnSEQyLDkxajhO6fkw1H72KgM"
    var g_id = "727836194"
    var url = "https://docs.google.com/spreadsheets/d/" + long_id + "/export?gid=" + g_id + "&format=csv&id=" + long_id
    request(url, function(error, response, body) {

      if (error == null) {
        csv()
          .fromString(body)
          .then((jsonObj) => {

            const filteredJsonObj = [];

            let charityContractsCount = 0

            jsonObj.forEach(e => {

              if (charityContractsCount < charityContracts.length) {
                charityMapAddress[charityContracts[charityContractsCount]] = e['Organization Name']
                charityMapName[e['Organization Name']] = charityContracts[charityContractsCount]
              }
              charityContractsCount += 1

            })

            console.log('charityMapName', charityMapName)

          })

      }

    })


  }
  else {
    d.map((k) => {
      charityMapAddress[k['address']] = k['charityName']
      charityMapName[k['charityName']] = k['address']
    })
    //console.log('charityDevMapName', charityMapName)
  }



}

console.log('SETTING CHARITY MAP')
setCharityMap()


const getCharityInformation = (req, moveOn, skipCharityStats) => {

  // in dev mode get new charity addresses
  //if (process.env.NODE_ENV == 'development') {
  //  console.log('SETTING CHARITY MAP')
  setCharityMap()
  //}

  //var long_id = "1lwHTt1C8tkm_LEHFv2kcqaTOgNFJ6U0p32M_j98zts0"
  //var g_id = "313945428"
  var long_id = "1KQ7kzA2T8nDED8vo9XjnSEQyLDkxajhO6fkw1H72KgM"
  var g_id = "727836194"
  var url = "https://docs.google.com/spreadsheets/d/" + long_id + "/export?gid=" + g_id + "&format=csv&id=" + long_id
  request(url, function(error, response, body) {

    if (error == null) {
      csv()
        .fromString(body)
        .then((jsonObj) => {

          const filteredJsonObj = [];

          jsonObj.forEach(e => {

            const maxChars = 200;
            if (e['Brief Description & History'].length > maxChars) {
              e['Shorted Description'] = `${e['Brief Description & History'].slice(0, 200)}...`
            }
            else {
              e['Shorted Description'] = e['Brief Description & History'];
            }

            if (Object.keys(charityMapName).indexOf(e['Organization Name']) > -1) {

              e['CharityPool Contract'] = charityMapName[e['Organization Name']]

              if (process.env.NODE_ENV == 'development') {
                e['Status'] = 'LIVE'
              }

              if (e['Status'] == 'LIVE' || e['Status'] == 'HIDE') {
                filteredJsonObj.push(e);
              }

            }

          });

          filteredJsonObj.sort((a, b) => (a['Organization Name'] > b['Organization Name']) ? 1 : -1)

          return filteredJsonObj

        })
        .then((filteredJsonObj) => {

          moveOn(filteredJsonObj);

        })

    }
  });
}

router.get('/charities', (req, res) => {

  const moveOn = (data) => {
    res.send(data);
  }

  getCharityInformation(req, moveOn);

});

router.get('/charities/:id', (req, res) => {

  const charity_id = req.params.id;

  // var long_id = "1lwHTt1C8tkm_LEHFv2kcqaTOgNFJ6U0p32M_j98zts0"
  // var g_id = "313945428"
  var long_id = "1KQ7kzA2T8nDED8vo9XjnSEQyLDkxajhO6fkw1H72KgM"
  var g_id = "727836194"
  var url = "https://docs.google.com/spreadsheets/d/" + long_id + "/export?gid=" + g_id + "&format=csv&id=" + long_id
  request(url, function(error, response, body) {

    if (error == null) {
      csv()
        .fromString(body)
        .then((jsonObj) => {

          // jsonObj.sort((a, b) => (a['Organization Name'] > b['Organization Name'] ) ? 1 : -1)

          var charityObject = null;
          for (var i = 0; i < jsonObj.length; i++) {

            if (Object.keys(charityMapAddress).indexOf(charity_id) > -1) {
              if (charityMapName[jsonObj[i]['Organization Name']] == charity_id) {

                jsonObj[i]['CharityPool Contract'] = charity_id

                if (process.env.NODE_ENV == 'development') {
                  jsonObj[i]['Status'] = 'LIVE'
                }

                charityObject = jsonObj[i]
                break
              }
            }

          }

          // const getCharityStat = async() => {

          //   const e = charityObject;
          //   const currencies = [];
          //   e['Stats'] = {}
          //   if (e['DAI CharityPool'] != '') {
          //     currencies.push('DAI');
          //     e['Stats']['DAI'] = await getCharityStats(req, e['DAI CharityPool']);
          //   }
          //   if (e['USDC CharityPool'] != '') {
          //     currencies.push('USDC');
          //     e['Stats']['USDC'] = await getCharityStats(req, e['USDC CharityPool']);
          //   }
          //   e['Currencies'] = currencies;

          //   e['Stats']['Total'] = {};
          //   e['Stats']['Total']['interest'] = 0;
          //   e['Stats']['Total']['contribution'] = 0;

          //   for (let j = 0; j < currencies.length; j++) {
          //     e['Stats']['Total']['interest'] += e['Stats'][currencies[j]]['interest'];
          //     e['Stats']['Total']['contribution'] += e['Stats'][currencies[j]]['contribution'];
          //   }

          //   moveOn(charityObject);

          // }

          const moveOn = (charityObject) => {
            if (charityObject != null) {
              res.send({
                message: 'success',
                data: charityObject
              })
            }
            else {
              res.send({
                message: 'error - no charity found'
              })
            }
          }

          if (charityObject) {
            // getCharityStat()
            moveOn(charityObject)
          }
          else {
            moveOn(charityObject)
          }

        })
    }
  });

});

router.get('/stats', (req, res) => {

  // return the key stats for the frontend
  const response = {
    totalInterest: 0,
    totalCharities: 0,
    tvl: 0,
    totalHelpers: 0,
    totalCountries: 2
  }

  req.app.db.ContribByCharity.findAll({
      order: [
        ['time', 'DESC']
      ],
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('time')), 'time'],
      ],
      raw: true,
      limit: 1
    })
    .then((data) => {

      const times = _.map(data, function(data) { return data.time; });

      return req.app.db.ContribByCharity.findAll({
        where: { time: times },
        group: ['contrib_by_charity.time'],
        attributes: ['time', [Sequelize.fn('sum', Sequelize.col('total_contrib_usd')), 'total_contrib_usd']],
        order: [
          ['time', 'DESC']
        ],
        raw: true,
      });

    })
    .then((data) => {

      // get in series format
      // [time,total]
      const r = _.map(data, function(data) { return parseFloat(data.total_contrib_usd.toFixed(0)); });

      if (r.length > 0) {
        response['tvl'] = r[0];
      }

      return req.app.db.TotalInterestByCharity.findOne({
        order: [
          ['updatedAt', 'DESC']
        ],
      })

    })
    .then((data) => {
      const latestTime = data.time;
      return req.app.db.TotalInterestByCharity.findAll({
        where: { time: latestTime },
        order: [
          ['total_interest', 'DESC']
        ]
      })
    }).then((d) => {
      let totalinterest = 0;
      let totalcharities = d.length;
      d.map((d) => {
        totalinterest += d.total_interest;
      })
      response['totalInterest'] = parseFloat(totalinterest.toFixed(2))
      response['totalCharities'] = totalcharities

      return req.app.db.ContribByUser.count({ distinct: true, col: 'useraddress' })

    }).then((d) => {

      response['totalHelpers'] = d;

      // var long_id = "1lwHTt1C8tkm_LEHFv2kcqaTOgNFJ6U0p32M_j98zts0"
      // var g_id = "313945428"
      var long_id = "1KQ7kzA2T8nDED8vo9XjnSEQyLDkxajhO6fkw1H72KgM"
      var g_id = "727836194"
      var url = "https://docs.google.com/spreadsheets/d/" + long_id + "/export?gid=" + g_id + "&format=csv&id=" + long_id
      request(url, function(error, ress, body) {

        if (error == null) {
          csv()
            .fromString(body)
            .then((jsonObj) => {
              response['totalCharities'] = jsonObj.length;
              res.json(response);
            })
        }
        else {
          res.json(response);
        }

      })

    })

});

router.get('/totalinterestbycharities', (req, res) => {

  let latestTime = null;
  let data;
  req.app.db.TotalInterestByCharity.findOne({
      order: [
        ['updatedAt', 'DESC']
      ],
    })
    .then((data) => {
      latestTime = data.time;
      return req.app.db.TotalInterestByCharity.findAll({
        where: { time: latestTime },
        order: [
          ['total_interest', 'DESC']
        ]
      })
    }).then((d) => {
      data = d;
      res.send(data);
    })

});

router.post('/nickname', (req, res) => {
  if (req.body.address != undefined && req.body.address != '' && req.body.nickname != undefined && req.body.nickname != '') {
    req.app.db.AddressNickname.findOne({
      where: {
        address: req.body.address
      }
    }).then((d) => {
      if (d == null) {
        const data = {
          nickname: req.body.nickname,
          address: req.body.address
        }
        return req.app.db.AddressNickname.create(data)
      }
      else {
        d.nickname = req.body.nickname;
        return d.save()
      }
    }).then((d) => {
      res.send('success');
    })
  }
  else {
    res.send('error - please send valid parameters');
  }
});

router.get('/nickname', (req, res) => {
  if (req.query.address != undefined && req.query.address != '') {
    req.app.db.AddressNickname.findOne({
      where: {
        address: req.query.address
      }
    }).then((d) => {
      if (d == null) {
        res.send(null);
      }
      else {
        res.send(d.nickname);
      }
    })
  }
  else {
    res.send('error - please send valid parameters');
  }
});

router.get('/topcharities', (req, res) => {

  let latestTime = null;
  let data;
  req.app.db.ContribByCharity.findOne({
      order: [
        ['updatedAt', 'DESC']
      ],
    })
    .then((data) => {
      latestTime = data.time;
      return req.app.db.ContribByCharity.findAll({
        where: { time: latestTime },
        order: [
          ['total_contrib_usd', 'DESC']
        ],
        limit: 10
      })
    }).then((d) => {
      data = d;
      res.send(data);
    })

});

/*
router.get('/userstats', (req, res) => {

  const useraddress = req.query.address

  const response = {};


  const moveOn = (data) => {

    const charityHash = {};
    for (let i = 0; i < data.length; i++) {

      if (data[i]['DAI CharityPool'] != '') {
        charityHash[data[i]['DAI CharityPool']] = {
          currency: 'DAI',
          name: data[i]['Organization Name'],
          id: data[i]['Id'],
          logo: data[i]['Logo']
        }
      }

      if (data[i]['USDC CharityPool'] != '') {
        charityHash[data[i]['USDC CharityPool']] = {
          currency: 'USDC',
          name: data[i]['Organization Name'],
          id: data[i]['Id'],
          logo: data[i]['Logo']
        }
      }

    }

    response['contrib_by_charity_summary'] = {}
    //response['contrib_by_charity_usd_summary'] ={}

    let totalContributions = 0;

    if (Object.keys(response['contrib_by_charity']).length > 0) {

      for (var i = 0; i < Object.keys(response['contrib_by_charity']).length; i++) {

        var key = Object.keys(response['contrib_by_charity'])[i];

        console.log(key)

        totalContributions += response['contrib_by_charity'][key];

        var match = charityHash[key];
        // console.log(match)

        if (match != undefined) {

          if (response['contrib_by_charity'][key] > 0) {
            if (Object.keys(response['contrib_by_charity_summary']).includes(match['name'])) {
              response['contrib_by_charity_summary'][match['name']][match['currency']] = {
                address: key,
                contrib: response['contrib_by_charity'][key]
              }
              response['contrib_by_charity_summary'][match['name']]['total'] += response['contrib_by_charity'][key]
            }
            else {
              response['contrib_by_charity_summary'][match['name']] = {};
              response['contrib_by_charity_summary'][match['name']]['total'] = 0;
              response['contrib_by_charity_summary'][match['name']]['id'] = match['id'];
              response['contrib_by_charity_summary'][match['name']]['logo'] = match['logo'];
              response['contrib_by_charity_summary'][match['name']][match['currency']] = {
                address: key,
                contrib: response['contrib_by_charity'][key]
              }
              response['contrib_by_charity_summary'][match['name']]['total'] += response['contrib_by_charity'][key]
            }
          }

        }

        //response['contrib_by_charity_usd_summary'] 
      }

    }

    response['contrib_by_charity_summary']['total'] = totalContributions;

    res.send(response);
  }

  if (useraddress != undefined && useraddress != '') {

    let data;
    req.app.db.ContribByUser.findAll({
        where: {
          useraddress: useraddress
        },
        order: [
          ['time', 'DESC']
        ],
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('time')), 'time'],
          [Sequelize.col('total_contrib'), 'total_contrib'],
          [Sequelize.col('total_contrib_usd'), 'total_contrib_usd'],
          [Sequelize.col('contrib_by_charity'), 'contrib_by_charity'],
          [Sequelize.col('contrib_by_charity_usd'), 'contrib_by_charity_usd'],
        ],
        raw: true,
        limit: 24 * 7
      })
      .then((data) => {
        const r = _.map(data, function(data) { return { 'time': data.time, 'contrib': parseFloat(data.total_contrib_usd.toFixed(0)) } });
        response['contribovertime'] = r;

        response['contrib_by_charity'] = {};
        response['contrib_by_charity_usd'] = {};
        if (data.length > 0) {
          response['contrib_by_charity'] = JSON.parse(data[0]['contrib_by_charity']);
          response['contrib_by_charity_usd'] = JSON.parse(data[0]['contrib_by_charity_usd']);
        }
        response['contribovertime'] = response['contribovertime'].reverse()

        return req.app.db.AddressNickname.findOne({
          where: {
            address: useraddress
          }
        })

        // res.send(response)

      })
      .then((d) => {
        let nickname = null;
        if (d == null) {
          // empty
        }
        else {
          nickname = d.nickname;
        }
        response['nickname'] = nickname;
        getCharityInformation(req, moveOn, true);

      })

  }

});
*/

router.get('/stakingstats', (req, res) => {

  const response = {};

  let data;
  req.app.db.StakingStat.findAll({
      order: [
        ['time', 'ASC']
      ],
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('time')), 'time'],
        [Sequelize.col('total_reward'), 'total_reward'],
      ],
      raw: true,
      limit: 24 * 7
    })
    .then((data) => {
      const r = _.map(data, function(data) {

        let reward = 0
        if (data.total_reward != null) {
          reward = parseFloat(data.total_reward.toFixed(6));
        }
        return { 'time': data.time, 'total_reward': reward }
      });

      response['rewardovertime'] = r;

      // response['contrib_by_charity'] = {};
      // response['contrib_by_charity_usd'] = {};
      // if (data.length > 0) {
      //   response['contrib_by_charity'] = JSON.parse(data[0]['contrib_by_charity']);
      //   response['contrib_by_charity_usd'] = JSON.parse(data[0]['contrib_by_charity_usd']);
      // }

      res.send(response)

    })
});

/*
router.get('/contribovertime', (req, res) => {

  let data;
  req.app.db.ContribByCharity.findAll({
      order: [
        ['time', 'DESC']
      ],
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('time')), 'time'],
      ],
      raw: true,
      limit: 24 * 7
    })
    .then((data) => {
      const times = _.map(data, function(data) { return data.time; });

      return req.app.db.ContribByCharity.findAll({
        where: { time: times },
        group: ['contrib_by_charity.time'],
        attributes: ['time', [Sequelize.fn('sum', Sequelize.col('total_contrib_usd')), 'total_contrib_usd']],
        order: [
          ['time', 'DESC']
        ],
        raw: true,
      });

    })
    .then((data) => {

      // get in series format
      // [time,total]
      const r = _.map(data, function(data) { return [data.time, parseFloat(data.total_contrib_usd.toFixed(0))]; });

      res.send(r)
    });

});
*/



router.get('/allnicknames', (req, res) => {

  req.app.db.AddressNickname.findAll({
    attributes: ['address', 'nickname']
  }).then((data) => {
    res.send(data)
  })

})


router.get('/topcontributors', (req, res) => {

  let latestTime = null;
  let data;
  req.app.db.ContribByUser.findOne({
      order: [
        ['updatedAt', 'DESC']
      ],
    })
    .then((data) => {
      latestTime = data.time;
      return req.app.db.ContribByUser.findAll({
        where: { time: latestTime },
        order: [
          ['total_contrib_usd', 'DESC']
        ],
        limit: 100
      })
    }).then((d) => {

      data = d;

      const addresses = [];
      for (let i = 0; i < data.length; i++) {
        addresses.push(data[i].useraddress);
      }
      // combine with nicknames
      return req.app.db.AddressNickname.findAll({
        where: {
          address: addresses
        }
      })


    }).then((n) => {
      const addressHash = {};
      for (let i = 0; i < n.length; i++) {
        addressHash[n[i].address] = n[i].nickname;
      }
      // console.log(addressHash);

      var r = [];
      for (let i = 0; i < data.length; i++) {
        const d = data[i].dataValues;
        if (d.useraddress in addressHash) {
          d.nickname = addressHash[d.useraddress];
        }
        else {
          d.nickname = null;
        }
        r.push(d)

      }
      res.send(r);
    })

});

router.get('/coinbase/callback', (req, res) => {

  console.log(req.query);

  const client_id = '50bbd2ddf161d4e414a92fd269a4ce215fd6d9846ae8bd2645ea727a6895bfef';
  const client_secret = '';

  var options = {
    method: 'POST',
    url: `https://api.coinbase.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=https://avalanche.ihelp.finance/api/v1/data/coinbase/callback`,
  }
  request(options, function(error, response, body) {

    //console.log(body);

    req.app.db.CharityAccount.findOne({
      where: {
        email: req.query.state
      },
    }).then((d) => {
      if (d != null) {
        try {
          d.coinbase_refresh = JSON.parse(body)['refresh_token']
        }
        catch (e) {
          console.log('cannot parse refresh_token');
        }
        return d.save()

      }
      else {
        res.json({
          message: 'error - cannot find user'
        })
      }
    }).then(() => {
      res.redirect('/account')
    })

  })

});

router.get('/login', (req, res) => {

  let user = null;
  let newCreds = null;

  let response = {};

  req.app.db.CharityAccount.findOne({
    where: {
      email: req.query.email,
    },
  }).then((u) => {
    user = u;
    if (user) {
      user
        .validPassword(req.query.pass)
        .then((d) => {
          if (d == true) {

            if (user['coinbase_refresh'] != null && req.query.fetchWallet == 'true') {

              console.log(user['coinbase_refresh']);

              // with the refresh token get new access token and save new refresh to db

              const client_id = '50bbd2ddf161d4e414a92fd269a4ce215fd6d9846ae8bd2645ea727a6895bfef';
              const client_secret = '9f328d30217c003daa767958aea3a1db80e0966b6a73a97a40c0534fa68a9eee';

              const url = `https://api.coinbase.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${user['coinbase_refresh']}&grant_type=refresh_token`

              var options = {
                method: 'POST',
                url: url,
                json: true
              }

              response = {
                message: 'success',
                email: user.email,
                coinbase: false,
                charity: null
              }

              return requestPromise(options)

            }

            else if (user['binance_api'] != null && req.query.fetchWallet == 'true') {

            }
            else {

              response = {
                message: 'success',
                email: user.email,
                coinbase: false,
                charity: null
              }

              getCharityInfo();

            }

          }
          else {
            res.json({
              message: 'password not correct',
            })
          }
        }).then((body) => {

          newCreds = body;

          user.coinbase_refresh = newCreds['refresh_token']

          return user.save()

        }).then((d) => {

          console.log(newCreds);

          var client = new Client({ 'accessToken': newCreds['access_token'], 'refreshToken': newCreds['refresh_token'], strictSSL: false });

          client.getCurrentUser(function(err, current_user) {

            response['coinbase'] = {};
            response['coinbase']['username'] = current_user['name'];

            client.getAccount('AVAX', function(err, avax_account) {

              response['coinbase']['avax'] = avax_account.balance.amount;

              client.getPaymentMethods({}, function(err, methods) {

                let fiat_account = null;
                for (let i = 0; i < methods.length; i++) {
                  if (methods[i]['name'] == 'Cash (USD)') {
                    fiat_account = methods[i]['fiat_account']['id'];
                    break
                  }
                }
                console.log(fiat_account);

                if (fiat_account) {
                  client.getAccount(fiat_account, function(err, fiat_account) {
                    //console.log(fiat_account)
                    try {
                      response['coinbase']['usd'] = fiat_account.balance.amount;
                    }
                    catch (e) {
                      response['coinbase']['usd'] = 'NA'
                    }
                    getCharityInfo();
                  });
                }
                else {
                  getCharityInfo();
                }

              });
            });
          });

        })
      // .catch((err) => {
      //   res.json(response)
      // })
    }
    else {
      res.json({
        message: 'no user found',
      })
    }
  })

  const getCharityInfo = () => {

    // var long_id = "1lwHTt1C8tkm_LEHFv2kcqaTOgNFJ6U0p32M_j98zts0"
    // var g_id = "313945428"
    var long_id = "1KQ7kzA2T8nDED8vo9XjnSEQyLDkxajhO6fkw1H72KgM"
    var g_id = "727836194"
    var url = "https://docs.google.com/spreadsheets/d/" + long_id + "/export?gid=" + g_id + "&format=csv&id=" + long_id
    request(url, function(error, re, body) {

      if (error == null) {
        csv()
          .fromString(body)
          .then((jsonObj) => {

            // jsonObj.sort((a, b) => (a['Organization Name'] > b['Organization Name'] ) ? 1 : -1)

            var charityObject = null;
            for (var i = 0; i < jsonObj.length; i++) {
              if (jsonObj[i]['Email Address'] == response['email']) {
                charityObject = jsonObj[i]
                break
              }
            }

            const getCharityStat = async() => {

              const e = charityObject;
              const currencies = [];
              e['Stats'] = {}
              if (e['DAI CharityPool'] != '') {
                currencies.push('DAI');
                e['Stats']['DAI'] = await getCharityStats(req, e['DAI CharityPool']);
              }
              if (e['USDC CharityPool'] != '') {
                currencies.push('USDC');
                e['Stats']['USDC'] = await getCharityStats(req, e['USDC CharityPool']);
              }
              e['Currencies'] = currencies;

              e['Stats']['Total'] = {};
              e['Stats']['Total']['interest'] = 0;
              e['Stats']['Total']['contribution'] = 0;

              for (let j = 0; j < currencies.length; j++) {
                e['Stats']['Total']['interest'] += e['Stats'][currencies[j]]['interest'];
                e['Stats']['Total']['contribution'] += e['Stats'][currencies[j]]['contribution'];
              }

              moveOn(charityObject);

            }

            const moveOn = (charityObject) => {
              if (charityObject != null) {
                response['charity'] = charityObject;
                res.json(response);
              }
              else {
                res.json(response);
              }
            }

            if (charityObject) {
              getCharityStat()
            }
            else {
              moveOn(charityObject)
            }

          })
      }
    });

  }

})

router.get('/contracts', (req, res) => {

   const contractFile = `/build/${process.env.REACT_APP_NETWORK}_contracts.json`
    
  fs.readFile(contractFile, 'utf8', (e, dd) => {

    /*
    const chainid = '31337'
    
    const d = JSON.parse(dd)
    
    // only return the key function contracts
    const contractFilters = ['analytics','iHelp']
    
    const contractKeys = Object.keys(d[chainid][0]['contracts']);
    
    const response = {}
    response[chainid] = [{
        "name": d[chainid][0]['name'],
        "chainId": chainid,
        "contracts": {}
      }]

    contractKeys.map((k)=>{
      if (contractFilters.indexOf(k) > -1) {
        response[chainid][0]['contracts'][k] = d[chainid][0]['contracts'][k];
      }
    })
    */

    try {
      res.json(JSON.parse(dd));
    }
    catch (e) {
      res.send({});
    }

  })

})

router.post('/event', (req, res) => {

  if (req.query.key == process.env.EVENT_API_KEY) {

    console.log(req.body)

    req.app.db.Event.create(req.body)

    res.send({
      error: false,
      message: 'success'
    })

  }
  else {
    res.send({
      error: true,
      message: 'cannot validate event api key'
    })
  }

});

router.get('/events', (req, res) => {

  const address = req.query.address;

  if (address != undefined) {

    req.app.db.Event.findAll({
      where: { sender: address },
      order: [
        ['createdAt', 'ASC']
      ],
      //limit: 100
    }).then((d) => {

      res.send(d)

    })

  }
  else {
    res.send({
      error: true,
      message: 'cannot find address'
    })
  }

});

router.get('/userstats', (req, res) => {

  const address = req.query.address;

  const contribOverTime = []

  if (address != undefined) {

    req.app.db.Event.findAll({
      where: { sender: address },
      order: [
        ['createdAt', 'ASC']
      ],
      //limit: 100
    }).then((d) => {

      // create time series scatter map of the contributions

      let lastContrib = 0

      d.map((dd) => {

        contribOverTime.push({
          time: dd['createdAt'],
          contrib: lastContrib + dd['amountUSD']
        });

        lastContrib = lastContrib + dd['amountUSD']

      })

      return req.app.db.AddressNickname.findOne({
        where: {
          address: address
        }
      })


    }).then((d) => {

      const response = {
        nickname: null,
        address: address,
        contribovertime: contribOverTime,
      }

      if (d == null) {
        res.send(response);
      }
      else {
        response['nickname'] = d.nickname
        res.send(response);
      }

    })

  }
  else {
    res.send({
      error: true,
      message: 'cannot find address'
    })
  }

});

router.get('/leaderboard', (req, res) => {

  const response = {
    helpers: [],
    charities: []
  }
  req.app.db.CharityStats.findAll({
    limit: 100,
    order: [
      ['contributions', 'DESC']
    ]
  }).then((d) => {

    response.charities = d;

    return req.app.db.UserStats.findAll({
      limit: 100,
      order: [
        ['contributions', 'DESC']
      ]
    })

  }).then((d) => {

    response.helpers = d;

    res.send(response)

  })

})


module.exports = router;
