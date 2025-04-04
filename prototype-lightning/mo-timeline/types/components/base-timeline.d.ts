import { EventEmitter } from '../stencil-public-runtime';
import { IWarning } from './common/types';
export interface IMouseState {
    up: boolean;
    down: boolean;
    xPos: number;
    over: boolean;
    target: any;
}
export interface TimeLineConstraint {
    left: number;
    right: number;
}
export declare class BaseTimeline {
    private timeStepArray;
    private loadedTimeStepMap;
    private timeStepUtils;
    private timerId;
    element: HTMLElement;
    dateLabelFormat: string;
    timeLineLabelFormat: string;
    mobileTimelineBreakPoint: number;
    timeStepIndex: number;
    warnings: IWarning[];
    timesteps: any;
    loadedTimesteps: any;
    defaultTimestepState: string;
    disablePlayButton: boolean;
    constrainTimeline: boolean;
    mouseState: IMouseState;
    timezone: string;
    currentContainerWidth: number;
    playing: boolean;
    timeLineConstraint: TimeLineConstraint;
    disableTimesteps: boolean;
    newTimeStepSelected: EventEmitter;
    constrainTimelineHandler(): void;
    onDefaultTimestepStateChange(newVal: any): void;
    onInitialTimeStepIndexChange(newVal: any): void;
    onTimeStepsChange(newVal: string): void;
    onLoadedTimeStepsChange(newVal: string): void;
    watchMouseState(newVal: any): void;
    constraintChangedHandler(event: CustomEvent): void;
    dateClickedHandler(event: CustomEvent): void;
    forwardClickedHandler(): void;
    backClickedHandler(): void;
    playPauseClickedHandler(): void;
    play(play?: any): void;
    mouseLeaveHandler(event: MouseEvent): void;
    mouseOverHandler(event: MouseEvent): void;
    mouseDownHandler(event: MouseEvent): void;
    mouseUpHandler(event: MouseEvent): void;
    mouseMoveHandler(event: MouseEvent): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): any;
    setInitialSelectedTimeStep(): void;
    private isMobileScreen;
    private dateLabel;
    private renderMobileTimeline;
    private renderTimeline;
    private startTimer;
    forward(): void;
    backward(): void;
    private emitCurrentlySelectedTimeStep;
}
