function minutes(min) {
    return min * MINUTE_MILISECONDS
}

function seconds(sec) {
    return sec * SECOND_MILISECONDS
}

function getCurrentUTCHours() {
    const currentDate = new Date()
    return currentDate.getHours() + ARG_HOUR_OFFSET
}
const SECOND_MILISECONDS = 1000
const MINUTE_MILISECONDS = SECOND_MILISECONDS * 60
const ARG_HOUR_OFFSET = 3

function toTimeOnly(date) {
    const h = (date.getHours()<10?'0':'') + date.getHours()
    const m = (date.getMinutes()<10?'0':'') + date.getMinutes();
    const s = (date.getSeconds()<10?'0':'') + date.getSeconds();
    return h + ':' + m + ':' + s;
  }

export default {minutes, seconds, getCurrentUTCHours, toTimeOnly}