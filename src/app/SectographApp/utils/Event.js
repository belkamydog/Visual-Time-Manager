import { getText } from '@zos/i18n'

export class Event {
    id
    description
    start
    end
    color

    remained_time
    ago_time
    status
    period
    level

    constructor(event){
        this.id = event.id
        this.description = event.description
        this.start = new Date(event.start)
        this.end = new Date (event.end)
    }

    getStatus(){
        const now = new Date()
        let result = ''
        if (now < this.start){
            const {hours, minutes} = Event.calculateTimeDifference(now, this.start)
            result = getText('After')+': '
            result += hours > 0 ? hours + getText('h') : ''
            result += minutes > 0 ?  ' ' +  minutes + getText('m') : ''
        }
        else if (now > this.end){
            const {hours, minutes} = Event.calculateTimeDifference(this.end, now)
            result += hours > 0 ? hours + getText('h') : ''
            result += minutes > 0 ?  ' ' +  minutes + getText('m') + ' ' : ''
            result += ' ' + getText('ago')         
        }
        else {
            const {hours, minutes} = Event.calculateTimeDifference(now, this.end)
            result += getText('Left') + ': '
            if (hours == 0) result += minutes + ' ' +getText('m')
            else result += hours + getText('h') + ' ' + minutes + getText('m')
        }
        return result
    }

    getPeriod(){
        return  Event.addZero(this.start.getHours().toString()) + ':' +
                Event.addZero(this.start.getMinutes().toString()) + ' - ' +
                Event.addZero(this.end.getHours().toString()) + ':' +
                Event.addZero(this.end.getMinutes().toString())

    }

    getlevel(){
        let now = new Date()
        if (now > this.end) this.level = 100
        else if (now < this.start) this.level = 0
        else {
            this.level =  (now.getTime() - this.start.getTime()) / (this.end.getTime() - this.start.getTime()) * 100;
        }
    
        return this.level
    }

    getDescription(){ return this.description }

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