import { HOUR_MS } from "./Constants"


function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function calculateAngles(event){
    let startAngle = convertTimeToAngle(event.start)
    let endAngle = convertTimeToAngle(event.end)
    if (new Date(event.start) < (Date.now() - 2 * HOUR_MS) && (new Date(event.end) > (Date.now() - 2 * HOUR_MS))) {
      startAngle = convertTimeToAngle(Date.now() - 2 * HOUR_MS)
    }
    else if(new Date(event.end) > Date.now + 10 * HOUR_MS){
      endAngle = convertTimeToAngle(Date.now() + 10 * HOUR_MS)
    }
    startAngle = startAngle > endAngle ? (startAngle-360) : startAngle
    return {startAngle, endAngle}
}

export function convertTimeToAngle(time){
  // 1h => 30 grad
  // 1h => 60 min => 30/60 = > 0.5 grad/min
  let date = new Date(time)
  let result = (date.getHours() * 60 + date.getMinutes()) * 0.5
  // normalization
  return result >= 360 ? result % 360 : result
}

export function isPointInSector(x, y, centerX, centerY, radius, startAngle, endAngle) {
  const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  if (distance > radius) {
    // console.log("OUT OF CIRCLE")
    return false;
  }
  let pointAngle = 90 - Math.atan2(centerY-y, x - centerX) * (180 / Math.PI);
  if (pointAngle < 0) pointAngle = 360 + pointAngle
  // console.log("Point angle" + pointAngle)

  if (startAngle <= endAngle) {
    if (startAngle < 0 ) pointAngle = pointAngle - 360
    // console.log("s " + startAngle + " e " + endAngle + " p " + pointAngle + " "+ ( pointAngle >= startAngle && pointAngle <= endAngle))
    return pointAngle >= startAngle && pointAngle <= endAngle;
  } else {
    return pointAngle >= startAngle || pointAngle <= endAngle;
  }
}

export function getTimeDifference(start, end) {
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}