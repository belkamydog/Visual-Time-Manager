import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import hmUI from '@zos/ui'
import {log} from '@zos/utils'
import { push } from '@zos/router'
import { Time } from '@zos/sensor'
import { DayEvents, wfNumbers} from '../utils/Globals';
import { onGesture, GESTURE_LEFT, GESTURE_UP } from '@zos/interaction'
import { HOUR_MS } from '../utils/Constants';
import { EventsManager } from '../utils/EventsManager';
import { Event } from '../utils/Event';
import { writeFileSync, readFileSync } from '@zos/fs'



Page({
  logger: log.getLogger('index.js'),
  widgets:{
    canvas: null,
    background: null,
    hourArrow: null,
    destroyArrow: null,
    minuteArrow: null,
    digitTime: null,
    wfNumbers:{
      _0: null,
      _1: null,
      _2: null,
      _3: null,
      _4: null,
      _5: null,
      _6: null,
      _7: null,
      _8: null,
      _9: null,
      _10: null,
      _11: null,
    }
  },
  sensors: {
    timeSensor: null,
  },


  registerGes(){
    onGesture({
        callback: (event) => {
          if (event === GESTURE_LEFT) {
            // DayEvents.getListOfCurrentDayEvents()
            push({
              url: 'page/add_new_event/description',
            })
          }
          return true
        },
      })
  },

  initBackground(){
    this.background = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      src: 'background.png'
    })
  },

  initWfNumbers() {
    const centerX = 240;
    const centerY = 240;
    const radius = 200;
    wfNumbers.initWatchFace(new Date().getHours())
    const numbers = wfNumbers.getTimePointDigits()
    let angle = -90
    for (let i = 0; i < 12; i++){
      const angleInRadians = angle * Math.PI / 180;
      const x = centerX + radius * Math.cos(angleInRadians) - 20;
      const y = centerY + radius * Math.sin(angleInRadians) - 20;
      angle += 30
      this.widgets.wfNumbers[`_${i}`] = hmUI.createWidget(hmUI.widget.TEXT, {
        x: Math.round(x),
        y: Math.round(y),
        w: 40,
        h: 40,
        color: 0xFFFFFF,
        text_size: 30,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: numbers[i]
      });
    }
  },

  initArrows(){
    this.destroyArrow = hmUI.createWidget(hmUI.widget.IMG,{
      x: 0,
      y: 0,
      h: 480,
      w: 480,
      center_x: 240,
      center_y: 240,
      pos_x: 240,
      pos_y: 0,
      angle: EventsManager.convertTimeToAngle(new Date() - HOUR_MS*2),
      src: 'arrows/minute.png'
    })
    this.hourArrow = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
      hour_centerX: 240,
      hour_centerY: 240,
      hour_posX: 2,
      hour_posY: 220,
      hour_path: 'arrows/hour.png',
      hour_cover_path: '/arrows/center.png',
      hour_cover_x: 160,
      hour_cover_y: 160

    })
  },

  updateWfNumbers(){
    wfNumbers.updateWatchFaceDigit(new Date().getHours())
    const numbers = wfNumbers.getTimePointDigits()
    for (let i = 0; i < 12; i++){
      this.widgets.wfNumbers[`_${i}`].setProperty(hmUI.prop.TEXT, numbers[i])
    }
  },

  updateWidgets(){
    this.updateWfNumbers()
    this.destroyArrow.setProperty(hmUI.prop.ANGLE, EventsManager.convertTimeToAngle(new Date() - HOUR_MS * 2))
    this.digitTime.setProperty(hmUI.prop.TEXT, Event.addZero(this.timeSensor.getHours().toString()) + 
                              ':' + Event.addZero(this.timeSensor.getMinutes().toString()))
      this.canvas.clear({
        x: 0,
        y: 0,
        w: 480,
        h: 480
      })
      this.renderEvents(DayEvents.getListOfCurrentDayEvents())
  },

  initDigitalTime(){
    this.timeSensor = new Time()
    this.digitTime = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 160,
      y: 190,
      w: 160,
      h: 60,
      color: 0x0000,
      text_size: 45,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.NONE,
      text: Event.addZero(this.timeSensor.getHours().toString()) + ':' + Event.addZero(this.timeSensor.getMinutes().toString())
    })
    const self = this
    this.timeSensor.onPerMinute(function cb() {
      self.updateWidgets()                  
    })
  },

  initCanvas(){
    this.canvas = hmUI.createWidget(hmUI.widget.CANVAS, {
      x: 0,
      y: 0,
      w: 480,
      h: 480,
      alpha: 50 
    })
    this.canvas.addEventListener(hmUI.event.CLICK_UP, function cb(info) {
      for (const event of DayEvents.getListOfCurrentDayEvents()){
        if (EventsManager.isThisEvent(info.x, info.y, event)){
          push({
            url: 'page/event',
            params: JSON.stringify(event),
          })
        }
      }
    })
  },

  renderSectorInfo(data, startAngle, endAngle) {
    hmUI.createWidget(hmUI.widget.TEXT, {
      w: 240*2,
      h: 240*2,
      text: data,
      color: 0x2E8B57,
      text_size: 17,
      start_angle: startAngle,
      end_angle: endAngle,
      radius: 240,
      mode: 0,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V
    })

    //   hmUI.createWidget(hmUI.widget.TEXT, {
    //   w: 240*2,
    //   h: 240*2,
    //   text: data,
    //   color: 0x2E8B57,
    //   text_size: 17,
    //   start_angle: startAngle,
    //   end_angle: endAngle,
    //   radius: 240,
    //   mode: 0,
    //   align_h: hmUI.align.CENTER_H,
    //   align_v: hmUI.align.CENTER_V
    // })

    // this.canvas.drawText({
    //   x:0,
    //   y:0,
    //   text: data,
    //   color: 0x2E8B57,
    //   text_size: 22,
    //   start_angle: startAngle,
    //   end_angle: endAngle,
    //   radius: 180,
    //   mode: 0,
    //   align_h: hmUI.align.CENTER_H,
    //   align_v: hmUI.align.CENTER_V
    // })
  },

  drawEvent(event){
    const ev = new Event(event)
    // this.renderSectorInfo(ev.getPeriod(), event.startAngle, event.endAngle)
    this.canvas.drawArc({
      center_x: 240,
      center_y: 240,
      radius_x: 225,
      radius_y: 225,
      start_angle: event.startAngle-90,
      end_angle: event.endAngle-90,
      color: event.color
    })
  },

  renderEvents(events){
    for (const event of events) {
      this.drawEvent(event);
    }
  },

  onInit(params){
    // this.initBackground()
    this.registerGes()
    this.initWfNumbers()
    this.initArrows()
    this.initCanvas()
    this.initDigitalTime()
    // if (params== 'clear')     this.canvas.clear({
    //     x: 0,
    //     y: 0,
    //     w: 480,
    //     h: 480
    //   })
    this.renderEvents(DayEvents.getListOfCurrentDayEvents())
  },

  build() {
    
  },

  onDestroy(){
  }
})
