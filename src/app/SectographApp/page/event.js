import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import hmUI from '@zos/ui'
import { back, push } from '@zos/router'
import { Event } from '../utils/Event'
import { DayEvents } from '../utils/Globals'

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
        previousEventBtn: null,
        nextEventBtn: null,
        eventStatus: null,
        deleteDialog: null,
        editList: null
    },

    onInit(params){
        const current_event = JSON.parse(params)
        const pageData = new Event(current_event)
        console.log('ID: ' + pageData.getId())
        this.eventLabel = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 110,
            y: 210,
            w: 300,
            h: 46,
            color: 0xffffff,
            text_size: 36,
            text: current_event.description
        }),
        this.timePeriod = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 150,
            y: 290,
            w: 288,
            h: 46,
            color: 0xffffff,
            text_size: 34,
            text: pageData.getPeriod()
        }),
        this.progressArcBackground = hmUI.createWidget(hmUI.widget.ARC_PROGRESS, {
            center_x: 240,
            center_y: 240,
            radius: 220,
            start_angle: -160,
            end_angle: 160,
            color: 0xC0C0C0,
            line_width: 20,
            level: 100
        }),
        this.progressArc = hmUI.createWidget(hmUI.widget.ARC_PROGRESS, {
            center_x: 240,
            center_y: 240,
            radius: 220,
            start_angle: -160,
            end_angle: 160,
            color: 0x22F91A,
            line_width: 20,
            level: pageData.getlevel()
        }),
        this.backBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 205,
            y: 400,
            w: 70,
            h: 70,
            radius: 35,
            normal_color: 0x006400,
            press_color: 0x006400,
            text: 'Back',
            click_func: (button_widget) => {
                push({
                    url: 'page/index',
                })
            }
        }),
        this.editDescBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 90,
            y: 210,
            w: 300,
            h: 46,
            click_func: (button_widget) => {
                console.log("PUSHED EDIT DESCRIPTION " + JSON.stringify(pageData))
                push({
                    url: 'page/add_new_event/description',
                    params: JSON.stringify(pageData)
                })
            }
        }),
        this.editDescBtn.setAlpha(0)
        this.editStartEvent = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 150,
            y: 290,
            w: 95,
            h: 46,
            click_func: (button_widget) => {
                console.log("PUSHED EDIT START_EVENT")
                push({
                    url: 'page/add_new_event/start_date',
                    params: JSON.stringify(pageData)
                })
            }
        }),
        this.editStartEvent.setAlpha(0),
        this.editEndEvent = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 294,
            y: 290,
            w: 95,
            h: 46,
            click_func: (button_widget) => {
                console.log("PUSHED EDIT END_EVENT")
                push({
                    url: 'page/add_new_event/end_date',
                    params: JSON.stringify(pageData)
                })
            }
        }),
        this.editEndEvent.setAlpha(0)
        this.deleteBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 205,
            y: 40,
            w: 70,
            h: 70,
            radius: 35,
            normal_color: 0xFF4500,
            press_color: 0xFF6347,
            text: 'Delete',
            click_func: (button_widget) => {
                this.deleteDialog.show(true)
            }
        }),
        this.previousEventBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 55,
            y: 200,
            w: 10,
            h: 50,
            radius: 0,
            normal_color: 0x000000,
            press_color: 0x000000,
            text: '<',
            click_func: (button_widget) => {
                back()
            }
        })
        this.nextEventBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 425,
            y: 200,
            w: 10,
            h: 50,
            radius: 0,
            normal_color: 0x000000,
            press_color: 0x000000,
            text: '>',
            click_func: (button_widget) => {
                back()
            }
        }),
        this.eventStatus = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 130,
            y: 150,
            w: 288,
            h: 40,
            color: 0xffffff,
            text_size: 26,
            text: pageData.getStatus()
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
    },

    build(){

    }
})