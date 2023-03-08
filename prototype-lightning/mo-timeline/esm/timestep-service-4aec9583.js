import { h as hooks } from './timestep-utils-e02ff818.js';

class TimeStepService {
    constructor(timeSteps) {
        this.timeSteps = timeSteps;
    }
    setTimesteps(timesteps) {
        this.timeSteps = timesteps;
    }
    generatePaddingWidths(index) {
        return {
            'padding-right': this.calculateRHSWidthPercentage(index) + '%',
            'padding-left': this.calculateLHSWidthPercentage(index) + '%',
            'left': (parseFloat(this.calculateLHSPosPercentage(index)) - parseFloat(this.calculateLHSWidthPercentage(index))).toFixed(2) + '%'
        };
    }
    calculateLHSPosPercentage(index) {
        if (index > 0) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(hooks(this.timeSteps[index]), hooks(this.timeSteps[0]))) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    }
    calculateLHSWidthPercentage(index) {
        if (index > 0) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(hooks(this.timeSteps[index]), hooks(this.timeSteps[index - 1])) / 2) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    }
    calculateRHSWidthPercentage(index) {
        if (index < this.timeSteps.length - 1) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(hooks(this.timeSteps[index + 1]), hooks(this.timeSteps[index])) / 2) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    }
    getTimeStepDiffAsPercentage(timeStepA, timeStepB) {
        const difference = hooks.duration(timeStepA.diff(timeStepB)).asSeconds();
        return (100 / this.getTimeLineDurationInSeconds()) * difference;
    }
    getTimeLineDurationInSeconds() {
        const maxIndex = this.timeSteps.length - 1;
        const finalTimeStepAsDate = hooks(this.timeSteps[maxIndex]);
        const firstTimeStepAsDate = hooks(this.timeSteps[0]);
        return hooks.duration(finalTimeStepAsDate.diff(firstTimeStepAsDate)).asSeconds();
    }
}

export { TimeStepService as T };
