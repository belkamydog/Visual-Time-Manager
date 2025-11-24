import { log } from "@zos/utils"
import { HOUR_MS } from "./Constants"

/**
 * The class responsible for preparing and receiving information for rendering
*/
export class EventsManager {
    logger = log.getLogger('EventManager.js')
    listOfCurrentDayEvents = []

    constructor(){
      this.updateListOfCurrentDayEvents()
    }

    eventsFilter(event){
      let result = false
      let now = new Date()
      let startEv = new Date(event.start)
      let endEv = new Date(event.end)
      // (start - now) <= 12h && end - now <= 2h
      if ((startEv.getTime() - now.getTime()) <= (10 * HOUR_MS) && startEv >= now)
        result = true
      else if ((now.getTime() - endEv.getTime()) <= 2 * HOUR_MS && now >= endEv)
        result = true
      else if (now >= startEv && now <= endEv) result = true

      return result 
    }

    uploadEventFromFile(){
      /** Mock */
      let loadedEvents =  [
        // { start: '2025-11-23T00:00:00', end: '2025-11-21T01:00:00', description: 'Do nothing', color: '0x2E8B57' },
        // { start: '2025-11-23T23:00:00', end: '2025-11-21T24:00:00', description: 'Sport', color: '0x1E90FF'},

        
        // { start: '2025-11-23T15:00:00', end: '2025-11-21T18:08:00', description: 'Time of tea', color: '0xFFD700'},

        // { start: '2025-11-23T00:00:00', end: '2025-11-21T01:00:00', description: 'DieHard', color: '0x2E8B57' },
        // { start: '2025-11-24T20:00:00', end: '2025-11-24T22:00:00', description: 'Do work', color: '0x1E90FF'},

        // { start: '2025-11-24T21:00:00', end: '2025-11-25T01:30:00', description: 'Time discussion', color: '0xFFFFCC'}, 
        // { start: '2025-11-24T20:00:00', end: '2025-11-24T21:00:00', description: 'Love Time', color: '0xFF6344'}, 

        // { start: '2025-11-24T14:00:00', end: '2025-11-24T15:00:00', description: 'Time of coffee', color: '0xFFD700'}
      ]
      for (const ev of loadedEvents){
        if (this.eventsFilter(ev)){
          this.listOfCurrentDayEvents.push(ev)
        }
      }
    }

    updateListOfCurrentDayEvents(){
      this.listOfCurrentDayEvents.splice(0, this.listOfCurrentDayEvents.length) 
      this.uploadEventFromFile()
    }

    getListOfCurrentDayEvents(){
      this.updateListOfCurrentDayEvents()
      return this.listOfCurrentDayEvents
    }
}