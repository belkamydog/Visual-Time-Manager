import { readSync, statSync, openSync, O_RDONLY} from '@zos/fs'
import {widget, createWidget, prop, align} from '@zos/ui'
import {Time, Battery, Step, Calorie, Distance, HeartRate} from '@zos/sensor'
import { WEEK_DAYS } from '../../../app/TimeManager/utils/Constants'
import { WatchFaceDigits } from '../utils/WatchFaceDigits'
import { Manager } from '../utils/Manager'


function addZero(value){
  return value < 10 ? '0'+ value : value
}

function getLevel(value) {
    if (value >= 0 && value < 5) {
        return 1; // Уровень 1: 0-4.99
    }else if (value >= 5 && value < 13) {
        return 2; // Уровень 1: 0-12.99
    } else if (value >= 13 && value < 25) {
        return 3; // Уровень 2: 13-24.99
    } else if (value >= 25 && value < 38) {
        return 4; // Уровень 3: 25-37.99
    } else if (value >= 38 && value < 50) {
        return 5; // Уровень 4: 38-49.99
    } else if (value >= 50 && value < 63) {
        return 6; // Уровень 5: 50-62.99
    } else if (value >= 63 && value < 75) {
        return 7; // Уровень 6: 63-74.99
    } else if (value >= 75 && value < 88) {
        return 8; // Уровень 7: 75-87.99
    } else if (value >= 88 && value <= 100) {
        return 9; // Уровень 8: 88-100
    } else {
        throw new Error('Значение выходит за допустимый диапазон');
    }
}
const eventsArr = [
  {start:"2025-12-16T12:00:00.635Z", end:"2025-12-16T13:00:00.635Z", startAngle: 0, endAngle: 30, description: 'School New Year party', state: 'After some minutes', period: '12:00-13:00', color: '0x5b0202'},
  {start:"2025-12-16T15:00:00.635Z", end:"2025-12-16T17:00:00.635Z",startAngle: 90, endAngle: 150, description: 'Running', state: 'After some minutes', period: '15:00-17:00', color: '0x063308'},
  {start:"2025-12-16T18:00:00.635Z", end:"2025-12-16T19:00:00.635Z",startAngle: 180, endAngle: 210, description: 'Cooking', state: 'After some minutes', period: '18:00-19:00', color: '0x120862'},
]

WatchFace({
  events: [],
  wf: new WatchFaceDigits(),
  sensors: {
    timeSensor: new Time(),
    powerSensor: new Battery(),
    stepSensor: new Step(),
    calorieSensor: new Calorie(),
    distanceSensor: new Distance(),
    heartRateSensor: new HeartRate()
  },
  state:{
    backgroundAnalog: null,
    digitBackground: null,
    time:{
      hourMinute: null,
      seconds: null,
      date: null,
      weekDay: null,
    },
    eventState: {
      time: null,
      description: null
    },
    actitity:{
      step:null,
      calories:null,
      distance:null,
      heart:null,
    },
    power:{
      value: null,
      indicate: null
    },
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

  initWfNumbers() {
    const centerX = 240;
    const centerY = 240;
    const radius = 220;
    
    this.wf.initWatchFace(new Date().getHours())
    const numbers = this.wf.getTimePointDigits()
    let angle = -90
    for (let i = 0; i < 12; i++){
      const angleInRadians = angle * Math.PI / 180;
      const x = centerX + radius * Math.cos(angleInRadians) - 20;
      let y = centerY + radius * Math.sin(angleInRadians) - 20;
      let value = numbers[i]
      let size = 40-12
      let w = 52-12
      let h = 52-12
      if (numbers[i] == 12) {
        size = 30-15
        value = '☀️'
        y = centerY + (radius-5) * Math.sin(angleInRadians) - 20;
        w = 52
        h = 52
      }
      else if (numbers[i] == 0){
        size = 30-15
        value = '🌙'
        y = centerY + (radius-5) * Math.sin(angleInRadians) - 20;
        w = 52
        h = 52
      } 
      angle += 30
      this.state.wfNumbers[`_${i}`] = createWidget(widget.TEXT, {
        x: Math.round(x),
        y: Math.round(y),
        w: w,
        h: h,
        color: 0xFFFFFF,
        text_size: size,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: value
      });
    }
  },
  initAnalogBg(){
    this.state.backgroundAnalog = createWidget(widget.IMG, {
      src: 'bgAnalog2.png',
      x: 0,
      y: 0,
    })
  },
  initDigitalBg(){
    this.state.digitBackground = createWidget(widget.IMG, {
      src: 'digitBg.png',
      x: (480-350.06)/2,
      y: (480-350.06)/2,
    })
  },
  initDateTime(){
    this.state.time.hourMinute = createWidget(widget.TEXT, {
      text: (addZero(this.sensors.timeSensor.getHours())+':'+ addZero(this.sensors.timeSensor.getMinutes())).toString(),
      text_size: 88,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 100,
      y: 200,
      w: 250,
    })
    this.state.time.seconds = createWidget(widget.TEXT, {
      text: addZero(this.sensors.timeSensor.getSeconds()),
      text_size: 58,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 185+155,
      y: 225,
      w: 100,
    })
    this.state.time.date = createWidget(widget.TEXT, {
      text: addZero(this.sensors.timeSensor.getDate()) +  '.' + addZero(this.sensors.timeSensor.getMonth()) ,
      text_size: 48,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 105,
      y: 155,
      w: 120,
    }) 
    this.state.time.weekDay = createWidget(widget.TEXT, {
      text: WEEK_DAYS[this.sensors.timeSensor.getDay()] ,
      text_size: 38,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 225,
      y: 163,
      w: 200,
    })
    createWidget(widget.TIME_POINTER, {
      hour_centerX: 240,
      hour_centerY: 240,
      hour_posX: 0,
      hour_posY: 240,
      hour_path: 'hour.png',  
    })
    let timer = null
    createWidget(widget.WIDGET_DELEGATE, {
      resume_call: () => {
        timer = setInterval(()=>{
          this.state.time.seconds.setProperty(prop.TEXT, addZero(this.sensors.timeSensor.getSeconds().toString()))
          this.state.time.hourMinute.setProperty(prop.TEXT, (addZero(this.sensors.timeSensor.getHours())+':'+ addZero(this.sensors.timeSensor.getMinutes())).toString())
        }, 1000)
      },
      pause_call: () => {
        clearInterval(timer);
        timer = null;
        console.log('Watchface pause')
      }
    })
  },
  initActivity(){
    createWidget(widget.IMG, {
      src: 'icons/step.png',
      x: 100,
      y: 300,
    })
    this.state.actitity.step = createWidget(widget.TEXT, {
      text: this.sensors.stepSensor.getCurrent().toString(),
      text_size: 20,
      align_h: align.LEFT,
      color: 0x000000, // if val < 5 red color
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 140,
      y: 300,
      w: 100,
    })    
    createWidget(widget.IMG, {
      src: 'icons/dist.png',
      x: 360,
      y: 300,
    })
    this.state.actitity.distance = createWidget(widget.TEXT, {
      text: this.sensors.distanceSensor.getCurrent().toString(),
      text_size: 20,
      align_h: align.RIGHT,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 240,
      y: 300,
      w: 100,
    })      
    createWidget(widget.IMG, {
      src: 'icons/calories.png',
      x: 125,
      y: 335,
    })
    this.state.actitity.calories = createWidget(widget.TEXT, {
      text: this.sensors.calorieSensor.getCurrent().toString(),
      text_size: 20,
      align_h: align.LEFT,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 160,
      y: 340,
      w: 100,
    })      
    createWidget(widget.IMG, {
      src: 'icons/heart.png',
      x: 335,
      y: 340,
    })
    this.state.actitity.heart = createWidget(widget.TEXT, {
      text: this.sensors.heartRateSensor.getLast().toString(),
      text_size: 20,
      align_h: align.RIGHT,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 225,
      y: 340,
      w: 100,
    })
    createWidget(widget.WIDGET_DELEGATE, {
      resume_call: () => {
        this.state.actitity.step.setProperty(prop.TEXT, this.sensors.stepSensor.getCurrent().toString())
        this.state.actitity.calories.setProperty(prop.TEXT, this.sensors.calorieSensor.getCurrent().toString())
        this.state.actitity.distance.setProperty(prop.TEXT, this.sensors.distanceSensor.getCurrent().toString())
        this.state.actitity.heart.setProperty(prop.TEXT, this.sensors.heartRateSensor.getCurrent().toString())
      }
    })        
  },
  initPower(){
    this.state.power.value = createWidget(widget.TEXT, {
      text: this.sensors.powerSensor.getCurrent().toString() + '%',
      text_size: 20,
      align_h: align.CENTER_H,
      color: 0xffffff, // if val < 5 red color
      font: 'fonts/Serati/Serati-Regular.otf',
      x: (480-100)/2,
      y: 417,
      w: 100,
    })
    const imgPower = ['power/0.png', 'power/1.png','power/2.png','power/3.png','power/4.png','power/5.png','power/6.png','power/7.png','power/8.png',]
    this.state.power.indicate = createWidget(widget.IMG_LEVEL, {
      x: 0,
      y: 0,
      image_array: imgPower,
      image_length: 9,
      level: getLevel(this.sensors.powerSensor.getCurrent())
    })
    console.log('level ' + getLevel(this.sensors.powerSensor.getCurrent()))
    this.sensors.powerSensor.onChange(()=>{
      this.state.power.value.setProperty(prop.TEXT, this.sensors.powerSensor.getCurrent().toString() + '%')
      this.state.power.indicate.setProperty(prop.LEVEL, getLevel(this.sensors.powerSensor.getCurrent()))

    })
    createWidget(widget.WIDGET_DELEGATE, {
      resume_call: () => {
          this.state.power.value.setProperty(prop.TEXT, this.sensors.powerSensor.getCurrent().toString() + '%')
          this.state.power.indicate.setProperty(prop.LEVEL, getLevel(this.sensors.powerSensor.getCurrent()))
      },
    })    
  },
  initWeather(){

  },
  initEventState(){
    let current = Manager.getNextState(eventsArr)
    this.state.eventState.time = createWidget(widget.TEXT, {
      text: current.state,
      text_size: 20,
      align_h: align.CENTER_H,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: (480-100)/2,
      y: 80,
      w: 100,
    })
    this.state.eventState.description = createWidget(widget.TEXT, {
      text: current.description,
      text_size: 30,
      align_h: align.CENTER_H,
      color: 0x000000,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: (480-220)/2,
      y: 110,
      w: 220,
    })    
  },
  renderEventSectors(){
    eventsArr.forEach((item) =>{
      const ev = createWidget(widget.ARC, {
        x: 0,
        y: 0,
        w: 480,
        h: 480,
        start_angle: item.startAngle-90,
        end_angle: item.endAngle-90,
        line_width: 35,
        alpha: 100,
        color: item.color
      })
      ev.setAlpha(250)
      this.events.push(ev)
    })
  },

  onInit() {
    this.renderEventSectors()
    this.initAnalogBg()
    this.initWfNumbers()
    this.initPower()
    this.initDigitalBg()
    this.initDateTime()
    this.initActivity()
    this.initEventState()
  },

  build() {


      const fd = openSync({
        path: 'events',
        flag: O_RDONLY,
        options:{
          appId: 1099579,
        }
      })

      const fileInfo = statSync({
        path: 'events',
        options: {
            appId: 1099579
        }
      });
      console.log(fd)
      const buffer = new ArrayBuffer(1024) 
      const result = readSync({
        fd,
        buffer,
      })

      const uint8Array = new Uint8Array(buffer);
      const text = String.fromCharCode.apply(null, uint8Array);
      console.log('TEXT: ' + text) 


  },

  onDestroy() {
  },
})
