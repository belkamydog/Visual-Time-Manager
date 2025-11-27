import { log } from "@zos/utils"
import { HOUR_MS } from "./Constants"
import { readFileSync, writeFileSync } from '@zos/fs'

/**
 * The class responsible for load, preparing and receiving information for rendering
*/
export class EventsManager {
    logger = log.getLogger('EventManager.js')
    listOfCurrentDayEvents = []

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

    syncEvents(){
      /** Mock */
      let mockEvents =  [
        { start: '2025-11-27T05:00:00', end: '2025-11-27T09:30:00', description: 'Time discussion', color: '0xFFFFCC'}, 
        { start: '2025-11-27T12:00:00', end: '2025-11-27T13:00:00', description: 'Love Time', color: '0xFF6344'}, 
        { start: '2025-11-27T18:00:00', end: '2025-11-27T21:00:00', description: 'Time of coffee', color: '0xFFD700'}
      ]
      writeFileSync({
        path: 'events',
        data: JSON.stringify(mockEvents),
        options: {
            encoding: 'utf8',
        },
      })
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

    /** Add to event json event startAngle  and event endAngle*/
    prepareEvents(events){
      for (const ev of events){
        if (this.eventsFilter(ev)){
          ev.angle = this.calculateAngles(ev)
          this.listOfCurrentDayEvents.push(ev)
        }
      }
    }

    /**Upload events from file /data/events  with filtration*/
    uploadActualEvents(){
      const file = readFileSync({
        path: 'events',
        options: {
          encoding: 'utf8',
        },
      })
      if (file && file.trim()){
        const loadedEvents = JSON.parse(file)
        for (const ev of loadedEvents){
          if (this.eventsFilter(ev)){
            const angles = EventsManager.calculateAngles(ev, Date.now())
            const t = {
              start: ev.start,
              end: ev.end, 
              description: ev.description,
              color: ev.color,
              startAngle: angles.startAngle,
              endAngle: angles.endAngle
            }
            this.listOfCurrentDayEvents.push(t)
            }
          }
          console.log('GET LIST OF EVENTS: '+ JSON.stringify(this.listOfCurrentDayEvents))
      }
      else this.logger.log('0 events loaded')
    }

    addEvent(event){
      const loaded_events = readFileSync({
        path: 'events',
        options: {
          encoding: 'utf8',
        }
      })
      console.log('BEFORE ADD FILE: ' + loaded_events)
      let result = []
      if (loaded_events && loaded_events.trim()){
         for (const ev of JSON.parse(loaded_events)){
            result.push(ev)
         }
         result.push(event)
      }
      else result.push(event)
      writeFileSync({
        path: 'events',
        data: JSON.stringify(result),
        options: {
            encoding: 'utf8',
        }
      })
      this.uploadActualEvents()
      const loaded_events2 = readFileSync({
        path: 'events',
        options: {
          encoding: 'utf8',
        }
      })
      console.log('AFTER ADD FILE: ' + loaded_events2)
      // console.log("LIST: " + JSON.stringify(this.listOfCurrentDayEvents))
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

      if (event.startAngle <= event.endAngle) {
        if (event.startAngle < 0 ) pointAngle = pointAngle - 360
        return pointAngle >= event.startAngle && pointAngle <= event.endAngle;
      } else {
        return pointAngle >= event.startAngle || pointAngle <= event.endAngle;
      }
    }
}