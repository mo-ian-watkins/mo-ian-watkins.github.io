import { JSXElement } from '@babel/types';
export interface ITimeStepProps {
    timeStep: any;
    style: any;
    previousTimeStep?: any;
    nextTimeStep?: any;
    enabled?: any;
}
export declare class TimeStep {
    timeData: ITimeStepProps;
    labelFormat: string;
    render(): JSXElement;
    private renderLabel;
    private renderVerticalLine;
    private largeVerticalLineRequired;
    private timeDivisionChange;
}
