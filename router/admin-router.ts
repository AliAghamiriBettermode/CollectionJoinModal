import express from 'express'
import AdminController from '../controller/admin-controller.js'
import { handleResponse } from '../utils/response-handler.js'
import { errors } from '../consts/errors.js'
import { COLLECTIONS } from '../consts/collections.js'
import _ from 'lodash'

const adminRouter = express.Router()

adminRouter.post('/join-collection', async (req, res) => {
  const { member_id: memberId, collection_id: collectionId } = req.body
  if (!collectionId) {
    return handleResponse(req, res, { success: false, error: errors.COLLECTION_ID_REQUIRED })
  }
  if (!memberId) {
    return handleResponse(req, res, { success: false, error: errors.MEMBER_ID_REQUIRED })
  }
  const response = await AdminController.getInstance().joinCollection(collectionId, memberId)
  return handleResponse(req, res, response)
})

adminRouter.get('/get-location', async (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for'] as string).split(',')[0] : req.ip
  if (!ipAddress) {
    return handleResponse(req, res, { success: false, error: errors.IP_ADDRESS_REQUIRED })
  }
  const response = await AdminController.getInstance().getCountryGroupFromIP(ipAddress)
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
            <div class="px-4 py-5 sm:p-6 flex justify-between pb-0 sm:pb-0 items-start">
              <div class="text-start sm:mt-0 sm:text-start min-w-0 break-words"><h3
                class="font-medium text-heading-xs text-content pe-10" id="modal-modal:r6g:-title">Join Perks</h3></div>
              <div class="flex gap-1 items-center absolute top-4 right-4">
                <button id="collection-join-modal-close" type="button" aria-label="Close"
                        class="inline-block py-[9px] w-10 h-10 leading-5 text-label-sm rounded-button relative min-w-0 max-w-full font-medium text-center focus:outline-none focus-visible:ring transition duration-200 border disabled:cursor-default disabled:pointer-events-none disabled:border-line-disabled text-content hover:bg-action-neutral-hovered active:bg-action-neutral-pressed aria-pressed:bg-action-neutral-pressed disabled:bg-action-neutral-disabled disabled:text-content-disabled border-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-5 w-5 mx-auto shrink-0 shrink-0" width="1em"
                       height="1em" aria-hidden="true" focusable="false">
                    <use href="/icon-sprite-line.svg?v=f179f52eb3711fab9a5da90626638f13#icon-close"></use>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex-1 text-md px-4 sm:px-6 overflow-y-auto my-4 py-1">
              <div
                class="w-full flex flex-col max-w-full self-center space-y-3 sm:space-y-3.5 md:space-y-4 lg:space-y-5 py-5 sm:py-6 md:py-7 lg:py-8 px-5 sm:px-6 md:px-7 lg:px-8">
                <span class="text-start text-xl block-text" data-block-id="title" data-block-name="text">Join Perks based on your country!</span>
                <div
                  class="w-full flex flex-col max-w-full md:max-w-8xl self-center space-y-3 sm:space-y-3.5 md:space-y-4 lg:space-y-5 py-0 sm:py-0 md:py-0 lg:py-0 px-0 sm:px-0 md:px-0 lg:px-0">
                  ${_.map(COLLECTIONS, c => `
                  <button type="button" class="touch-manipulation inline-block rounded-button px-3.5 py-[5px] min-h-[32px] leading-5 text-label-sm justify-center truncate relative min-w-0 max-w-full font-medium text-center focus:outline-none focus-visible:ring transition duration-200 border disabled:cursor-default disabled:pointer-events-none disabled:border-line-disabled text-content-on-primary bg-action-primary hover:bg-action-primary-hovered active:bg-action-primary-pressed aria-pressed:bg-action-primary-pressed disabled:bg-action-primary-disabled disabled:text-content-disabled border-transparent focus-visible:ring-focused justify-center" data-block-id="button-${c.id}" data-block-name="button">${c.name}</button>
                  <button type="button" style="display: none;" class="touch-manipulation inline-flex gap-2 items-center rounded-button px-3.5 py-[5px] min-h-[32px] leading-5 text-label-sm justify-center truncate relative min-w-0 max-w-full font-medium text-center focus:outline-none focus-visible:ring transition duration-200 border disabled:cursor-default disabled:pointer-events-none disabled:border-line-disabled opacity-60 cursor-default pointer-events-none text-content-on-primary bg-action-primary hover:bg-action-primary-hovered active:bg-action-primary-pressed aria-pressed:bg-action-primary-pressed disabled:bg-action-primary-disabled disabled:text-content-disabled border-transparent focus-visible:ring-focused justify-center" data-block-id="button-${c.id}-loading" data-block-name="button">
                    <span class="min-w-0 invisible truncate">${c.name}</span>
                    <span class="absolute inset-0 inline-flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin shrink-0" width="1em" height="1em">
                        <use href="/icon-sprite-line.svg?v=f179f52eb3711fab9a5da90626638f13#icon-spinner">                  
                        </use>
                      </svg>
                    </span>
                  </button>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed inset-0 bg-background-backdrop"></div>
  </div>
</div>`
  const buttons = _.map(COLLECTIONS, c => ({
    id: `button-${c.id}`,
    collection_id: c.id,
  }))
  return res.status(200).json({ success: true, data: { html, buttons } })
})

export default adminRouter