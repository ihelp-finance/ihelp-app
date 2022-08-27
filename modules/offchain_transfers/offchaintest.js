var Client = require('coinbase').Client;
const requestPromise = require('request-promise');

const db = require('/core/ihelp/ihelp-app-avax/config/db.js');

const email = 'pgroverman@icloud.com'

let account = null;
let newCreds = null;

let response = {};

db.CharityAccount.findOne({
    where: {
        email: email
    }
}).then((d) => {
    if (d == null) {
        console.log('no email found')
    }
    else {
        return d;
    }
}).then((a) => {

    account = a;

    console.log(account['coinbase_refresh']);

    // with the refresh token get new access token and save new refresh to db

    const client_id = '';
    const client_secret = '';

    const url = `https://api.coinbase.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${account['coinbase_refresh']}&grant_type=refresh_token`

    var options = {
        method: 'POST',
        url: url,
        json: true
    }
    return requestPromise(options)

}).then((body) => {

    newCreds = body;

    account.coinbase_refresh = newCreds['refresh_token']

    return account.save()

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
                        response['coinbase']['usd'] = fiat_account.balance.amount;
                        getCharityInfo();
                    });
                }
                else {
                    getCharityInfo();
                }

            });
        });
    });

}).catch((r) => {
    try {
        console.log(r.response.body)
    }
    catch (e) {
        console.log(r)
    }
    process.exit(0)
})

const getCharityInfo = () => {
    console.log(response);
    process.exit(0)
}