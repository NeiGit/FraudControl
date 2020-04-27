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

export default {minutes, seconds, getCurrentUTCHours}