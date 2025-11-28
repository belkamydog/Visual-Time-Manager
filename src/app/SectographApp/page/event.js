import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import hmUI from '@zos/ui'
import { back, home } from '@zos/router'
import { Event } from '../utils/Event'
import { DayEvents } from '../utils/Globals'

Page ({
    widgets :{
        eventLabel: null,
        progressArc: null,
        progressArcBackground: null,
        timePeriod: null,
        backBtn: null,
        editBtn: null,
        deleteBtn: null,
        previousEventBtn: null,
        nextEventBtn: null,
        eventStatus: null
    },

    onInit(params){
        const current_event = JSON.parse(params)
        const pageData = new Event(current_event)
        this.eventLabel = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 120,
            y: 200,
            w: 300,
            h: 46,
            color: 0xffffff,
            text_size: 36,
            text: current_event.description
        }),
        this.timePeriod = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 170,
            y: 250,
            w: 288,
            h: 46,
            color: 0xffffff,
            text_size: 26,
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
                back()
            }
        }),
        this.editBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 105,
            y: 310,
            w: 70,
            h: 70,
            radius: 35,
            normal_color: 0xBDB76B,
            press_color: 0xBDB76B,
            text: 'Edit',
            click_func: (button_widget) => {
                back()
            }
        }),
        this.deleteBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 305,
            y: 310,
            w: 70,
            h: 70,
            radius: 35,
            normal_color: 0xFF4500,
            press_color: 0xFF6347,
            text: 'Delete',
            click_func: (button_widget) => {
                back()
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
            x: 150,
            y: 150,
            w: 288,
            h: 46,
            color: 0xffffff,
            text_size: 26,
            text: pageData.getStatus()
        })
    },

    build(){

    }
})