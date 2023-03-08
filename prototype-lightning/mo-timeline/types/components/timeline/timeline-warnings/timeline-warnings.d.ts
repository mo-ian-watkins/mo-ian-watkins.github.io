import { IWarning } from '../../common/types';
export declare class TimelineWarnings {
    firstTimeStep: string;
    lastTimeStep: string;
    warnings: IWarning[];
    render(): any;
    private renderWarnings;
    private calculateWarningPosition;
    private calculateTimeDifferenceAsPercentage;
}
