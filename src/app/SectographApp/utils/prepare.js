
export function addZero(str){
    let result = str >= 10 ? str : '0'+ str
    return result.toString()
}

export function getIntervalTime(event){
    const start = new Date(event.start)
    const end = new Date(event.end)
    return start.getHours().toString() + ':' + start.getMinutes().toString() +
         '-' +  end.getHours().toString() + ':' + end.getMinutes().toString();
}


