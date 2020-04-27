export default (status, msg) => {
    const err = new Error(msg)
    if(status)
        err.status = status
    return err
}