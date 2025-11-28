import { log } from "@zos/utils"
import { HOUR_MS, COLORS } from "./Constants"
import { readFileSync, writeFileSync } from '@zos/fs'
import { color } from "chart.js/helpers"


/**
 * The class responsible for load, preparing and receiving information for rendering
*/
export class EventsManager {
    logger = log.getLogger('EventManager.js')
    listOfCurrentDayEvents = []
    color_index = 0

    constructor(){
      // writeFileSync({
      //   path: 'events',
      //   data: '',
      //   options: {
      //       encoding: 'utf8',
      //   }
      // })
      // this.uploadActualEvents()
    }

    /**Filter all loaded events [2h - now +10h] */
    eventsFilter(event){
      let result = false
      let now = new Date()
      let startEv = new Date(event.start)
      let endEv = new Date(event.end)
      if ((startEv.getTime() - now.getTime()) <= (10 * HOUR_MS) && startEv >= now)
        result = true
      else if ((now.getTime() - endEv.getTime()) <= 2 * HOUR_MS && now >= endEv)
        result = true
      else if (now >= startEv && now <= endEv) result = true

      return result 
    }

    /**Upload events from file /data/events  with filtration*/
    uploadActualEvents(){
      const file = EventsManager.readEvents()
      if (file && file.trim()){
        const loadedEvents = JSON.parse(file)
        for (const ev of loadedEvents){
          if (this.eventsFilter(ev)){
            const updatedEvent = EventsManager.addColorAnglesToEvent(ev)
            this.listOfCurrentDayEvents.push(updatedEvent)
          }
        }
        console.log('GET LIST OF EVENTS: '+ JSON.stringify(this.listOfCurrentDayEvents))
      }
      else this.logger.log('0 events loaded')
    }

    addEvent(event){
      const loaded_events = EventsManager.readEvents()
      let result = []
      if (loaded_events && loaded_events.trim()){
         for (const ev of JSON.parse(loaded_events)){
            const eventWithId = {
              id: !event.id ? EventsManager.generateEventId(): event.id,
              start: ev.start,
              end: ev.end, 
              description: ev.description,
            } 
            result.push(eventWithId)
         }
         result.push(event)
      }
      else result.push(event)
      EventsManager.writeEvents(result)
      this.uploadActualEvents()
    }

    editStartDate(event){
      const loadedEvents = EventsManager.readEvents()
      let result = []
      if (loadedEvents && loadedEvents.trim()){
        const events = JSON.parse(loadedEvents)
        for (const e of events){
          if (e.id == event.id) {
            e.start = event.start
          }
          result.push(e)
        }
        EventsManager.writeEvents(result)
      }
      this.uploadActualEvents()
    }

    editEndDate(event){
      const loadedEvents = EventsManager.readEvents()
      let result = []
      if (loadedEvents && loadedEvents.trim()){
        const events = JSON.parse(loadedEvents)
        for (const e of events){
          if (e.id == event.id) {
            e.end = event.end
          }
          result.push(e)
        }
        EventsManager.writeEvents(result)
      }
      this.uploadActualEvents()
    }

    editEventDescription(event){
      const loadedEvents = EventsManager.readEvents()
      let result = []
      if (loadedEvents && loadedEvents.trim()){
        const events = JSON.parse(loadedEvents)
        for (const e of events){
          console.log('ID ' + event.id)
          if (e.id == event.id) {
            e.description = event.description
          }
          result.push(e)
        }
        EventsManager.writeEvents(result)
      }
      this.uploadActualEvents()
    }

    deleteEventById(id){
      const loadedEvents = EventsManager.readEvents()
      let result = []
      if (loadedEvents && loadedEvents.trim()){
        const events = JSON.parse(loadedEvents)
        for (const e of events){
          if (e.id != id) {
            console.log('DEl ' + JSON.stringify(e))
            result.push(e)
          }
        }
        EventsManager.writeEvents(result)
      }
      this.uploadActualEvents()
    }

    getListOfCurrentDayEvents(){
      this.listOfCurrentDayEvents.splice(0, this.listOfCurrentDayEvents.length) 
      this.uploadActualEvents()
      console.log(this.listOfCurrentDayEvents)
      this.listOfCurrentDayEvents.forEach(function(e){
        console.log('LIST: ' + JSON.stringify(e))
      })
      return this.listOfCurrentDayEvents
    }

    static readEvents(){
      return readFileSync({
          path: 'events',
          options: {
            encoding: 'utf8',
          }
        })
    }

    static writeEvents(events){
      writeFileSync({
        path: 'events',
        data: JSON.stringify(events),
        options: {
            encoding: 'utf8',
        }
      })
    }

    static generateEventId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    static addColorAnglesToEvent(event){
       const angles = EventsManager.calculateAngles(event, Date.now())
       const result = {
          id: event.id,
          start: event.start,
          end: event.end, 
          description: event.description,
          startAngle: angles.startAngle,
          endAngle: angles.endAngle,
          color: COLORS[10]
        }
        color_index = color_index == COLORS.length-1 ? 0 : color_index
        return result
    }

    static calculateAngles(event, timeNow){
      let startAngle = EventsManager.convertTimeToAngle(event.start)
      let endAngle = EventsManager.convertTimeToAngle(event.end)
      const deleteTime = new Date(new Date(timeNow).getTime()- 2 * HOUR_MS)
      if (new Date(event.start) < deleteTime) {
        startAngle = EventsManager.convertTimeToAngle(deleteTime)
      }
      else if(new Date(event.end) > timeNow+ 10 * HOUR_MS){
        endAngle = EventsManager.convertTimeToAngle(timeNow + 10 * HOUR_MS)
      }
      startAngle = startAngle > endAngle ? (startAngle-360) : startAngle
      return {startAngle: startAngle, endAngle: endAngle}
    }

    static convertTimeToAngle(time){
      // 1h => 30 grad
      // 1h => 60 min => 30/60 = > 0.5 grad/min
      let date = new Date(time)
      let result = (date.getHours() * 60 + date.getMinutes()) * 0.5
      // normalization
      return result >= 360 ? result % 360 : result
    }

    static isThisEvent(x, y, event) {
      const distance = Math.sqrt((x - 240) ** 2 + (y - 240) ** 2);
      if (distance > 200) {
        return false;
      }
      let pointAngle = 90 - Math.atan2(240 - y, x - 240) * (180 / Math.PI);
      if (pointAngle < 0) pointAngle = 360 + pointAngle
      console.log('EVENT IS THIS '+ JSON.stringify(event) + ' ' + pointAngle)

      if (event.startAngle <= event.endAngle) {
        // if (event.startAngle < 0 ) pointAngle = pointAngle - 360 ????

        return pointAngle >= event.startAngle && pointAngle <= event.endAngle;
      } else {
        return pointAngle >= event.startAngle || pointAngle <= event.endAngle;
      }
    }
}