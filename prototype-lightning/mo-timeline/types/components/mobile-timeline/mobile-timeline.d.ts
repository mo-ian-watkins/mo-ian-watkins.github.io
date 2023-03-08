import { JSXElement } from '@babel/types';
import { EventEmitter } from '../../stencil-public-runtime';
export interface ITimeStepInfo {
    timeSteps: string[];
    loadedTimeSteps: string[];
    timeStepIndex: number;
}
export declare class MobileTimeline {
    newIndexSelected: EventEmitter;
    dateClicked: EventEmitter;
    timeSteps: string[];
    loadedTimeStepMap: Map<number, string>;
    disableTimesteps: boolean;
    timeStepIndex: any;
    el: HTMLElement;
    timeline: any;
    externalUpdate: boolean;
    newTimeStepIndex: number;
    slides: any;
    componentDidLoad(): void;
    onTimeStepIndexChange(newTimeStepIndex: number): void;
    onTimeStepsChange(newTimeSteps: string[]): void;
    onLoadedTimeStepsChange(newTimeSteps: Map<number, string>): void;
    newIndex(event: CustomEvent): void;
    generateSlider(timesteps: string[], loadedTimesteps: Map<number, string>): void;
    getNewIndex(newIndex: number, numberOfTimeSteps: number): number;
    render(): JSXElement;
}
