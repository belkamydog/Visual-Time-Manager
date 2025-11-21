import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import { calculateAngles, isPointInSector, isShowEvent } from '../utils/calculate';
import hmUI from '@zos/ui'
import { push } from '@zos/router'
import { Time } from '@zos/sensor'
import { addZero } from '../utils/prepare';
import * as Globals from '../utils/Globals'


let MOCK_EVENTS = [
  { start: '2025-11-21T00:00:00', end: '2025-11-21T01:00:00', description: 'Do nothing' },
  { start: '2025-11-21T03:00:00', end: '2025-11-21T06:00:00', description: 'Do work'},
  { start: '2025-11-21T19:00:00', end: '2025-11-21T21:00:00', description: 'Time discussion'}, 
  { start: '2025-11-21T11:00:00', end: '2025-11-21T12:00:00', description: 'Time of tea'}
];

// tmp
const EVENT_COLORS = [
  0x2E8B57, // Зеленый - работа
  0x1E90FF, // Синий - встречи
  0xFF6347, // Красный - важное
  0xFFD700, // Желтый - личное
  0x9932CC, // Фиолетовый - здоровье
  0xFF69B4, // Розовый - развлечения
  0xFF8C00, // Оранжевый - спорт
  0x00CED1  // Бирюзовый - обучение
];

let color = 0 // tmp

Page({
  widgets:{
    canvas: null,
    background: null,
    hourArrow: null,
    minuteArrow: null,
    digitTime: null,
  },
  sensors: {
    timeSensor: null
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
    })
  },

  initCanvas(){
    this.canvas = hmUI.createWidget(hmUI.widget.CANVAS, {
      x: 0,
      y: 0,
      w: 480,
      h: 480,
      alpha: 60 
    })
    this.canvas.addEventListener(hmUI.event.CLICK_UP, function cb(info) {
      for (const event of MOCK_EVENTS){
        let {startAngle, endAngle } = calculateAngles(event)
        if (isPointInSector(info.x, info.y, 240, 240, 240, startAngle, endAngle) && isShowEvent(event)){
          push({
            url: 'page/event',
            params: JSON.stringify(event),
          })
        }
      }
    })
  },

  drawEvent(event){
    if (isShowEvent(event)){
      let {startAngle, endAngle} = calculateAngles(event)
      this.canvas.drawArc({
        center_x: 240,
        center_y: 240,
        radius_x: 225,
        radius_y: 225,
        start_angle: startAngle-90,
        end_angle: endAngle-90,
        color:  EVENT_COLORS[color],
      })
      color++
    }
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
    this.renderEvents(MOCK_EVENTS)
  },

  build() {

  },

  onDestroy(){
  }
})
