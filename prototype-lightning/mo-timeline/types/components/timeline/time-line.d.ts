import { JSXElement } from '@babel/types';
import { ITimeStepProps } from './time-step/time-step';
import { IMouseState, TimeLineConstraint } from '../base-timeline';
import { IWarning } from '../common/types';
export declare class Timeline {
    timeStepProperties: ITimeStepProps[];
    timeSteps: string[];
    loadedTimeStepMap: Map<number, string>;
    timeStepIndex: number;
    disableTimesteps: boolean;
    labelFormat: string;
    warnings: IWarning[];
    mouseState: IMouseState;
    constrainTimeline: boolean;
    timeLineConstraint: TimeLineConstraint;
    private timeStepSpacingService;
    private timeStepUtils;
    constrainTimelineHandler(): void;
    onTimeStepsChange(newTimesteps: any): void;
    watchMouseState(newVal: any): void;
    constraintChangedHandler(event: CustomEvent): void;
    componentWillLoad(): void;
    render(): JSXElement;
    private generateTimeStepProp;
}
