import {log} from '@zos/utils'
import { FileService } from './FileService'
import { SettingsService } from './SettingsService'
import { Event } from '../models/Event'
import { HOUR_MS, REPEAT } from '../Constants'

const logger = log.getLogger('EventService')

export class EventService {
    eventsFilePath = 'events'
    actualEvents = []

    constructor(){}

    getActualEvents(){
        this.#autoDeleteEvents()
        this.#uploadActualEvents()
        FileService.writeFile('actual_events', this.#convertToEvent())
        return this.actualEvents
    }
    
    /**
     * Method for clearing event history
     * 
     * Deletes all saved events by overwriting the events file with an empty array.
     * 
     * @function clearHistoryOfEvents
     * @throws {Error} Throws error if history clearing fails
     * 
     * @example
     * // Usage example
     * try {
     *     clearHistoryOfEvents();
     *     console.log('Event history cleared successfully');
     * } catch (error) {
     *     console.error('Error clearing history:', error);
     * }
     * 
     * @returns {void} Method doesn't return a value
     * 
     * @see FileService.writeFile - method for writing to file
     * @see logger.log - method for logging successful operations
     * @see logger.error - method for logging errors
     */
    clearHistoryOfEvents(){
        logger.log('Delete events history init...')
        try{
            this.#saveEvents([])
            logger.log('Clear history successfull')
        } catch(Error){
            logger.error(Error , 'Clear history failed')
            throw new Error('Clear history failed')
        }
    }

    /**
     * Creates a new event and saves it to the list
     * 
     * Method performs the following actions:
     * 1. Validates fields of the new event
     * 2. Loads existing events
     * 3. Generates unique ID for the new event
     * 4. Adds event to the list
     * 5. Saves updated list
     * 
     * @public
     * @param {Event} event - new event object
     * @returns {void}
     * 
     * @description
     * Method is intended for adding new events to the calendar.
     * Before saving, the event is validated and receives a unique ID.
     * 
     * @throws {Error} In case of errors when creating event
     */
    createNewEvent(event) {
        logger.log('Creating new event...');
        try {
            this.#checkEventFields(event);
            let result = this.#loadEvents();
            this.#generateEventId(event, result);
            result.push(event);
            this.#saveEvents(result);
            this.#uploadActualEvents()
            logger.log('New event created successfully');
        } catch (error) {
            logger.error(error, 'Create new event failed');
            throw error;
        }
    }

    /**
     * Edits an existing event in the list
     * 
     * Method searches for event by ID and replaces it with new version
     * 
     * @public
     * @param {Event} event - event object with updated data
     * @returns {void}
     * 
     * @description
     * Method performs the following actions:
     * 1. Loads current events from file
     * 2. Iterates through event list
     * 3. Replaces event with matching ID with the new one
     * 4. Saves updated list
     * 
     * @throws {Error} In case of errors when working with files
     */
    editEvent(event) {
        logger.log('Edit event started...');
        try {
            const loadedEvents = this.#loadEvents();
            let result = [];
            for (const ev of loadedEvents) {
                if (this.#checkEventFields(ev) && event.id === ev.id) {
                    result.push(event);
                } else {
                    result.push(ev);
                }
            }
            this.#saveEvents(result);
            this.#uploadActualEvents()
            logger.log('Event edited successfully');
        } catch (error) {
            logger.error(error, 'Edit event failed');
            throw error;
        }
    }

    /**
     * Deletes event by its ID
     * 
     * Method finds event with specified ID and removes it from the list
     * 
     * @public
     * @param {number} id - unique event identifier for deletion
     * @returns {void}
     * 
     * @description
     * Method performs the following actions:
     * 1. Loads all events from file
     * 2. Filters events, keeping only those whose ID doesn't match the provided one
     * 3. Saves updated list
     * 4. Updates list of actual events
     * 
     * @throws {Error} In case of errors when deleting event
     */
    deleteEvent(id) {
        try {
            logger.log(`Deleting event with ID: ${id}`);
            const loadedEvents = this.#loadEvents();
            const result = [];
            for (const ev of loadedEvents) {
                if (this.#checkEventFields(ev) && ev.id !== id) {
                    result.push(ev);
                }
            }
            this.#saveEvents(result);
            this.#uploadActualEvents();
            logger.log('Event deleted successfully');
            return result
        } catch (error) {
            logger.error(error, `Failed to delete event with ID: ${id}`);
            throw error;
        }
    }

    getWeekListOfEvents(date){
        this.#autoDeleteEvents()
        const week = EventService.getWeekRange(date)
        const loadedEvents = this.#loadEvents()
        let resultList = []
        for (const ev of loadedEvents){
            ev.check_repeat = ev.repeat
            if (ev.repeat != 'never') {
                this.#repeateRule(new Event(ev), week, resultList)
            }
            else {
                if (new Date(ev.start) >= week.start && new Date(ev.start <= week.end))
                    resultList.push(new Event(ev))
            }
        }
        resultList.sort((a, b) => new Date(a.start) - new Date(b.start));
        for (const i of resultList) console.log('resultList ' + JSON.stringify(i))
        return resultList
    }

    /**
     * Automatically deletes outdated events from the list
     * 
     * Method filters events based on auto-delete settings and saves only relevant ones
     * 
     * @private
     * @returns {void}
     * 
     * @description
     * Method performs the following actions:
     * 1. Loads auto-delete settings
     * 2. Loads all events
     * 3. Filters events by deletion conditions
     * 4. Saves filtered list
     * 
     * @throws {Error} In case of errors when processing events
     */
    #autoDeleteEvents() {
        try {
            let countOfdeleted = 0
            logger.log('Starting auto-delete process...');
            const autoDelete = SettingsService.loadSettings().autoDelete;
            const loadedEvents = this.#loadEvents();
            const deleteFilterDone = [];
            for (const ev of loadedEvents) {
                if (this.#checkEventFields(ev) && !this.#deleteFilter(ev, autoDelete)) {
                    deleteFilterDone.push(ev);
                }
                else countOfdeleted++
            }
            this.#saveEvents(deleteFilterDone);
            logger.log(`Auto-delete process completed. ${countOfdeleted} events deleted`);
        } catch (error) {
            logger.error(error, 'Auto-delete events failed');
            throw error;
        }
    }

    /**
     * Loads actual events from file and prepares them for display
     * 
     * Method filters events by relevance and adds necessary display parameters to them
     * 
     * @private
     * @returns {void}
     * 
     * @description
     * Method performs the following actions:
     * 1. Loads all events from file
     * 2. Filters events by relevance
     * 3. Adds display angles for each event
     * 4. Saves actual events to actualEvents array
     * 
     * @throws {Error} In case of errors when processing events
     */
    #uploadActualEvents() {
        try {
            logger.log('Loading actual events...');
            this.actualEvents = []
            const loadedEvents = this.#loadEvents();
            const start = new Date().getTime() - 2 * HOUR_MS
            const end = new Date().getTime() + 10 * HOUR_MS
            for (const ev of loadedEvents) {
                this.#addAnglesToEvent(ev);
                if (this.#checkEventFields(ev) && this.#actualEventsFilter(ev) && ev.repeat == 'never') {
                    this.actualEvents.push(ev);
                }
                else{
                    let repeatedEventsList = []
                    this.#repeateRule(ev, {start: new Date(start), end: new Date(end)}, repeatedEventsList)
                    repeatedEventsList.forEach((item) => {
                        if (this.#checkEventFields(item) && this.#actualEventsFilter(item))
                            this.#addAnglesToEvent(item)
                            this.actualEvents.push(item)
                    })
                }
            }
            logger.log(`Actual events loaded successfully. Count of uploaded = ${this.actualEvents.length}`);
        } catch (error) {
            logger.error(error, 'Failed to load actual events');
            throw error;
        }
    }

    /**
     * Filters events by their relevance
     * 
     * Method determines if event is relevant for display based on its time boundaries
     * 
     * @private
     * @param {Event} event - event to check
     * @returns {boolean} true - if event is relevant, false - otherwise
     * 
     * @description
     * Event is considered relevant if one of the conditions is met:
     * 1. Event starts no later than in 10 hours and no earlier than current moment
     * 2. Event ended no more than 2 hours ago
     * 3. Event is happening right now (current time is between start and end)
     */
    #actualEventsFilter(event) {
        const now = new Date();
        const startEv = new Date(event.start);
        const endEv = new Date(event.end);
        return (
            // Event starts within next 10 hours and not before current moment
            ((startEv.getTime() - now.getTime()) <= (10 * HOUR_MS) && startEv >= now) ||
            // Event ended no more than 2 hours ago
            ((now.getTime() - endEv.getTime()) <= (2 * HOUR_MS) && now >= endEv) ||
            // Event is happening right now
            (now >= startEv && now <= endEv)
        );
    }


    #convertToEvent(){
        let result = []
        this.actualEvents.forEach((item)=>{
            result.push(new Event(item))
        })
        return result
    }


    /**
     * Determines necessity of automatic event deletion
     * 
     * @public
     * @param {Object} event - event object with fields repeat and end
     * @param {String} autoDelete - never, day, week, month
     * @returns {boolean} true - if event should be deleted, false - otherwise
     * 
     * @description
     * Method checks if event should be automatically deleted based on:
     * - presence of event repetition
     * - auto-delete settings
     * - difference between current date and event end date
     */
    #deleteFilter(event, autoDelete) {
        if (event.repeat && event.repeat != 'never') return false;
        let result = false;
        const now = new Date();
        const end = new Date(event.end);
        if (autoDelete === 'day') {
            // Deletion 24 hours after end
            if (now > end && (now.getTime() - end.getTime()) > HOUR_MS * 24) {
                result = true;
            }
        } else if (autoDelete === 'week') {
            // Deletion 7 days after end
            if (now > end && (now.getTime() - end.getTime()) > HOUR_MS * 24 * 7) {
                result = true;
            }
        } else if (autoDelete === 'month') {
            // Deletion 31 days after end
            if (now > end && (now.getTime() - end.getTime()) > HOUR_MS * 24 * 31) {
                result = true;
            }
        }
        if (result) {
            logger.log('Auto-delete = ' + this.autoDelete + ' Delete: ' + event);
        }
        return result;
    }

    /**
     * Method for loading events from file
     * 
     * Loads saved events from specified file in JSON format.
     * Handles possible errors when reading file or parsing data.
     * 
     * @function loadEvents
     * @returns {Array|string} Array of events in JSON format or empty string on error
     * 
     * @throws {Error} Internal error when reading file
     * 
     * @example
     * // Usage example
     * try {
     *     const events = loadEvents();
     *     if (events instanceof Array) {
     *         // Process loaded events
     *     }
     * } catch (error) {
     *     console.error('Error loading events:', error);
     * }
     * 
     * @see FileService.readFile - method for reading file
     * @see JSON.parse - method for parsing JSON data
     */
    #loadEvents(){
        try {
           const fileContent = FileService.readFile(this.eventsFilePath)
            if (!fileContent) return []
            return JSON.parse(fileContent)
        } catch (Error) {
            logger.error(Error, 'Upload events failed')
            return []
        }
    }

    /**
     * Saves event list to file
     * 
     * Method writes provided event array to file in JSON format
     * 
     * @private
     * @param {Array<Event>} listOfEvents - event array for saving
     * @returns {void}
     * 
     * @description
     * Method writes provided event list to file.
     * Each event must conform to expected data structure.
     * 
     * @throws {Error} In case of errors when writing file
     */
    #saveEvents(listOfEvents) {
        try {
            FileService.writeFile(this.eventsFilePath, listOfEvents);
            logger.log('Events successfully saved');
        } catch (error) {
            logger.error(error, 'Failed to save events');
            throw error;
        }
    }

    /**
     * Creates list of repeating events based on specified period
     * 
     * Method generates event copies according to repetition rule up to specified end date
     * 
     * @private
     * @param {Event} event - source event with repetition rule
     * @param {Object} period - object with fields start and end, defining repetition period
     * @returns {Event[]} array of repeating events
     * 
     * @description
     * Method supports following repetition types:
     * - 'never' - no repetition
     * - 'day' - daily repetition
     * - 'week' - weekly repetition
     * - 'month' - monthly repetition
     * 
     * Each repetition type uses its own time interval
     */
    #repeateRule(event, period, listToAdd) {
        let repeatMs = this.#getRepeatTimeMs(event);
        if (event.repeat !== 'never') {
            let repeatedEvent = { ...event };
            repeatedEvent.check_repeat = event.repeat;
            repeatedEvent.repeat = 'never';
            let start = new Date(event.start).getTime() + repeatMs
            let end = new Date(event.end).getTime() + repeatMs
            while (new Date(repeatedEvent.start).getTime() <= new Date(period.end).getTime()) {
                if (new Date(repeatedEvent.start).getTime() <= new Date(period.end).getTime() &&
                    new Date(repeatedEvent.end).getTime() >= new Date(period.start).getTime()){
                    listToAdd.push(new Event(repeatedEvent));
                }
                repeatedEvent.start = start;
                repeatedEvent.end = end;
                repeatMs = event.repeat === 'month' 
                    ? this.#getMsToSameDateInNextMonth(repeatedEvent) 
                    : repeatMs;
                start += repeatMs
                end += repeatMs
            }
        }
    }

    /**
     * Method for checking correctness of event fields
     * 
     * Checks if provided data conforms to event format
     * 
     * @function checkEventFields
     * @param {Object} event - event object to check
     * @returns {boolean} true if all fields are correct, otherwise false
     * 
     * @example
     * const event = {
     *     description: 'Meeting with client',
     *     startDate: new Date(),
     *     endDate: new Date(),
     *     color: '0x000000',
     *     repeat: '0123'
     * };
     * 
     * const isValid = checkEventFields(event); // true
     * 
     * @throws {Error} Throws error if any field doesn't meet requirements
     * 
     * @see Event format requirements:
     *      - description: string
     *      - startDate: Date object
     *      - endDate: Date object
     *      - color: string in hex format (e.g. '0x000000')
     *      - repeat: string containing digits 0-3 (e.g. '0123')
     */
    #checkEventFields(event) {
        if (!event || typeof event !== 'object') {
            throw new Error('Event must be a valid object');
        }
        if (typeof event.description !== 'string' || event.description.trim() === '') {
            throw new Error('Invalid description: must be a non-empty string');
        }
        if (!(new Date(event.start) instanceof Date)) {
            throw new Error('Invalid startDate: must be a valid Date object');
        }
        if (!(new Date(event.end) instanceof Date)) {
            throw new Error('Invalid endDate: must be a valid Date object');
        }
        if (typeof event.repeat !== 'string' ||
            !['never', 'day', 'week', 'month'].includes(event.repeat)
        ) {
            throw new Error('Invalid repeat: must be one of \'never\', \'day\', \'week\', \'month\'');
        }

        return true;
    }

    /**
     * Method for generating unique event ID
     * 
     * Generates unique event identifier by combining current time
     * in base-36 format and random string. This approach provides high
     * probability of generated ID uniqueness.
     * 
     * @function generateEventId
     * @returns {string} Unique event identifier
     * 
     * @description
     * Method creates ID consisting of two parts:
     * 1. Current time in milliseconds, converted to base-36
     * 2. Random string of 9 characters in base-36
     * 
     * Example return value: 'r3m123456789'
     * 
     * @see toString(36) - converting number to string in base-36 number system
     *      (uses digits 0-9 and letters a-z)
     * 
     * @example
     * const eventId = generateEventId(); // e.g. 'r3m123456789'
     */
    #generatorId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Method for automatic checking and generation of unique event ID
     * 
     * Checks for ID duplicates in event list and, if duplicate found,
     * automatically generates new unique ID for event.
     * 
     * @function checkDuplicateId
     * @param {Object} event - event object for which ID is checked
     * @param {Array} allEvents - array of all existing events for checking
     * 
     * @returns {void} Method modifies original event object
     * 
     * @throws {Error} Throws error if:
     *   - event is not an object
     *   - allEvents is not an array
     *   - generateEventId() method is unavailable
     * 
     * @example
     * // Usage example
     * const event = {
     *     id: 'possible-duplicate',
     *     description: 'New event'
     * };
     * 
     * const allEvents = [
     *     { id: 'existing-id-1' },
     *     { id: 'possible-duplicate' },
     *     { id: 'existing-id-2' }
     * ];
     * 
     * checkDuplicateId(event, allEvents);
     * // After execution event.id will contain unique ID
     * 
     * @see generateEventId - method for generating new ID
     * @see Array.prototype.some - method for checking duplicates
     * 
     * @note Method modifies original event object,
     *       changing its id property if necessary
     */
    #generateEventId(event, allEvents) {
        if (!event || typeof event !== 'object') {
            throw new Error('Event must be a valid object');
        }
        if (!Array.isArray(allEvents)) {
            throw new Error('All events must be provided as an array');
        }
        while (allEvents.some(existingEvent => existingEvent.id === event.id)) {
            event.id = this.#generatorId();
        }
    }

    /**
     * Adds angles to event based on its time boundaries
     * 
     * @private
     * @param {Object} event - event object with fields start and end
     * @description
     * Method calculates start and end angles for visual representation of event
     * on watch face and adds them to event object.
     */
    #addAnglesToEvent(event) {
        // Calculate angles for event
        const angles = this.#calculateEventAngles(event, Date.now());
        // Add angles to event object
        event.startAngle = angles.startAngle;
        event.endAngle = angles.endAngle;
    }

    /**
     * Calculates angles for visual representation of event
     * 
     * @private
     * @param {Object} event - event object with fields start and end
     * @param {number} timeNow - current time in milliseconds
     * @returns {Object} object with fields startAngle and endAngle
     * 
     * @description
     * Method calculates angles based on event time boundaries,
     * considering display time limitations.
     * 
     * Limitations:
     * - Events older than 2 hours from current time start from 2-hour ago angle
     * - Events ending later than 10 hours are truncated to 10-hour limit
     */
    #calculateEventAngles(event, timeNow) {
        // Calculate base angles for event start and end
        let startAngle = EventService.convertTimeToAngle(event.start);
        let endAngle = EventService.convertTimeToAngle(event.end);
        
        // Calculate cutoff time (2 hours ago)
        const deleteTime = new Date(new Date(timeNow).getTime() - 2 * HOUR_MS);
        
        // Adjust angles considering time limitations
        if (new Date(event.start) < deleteTime) {
            // If event starts before 2 hours ago, start from 2-hour mark
            startAngle = EventService.convertTimeToAngle(deleteTime);
        } else if (new Date(event.end).getTime() > timeNow + 10 * HOUR_MS) {
            // If event ends later than 10 hours, truncate to 10-hour mark
            endAngle = EventService.convertTimeToAngle(timeNow + 10 * HOUR_MS);
        }
        
        // Adjust start angle if it's greater than end angle
        startAngle = startAngle > endAngle ? (startAngle - 360) : startAngle;
        
        return {
            startAngle: startAngle,
            endAngle: endAngle
        };
    }

    #getRepeatTimeMs(event){
        let repeatTimeMs = 0
        if (event.repeat == REPEAT[1]) repeatTimeMs = 24 * HOUR_MS
        else if ( event.repeat == REPEAT[2]) repeatTimeMs = 7 * 24 * HOUR_MS
        else if (event.repeat == REPEAT[3]) repeatTimeMs = this.#getMsToSameDateInNextMonth(event)
        return repeatTimeMs
    }

    /**
     * Calculates number of milliseconds to same date in next month
     * 
     * Method calculates time difference between event date and same date in next month,
     * considering number of days in next month
     * 
     * @private
     * @param {Event} event - event for which calculation is performed
     * @returns {number} number of milliseconds to same date in next month
     * 
     * @description
     * Method considers:
     * - transition between months
     * - transition between years
     * - different number of days in months
     * - correct handling of last day of month
     */
    #getMsToSameDateInNextMonth(event) {
        const start = new Date(event.start);
        const currentDay = start.getDate();
        let nextMonth = start.getMonth() + 1;
        let nextYear = start.getFullYear();
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear += 1;
        }
        const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const nextDay = Math.min(currentDay, daysInNextMonth);
        const nextEventDate = new Date(nextYear, nextMonth, nextDay);
        const diffInMs = nextEventDate.getTime() - start.getTime();
        return diffInMs;
    }

    /**
     * Defines week boundaries for given date
     * 
     * Method calculates Monday and Sunday of current week for specified date
     * 
     * @private
     * @param {Date|string} date - date for which week is determined
     * @returns {{start: Date, end: Date}} object with start (Monday) and end (Sunday) dates of week
     * 
     * @description
     * Week is considered from Monday to Sunday.
     * Method correctly handles transitions between months and years.
     */
    static getWeekRange(date) {
      const currentDate = new Date(date);
      const dayOfWeek = currentDate.getDay(); // 0-Sunday, 1-Monday, ...6-Saturday
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() + diffToMonday);
      const sunday = new Date(monday);
      monday.setHours(0)
      monday.setMinutes(0)
      monday.setSeconds(0)
      monday.setMilliseconds(0)
      sunday.setHours(0)
      sunday.setMinutes(0)
      sunday.setSeconds(0)
      sunday.setMilliseconds(0)
      sunday.setDate(monday.getDate() + 7);
      return { start: monday, end: sunday };
    }

    /**
     * Converts time to degrees for display on watch face
     * 
     * Function converts hours and minutes to rotation degrees of clock hand.
     * Used for correct display of hour and minute hand positions
     * on analog watch face.
     * 
     * @static
     * @param {string|Date} time - time in string format or Date object
     * @returns {number} angle in degrees [0, 360)
     * 
     * @description
     * Conversion algorithm:
     * - 1 hour corresponds to 30 degrees (full circle 360° / 12 hours)
     * - 1 minute corresponds to 0.5 degrees (30° / 60 minutes)
     * 
     * Example:
     * - 12:00 -> 0 degrees
     * - 3:00 -> 90 degrees
     * - 6:00 -> 180 degrees
     * - 9:00 -> 270 degrees
     * - 12:30 -> 180 degrees (30 minutes * 0.5°/min)
     */
    static convertTimeToAngle(time) {
        // Create date object from provided time
        let date = new Date(time);
        
        // Calculate total number of minutes
        // (hours * 60 + minutes) * 0.5°/minute
        let result = (date.getHours() * 60 + date.getMinutes()) * 0.5;
        
        // Result normalization: if exceeds 360°, take remainder
        return result >= 360 ? result % 360 : result;
    }

    static convertToCirCoord(coordinate) {
        let result = 0
        if (coordinate >= 240) result = coordinate - 240
        else result = 240 - coordinate
            return result
    }

    static isThisEvent(x, y, event) {
        const distance = Math.sqrt((x - 240) ** 2 + (y - 240) ** 2);
        if (distance > 200) {
            return false;
        }
        let pointAngle = 90 - Math.atan2(240 - y, x - 240) * (180 / Math.PI);
        if (pointAngle < 0) pointAngle = 360 + pointAngle
        if (event.startAngle <= event.endAngle) {
            if (event.startAngle < 0 && pointAngle > 270) {
            pointAngle = pointAngle -360
            }
            return pointAngle >= event.startAngle && pointAngle <= event.endAngle;
        } else {
            return pointAngle >= event.startAngle || pointAngle <= event.endAngle;
        }
    }

    static separateListToPastCurrentFutureEvents(eventsList){
      let past = 0, current = 0, future = 0
      const now = new Date()
      for (const ev of eventsList){
        const start = new Date(ev.start)
        const end = new Date(ev.end)
        if (now > end) past++
        else if (start > now) future++
        else current++
      }
      return {past: past, current: past + current, future: past+ current + future}
    }
}