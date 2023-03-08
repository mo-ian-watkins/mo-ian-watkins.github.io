export declare enum EWarningSeverity {
    RED = "RED",
    AMBER = "AMBER",
    YELLOW = "YELLOW"
}
export interface IWarning {
    severity: EWarningSeverity;
    validFrom: string;
    validTo: string;
}
