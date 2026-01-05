import {widget, createWidget, prop, align, deleteWidget, event} from '@zos/ui'
import {Time, Battery, Step, Calorie, Distance, HeartRate, Weather} from '@zos/sensor'
import { WEEK_DAYS_SHORT } from '../../../app/TimeManager/utils/Constants'
import { WatchFaceDigits } from '../utils/WatchFaceDigits'
import { Manager } from '../utils/Manager'
import { launchApp} from '@zos/router'
import {log} from '@zos/utils'
import { getText } from '@zos/i18n'


function addZero(value){
  return value < 10 ? '0'+ value : value
}
const logger = log.getLogger('Time Manager Wachface')
const wf = new WatchFaceDigits()

WatchFace({
  events: [],
  sensors: {
    timer: null,
    timeSensor: new Time(),
    powerSensor: new Battery(),
    stepSensor: new Step(),
    calorieSensor: new Calorie(),
    distanceSensor: new Distance(),
    heartRateSensor: new HeartRate(),
    weatherSensor: new Weather()
  },
  state:{
    openApp: null,
    refreshTimer: null, 
    group: null, 
    backgroundAnalog: null,
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
    weather:{
      location: null,
      current:{
        temperature:{
          low: null,
          high: null
        },
        description: null,
        icon:null
      }
    },
    wf: null, 
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
    logger.log('Init wfNumbers..')
    const centerX = 240;
    const centerY = 240;
    const radius = 220;
    wf.initWatchFace(new Date().getHours())
    const numbers = wf.getTimePointDigits()
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
        size = 30-5
        value = '☀️'
        y = centerY + (radius-5) * Math.sin(angleInRadians) - 30;
        w = 52
        h = 52
      }
      else if (numbers[i] == 0){
        size = 30-5
        value = '🌙'
        y = centerY + (radius-5) * Math.sin(angleInRadians) - 30;
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
  updateWfNumbers(){
    wf.updateWatchFaceDigit(new Date().getHours())
    const numbers = wf.getTimePointDigits()
    for (let i = 0; i < 12; i++){
          let value = numbers[i]
          if (numbers[i] == 12) {
            value = '☀️'
          }
          else if (numbers[i] == 0){
            value = '🌙'
          } 
          this.state.wfNumbers[`_${i}`].setProperty(prop.TEXT, value)        
      }
  },
  initAnalogBg(){
    logger.log('Init analog BG..')
    this.state.backgroundAnalog = createWidget(widget.IMG, {
      src: 'bgAnalog2.png',
      x: 0,
      y: 0,
    })
  },
  initDateTime(){
    logger.log('Init date and time widgets..')
    this.state.time.hourMinute = createWidget(widget.TEXT, {
      text: (addZero(this.sensors.timeSensor.getHours())+':'+ addZero(this.sensors.timeSensor.getMinutes())).toString(),
      text_size: 88,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 100,
      y: 200,
      w: 250,
    })
    this.state.time.seconds = createWidget(widget.TEXT, {
      text: addZero(this.sensors.timeSensor.getSeconds()),
      text_size: 58,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 185+155,
      y: 225,
      w: 100,
    })
    this.state.time.date = createWidget(widget.TEXT, {
      text: addZero(this.sensors.timeSensor.getDate()) +  '.' + addZero(this.sensors.timeSensor.getMonth()) ,
      text_size: 48,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 105,
      y: 155,
      w: 120,
    }) 
    this.state.time.weekDay = createWidget(widget.TEXT, {
      text: getText(WEEK_DAYS_SHORT[this.sensors.timeSensor.getDay()]),
      text_size: 38,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 225,
      y: 163,
      w: 170,
    })
    createWidget(widget.TIME_POINTER, {
      hour_centerX: 240,
      hour_centerY: 240,
      hour_posX: 0,
      hour_posY: 240,
      hour_path: 'hour.png',  
    })
  },
  updateDateTime(){
    this.state.time.date.setProperty(prop.TEXT, addZero(this.sensors.timeSensor.getDate()) +  '.' + addZero(this.sensors.timeSensor.getMonth()))
    this.state.time.weekDay.setProperty(prop.TEXT, getText(WEEK_DAYS_SHORT[this.sensors.timeSensor.getDay()]))
    this.sensors.timer = setInterval(()=>{
      this.state.time.seconds.setProperty(prop.TEXT, addZero(this.sensors.timeSensor.getSeconds().toString()))
      this.state.time.hourMinute.setProperty(prop.TEXT, (addZero(this.sensors.timeSensor.getHours())+':'+ addZero(this.sensors.timeSensor.getMinutes())).toString())
    }, 1000)
  },
  initActivity(){
    createWidget(widget.IMG, {
      src: 'icons/step.png',
      x: 100,
      y: 300,
    })
    this.state.actitity.step = createWidget(widget.TEXT, {
      text: this.sensors.stepSensor.getCurrent().toString(),
      text_size: 30,
      align_h: align.LEFT,
      color: 0xFFFFFF,
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
      text_size: 30,
      align_h: align.RIGHT,
      color: 0xFFFFFF,
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
      text_size: 30,
      align_h: align.LEFT,
      color: 0xFFFFFF,
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
      text_size: 30,
      align_h: align.RIGHT,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 225,
      y: 340,
      w: 100,
    })    
  },
  updateActivity(){
    this.state.actitity.step.setProperty(prop.TEXT, this.sensors.stepSensor.getCurrent().toString())
    this.state.actitity.calories.setProperty(prop.TEXT, this.sensors.calorieSensor.getCurrent().toString())
    this.state.actitity.distance.setProperty(prop.TEXT, this.sensors.distanceSensor.getCurrent().toString())
    this.state.actitity.heart.setProperty(prop.TEXT, this.sensors.heartRateSensor.getCurrent().toString())
  },
  initPower(){
    logger.log('Init power widget..')
    this.state.power.value = createWidget(widget.TEXT, {
      text: this.sensors.powerSensor.getCurrent().toString() + '%',
      text_size: 30,
      align_h: align.LEFT,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 230,
      y: 375,
      w: 100,
    })
    createWidget(widget.IMG, {
      src: 'icons/power.png',
      x: 240-45,
      y: 380,
    })
    this.sensors.powerSensor.onChange(()=>{
      this.state.power.value.setProperty(prop.TEXT, this.sensors.powerSensor.getCurrent().toString() + '%')
    })
  },
  updatePower(){
    this.state.power.value.setProperty(prop.TEXT, this.sensors.powerSensor.getCurrent().toString() + '%')
  },
  initWeather() {
    logger.log('Init weather widgets..')
    const forecastData = this.sensors.weatherSensor.getForecast().forecastData
    this.state.weather.current.temperature.low = createWidget(widget.TEXT,{
      text: forecastData.data[0].low.toString() + '°',
      text_size: 20,
      align_h: align.LEFT,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 320,
      y: 160,
      w: 50,      
    })
    this.state.weather.current.temperature.high = createWidget(widget.TEXT,{
      text: forecastData.data[0].high.toString() + '°',
      text_size: 20,
      align_h: align.LEFT,
      color: 0xFFFFFF,
      font: 'fonts/Serati/Serati-Regular.otf',
      x: 320+50,
      y: 160,
      w: 50,      
    })
   this.state.weather.current.icon =  createWidget(widget.IMG, {
      src: `weather/${forecastData.data[0].index}.png`,
      x: 330,
      y: 180,
    })
  },
  updateWeather(){
    const forecastData = this.sensors.weatherSensor.getForecast().forecastData
    this.state.weather.current.temperature.low.setProperty(prop.TEXT, forecastData.data[0].low.toString() + '°')
    this.state.weather.current.temperature.high.setProperty(prop.TEXT, forecastData.data[0].high.toString() + '°')
    this.state.weather.current.icon.setProperty(prop.SRC, `weather/${forecastData.data[0].index}.png`)
  },
  initEventState(){
    logger.log('Init event state..')
    this.state.eventState.time = createWidget(widget.TEXT, {
      text: '',
      text_size: 30,
      align_h: align.CENTER_H,
      color: 0xFFFFFF,
      x: (480-100)/2,
      y: 80,
      w: 100,
    })
    this.state.eventState.description = createWidget(widget.TEXT, {
      text: '',
      text_size: 30,
      align_h: align.CENTER_H,
      color: 0xFFFFFF,
      x: (480-220)/2,
      y: 120,
      w: 220,
    })    
  },
  updateEventState(eventsArr){
    try{
      let current = Manager.getNextState(eventsArr)
      this.state.eventState.time.setProperty(prop.TEXT, current.status)
      this.state.eventState.description.setProperty(prop.TEXT, current.description)
    } catch {
      return
    }
  },
  renderEventSectors(){
    if (this.state.group == null) {
      logger.log('Event sectors group init')
      this.state.group = createWidget(widget.GROUP, {
        w: 480,
        h: 480,
        x: 0,
        y: 0,
      })
    }
    const listOfActuals = Manager.uploadActualEvents()
    this.events.forEach((item) => {
      deleteWidget(item)
    })
    if (listOfActuals != undefined) {
      listOfActuals.forEach((item) =>{
        const ev = this.state.group.createWidget(widget.ARC, {
          x: (480-400)/2,
          y: (480-400)/2,
          w: 400,
          h: 400,
          start_angle: item.startAngle-90,
          end_angle: item.endAngle-90,
          line_width: 23,
          alpha: 100,
          color: item.color
        })
        ev.setAlpha(250)
        this.events.push(ev)
      })
    }
    this.updateEventState(listOfActuals)
  },
  refreshEventData(){
      let lastUpdateTime = 0;
      createWidget(widget.WIDGET_DELEGATE, {
          resume_call: async () => {
              const currentTime = Date.now();
              if (currentTime - lastUpdateTime < 60000) {
                  logger.log('Upadte events data failed timer < 1 min');
                  return;
              }
              try {
                  lastUpdateTime = currentTime;
                  await this.updateData();
                  if (!this.state.refreshTimer) {
                      this.state.refreshTimer = setInterval(() => {
                          launchApp({
                              appId: 1099579,
                              url: 'page/refresh'
                          });
                      }, 60000);
                      logger.log('Event data updated successfull')
                  }
              } catch (error) {
                  console.error('Update events failed! Error:', error);
              }
          },
          pause_call: () => {
              if (this.state.refreshTimer) {
                  clearInterval(this.state.refreshTimer);
                  this.state.refreshTimer = null;
              }
          },
          error_call: (error) => {
              console.error('Error in WIDGET_DELEGATE:', error);
          }
      });
  },
  async updateData() {
      return new Promise((resolve, reject) => {
          launchApp({
              appId: 1099579,
              url: 'page/refresh',
              onSuccess: () => {
                  logger.log('Update events successfull');
                  resolve();
              },
              onError: (error) => {
                  console.error('Update events error: ', error);
                  reject(error);
              }
          });
      });
  },
  updateEventSectors(){
    Manager.uploadActualEvents()
    this.renderEventSectors()
    deleteWidget(this.state.backgroundAnalog)
    this.initAnalogBg()
  },
  updateWidgets(){
    createWidget(widget.WIDGET_DELEGATE, {
      resume_call: () => {
        this.updateWfNumbers()
        this.updateDateTime()
        this.updateActivity()
        this.updatePower()
        this.updateWeather()
        this.updateEventSectors()
        this.createOpenAppArea()
      },
      pause_call: () => {
        clearInterval(this.sensors.timer)
        this.sensors.timer = null
      }
    })
  },
  createOpenAppArea(){
    if (this.state.openApp == null) deleteWidget(this.state.openApp)
    this.state.openApp = createWidget(widget.FILL_RECT, {
      w: 50,
      h: 50,
      x: (480-50)/2,
      y: 80,
      color: 0xda1111
    })
    this.state.openApp.setAlpha(0)
    this.state.openApp.addEventListener(event.CLICK_UP, () => {
      launchApp ({
        appId: 1099579
      })
    })
  },

  onInit() {
    try{
      logger.log('Wachface init')
      this.renderEventSectors()
      this.initAnalogBg()
      this.initWfNumbers()
      this.initPower()
      this.initDateTime()
      this.initActivity()
      this.initWeather()
      this.initEventState([])
      this.refreshEventData()
      this.updateWidgets()
    } catch (error){
      logger.error('Error ', error)
    }
  }
})
