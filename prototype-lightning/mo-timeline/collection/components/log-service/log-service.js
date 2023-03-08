/* tslint:disable:no-console*/
export class LogService {
    constructor() {
        this.loggingOn = false;
    }
    // IE doesn't support console.table :(
    componentWillLoad() {
        if (!console.table) {
            console.table = (e) => {
                console.info(e);
            };
        }
    }
    /**
     * Sets the whether logging is on
     * @param {boolean} value
     */
    setLogging(value) {
        this.loggingOn = value;
    }
    /**
     * Logs an 'table' message to the console
     * @param {*} msg - The message
     * @param {*} table
     */
    infoTable(msg, table) {
        this.info(msg);
        if (this.loggingOn) {
            if (table) {
                console.table(table);
            }
        }
    }
    /**
     * Logs an 'info' message to the console
     * @param {*} msg - The message
     */
    info(...msg) {
        if (this.loggingOn) {
            console.info('', ...msg);
        }
    }
    /**
     * Logs an 'error' message to the console
     * @param {*} msg - The message
     */
    error(...msg) {
        console.error('', ...msg);
    }
}
