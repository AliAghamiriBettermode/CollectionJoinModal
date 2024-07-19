import got from 'got'
import { encodeBase64 } from '../utils/utils.js'

class BettermodeService {
  static instance: BettermodeService

  async handleSubscription(body: any) {
    // TODO: Implement this
    return {}
  }

  async handleInteraction(body: any) {
    // TODO: Implement this
    return {}
  }

  async handleShortcutsStates(body: any) {
    // TODO: Implement this
    return {}
  }

  async getMemberAccessToken(networkId: string, memberId: string) {
    try {
      const response = await got.post('https://api.bettermode.com', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodeBase64(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)}`,
        },
        json: {
          query: `query{
              limitedToken(context: NETWORK, entityId: "${networkId}", networkId: "${networkId}", impersonateMemberId:"${memberId}"){
                  accessToken
              }
            }`,
          variables: {},
        },
      })

      return JSON.parse(response.body).data.limitedToken.accessToken
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async joinSpace(spaceId: string, memberId: string) {
    const accessToken = await this.getMemberAccessToken(process.env.NETWORK_ID!, process.env.ADMIN_MEMBER_ID!)
    if (!accessToken) {
      return false
    }
    const res = await got.post('https://api.bettermode.com', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      json: {
        query: `mutation AddSpaceMembers {
                                    addSpaceMembers(
                                        input: { memberId: "${memberId}" }
                                        spaceId: "${spaceId}"
                                    ) {
                                        member {
                                            id
                                            name
                                        }
                                        role {
                                            id
                                        }
                                    }
                                }`,
        variables: {},
      },
    })
    console.log(res.body)
  }

  static getInstance() {
    if (!BettermodeService.instance) {
      BettermodeService.instance = new BettermodeService()
    }
    return BettermodeService.instance
  }
}

export default BettermodeService






