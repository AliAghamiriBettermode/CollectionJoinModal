import BettermodeService from '../service/bettermode-service.js'
import { COLLECTIONS } from '../consts/collections.js'
import _ from 'lodash'
import { errors } from '../consts/errors.js'
import BlueBird from 'bluebird'

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

  static getInstance() {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController()
    }
    return AdminController.instance
  }
}

export default AdminController