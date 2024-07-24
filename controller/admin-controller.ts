import BettermodeService from '../service/bettermode-service.js'
import { COLLECTIONS } from '../consts/collections.js'
import _ from 'lodash'
import { errors } from '../consts/errors.js'
import BlueBird from 'bluebird'
import geoip from 'geoip-lite'
import { COUNTRIES } from '../consts/countries.js'

class AdminController {
  static instance: AdminController

  async joinCollection(collectionId: string, memberId: string) {
    const collection = _.find(COLLECTIONS, { id: collectionId })
    if (!collection) {
      return { success: false, error: errors.COLLECTION_NOT_FOUND }
    }
    await BlueBird.mapSeries(collection.spaces.nodes, async (space) => {
      await BettermodeService.getInstance().joinSpace(space.id, memberId)
    })
    return { success: true }
  }

  async getCountryGroupFromIP(ip: string) {
    if (!ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      return { success: false, error: errors.INVALID_IP_ADDRESS }
    }
    const geo = geoip.lookup(ip)
    if (!geo) {
      return { success: false, error: errors.IP_LOOKUP_FAILED }
    }
    const country = _.find(COUNTRIES, { countryCode: geo.country })
    if (!country) {
      return { success: false, error: errors.IP_LOOKUP_FAILED }
    }
    return {
      success: true,
      data: {
        geo,
        countryGroup: country.countryGroup,
      },
    }
  }

  static getInstance() {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController()
    }
    return AdminController.instance
  }
}

export default AdminController