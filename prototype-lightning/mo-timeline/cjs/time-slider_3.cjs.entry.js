'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-6b418cf3.js');
const timestepUtils = require('./timestep-utils-114384c5.js');
const ResizeSensor = require('./ResizeSensor-a6175677.js');
const timestepService = require('./timestep-service-8d32fd77.js');

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

const timeSliderCss = ".slider{margin-top:1.6rem;width:100%;height:2.2rem;position:absolute;z-index:3;cursor:pointer}.slider__handle{width:6.4px;height:inherit;background-color:#B9DC0C;border-radius:20px;position:absolute;z-index:1000}.slider__handle:hover{cursor:e-resize;background-color:#89a308}.slider__timeBarSpacing{display:inline-block;height:1rem;position:absolute}#constraints{width:100%;height:2.2rem}.timeline-constraint{display:inline-block;height:2.2rem;width:6px;position:absolute}.timeline-constraint:hover,.timeline-constraint:active{cursor:col-resize}";

const TimeSlider = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.dateClicked = index.createEvent(this, "dateClicked", 7);
        this.constraintChanged = index.createEvent(this, "constraintChanged", 7);
        this.timeLineConstraint = { left: 0, right: Number.MAX_SAFE_INTEGER };
        this.xOffset = 0;
        this.timeBarPositions = [];
        this.resetTimeLine = false;
        this.resetTimeLineConstraints = false;
        this.setInitialSelectedTimeStep = true;
    }
    constrainTimelineHandler() {
        // Need to set a flag here so that the constraints can be reset later in the lifecycle.  Will use
        // componentDidUpdate to reset the constraints to their original positions as we need the constraints
        // to have rendered first before we can move them
        this.resetTimeLineConstraints = true;
    }
    watchHandler() {
        this.timeStepIndexUpdate();
    }
    timeStepsOnChangeHandler(newVal, oldVal) {
        this.timeStepSpacingService.setTimesteps(newVal);
        this.refreshTimeBarsPositions();
        if (oldVal && (newVal.length !== oldVal.length)) {
            this.resetTimeLineConstraints = true;
            this.resetTimeLine = true;
        }
    }
    watchMouseState(newVal, oldVal) {
        if (!oldVal.up && newVal.up) {
            this.mouseUp(newVal.xPos);
        }
        if (oldVal.over && !newVal.over) {
            // if leaving the target area behave in the same way as if the user released the mouse button
            this.mouseUp(newVal.xPos);
        }
        if (oldVal.xPos !== newVal.xPos) {
            this.mouseMove(newVal.xPos);
        }
        if (!oldVal.down && newVal.down) {
            this.mouseDown();
        }
    }
    componentWillLoad() {
        this.timeStepSpacingService = new timestepService.TimeStepService(this.timeSteps);
        this.timeStepUtils = new timestepUtils.TimeStepUtils();
    }
    componentDidUpdate() {
        if (this.resetTimeLineConstraints) {
            this.resetConstraints();
            this.resetTimeLineConstraints = false;
        }
        if (this.resetTimeLine) {
            this.refreshTimeBarsPositions();
            this.resetTimeLine = false;
        }
    }
    render() {
        if (this.timeSteps && this.timeSteps.length > 0) {
            return (index.h("div", { class: 'slider' }, index.h("div", { class: 'slider__handle', ref: (el) => this.handleElement = el }), this.timeSteps.map((_timeStep, index$1) => {
                return index.h("div", { class: 'slider__timeBarSpacing', style: this.timeStepProperties[index$1].style });
            }), this.constrainTimeline &&
                index.h("div", { id: 'constraints' }, index.h("div", { id: 'constrainLeft', class: 'timeline-constraint', ref: (el3) => this.constraintLeft = el3 }, index.h("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '6', height: '45', viewBox: '0 0 6 45' }, index.h("polygon", { fill: '#007AA9', id: 'constrain_left', points: '0 0 6 0 6 45 0 30' }))), index.h("div", { id: 'constrainRight', class: 'timeline-constraint', ref: (el4) => this.constraintRight = el4 }, index.h("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '6', height: '45', viewBox: '0 0 6 45' }, index.h("polygon", { fill: '#007AA9', id: 'constrain_right', points: '0 0 6 0 6 30 0 45' }))))));
        }
        else {
            return (index.h("div", null));
        }
    }
    componentDidLoad() {
        this.refreshTimeBarsPositions();
        window.addEventListener('resize', () => {
            this.refreshTimeBarsPositions();
        });
        // tslint:disable-next-line: no-unused-expression
        new ResizeSensor.ResizeSensor(this.el.firstElementChild, () => {
            this.refreshTimeBarsPositions();
        });
        this.resetConstraints();
    }
    componentDidRender() {
        if (this.setInitialSelectedTimeStep
            && typeof this.timeStepIndex !== 'undefined'
            && typeof this.handleElement !== 'undefined') {
            this.moveElement(this.handleElement, this.timeStepIndex, '- 3px');
            this.setInitialSelectedTimeStep = false;
        }
    }
    refreshTimeBarsPositions() {
        if (this.timeSteps && this.timeSteps.length > 0) {
            this.timeBarPositions = [];
            let timeBars;
            timeBars = this.el.firstElementChild.querySelectorAll('.slider__timeBarSpacing');
            timeBars.forEach((timeBar, index) => {
                this.timeBarPositions.push({
                    leftPos: timeBar.getBoundingClientRect().left,
                    rightPos: timeBar.getBoundingClientRect().right,
                    timeStepIndex: index
                });
            });
        }
    }
    // Handle clicking on the timeline or dropping the relevant handle element.
    // When the mouse button is released or when the mouse leaves the timeline area we need to check to see if anything
    // was being dragged and if so 'drop' the element as close to where the mouse was when the button was released or
    // when it left the area
    mouseUp(mouseXPos) {
        // For the constraints find the nearest timestep to the mouse position, we don't care if it's loaded or not.
        let nearestIndexToClick = this.findNearestTimeStepToPointer(mouseXPos);
        if (this.constraintLeftActive) {
            this.constraintLeftActive = false;
            this.moveLeftConstraint(nearestIndexToClick);
        }
        else if (this.constraintRightActive) {
            this.constraintRightActive = false;
            this.moveRightConstraint(nearestIndexToClick);
        }
        else if (this.sliderHandleActive
            || (this.el === this.mouseState.target || this.el.contains(this.mouseState.target))) {
            // either the slider handle has been dropped or the user has clicked on the timeline
            this.sliderHandleActive = false;
            // For the slider handle we only want to settle on an active timestep
            nearestIndexToClick = this.findNearestActiveTimeStepToPointer(mouseXPos);
            this.moveElement(this.handleElement, nearestIndexToClick, '- 3px');
            this.handleDateClick(nearestIndexToClick);
        }
    }
    // When the mouse is clicked check if any of the draggable items are underneath it.
    mouseDown() {
        // Clear all selections when mouse down (stops anything other than the grabbable elements being highlighted and
        // therefore dragged
        const sel = window.document.getSelection();
        if (sel.rangeCount > 0 && sel.getRangeAt(0).getClientRects().length > 0) {
            sel.removeAllRanges();
        }
        // Check to see what is under the mouse pointer when the mouse button is clicked
        if (this.mouseState.target === this.handleElement) {
            this.sliderHandleActive = true;
        }
        else if (this.constrainTimeline) {
            if (this.mouseState.target === this.constraintRight || this.constraintRight.contains(this.mouseState.target)) {
                this.constraintRightActive = true;
            }
            else if (this.mouseState.target === this.constraintLeft || this.constraintLeft.contains(this.mouseState.target)) {
                this.constraintLeftActive = true;
            }
        }
    }
    // If the mouse is being moved and a draggable element has already been selected (with the mouse down) then move the
    // draggable item along the timeline to the mouse pointer.  Constraints will move anywhere on the timeline, the
    // slider handle can only move to 'active' timesteps
    mouseMove(mouseXPos) {
        if (this.sliderHandleActive) {
            const newIndex = this.findNearestActiveTimeStep(this.findNearestTimeStepToPointer(mouseXPos));
            if (newIndex !== this.timeStepIndex) {
                this.handleDateClick(newIndex);
            }
            this.moveElement(this.handleElement, newIndex, '- 3px');
        }
        if (this.constraintLeftActive || this.constraintRightActive) {
            const newIndex = this.findNearestTimeStepToPointer(mouseXPos);
            if (this.constraintRightActive) {
                this.moveRightConstraint(newIndex);
            }
            if (this.constraintLeftActive) {
                this.moveLeftConstraint(newIndex);
            }
        }
    }
    moveRightConstraint(newIndex) {
        // prevent right constraint moving passed the left one
        if (newIndex > this.timeLineConstraint.left) {
            this.moveElement(this.constraintRight, newIndex, '- 1px');
            this.timeLineConstraint = { left: this.timeLineConstraint.left, right: newIndex };
            this.constraintChanged.emit(this.timeLineConstraint);
        }
    }
    moveLeftConstraint(newIndex) {
        // prevent left constraint moving passed the right one
        if (newIndex < this.timeLineConstraint.right) {
            this.moveElement(this.constraintLeft, newIndex, '- 5px');
            this.timeLineConstraint = { left: newIndex, right: this.timeLineConstraint.right };
            this.constraintChanged.emit(this.timeLineConstraint);
        }
    }
    // Using the mouse position find the nearest timestep
    findNearestTimeStepToPointer(mouseXPos) {
        let nearestTimestepIndex;
        if (mouseXPos > this.timeBarPositions[this.timeBarPositions.length - 1].rightPos) {
            nearestTimestepIndex = this.timeSteps.length - 1;
        }
        else if (mouseXPos < this.timeBarPositions[0].leftPos) {
            nearestTimestepIndex = 0;
        }
        else {
            for (const timeBarPos of this.timeBarPositions) {
                if (timeBarPos.leftPos <= mouseXPos && timeBarPos.rightPos >= mouseXPos) {
                    // Found timestep bar that encompasses to the mouse position
                    nearestTimestepIndex = timeBarPos.timeStepIndex;
                }
            }
        }
        return nearestTimestepIndex;
    }
    // Using the mouse position find the nearest 'active' timestep
    findNearestActiveTimeStepToPointer(mouseXPos) {
        let nearestTimestepIndex = this.findNearestTimeStepToPointer(mouseXPos);
        // If timesteps are being loaded dynamically, go find the closest loaded timestep to that selected.
        nearestTimestepIndex = this.findNearestActiveTimeStep(nearestTimestepIndex);
        return nearestTimestepIndex;
    }
    // Given a timestep index find the nearest active one (loaded and within the constraints - if set)
    findNearestActiveTimeStep(selectedIndex) {
        // The timeStepMap is only relevant if we are loading timesteps.  If we aren't set it to null and only the
        // constraint will be used to determine if the timestep should be enabled or disabled.
        const timeStepMap = this.disableTimesteps ? this.loadedTimeStepMap : null;
        return this.timeStepUtils.findNearestActiveTimeStep(selectedIndex, this.timeSteps.length, timeStepMap, this.timeLineConstraint);
    }
    moveElement(element, timeStepIndex, offset) {
        if (typeof element !== 'undefined') {
            this.xOffset = parseFloat(this.calculateSnapPosition(timeStepIndex));
            element.setAttribute('style', 'left: calc(' + this.xOffset + '% ' + offset + ') ');
        }
    }
    calculateSnapPosition(index) {
        return this.timeStepSpacingService.calculateLHSPosPercentage(index);
    }
    timeStepIndexUpdate() {
        if (!this.sliderHandleActive) {
            this.moveElement(this.handleElement, this.timeStepIndex, '- 3px');
        }
    }
    handleDateClick(nearestIndexToClick) {
        this.dateClicked.emit(nearestIndexToClick);
    }
    resetConstraints() {
        if (typeof this.timeSteps !== 'undefined') {
            this.timeLineConstraint.left = 0;
            this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timeSteps.length);
            if (this.constrainTimeline) {
                this.moveElement(this.constraintLeft, 0, '- 5px');
                this.moveElement(this.constraintRight, this.timeSteps.length - 1, '- 1px');
            }
        }
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "constrainTimeline": ["constrainTimelineHandler"],
        "timeStepIndex": ["watchHandler"],
        "timeSteps": ["timeStepsOnChangeHandler"],
        "mouseState": ["watchMouseState"]
    }; }
};
TimeSlider.style = timeSliderCss;

const timeStepCss = ".timeBar{width:0;height:4rem;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;z-index:2;position:absolute}.timeBar .timeBar__label{color:white;height:1rem;font-size:12px;margin-bottom:0.6rem;white-space:nowrap}.timeBar .timeBar__verticalLine{height:30%;margin-top:0.8rem;border-left:solid #C2C9CB thin;z-index:2}.timeBar .timeBar__verticalLineDisabled{height:30%;margin-top:0.8rem;border-left:solid #53676D thin;z-index:2}.timeBar .timeBar__largeVerticalLine{z-index:2;height:50%;border-left:solid white thin}.timeBar .timeBar__largeVerticalLineDisabled{z-index:2;height:50%;border-left:solid #53676D thin}";

const TimeStep = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        if (this.timeData) {
            let cssClass = 'timeBar';
            if (!this.timeData.enabled) {
                cssClass += ' timeBar__disabledTimestep';
            }
            return (index.h("div", { class: cssClass, style: this.timeData.style }, this.renderLabel(), this.renderVerticalLine()));
        }
        else {
            return null;
        }
    }
    renderLabel() {
        if (this.largeVerticalLineRequired()) {
            return (index.h("div", { class: 'timeBar__label' }, this.timeData.timeStep.format(this.labelFormat)));
        }
        else {
            return (index.h("div", { class: 'timeBar__label' }));
        }
    }
    renderVerticalLine() {
        let cssClass = 'timeBar__';
        if (this.largeVerticalLineRequired()) {
            cssClass += 'largeVerticalLine';
        }
        else {
            cssClass += 'verticalLine';
        }
        if (!this.timeData.enabled) {
            cssClass += 'Disabled';
        }
        return (index.h("div", { class: cssClass }));
    }
    largeVerticalLineRequired() {
        return this.timeDivisionChange();
    }
    timeDivisionChange() {
        const prevTimeStepDay = timestepUtils.hooks(this.timeData.previousTimeStep).day();
        const thisTimeStepDay = timestepUtils.hooks(this.timeData.timeStep).day();
        return !this.timeData.previousTimeStep || prevTimeStepDay !== thisTimeStepDay;
    }
};
TimeStep.style = timeStepCss;

var EWarningSeverity;
(function (EWarningSeverity) {
    EWarningSeverity["RED"] = "RED";
    EWarningSeverity["AMBER"] = "AMBER";
    EWarningSeverity["YELLOW"] = "YELLOW";
})(EWarningSeverity || (EWarningSeverity = {}));

const timelineWarningsCss = ".warningsContainer{width:100%;height:1.1rem;margin-top:2.5rem;position:absolute;z-index:1;left:0;display:grid;display:-ms-grid;-ms-grid-rows:1fr 1fr 1fr;overflow-x:hidden;grid-template-areas:\"redWarning\" \"amberWarning\" \"yellowWarning\"}.warningsContainer__redWarnings{grid-area:redWarning;-ms-grid-row:1;margin-bottom:0.075rem;position:absolute;width:100%}.warningsContainer__amberWarnings{grid-area:amberWarning;-ms-grid-row:2;margin-bottom:0.075rem;position:absolute;width:100%}.warningsContainer__yellowWarnings{-ms-grid-row:3;grid-area:yellowWarning;margin-bottom:0.075rem;position:absolute;width:100%}.warningsContainer__warning{height:4.5px;position:absolute;background-clip:content-box;margin-bottom:0.075rem}#severityRED{background-color:#CC0033}#severityAMBER{background-color:#FF9900}#severityYELLOW{background-color:#FFE923}";

const TimelineWarnings = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.warnings = [];
    }
    render() {
        return (index.h("div", { class: 'warningsContainer' }, index.h("div", { class: 'warningsContainer__redWarnings' }, this.renderWarnings(EWarningSeverity.RED)), index.h("div", { class: 'warningsContainer__amberWarnings' }, this.renderWarnings(EWarningSeverity.AMBER)), index.h("div", { class: 'warningsContainer__yellowWarnings' }, this.renderWarnings(EWarningSeverity.YELLOW))));
    }
    renderWarnings(severity) {
        return this.warnings.map((warning) => {
            if (timestepUtils.hooks(warning.validFrom).isBefore(timestepUtils.hooks(this.lastTimeStep))) {
                if (warning.severity === severity) {
                    return (index.h("div", { class: 'warningsContainer__warning', id: 'severity' + severity.toString(), style: this.calculateWarningPosition(warning) }));
                }
            }
        });
    }
    calculateWarningPosition(warning) {
        return {
            'width': this.calculateTimeDifferenceAsPercentage(timestepUtils.hooks(warning.validTo), timestepUtils.hooks(warning.validFrom)) + '%',
            'left': this.calculateTimeDifferenceAsPercentage(timestepUtils.hooks(warning.validFrom), timestepUtils.hooks(this.firstTimeStep)) + '%'
        };
    }
    calculateTimeDifferenceAsPercentage(latestTimePoint, earliestTimePoint) {
        const timeFrom = (earliestTimePoint.isBefore(timestepUtils.hooks(this.firstTimeStep))) ? timestepUtils.hooks(this.firstTimeStep) : earliestTimePoint;
        const timeTo = (latestTimePoint.isBefore(timestepUtils.hooks(this.firstTimeStep))) ? timestepUtils.hooks(this.firstTimeStep) : latestTimePoint;
        const durationBetweenTimePoints = timestepUtils.hooks.duration(timestepUtils.hooks(timeTo).diff(timeFrom)).asSeconds();
        const timelineDuration = timestepUtils.hooks.duration(timestepUtils.hooks(this.lastTimeStep).diff(timestepUtils.hooks(this.firstTimeStep))).asSeconds();
        return (Math.floor(((durationBetweenTimePoints / timelineDuration) * 100) * 100) / 100).toFixed(2);
    }
};
TimelineWarnings.style = timelineWarningsCss;

exports.time_slider = TimeSlider;
exports.time_step = TimeStep;
exports.timeline_warnings = TimelineWarnings;
