import { createWidget, widget, prop, align } from '@zos/ui'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { DayEvents } from '../utils/Globals';
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { styleColors } from '../utils/Constants';
import {log} from '@zos/utils'
import { EventsManager } from '../utils/EventsManager';
import { Event } from '../utils/Event';

const logger = log.getLogger('page/list.js')

Page({

  initBg(){
    this.circle = createWidget(widget.CIRCLE, {
      center_x: 240,
      center_y: 240,
      radius: 227,
      color: styleColors.white_smoke,
    })
    this.circle = createWidget(widget.CIRCLE, {
      center_x: 240,
      center_y: 240,
      radius: 225,
      color: styleColors.black,
    })
  },

  initTitle(){
    const titleText = getText('List of events')
    createWidget(widget.TEXT, {
      text: titleText,
      x: 0,
      y: 50,
      w: 480,
      h: 50,
      text_size: 35,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      color: styleColors.white
    })
    const period = EventsManager.getWeekRange(new Date())
    createWidget(widget.TEXT, {
        text: period.start.getDate() + '.'+ (period.start.getMonth()+1) + ' - ' + period.end.getDate() + '.'+ (period.end.getMonth()+1),
        x: 0,
        y: 90,
        w: 480,
        h: 50,
        text_size: 35,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        color: styleColors.white
    })
  },

  addKeyToDeleteAddEditBtnAndWeekDay(arrEv){
    let result = []
    for (let i of arrEv){
      i.weekDay = new Event(i).getWeekDay()
      i.del_img = 'delete.png'
      i.edit_img = 'edit.png'
      result.push(i)
    } 
    let addEvent = {}
    addEvent.add_btn = 'add_btn.png'
    addEvent.add_btn_text = getText('New event'),
    result.push(addEvent)
    return result
  },

  ifEmptyListOfEventsLabel(){
    createWidget(widget.TEXT, {
      text: getText('Create event'),
      x: 0,
      y: 220,
      w: 480,
      h: 50,
      text_size: 35,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      color: styleColors.white
    })
  },

  onInit() {
    this.initBg()
    this.initTitle();
    const weekEvents = this.addKeyToDeleteAddEditBtnAndWeekDay(DayEvents.getListOfEventsBeforeDate(new Date()))
    logger.log('Init list of events: ' + JSON.stringify(weekEvents))
    if (weekEvents.length == 1) 
        this.ifEmptyListOfEventsLabel()
  
    logger.log('Creating scrollist of events...')
    const scrollList = createWidget(widget.SCROLL_LIST, {
        x: (480-380)/2,
        y: 140,
        h: 480,
        w: 380,
        radius:10,
        item_space: 20,
        snap_to_center: true,
        item_enable_horizon_drag: true,
        item_drag_max_distance: -120,
        item_config: [
          {
            type_id: 1,
            item_bg_color: styleColors.dark_gray,
            item_bg_radius: 10,
            text_view: [
              { x: 0, y: 0, w: 380, h: 40, key: 'date_period', color: 0xffffff, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 50, w: 380, h: 40, key: 'period', color: 0xffffff, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 80, w: 380, h: 80, key: 'description', color: styleColors.violet, text_size: 40, align_h: align.CENTER_H},
              { x: 0, y: 150, w: 380, h: 40, key: 'weekDay', color: 0xffffff, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 200, w: 380, h: 40, key: 'status', color: 0xffffff, text_size: 30, align_h: align.CENTER_H},
            ],
            text_view_count: 5,
            image_view: [
              { x:410, y: 20, w: 64, h: 64, key: 'del_img', action: true },
              { x:410, y: 150, w: 64, h: 64, key: 'edit_img', action: true }
            ],
            image_view_count: 2,
            item_height: 250
          },
          {
            type_id: 2,
            item_bg_color: styleColors.brown,
            item_bg_radius: 75,
            image_view: [{ x: (380-80)/2, y: 0, w: 80, h: 80, key: 'add_btn', action: true }],
            image_view_count: 1,
            item_height: 0
          },
        ],
        item_config_count: 2,
        data_array: weekEvents,
        data_count: weekEvents.length,
        item_focus_change_func: (list, index, focus) => {
        },
        item_click_func: (item, index, data_key) => {
          if (data_key === 'del_img') {
                const deleteDialog = createModal({
                  content: 'Delete this event?',
                  autoHide: false,
                  show: false,
                  onClick: (keyObj) => {
                      const { type } = keyObj
                      if (type === MODAL_CONFIRM) {
                        DayEvents.deleteEventById(weekEvents[index].id)
                        scrollList.setProperty(prop.DELETE_ITEM, { index })
                        logger.log('Delete event: ' + JSON.stringify(weekEvents[index]))
                        deleteDialog.show(false)
                      } else {
                          logger.log('Delete canceled')
                          deleteDialog.show(false)
                      }
                  },
                })
                deleteDialog.show(true) 
          }
          else if (data_key === 'add_btn'){
              const newEventDialog = createModal({
                  content:  getText('Create event')+ '?',
                  autoHide: false,
                  show: false,
                  onClick: (keyObj) => {
                      const { type } = keyObj
                      if (type === MODAL_CONFIRM) {
                        logger.log('Create new event init')
                        push ({
                          url: 'page/event/create/description'
                        })
                        this.onInit()
                      } else {
                        logger.log('Create new event canceled')
                          newEventDialog.show(false)
                      }
                  },
                })
                newEventDialog.show(true) 
          }
          else if (data_key == 'edit_img'){
            logger.log('Calling edit menu...')
            push({
              url: 'page/event/edit/menu'
            })
          }
        },
        data_type_config: [
          {
            start: 0,
            end: weekEvents.length-2,
            type_id: 1
          },
          {
            start: weekEvents.length-1,
            end: weekEvents.length-1,
            type_id: 2
          }
        ],
        data_type_config_count: 2
    })
  }
})