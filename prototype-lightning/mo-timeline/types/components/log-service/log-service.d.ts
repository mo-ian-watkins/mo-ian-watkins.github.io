export declare class LogService {
    loggingOn: boolean;
    componentWillLoad(): void;
    /**
     * Sets the whether logging is on
     * @param {boolean} value
     */
    setLogging(value: boolean): void;
    /**
     * Logs an 'table' message to the console
     * @param {*} msg - The message
     * @param {*} table
     */
    infoTable(msg: any, table?: any): void;
    /**
     * Logs an 'info' message to the console
     * @param {*} msg - The message
     */
    info(...msg: any[]): void;
    /**
     * Logs an 'error' message to the console
     * @param {*} msg - The message
     */
    error(...msg: any[]): void;
}
