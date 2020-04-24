function log(header, fileName, msg) {
    const date = new Date()
    console.log(`${header} - ${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()} - ${fileName} - ${msg}`)
}

function info(fileName, msg) {
    log('[INFO]', fileName, msg)
}

function error(fileName, msg, error) {
    log('[ERROR]', fileName, msg + ' - ' + error)
}



export default { log, error, info }