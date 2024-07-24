import got from 'got'
import { encodeBase64 } from '../utils/utils.js'

class BettermodeService {
  static instance: BettermodeService
  accessToken: string | undefined

  constructor() {
    this.getMemberAccessToken(process.env.NETWORK_ID!, process.env.ADMIN_MEMBER_ID!).then((accessToken) => {
      this.accessToken = accessToken
      console.log('Custom App Access token:', this.accessToken)
    })
  }

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
      console.error('[getMemberAccessToken] Error', e)
      return null
    }
  }

  async joinSpace(spaceId: string, memberId: string) {
    if (!this.accessToken) {
      console.error('[joinSpace] Access token not found')
      return false
    }
    try {
      const res = await got.post('https://api.bettermode.com', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
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
      console.log(JSON.parse(res.body))
      return true
    } catch (e) {
      console.error('[joinSpace] Error', e)
      return false
    }
  }

  async updateMemberField(memberId: string, key: string, value: string) {
    if (!this.accessToken) {
      console.error('[updateMemberField] Access token not found')
      return false
    }
    try {
      const res = await got.post('https://api.bettermode.com', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        json: {
          query: `mutation UpdateMember {
                    updateMember(
                        id: "${memberId}"
                        input: { fields: [{ key: "${key}", value: "\\"${value}\\"" }] }
                    ) {
                        name
                        id
                        fields {
                            key
                            value
                        }
                    }
                }`,
          variables: {},
        },
      })
      console.log(JSON.parse(res.body))
      return true
    } catch (e) {
      console.error('[updateMemberField] Error', e)
      return false
    }
  }

  static getInstance() {
    if (!BettermodeService.instance) {
      BettermodeService.instance = new BettermodeService()
    }
    return BettermodeService.instance
  }
}

export default BettermodeService






