
export class WatchFace {
    timePointDigits = [0, 1, 2, 3, 4, 5 ,6 ,7, 8, 9, 10, 11]

    constructor (){
    }

    initWatchFace(hours){
        if (hours >= 24) hours %= 24
        let currentHourIndex = 0
        if (hours < 12) currentHourIndex = hours
        else currentHourIndex = hours-12
        console.log(currentHourIndex)
        this.timePointDigits[(((currentHourIndex-2) % 12) + 12) % 12] =  hours-2 >= 0 ? hours-2 : 24+(hours-2)
        this.timePointDigits[(((currentHourIndex-1) % 12) + 12) % 12] =  hours-1 >= 0 ? hours-1 : 24+(hours-1)
        for (let i = 0 ; i < 10; i++){
            this.timePointDigits[(currentHourIndex + i) % 12] = hours
            hours = hours == 23 ? 0 : hours += 1 
        }
    }

    updateWatchFaceDigit(hours){
        const changed =  hours <= 0 ? 24-3 : hours - 3
        let currentHourIndex = 0
        if (changed < 12) currentHourIndex = changed
        else currentHourIndex = changed-12
        this.timePointDigits[currentHourIndex] = hours + 9
    }

    getTimePointDigits(){
        return this.timePointDigits
    }

}