import { h as hooks } from './timestep-utils-e02ff818.js';
var TimeStepService = /** @class */ (function () {
    function TimeStepService(timeSteps) {
        this.timeSteps = timeSteps;
    }
    TimeStepService.prototype.setTimesteps = function (timesteps) {
        this.timeSteps = timesteps;
    };
    TimeStepService.prototype.generatePaddingWidths = function (index) {
        return {
            'padding-right': this.calculateRHSWidthPercentage(index) + '%',
            'padding-left': this.calculateLHSWidthPercentage(index) + '%',
            'left': (parseFloat(this.calculateLHSPosPercentage(index)) - parseFloat(this.calculateLHSWidthPercentage(index))).toFixed(2) + '%'
        };
    };
    TimeStepService.prototype.calculateLHSPosPercentage = function (index) {
        if (index > 0) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(hooks(this.timeSteps[index]), hooks(this.timeSteps[0]))) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    };
    TimeStepService.prototype.calculateLHSWidthPercentage = function (index) {
        if (index > 0) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(hooks(this.timeSteps[index]), hooks(this.timeSteps[index - 1])) / 2) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    };
    TimeStepService.prototype.calculateRHSWidthPercentage = function (index) {
        if (index < this.timeSteps.length - 1) {
            return (Math.floor((this.getTimeStepDiffAsPercentage(hooks(this.timeSteps[index + 1]), hooks(this.timeSteps[index])) / 2) * 100) / 100).toFixed(2);
        }
        else {
            return '0';
        }
    };
    TimeStepService.prototype.getTimeStepDiffAsPercentage = function (timeStepA, timeStepB) {
        var difference = hooks.duration(timeStepA.diff(timeStepB)).asSeconds();
        return (100 / this.getTimeLineDurationInSeconds()) * difference;
    };
    TimeStepService.prototype.getTimeLineDurationInSeconds = function () {
        var maxIndex = this.timeSteps.length - 1;
        var finalTimeStepAsDate = hooks(this.timeSteps[maxIndex]);
        var firstTimeStepAsDate = hooks(this.timeSteps[0]);
        return hooks.duration(finalTimeStepAsDate.diff(firstTimeStepAsDate)).asSeconds();
    };
    return TimeStepService;
}());
export { TimeStepService as T };
