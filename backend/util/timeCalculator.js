function minutes(min) {
    return min * MINUTE_MILISECONDS
}

function seconds(sec) {
    return sec * SECOND_MILISECONDS
}

const SECOND_MILISECONDS = 1000
const MINUTE_MILISECONDS = SECOND_MILISECONDS * 60

export default {minutes, seconds}