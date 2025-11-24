import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import { calculateAngles, isPointInSector , convertTimeToAngle} from '../utils/calculate';
import { getIntervalTime } from '../utils/prepare';
import hmUI from '@zos/ui'
import {log} from '@zos/utils'
import { push } from '@zos/router'
import { Time } from '@zos/sensor'
import { addZero } from '../utils/prepare';
import { DayEvents} from '../utils/Globals';
import { HOUR_MS } from '../utils/Constants';


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

    const numbers = [
      { number: 12, angle: -90 },
      { number: 1, angle: -60 },
      { number: 2, angle: -30 },
      { number: 3, angle: 0 },
      { number: 4, angle: 30 },
      { number: 5, angle: 60 },
      { number: 6, angle: 90 },
      { number: 7, angle: 120 },
      { number: 8, angle: 150 },
      { number: 9, angle: 180 },
      { number: 10, angle: 210 },
      { number: 11, angle: 240 }
    ];

    const now = new Date()
    numbers.forEach(num => {
      const angleInRadians = num.angle * Math.PI / 180;
      const x = centerX + radius * Math.cos(angleInRadians) - 20;
      const y = centerY + radius * Math.sin(angleInRadians) - 20;
      const currentTimeDigit = now.getHours()-2 > num.number && num.number < now.getHours()-1 ? num.number + 12 : num.number
      this.widgets.wfNumbers[`_${num.number}`] = hmUI.createWidget(hmUI.widget.TEXT, {
        x: Math.round(x),
        y: Math.round(y),
        w: 40,
        h: 40,
        color: 0xFFFFFF,
        text_size: 30,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: currentTimeDigit
      });
    });
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
      angle: convertTimeToAngle(new Date() - HOUR_MS*2),
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

  updateWidgets(){
    this.updateWfNumbers()
    this.destroyArrow.setProperty(hmUI.prop.ANGLE, convertTimeToAngle(new Date() - HOUR_MS*2))
    this.digitTime.setProperty(hmUI.prop.TEXT, addZero(this.timeSensor.getHours().toString()) + 
                              ':' + addZero(this.timeSensor.getMinutes().toString()))
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
      text: addZero(this.timeSensor.getHours().toString()) + ':' + addZero(this.timeSensor.getMinutes().toString())
    })
    const self = this
    this.timeSensor.onPerMinute(function() {
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

  renderSectorInfo(data, startAngle, endAngle) {
    hmUI.createWidget(hmUI.widget.TEXT, {
      w: 240*2,
      h: 240*2,
      text: data,
      color: 0x2E8B57,
      text_size: 22,
      start_angle: startAngle,
      end_angle: endAngle,
      radius: 180,
      mode: 0,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V
    })
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
    let {startAngle, endAngle} = calculateAngles(event)
    // this.renderSectorInfo(getIntervalTime(event), startAngle, endAngle)
    this.canvas.drawArc({
      center_x: 240,
      center_y: 240,
      radius_x: 225,
      radius_y: 225,
      start_angle: startAngle-90,
      end_angle: endAngle-90,
      color: event.color
    })
    
  },

  renderEvents(events){
    for (const event of events) {
      this.drawEvent(event);
    }
  },

  onInit(){
    // this.initBackground()
    this.initWfNumbers()
    this.initArrows()
    this.initCanvas()
    this.initDigitalTime()
    this.renderEvents(DayEvents.getListOfCurrentDayEvents())
  },

  build() {
    
  },

  onDestroy(){
  }
})
