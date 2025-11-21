import { getText } from '@zos/i18n'

import { addZero } from "./prepare"
import { getTimeDifference } from "./calculate"


export class Event {
    description
    start
    end

    remained_time
    ago_time
    status
    period
    level

    constructor(event){
        this.description = event.description
        this.start = new Date(event.start)
        this.end = new Date (event.end)
    }

    getStatus(){
        let now = new Date()
        let result = ''
        if (now < this.start){
            let {hours, minutes} = getTimeDifference(now, this.start)
            result = getText('After')+': ' + hours + getText('h') + ' ' + minutes + getText('m')
        }
        else if (now > this.end){
            let {hours, minutes} = getTimeDifference(this.end, now)
            result = hours +  getText('h') + ' ' + minutes +  getText('m')+ ' ' +  getText('ago')         
        }
        else {
            let {hours, minutes} = getTimeDifference(now, this.end)
            result += getText('Left') + ': '
            if (hours == 0) result += minutes + ' ' +getText('m')
            else result += hours + getText('h') + ' ' + minutes + getText('m')
        }
        return result
    }

    getPeriod(){
        return  addZero(this.start.getHours().toString()) + ':' +
                addZero(this.start.getMinutes().toString()) + ' - ' +
                addZero(this.end.getHours().toString()) + ':' +
                addZero(this.end.getMinutes().toString())

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

}