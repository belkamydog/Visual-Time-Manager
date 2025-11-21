
export function addZero(str){
    let result = str >= 10 ? str : '0'+ str
    return result.toString()
}

