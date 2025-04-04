import { TimeLineConstraint } from '../../base-timeline';
export declare class TimeStepUtils {
    createSortedTimeStepArrayFromJSON(json: string): any[];
    createMatchingTimeStepMap(timeSteps: string[], loadedTimeSteps: string[]): Map<number, string>;
    findNearestNextActiveTimeStep(selectedIndex: number, numberOfTimeSteps: number, loadedTimeSteps: Map<number, string>, timeLineConstraint: TimeLineConstraint): number;
    findNearestPreviousActiveTimeStep(selectedIndex: number, numberOfTimeSteps: number, loadedTimeSteps: Map<number, string>, timeLineConstraint: TimeLineConstraint): number;
    findNearestActiveTimeStep(selectedIndex: number, numberOfTimeSteps: number, loadedTimeSteps: Map<number, string>, timeLineConstraint: TimeLineConstraint): number;
    private searchForNearestActiveTimeStep;
    isValidTimeStep(index: number, loadedTimeSteps: Map<number, string>, timeLineConstraint: TimeLineConstraint): boolean;
    resetTimelineConstraint(numberOfTimeSteps: any): {
        left: number;
        right: number;
    };
}
