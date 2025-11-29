import { createWidget, widget, prop } from '@zos/ui'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { DayEvents } from '../utils/Globals';
import { push } from '@zos/router'



Page({
  allEvents,
  scrollList,
  title,
  deleteDialog,

  initDeleteDialog(index){
    const deleteDialog = createModal({
        content: 'Delete this event?',
        autoHide: false,
        show: false,
        onClick: (keyObj) => {
            const { type } = keyObj
            if (type === MODAL_CONFIRM) {
                DayEvents.deleteEventById(allEvents[index].id)
                scrollList.setProperty(prop.DELETE_ITEM, { index })
                deleteDialog.show(false)
                this.onInit()
            } else {
                deleteDialog.show(false)
            }
        },
    })
    deleteDialog.show(true) 
  },

  onInit() {


    title = createWidget(widget.TEXT, {
      text: 'List of events',
      x: 150,
      y: 50,
      w: 300,
      h: 50,
      text_size: 35
    })

    allEvents = DayEvents.getListOfALlEvents()
    if (allEvents.length == 0) {
      createWidget(widget.TEXT,{
        text: 'No events',
        text_size: 40,
        x: 150,
        y: 200,
        h: 50,
        w: 480
      })
      createWidget(widget.BUTTON, {
        x: (480 - 300) / 2,
        y: 300,
        w: 300,
        h: 100,
        radius: 50,
        normal_color: 0x808080	,
        press_color: 0xfeb4a8,
        text: 'New event',
        text_size: 30,
        click_func: (button_widget) => {
          push ({
            url: 'page/add_new_event/description'
          })
        }
      })
    }
    else {
      for (let i of allEvents){
        i.del_img = 'delete.png'
      }


      scrollList = createWidget(widget.SCROLL_LIST, {
        x: 0,
        y: 120,
        h: 300,
        w: 480,
        item_space: 20,
        snap_to_center: true,
        item_enable_horizon_drag: true,
        item_drag_max_distance: -120,
        item_config: [
          {
            type_id: 1,
            item_bg_color: 0x808080,
            item_bg_radius: 10,
            text_view: [
              { x: 0, y: 0, w: 480, h: 80, key: 'description', color: 0xffffff, text_size: 40 },
              { x: 0, y: 120, w: 480, h: 40, key: 'date_period', color: 0xffffff, text_size: 20 },
              { x: 0, y: 80, w: 480, h: 40, key: 'period', color: 0xffffff, text_size: 20},
              { x: 0, y: 160, w: 480, h: 40, key: 'status', color: 0xffffff, text_size: 20 },
            ],
            text_view_count: 4,
            image_view: [{ x: 522, y: 78, w: 64, h: 64, key: 'del_img', action: true }],
            image_view_count: 1,
            item_height: 200
          }
        ],
        item_config_count: 1,
        data_array: allEvents,
        data_count: allEvents.length,
        item_focus_change_func: (list, index, focus) => {
          console.log('scrollListFocusChange index=' + index)
          console.log('scrollListFocusChange focus=' + focus)
        },
        item_click_func: (item, index, data_key) => {
          if (data_key === 'del_img') {
            this.initDeleteDialog(index)
          } else {
            updateConfig()
          }
        },
        data_type_config: [
          {
            start: 0,
            end: 1,
            type_id: 1
          },
          {
            start: 1,
            end: 2,
            type_id: 2
          }
        ],
      })


      function updateConfig() {
        scrollList.setProperty(prop.UPDATE_DATA, {
          data_type_config: [
            {
              start: 0,
              end: allEvents.length - 1,
              type_id: 1
            }
          ],
          data_type_config_count: 1,
          data_array: allEvents,
          data_count: allEvents.length,
          on_page: 1
        })
      }

    }


    
  }
})