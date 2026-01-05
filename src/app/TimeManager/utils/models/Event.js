import { getText } from '@zos/i18n'
import { styleColors, WEEK_DAYS } from '../Constants'
import { HOUR_MS } from '../Constants'

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

    colorState(){
        const now = new Date()
        if (now > this.end)  this.color_state = styleColors.gray
        else if (now >= this.start && now <= this.end) this.color_state = styleColors.green
        else this.color_state = styleColors.blue_violet 
    }

    getColorState(){ return this.color_state }

    durationEvent(){
        const duration = Event.calculateTimeDifference(this.start, this.end)
        const days = Math.trunc(duration.hours/24)
        const hours = duration.hours % 24
        this.duration += days > 0 ? ' ' + days + ' ' + getText('days') : ''
        this.duration += hours > 0 ? ' ' + hours + ' ' + getText('h') : ''
        this.duration += duration.minutes > 0 ? ' ' + duration.minutes + ' ' + getText('m') : ''
    }

    getDuration() {return this.duration}

    timePeriod(){
        this.period =  Event.addZero(this.start.getHours().toString()) + ':' +
            Event.addZero(this.start.getMinutes().toString()) + ' - ' +
            Event.addZero(this.end.getHours().toString()) + ':' +
            Event.addZero(this.end.getMinutes().toString())
    }
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
    datePeriod(){
        this.date_period= Event.addZero(this.start.getDate()) + '.' + Event.addZero(this.start.getMonth()+1)
        if (this.start.getDate() != this.end.getDate())
            this.date_period +=  ' - ' + Event.addZero(this.end.getDate()) + '.' + Event.addZero(this.end.getMonth()+1)
    }
    eventLevel(){
        let now = new Date()
        if (now > this.end) this.level = 100
        else if (now < this.start) this.level = 0
        else {
            this.level =  (now.getTime() - this.start.getTime()) / (this.end.getTime() - this.start.getTime()) * 100;
        }
    }
    weekDay(){
        const startWeekDay = this.start.getDay()
        const endWeekDay = this.end.getDay()
        this.week_day = startWeekDay == endWeekDay &&
                        this.start.getDate() == this.end.getDate() &&
                        this.start.getMonth() == this.end.getMonth() &&
                        this.start.getFullYear() == this.end.getFullYear() ?
                        getText(WEEK_DAYS[startWeekDay]) : getText(WEEK_DAYS[startWeekDay]) + ' - ' + getText(WEEK_DAYS[endWeekDay])
    }

    getStatus(){ return this.status }

    getPeriod(){ return this.period }

    getDatePeriod(){ return this.date_period }

    getlevel(){ return this.level }

    getColor(){ return this.color }

    getId() {return this.id}

    getDescription(){ return this.description }

    getWeekDay(){ return this.week_day }


    #calculateEventAngles(event, timeNow) {
        // Вычисляем базовые углы для начала и конца события
        let startAngle = this.#convertTimeToAngle(event.start);
        let endAngle = this.#convertTimeToAngle(event.end);
        
        // Вычисляем время отсечения (2 часа назад)
        const deleteTime = new Date(new Date(timeNow).getTime() - 2 * HOUR_MS);
        
        // Корректируем углы с учетом временных ограничений
        if (new Date(event.start) < deleteTime) {
            // Если начало события раньше 2 часов назад, начинаем от 2-часовой отметки
            startAngle = this.#convertTimeToAngle(deleteTime);
        } else if (new Date(event.end).getTime() > timeNow + 10 * HOUR_MS) {
            // Если конец события позже чем через 10 часов, обрезаем до 10-часовой отметки
            endAngle = this.#convertTimeToAngle(timeNow + 10 * HOUR_MS);
        }
        
        // Корректируем угол начала, если он больше угла конца
        startAngle = startAngle > endAngle ? (startAngle - 360) : startAngle;
        
        return {
            startAngle: startAngle,
            endAngle: endAngle
        };
    }

   #convertTimeToAngle(time) {
        // Создаем объект даты из переданного времени
        let date = new Date(time);
        
        // Вычисляем общее количество минут
        // (часы * 60 + минуты) * 0.5°/минуту
        let result = (date.getHours() * 60 + date.getMinutes()) * 0.5;
        
        // Нормализация результата: при превышении 360° берем остаток от деления
        return result >= 360 ? result % 360 : result;
    }

    static calculateTimeDifference(start, end) {
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    }

    static addZero(str){
        let result = str >= 10 ? str : '0'+ str
        return result.toString()
    }
}