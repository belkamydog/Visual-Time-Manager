import { getText } from '@zos/i18n'
import { styleColors, WEEK_DAYS } from '../Constants'
import { HOUR_MS } from '../Constants'

/**
 * Event class represents a calendar event with time tracking, visualization,
 * and status calculation capabilities for smartwatch applications.
 * 
 * @class Event
 * @property {string} id - Unique identifier of the event
 * @property {string} description - Event description/title
 * @property {Date} start - Start date and time of the event
 * @property {Date} end - End date and time of the event
 * @property {string} color - Event color in hex format
 * @property {string} repeat - Repetition type ('never', 'day', 'week', 'month')
 * @property {number} startAngle - Start angle for watch face visualization (0-360 degrees)
 * @property {number} endAngle - End angle for watch face visualization (0-360 degrees)
 * @property {string} ago_time - Time elapsed since event ended (deprecated)
 * @property {string} date_period - Formatted date range (DD.MM - DD.MM)
 * @property {string} period - Formatted time range (HH:MM - HH:MM)
 * @property {string} week_day - Day(s) of the week for the event
 * @property {string} status - Current status description (After/Left/ago)
 * @property {number} level - Completion percentage (0-100%)
 * @property {string} color_state - Color based on event status
 * @property {string} duration - Formatted duration string with emoji
 * @property {string} check_repeat - Original repeat value before processing
 */
export class Event {
    id
    description
    start
    end
    color
    repeat
    startAngle
    endAngle

    ago_time
    date_period
    period
    week_day
    status
    level
    color_state
    duration = '⏳'
    check_repeat

    /**
     * Creates a new Event instance and initializes all calculated properties
     * 
     * @constructor
     * @param {Object} event - Event data object
     * @param {string} event.id - Event identifier
     * @param {string} event.description - Event description
     * @param {Date|string} event.start - Start date/time
     * @param {Date|string} event.end - End date/time
     * @param {string} event.color - Color code
     * @param {string} event.repeat - Repetition type
     * @param {string} event.check_repeat - Original repeat value
     * @throws {Error} If event data is invalid
     */
    constructor(event){
        this.id = event.id
        this.description = event.description
        this.start = new Date(event.start)
        this.end = new Date (event.end)
        this.color = event.color
        this.repeat = event.repeat
        this.check_repeat = event.check_repeat
        this.timePeriod()
        this.eventStatus()
        this.datePeriod()
        this.eventLevel()
        this.weekDay()
        this.durationEvent()
        this.colorState()
        const {startAngle, endAngle } = this.#calculateEventAngles(event, new Date())
        this.startAngle = startAngle
        this.endAngle = endAngle
    }

    /**
     * Determines the visual color state based on event timing relative to current time
     * - Gray: Event has ended
     * - Green: Event is currently active
     * - Blue-violet: Event is upcoming
     * 
     * @private
     * @returns {void}
     */
    colorState(){
        const now = new Date()
        if (now > this.end)  this.color_state = styleColors.gray
        else if (now >= this.start && now <= this.end) this.color_state = styleColors.green
        else this.color_state = styleColors.blue_violet 
    }

    /**
     * Returns the current color state of the event
     * 
     * @public
     * @returns {string} Color state value
     */
    getColorState(){ return this.color_state }

    /**
     * Calculates and formats the event duration for display
     * Format: ⏳ [X days] [Y h] [Z m]
     * Only shows non-zero components
     * 
     * @private
     * @returns {void}
     */
    durationEvent(){
        const duration = Event.calculateTimeDifference(this.start, this.end)
        const days = Math.trunc(duration.hours/24)
        const hours = duration.hours % 24
        this.duration += days > 0 ? ' ' + days + ' ' + getText('days') : ''
        this.duration += hours > 0 ? ' ' + hours + ' ' + getText('h') : ''
        this.duration += duration.minutes > 0 ? ' ' + duration.minutes + ' ' + getText('m') : ''
    }

    /**
     * Returns the formatted duration string
     * 
     * @public
     * @returns {string} Formatted duration
     */
    getDuration() {return this.duration}

    /**
     * Creates a formatted time period string (HH:MM - HH:MM)
     * 
     * @private
     * @returns {void}
     */
    timePeriod(){
        this.period =  Event.addZero(this.start.getHours().toString()) + ':' +
            Event.addZero(this.start.getMinutes().toString()) + ' - ' +
            Event.addZero(this.end.getHours().toString()) + ':' +
            Event.addZero(this.end.getMinutes().toString())
    }

    /**
     * Calculates and formats the current status of the event
     * - For future events: "After: X days/hours/minutes"
     * - For past events: "X days/hours/minutes ago"
     * - For current events: "Left: X hours Y minutes"
     * 
     * @private
     * @returns {void}
     */
    eventStatus(){
        const now = new Date()
        let result = ''
        if (now < this.start){
            const {hours, minutes} = Event.calculateTimeDifference(now, this.start)
            result = getText('After')+': '
            if (hours > 24) {
                const daysCount =  Math.ceil(hours/24)
                result += daysCount > 1? daysCount + ' ' + getText('days') : daysCount + ' ' + getText('day')
            }
            else {
                result += hours > 0 ? hours + getText('h') : ''
                result += minutes > 0 ?  ' ' +  minutes + getText('m') : ''
            }
        }
        else if (now > this.end){
            const {hours, minutes} = Event.calculateTimeDifference(this.end, now)
            if (hours > 24) {
                const daysCount =  Math.ceil(hours/24)
                result += daysCount > 1? daysCount + ' ' + getText('days') : daysCount + ' ' + getText('day')
            }
            else {
                result += hours > 0 ? hours + getText('h') : ''
                result += minutes > 0 ?  ' ' +  minutes + getText('m') + ' ' : ''
            }
            result += ' ' + getText('ago')         
        }
        else {
            const {hours, minutes} = Event.calculateTimeDifference(now, this.end)
            result += getText('Left') + ': '
            if (hours == 0) result += minutes + ' ' +getText('m')
            else if (hours > 24) {
                const daysCount =  Math.ceil(hours/24)
                result += daysCount > 1? daysCount + ' ' + getText('days') : daysCount + ' ' + getText('day')
            }
            else result += hours + getText('h') + ' ' + minutes + getText('m')
        }
        this.status = result
    }

    /**
     * Creates a formatted date period string
     * Single day: "DD.MM"
     * Multiple days: "DD.MM - DD.MM"
     * 
     * @private
     * @returns {void}
     */
    datePeriod(){
        this.date_period= Event.addZero(this.start.getDate()) + '.' + Event.addZero(this.start.getMonth()+1)
        if (this.start.getDate() != this.end.getDate())
            this.date_period +=  ' - ' + Event.addZero(this.end.getDate()) + '.' + Event.addZero(this.end.getMonth()+1)
    }

    /**
     * Calculates the event completion level (0-100%)
     * - 0%: Event hasn't started
     * - 100%: Event has ended
     * - X%: Event is X% complete (linear progression)
     * 
     * @private
     * @returns {void}
     */
    eventLevel(){
        let now = new Date()
        if (now > this.end) this.level = 100
        else if (now < this.start) this.level = 0
        else {
            this.level =  (now.getTime() - this.start.getTime()) / (this.end.getTime() - this.start.getTime()) * 100;
        }
    }

    /**
     * Creates a formatted weekday string
     * Single day: "Monday"
     * Multiple days: "Monday - Tuesday"
     * 
     * @private
     * @returns {void}
     */
    weekDay(){
        const startWeekDay = this.start.getDay()
        const endWeekDay = this.end.getDay()
        this.week_day = startWeekDay == endWeekDay &&
                        this.start.getDate() == this.end.getDate() &&
                        this.start.getMonth() == this.end.getMonth() &&
                        this.start.getFullYear() == this.end.getFullYear() ?
                        getText(WEEK_DAYS[startWeekDay]) : getText(WEEK_DAYS[startWeekDay]) + ' - ' + getText(WEEK_DAYS[endWeekDay])
    }

    /**
     * Returns the current status string
     * 
     * @public
     * @returns {string} Status description
     */
    getStatus(){ return this.status }

    /**
     * Returns the formatted time period
     * 
     * @public
     * @returns {string} Time period string
     */
    getPeriod(){ return this.period }

    /**
     * Returns the formatted date period
     * 
     * @public
     * @returns {string} Date period string
     */
    getDatePeriod(){ return this.date_period }

    /**
     * Returns the completion level percentage
     * 
     * @public
     * @returns {number} Completion level (0-100)
     */
    getlevel(){ return this.level }

    /**
     * Returns the event color
     * 
     * @public
     * @returns {string} Color value
     */
    getColor(){ return this.color }

    /**
     * Returns the event ID
     * 
     * @public
     * @returns {string} Event identifier
     */
    getId() {return this.id}

    /**
     * Returns the event description
     * 
     * @public
     * @returns {string} Event description
     */
    getDescription(){ return this.description }

    /**
     * Returns the formatted weekday string
     * 
     * @public
     * @returns {string} Weekday information
     */
    getWeekDay(){ return this.week_day }

    /**
     * Calculates start and end angles for watch face visualization
     * with time constraints:
     * - Events older than 2 hours start from 2-hour mark
     * - Events ending later than 10 hours are truncated to 10-hour limit
     * 
     * @private
     * @param {Object} event - Event data object
     * @param {Date|number} timeNow - Current time
     * @returns {Object} Object with startAngle and endAngle properties
     * @property {number} startAngle - Start angle in degrees
     * @property {number} endAngle - End angle in degrees
     */
    #calculateEventAngles(event, timeNow) {
        let startAngle = this.#convertTimeToAngle(event.start);
        let endAngle = this.#convertTimeToAngle(event.end);
        
        const deleteTime = new Date(new Date(timeNow).getTime() - 2 * HOUR_MS);
        
        if (new Date(event.start) < deleteTime) {
            startAngle = this.#convertTimeToAngle(deleteTime);
        } else if (new Date(event.end).getTime() > timeNow + 10 * HOUR_MS) {
            endAngle = this.#convertTimeToAngle(timeNow + 10 * HOUR_MS);
        }
        
        startAngle = startAngle > endAngle ? (startAngle - 360) : startAngle;
        
        return {
            startAngle: startAngle,
            endAngle: endAngle
        };
    }

    /**
     * Converts a time to an angle for circular watch face display
     * 1 hour = 30 degrees, 1 minute = 0.5 degrees
     * 
     * @private
     * @param {Date|string} time - Time to convert
     * @returns {number} Angle in degrees (0-360)
     */
    #convertTimeToAngle(time) {
        let date = new Date(time);
        let result = (date.getHours() * 60 + date.getMinutes()) * 0.5;
        return result >= 360 ? result % 360 : result;
    }

    /**
     * Calculates the time difference between two dates
     * 
     * @static
     * @param {Date} start - Start date
     * @param {Date} end - End date
     * @returns {Object} Object containing hours and minutes
     * @property {number} hours - Total hours difference
     * @property {number} minutes - Remaining minutes
     */
    static calculateTimeDifference(start, end) {
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    }

    /**
     * Adds leading zero to single-digit numbers for consistent formatting
     * 
     * @static
     * @param {string|number} str - Number to format
     * @returns {string} Formatted string with leading zero if needed
     * @example
     * Event.addZero(5) // "05"
     * Event.addZero(12) // "12"
     * Event.addZero("9") // "09"
     */
    static addZero(str){
        let result = str >= 10 ? str : '0'+ str
        return result.toString()
    }
}