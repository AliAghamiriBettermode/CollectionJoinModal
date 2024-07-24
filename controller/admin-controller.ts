import BettermodeService from '../service/bettermode-service.js'
import { COLLECTIONS } from '../consts/collections.js'
import _ from 'lodash'
import { errors } from '../consts/errors.js'
import BlueBird from 'bluebird'
import geoip from 'geoip-lite'
import { COUNTRIES } from '../consts/countries.js'

class AdminController {
  static instance: AdminController

  async joinCollection(ip: string, memberId: string) {
    const countryGroup = await this.getCountryGroupFromIP(ip)
    if (!countryGroup) {
      return { success: false, error: errors.IP_LOOKUP_FAILED }
    }
    const collection = _.find(COLLECTIONS, { countryGroup: countryGroup })
    if (!collection) {
      return { success: false, error: errors.COLLECTION_NOT_FOUND }
    }
    const res = await BettermodeService.getInstance().updateMemberField(memberId, 'country_group', countryGroup)
    if (!res) {
      return { success: false, error: errors.UPDATE_PROFILE_FIELD_FAILED }
    }
    await BlueBird.mapSeries(collection.spaces.nodes, async (space) => {
      const res = await BettermodeService.getInstance().joinSpace(space.id, memberId)
      if (!res) {
        return { success: false, error: errors.JOIN_SPACE_FAILED }
      }
    })
    return { success: true }
  }

  async getCountryGroupFromIP(ip: string) {
    if (!ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      return null
    }
    const geo = geoip.lookup(ip)
    if (!geo) {
      return null
    }
    const country = _.find(COUNTRIES, { countryCode: geo.country })
    if (!country) {
      return null
    }
    return country.countryGroup
  }

  static getInstance() {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController()
    }
    return AdminController.instance
  }
}

export default AdminController