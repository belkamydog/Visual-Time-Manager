import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import { calculateAngles, isPointInSector, isShowEvent } from '../utils/calculate';
import hmUI from '@zos/ui'
import { push } from '@zos/router'
import { Time } from '@zos/sensor'
import { addZero } from '../utils/prepare';
import { DayEvents } from '../utils/Globals';

Page({
  widgets:{
    canvas: null,
    background: null,
    hourArrow: null,
    minuteArrow: null,
    digitTime: null,
  },
  sensors: {
    timeSensor: null,
  },

  initBackground(){
    this.background = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      src: 'background.png'
    })
  },

  initArrows(){
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
      text: addZero(this.timeSensor.getHours().toString()) + ':' + addZero(this.timeSensor.getMinutes().toString())
    })
    const self = this
    this.timeSensor.onPerMinute(function() {
      self.digitTime.setProperty(hmUI.prop.TEXT, addZero(self.timeSensor.getHours().toString()) + 
                              ':' + addZero(self.timeSensor.getMinutes().toString()))
      self.canvas.clear({
        x: 0,
        y: 0,
        w: 480,
        h: 480
      })
      self.renderEvents(DayEvents.getListOfCurrentDayEvents())                     
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
        let {startAngle, endAngle } = calculateAngles(event)
        if (isPointInSector(info.x, info.y, 240, 240, 240, startAngle, endAngle)){
          push({
            url: 'page/event',
            params: JSON.stringify(event),
          })
        }
      }
    })
  },

  drawEvent(event){
    let {startAngle, endAngle} = calculateAngles(event)
    this.canvas.drawArc({
      center_x: 240,
      center_y: 240,
      radius_x: 225,
      radius_y: 225,
      start_angle: startAngle-90,
      end_angle: endAngle-90,
      color: event.color,
    })
  },

  renderEvents(events){
    for (const event of events) {
      this.drawEvent(event);
    }
  },


  onInit(){
    this.initBackground()
    this.initCanvas()
    this.initArrows()
    this.initDigitalTime()
    this.renderEvents(DayEvents.getListOfCurrentDayEvents())
  },

  build() {
    
  },

  onDestroy(){
  }
})
