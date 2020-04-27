export class Logger {
    constructor(fileName) {
        this.fileName = fileName
    }

    log(header, msg) {
        const date = new Date()
        console.log(`${header} - ${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()} - ${this.fileName} - ${msg}`)
    }
    
    info(msg) {
        this.log('[INFO]', msg)
    }
    
    error(msg, error) {
        this.log('[ERROR]', msg + ' - ' + error)
    }

    warning(msg, warning) {
        this.log('[WARNING]', msg + ' - ' + warning)
    }
}


