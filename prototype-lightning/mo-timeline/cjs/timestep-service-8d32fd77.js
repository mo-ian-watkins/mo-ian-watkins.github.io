'use strict';

const timestepUtils = require('./timestep-utils-114384c5.js');

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
            return (Math.floor((this.getTimeStepDiffAsPercentage(timestepUtils.hooks(this.timeSteps[index]), timestepUtils.hooks(this.timeSteps[0]))) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    }
    calculateLHSWidthPercentage(index) {
        if (index > 0) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(timestepUtils.hooks(this.timeSteps[index]), timestepUtils.hooks(this.timeSteps[index - 1])) / 2) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    }
    calculateRHSWidthPercentage(index) {
        if (index < this.timeSteps.length - 1) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(timestepUtils.hooks(this.timeSteps[index + 1]), timestepUtils.hooks(this.timeSteps[index])) / 2) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    }
    getTimeStepDiffAsPercentage(timeStepA, timeStepB) {
        const difference = timestepUtils.hooks.duration(timeStepA.diff(timeStepB)).asSeconds();
        return (100 / this.getTimeLineDurationInSeconds()) * difference;
    }
    getTimeLineDurationInSeconds() {
        const maxIndex = this.timeSteps.length - 1;
        const finalTimeStepAsDate = timestepUtils.hooks(this.timeSteps[maxIndex]);
        const firstTimeStepAsDate = timestepUtils.hooks(this.timeSteps[0]);
        return timestepUtils.hooks.duration(finalTimeStepAsDate.diff(firstTimeStepAsDate)).asSeconds();
    }
}

exports.TimeStepService = TimeStepService;
