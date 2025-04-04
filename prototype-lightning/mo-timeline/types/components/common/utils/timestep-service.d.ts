export declare class TimeStepService {
    private timeSteps;
    constructor(timeSteps: string[]);
    setTimesteps(timesteps: any): void;
    generatePaddingWidths(index: number): {
        'padding-right': string;
        'padding-left': string;
        left: string;
    };
    calculateLHSPosPercentage(index: number): string;
    calculateLHSWidthPercentage(index: number): string;
    private calculateRHSWidthPercentage;
    private getTimeStepDiffAsPercentage;
    getTimeLineDurationInSeconds(): number;
}
