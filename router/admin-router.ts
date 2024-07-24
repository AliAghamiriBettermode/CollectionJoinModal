import express from 'express'
import AdminController from '../controller/admin-controller.js'
import { handleResponse } from '../utils/response-handler.js'
import { errors } from '../consts/errors.js'
import { COLLECTIONS } from '../consts/collections.js'
import _ from 'lodash'

const adminRouter = express.Router()

adminRouter.post('/join-collection', async (req, res) => {
  const { member_id: memberId } = req.body
  const ipAddress = req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for'] as string).split(',')[0] : req.ip
  if (!ipAddress) {
    return handleResponse(req, res, { success: false, error: errors.IP_LOOKUP_FAILED })
  }
  if (!memberId) {
    return handleResponse(req, res, { success: false, error: errors.MEMBER_ID_REQUIRED })
  }
  const response = await AdminController.getInstance().joinCollection(ipAddress, memberId)
  return handleResponse(req, res, response)
})

adminRouter.post('/modal-data', async (req, res) => {
  const html = `<div id="collection-join-modal" style="display: none;">
  <div data-portal-id="modal:r6h:" class="isolate" style="opacity: 1;">
    <div
      class="pointer-events-none fixed inset-0 z-10 flex flex-col justify-center overflow-y-hidden overscroll-contain transition-all p-0 sm:p-4">
      <div class="min-h-0">
        <div>
          <div role="dialog" aria-modal="true"
               class="relative pointer-events-auto bg-surface text-content-subdued sm:rounded-modal overflow-y-auto overscroll-contain flex flex-col mx-auto w-full sm:max-w-lg max-h-screen min-h-screen sm:min-h-0 h-full sm:max-h-[calc(100vh-2rem)] shadow-xl transform transition-all"
               aria-labelledby="modal-modal:r6g:-title" style="transform: scale(1);">
            <div class="flex-1 text-md px-4 sm:px-6 overflow-y-auto my-4 py-1">
              <div
                class="w-full flex flex-col max-w-full self-center space-y-3 sm:space-y-3.5 md:space-y-4 lg:space-y-5 py-5 sm:py-6 md:py-7 lg:py-8 px-5 sm:px-6 md:px-7 lg:px-8">
                <span class="inset-0 inline-flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin shrink-0" width="5em" height="5em">
                        <use href="/icon-sprite-line.svg?v=f179f52eb3711fab9a5da90626638f13#icon-spinner">
                        </use>
                      </svg>
                    </span>
                <span class="text-center text-xl block-text" data-block-id="title" data-block-name="text">Preparing your experience...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed inset-0 bg-background-backdrop"></div>
  </div>
</div>`
  return res.status(200).json({ success: true, data: { html } })
})

export default adminRouter