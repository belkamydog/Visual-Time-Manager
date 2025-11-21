

/**
 * The class responsible for preparing and receiving information for rendering
*/
export class EventsManager {
    HOUR_MS = 3600000
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
      if ((startEv.getTime() - now.getTime()) <= (10 * this.HOUR_MS) && startEv >= now)
        result = true
      else if ((now.getTime() - endEv.getTime()) <= 2 * this.HOUR_MS && now >= endEv)
        result = true
      else if (now >= startEv && now <= endEv) result = true

      return result 
    }

    uploadEventFromFile(){
      /** Tmp Mock */
      let loadedEvents =  [
        { start: '2025-11-21T00:00:00', end: '2025-11-21T01:00:00', description: 'Do nothing', color: '0x2E8B57' },
        { start: '2025-11-21T23:00:00', end: '2025-11-21T24:00:00', description: 'Sport', color: '0x1E90FF'},

        
        { start: '2025-11-21T15:00:00', end: '2025-11-21T18:08:00', description: 'Time of tea', color: '0xFFD700'},

        { start: '2025-11-20T00:00:00', end: '2025-11-21T01:00:00', description: 'DieHard', color: '0x2E8B57' },
        { start: '2025-11-20T03:00:00', end: '2025-11-21T06:00:00', description: 'Do work', color: '0x1E90FF'},

        { start: '2025-11-21T19:00:00', end: '2025-11-21T21:00:00', description: 'Time discussion', color: '0xFFFFCC'}, 
        { start: '2025-11-22T19:00:00', end: '2025-11-22T21:00:00', description: 'Love Time', color: '0xFF6344'}, 

        { start: '2025-11-23T04:00:00', end: '2025-11-21T5:00:00', description: 'Time of coffee', color: '0xFFD700'}
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