import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { createWidget, widget, align } from '@zos/ui'
import { back, push } from '@zos/router'
import { Event } from '../utils/Event'
import { DayEvents } from '../utils/Globals'
import { styleColors } from '../utils/Constants'

Page ({
    widgets :{
        eventLabel: null,
        clickLable: null,
        progressArc: null,
        progressArcBackground: null,
        timePeriod: null,
        backBtn: null,
        editDescBtn: null,
        editStartEvent: null,
        editEndEvent: null,
        deleteBtn: null,
        eventStatus: null,
        deleteDialog: null,
        editList: null
    },

    onInit(params){
        const current_event = JSON.parse(params)
        const pageData = new Event(current_event)
        this.eventLabel = createWidget(widget.TEXT, {
            x: (480-300)/2,
            y: 220,
            w: 300,
            h: 46,
            color: styleColors.white,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_size: 36,
            text: current_event.description
        }),
        this.timePeriod = createWidget(widget.TEXT, {
            x: (480-300)/2,
            y: 290,
            w: 300,
            h: 46,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: 34,
            text: pageData.getPeriod()
        }),
        this.eventStatus = createWidget(widget.TEXT, {
            x: (480-288)/2,
            y: 150,
            w: 288,
            h: 40,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            color: styleColors.white,
            text_size: 34,
            text: pageData.getStatus()
        }),        
        this.progressArcBackground = createWidget(widget.ARC_PROGRESS, {
            center_x: 240,
            center_y: 240,
            radius: 220,
            start_angle: -180,
            end_angle: 180,
            color: styleColors.gray,
            line_width: 20,
            level: 100
        }),
        this.progressArc = createWidget(widget.ARC_PROGRESS, {
            center_x: 240,
            center_y: 240,
            radius: 220,
            start_angle: -180,
            end_angle: 180,
            color: 0x22F91A,
            line_width: 20,
            level: pageData.getlevel()
        }),
        this.editDescBtn = createWidget(widget.BUTTON, {
            x: (480-300)/2,
            y: 210,
            w: 300,
            h: 46,
            click_func: (button_widget) => {
                push({
                    url: 'page/event/description',
                    params: JSON.stringify(pageData)
                })
            }
        }),
        this.editDescBtn.setAlpha(0)
        this.editStartEvent = createWidget(widget.BUTTON, {
            x: 150,
            y: 290,
            w: 95,
            h: 46,
            click_func: (button_widget) => {
                push({
                    url: 'page/event/start_date',
                    params: JSON.stringify(pageData)
                })
            }
        }),
        this.editStartEvent.setAlpha(0),
        this.editEndEvent = createWidget(widget.BUTTON, {
            x: 294,
            y: 290,
            w: 95,
            h: 46,
            click_func: (button_widget) => {
                push({
                    url: 'page/event/end_date',
                    params: JSON.stringify(pageData)
                })
            }
        }),
        this.editEndEvent.setAlpha(0)
        this.deleteBtn = createWidget(widget.BUTTON, {
            x: (480-70)/2,
            y: 40,
            w: 70,
            h: 70,
            normal_src: 'delete.png',
            press_src: 'delete.png',
            click_func: (button_widget) => {
                this.deleteDialog.show(true)
            }
        })
        this.deleteDialog = createModal({
            content: 'Delete this event?',
            autoHide: false,
            show: false,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                    DayEvents.deleteEventById(pageData.id)
                    back()
                } else {
                    this.deleteDialog.show(false)
                }
            },
        })
    }
})