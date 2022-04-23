
import requests,sys
import pprint as pp
from coinbase.wallet.client import OAuthClient

# https://www.coinbase.com/oauth/authorize?client_id=50bbd2ddf161d4e414a92fd269a4ce215fd6d9846ae8bd2645ea727a6895bfef&redirect_uri=https%3A%2F%2Favalanche.ihelp.finance%2Fapi%2Fv1%2Fdata%2Fcoinbase%2Fcallback&response_type=code&account_currency=AVAX&scope=wallet:sells:read,wallet:sells:create,wallet:user:read,wallet:accounts:read,wallet:addresses:read,wallet:withdrawals:create

# meta[send_limit_amount]=50&
# meta[send_limit_currency]=USD&
# meta[send_limit_period]=day
    
refresh_token = '57a9115b4c1c0c4290d096044003cbb073b89e7150f71c1e3ff97dbccc13241b'

# url = 'https://api.coinbase.com/oauth/token?client_id=50bbd2ddf161d4e414a92fd269a4ce215fd6d9846ae8bd2645ea727a6895bfef&client_secret=9f328d30217c003daa767958aea3a1db80e0966b6a73a97a40c0534fa68a9eee&refresh_token=%s&grant_type=refresh_token' % refresh_token
# print(url)
# res = requests.post(url)
# data = res.json()
# print(data)
# access_token = data['access_token']

access_token = 'ea28d46a4b623f85ce04ec3d9441cd0d93da02f74e3f79c1f7d810b778afea1f'

print('access_token',access_token)

client = OAuthClient(access_token, refresh_token)

user = client.get_current_user()
# accounts = client.get_accounts()
# for a in accounts['data']:
#     print(a['id'])

#print(user)

print('\n',user['name'])

#usd_account = client.get_payment_methods()
usd_account = client.get_account('f68318f6-33bc-54fa-a3f0-8bac4ee17310')
pp.pprint(usd_account)

sys.exit(0)

avax_account = client.get_account('AVAX')
avax_address = client.get_addresses('AVAX')

print('avax start balance:',avax_account['balance']['amount'])
print('avax address:',avax_address['data'][0]['address'])

# holding pool signer needs to swap to avax
# here holding pool signer should initiate transfer from avax holding pool to users avax address

# after transfer is made, sell the transfered avax to usd

sell_amount = '0.00000983'

print('selling',sell_amount,'avax through coinbase')

#sell  = client.sell('AVAX', amount=sell_amount, currency='AVAX')

# print(sell)

# if sell.id:
#     client.commit_sell('AVAX', sell.id)