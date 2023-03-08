import { r as registerInstance, c as createEvent, h, g as getElement } from './index-db3f3b83.js';
import { T as TimeStepUtils, h as hooks } from './timestep-utils-e02ff818.js';
import { R as ResizeSensor } from './ResizeSensor-13dd8efe.js';
import { T as TimeStepService } from './timestep-service-4aec9583.js';
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
var timeSliderCss = ".slider{margin-top:1.6rem;width:100%;height:2.2rem;position:absolute;z-index:3;cursor:pointer}.slider__handle{width:6.4px;height:inherit;background-color:#B9DC0C;border-radius:20px;position:absolute;z-index:1000}.slider__handle:hover{cursor:e-resize;background-color:#89a308}.slider__timeBarSpacing{display:inline-block;height:1rem;position:absolute}#constraints{width:100%;height:2.2rem}.timeline-constraint{display:inline-block;height:2.2rem;width:6px;position:absolute}.timeline-constraint:hover,.timeline-constraint:active{cursor:col-resize}";
var TimeSlider = /** @class */ (function () {
    function TimeSlider(hostRef) {
        registerInstance(this, hostRef);
        this.dateClicked = createEvent(this, "dateClicked", 7);
        this.constraintChanged = createEvent(this, "constraintChanged", 7);
        this.timeLineConstraint = { left: 0, right: Number.MAX_SAFE_INTEGER };
        this.xOffset = 0;
        this.timeBarPositions = [];
        this.resetTimeLine = false;
        this.resetTimeLineConstraints = false;
        this.setInitialSelectedTimeStep = true;
    }
    TimeSlider.prototype.constrainTimelineHandler = function () {
        // Need to set a flag here so that the constraints can be reset later in the lifecycle.  Will use
        // componentDidUpdate to reset the constraints to their original positions as we need the constraints
        // to have rendered first before we can move them
        this.resetTimeLineConstraints = true;
    };
    TimeSlider.prototype.watchHandler = function () {
        this.timeStepIndexUpdate();
    };
    TimeSlider.prototype.timeStepsOnChangeHandler = function (newVal, oldVal) {
        this.timeStepSpacingService.setTimesteps(newVal);
        this.refreshTimeBarsPositions();
        if (oldVal && (newVal.length !== oldVal.length)) {
            this.resetTimeLineConstraints = true;
            this.resetTimeLine = true;
        }
    };
    TimeSlider.prototype.watchMouseState = function (newVal, oldVal) {
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
    };
    TimeSlider.prototype.componentWillLoad = function () {
        this.timeStepSpacingService = new TimeStepService(this.timeSteps);
        this.timeStepUtils = new TimeStepUtils();
    };
    TimeSlider.prototype.componentDidUpdate = function () {
        if (this.resetTimeLineConstraints) {
            this.resetConstraints();
            this.resetTimeLineConstraints = false;
        }
        if (this.resetTimeLine) {
            this.refreshTimeBarsPositions();
            this.resetTimeLine = false;
        }
    };
    TimeSlider.prototype.render = function () {
        var _this = this;
        if (this.timeSteps && this.timeSteps.length > 0) {
            return (h("div", { class: 'slider' }, h("div", { class: 'slider__handle', ref: function (el) { return _this.handleElement = el; } }), this.timeSteps.map(function (_timeStep, index) {
                return h("div", { class: 'slider__timeBarSpacing', style: _this.timeStepProperties[index].style });
            }), this.constrainTimeline &&
                h("div", { id: 'constraints' }, h("div", { id: 'constrainLeft', class: 'timeline-constraint', ref: function (el3) { return _this.constraintLeft = el3; } }, h("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '6', height: '45', viewBox: '0 0 6 45' }, h("polygon", { fill: '#007AA9', id: 'constrain_left', points: '0 0 6 0 6 45 0 30' }))), h("div", { id: 'constrainRight', class: 'timeline-constraint', ref: function (el4) { return _this.constraintRight = el4; } }, h("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '6', height: '45', viewBox: '0 0 6 45' }, h("polygon", { fill: '#007AA9', id: 'constrain_right', points: '0 0 6 0 6 30 0 45' }))))));
        }
        else {
            return (h("div", null));
        }
    };
    TimeSlider.prototype.componentDidLoad = function () {
        var _this = this;
        this.refreshTimeBarsPositions();
        window.addEventListener('resize', function () {
            _this.refreshTimeBarsPositions();
        });
        // tslint:disable-next-line: no-unused-expression
        new ResizeSensor(this.el.firstElementChild, function () {
            _this.refreshTimeBarsPositions();
        });
        this.resetConstraints();
    };
    TimeSlider.prototype.componentDidRender = function () {
        if (this.setInitialSelectedTimeStep
            && typeof this.timeStepIndex !== 'undefined'
            && typeof this.handleElement !== 'undefined') {
            this.moveElement(this.handleElement, this.timeStepIndex, '- 3px');
            this.setInitialSelectedTimeStep = false;
        }
    };
    TimeSlider.prototype.refreshTimeBarsPositions = function () {
        var _this = this;
        if (this.timeSteps && this.timeSteps.length > 0) {
            this.timeBarPositions = [];
            var timeBars = void 0;
            timeBars = this.el.firstElementChild.querySelectorAll('.slider__timeBarSpacing');
            timeBars.forEach(function (timeBar, index) {
                _this.timeBarPositions.push({
                    leftPos: timeBar.getBoundingClientRect().left,
                    rightPos: timeBar.getBoundingClientRect().right,
                    timeStepIndex: index
                });
            });
        }
    };
    // Handle clicking on the timeline or dropping the relevant handle element.
    // When the mouse button is released or when the mouse leaves the timeline area we need to check to see if anything
    // was being dragged and if so 'drop' the element as close to where the mouse was when the button was released or
    // when it left the area
    TimeSlider.prototype.mouseUp = function (mouseXPos) {
        // For the constraints find the nearest timestep to the mouse position, we don't care if it's loaded or not.
        var nearestIndexToClick = this.findNearestTimeStepToPointer(mouseXPos);
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
    };
    // When the mouse is clicked check if any of the draggable items are underneath it.
    TimeSlider.prototype.mouseDown = function () {
        // Clear all selections when mouse down (stops anything other than the grabbable elements being highlighted and
        // therefore dragged
        var sel = window.document.getSelection();
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
    };
    // If the mouse is being moved and a draggable element has already been selected (with the mouse down) then move the
    // draggable item along the timeline to the mouse pointer.  Constraints will move anywhere on the timeline, the
    // slider handle can only move to 'active' timesteps
    TimeSlider.prototype.mouseMove = function (mouseXPos) {
        if (this.sliderHandleActive) {
            var newIndex = this.findNearestActiveTimeStep(this.findNearestTimeStepToPointer(mouseXPos));
            if (newIndex !== this.timeStepIndex) {
                this.handleDateClick(newIndex);
            }
            this.moveElement(this.handleElement, newIndex, '- 3px');
        }
        if (this.constraintLeftActive || this.constraintRightActive) {
            var newIndex = this.findNearestTimeStepToPointer(mouseXPos);
            if (this.constraintRightActive) {
                this.moveRightConstraint(newIndex);
            }
            if (this.constraintLeftActive) {
                this.moveLeftConstraint(newIndex);
            }
        }
    };
    TimeSlider.prototype.moveRightConstraint = function (newIndex) {
        // prevent right constraint moving passed the left one
        if (newIndex > this.timeLineConstraint.left) {
            this.moveElement(this.constraintRight, newIndex, '- 1px');
            this.timeLineConstraint = { left: this.timeLineConstraint.left, right: newIndex };
            this.constraintChanged.emit(this.timeLineConstraint);
        }
    };
    TimeSlider.prototype.moveLeftConstraint = function (newIndex) {
        // prevent left constraint moving passed the right one
        if (newIndex < this.timeLineConstraint.right) {
            this.moveElement(this.constraintLeft, newIndex, '- 5px');
            this.timeLineConstraint = { left: newIndex, right: this.timeLineConstraint.right };
            this.constraintChanged.emit(this.timeLineConstraint);
        }
    };
    // Using the mouse position find the nearest timestep
    TimeSlider.prototype.findNearestTimeStepToPointer = function (mouseXPos) {
        var nearestTimestepIndex;
        if (mouseXPos > this.timeBarPositions[this.timeBarPositions.length - 1].rightPos) {
            nearestTimestepIndex = this.timeSteps.length - 1;
        }
        else if (mouseXPos < this.timeBarPositions[0].leftPos) {
            nearestTimestepIndex = 0;
        }
        else {
            for (var _i = 0, _a = this.timeBarPositions; _i < _a.length; _i++) {
                var timeBarPos = _a[_i];
                if (timeBarPos.leftPos <= mouseXPos && timeBarPos.rightPos >= mouseXPos) {
                    // Found timestep bar that encompasses to the mouse position
                    nearestTimestepIndex = timeBarPos.timeStepIndex;
                }
            }
        }
        return nearestTimestepIndex;
    };
    // Using the mouse position find the nearest 'active' timestep
    TimeSlider.prototype.findNearestActiveTimeStepToPointer = function (mouseXPos) {
        var nearestTimestepIndex = this.findNearestTimeStepToPointer(mouseXPos);
        // If timesteps are being loaded dynamically, go find the closest loaded timestep to that selected.
        nearestTimestepIndex = this.findNearestActiveTimeStep(nearestTimestepIndex);
        return nearestTimestepIndex;
    };
    // Given a timestep index find the nearest active one (loaded and within the constraints - if set)
    TimeSlider.prototype.findNearestActiveTimeStep = function (selectedIndex) {
        // The timeStepMap is only relevant if we are loading timesteps.  If we aren't set it to null and only the
        // constraint will be used to determine if the timestep should be enabled or disabled.
        var timeStepMap = this.disableTimesteps ? this.loadedTimeStepMap : null;
        return this.timeStepUtils.findNearestActiveTimeStep(selectedIndex, this.timeSteps.length, timeStepMap, this.timeLineConstraint);
    };
    TimeSlider.prototype.moveElement = function (element, timeStepIndex, offset) {
        if (typeof element !== 'undefined') {
            this.xOffset = parseFloat(this.calculateSnapPosition(timeStepIndex));
            element.setAttribute('style', 'left: calc(' + this.xOffset + '% ' + offset + ') ');
        }
    };
    TimeSlider.prototype.calculateSnapPosition = function (index) {
        return this.timeStepSpacingService.calculateLHSPosPercentage(index);
    };
    TimeSlider.prototype.timeStepIndexUpdate = function () {
        if (!this.sliderHandleActive) {
            this.moveElement(this.handleElement, this.timeStepIndex, '- 3px');
        }
    };
    TimeSlider.prototype.handleDateClick = function (nearestIndexToClick) {
        this.dateClicked.emit(nearestIndexToClick);
    };
    TimeSlider.prototype.resetConstraints = function () {
        if (typeof this.timeSteps !== 'undefined') {
            this.timeLineConstraint.left = 0;
            this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timeSteps.length);
            if (this.constrainTimeline) {
                this.moveElement(this.constraintLeft, 0, '- 5px');
                this.moveElement(this.constraintRight, this.timeSteps.length - 1, '- 1px');
            }
        }
    };
    Object.defineProperty(TimeSlider.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeSlider, "watchers", {
        get: function () {
            return {
                "constrainTimeline": ["constrainTimelineHandler"],
                "timeStepIndex": ["watchHandler"],
                "timeSteps": ["timeStepsOnChangeHandler"],
                "mouseState": ["watchMouseState"]
            };
        },
        enumerable: false,
        configurable: true
    });
    return TimeSlider;
}());
TimeSlider.style = timeSliderCss;
var timeStepCss = ".timeBar{width:0;height:4rem;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;z-index:2;position:absolute}.timeBar .timeBar__label{color:white;height:1rem;font-size:12px;margin-bottom:0.6rem;white-space:nowrap}.timeBar .timeBar__verticalLine{height:30%;margin-top:0.8rem;border-left:solid #C2C9CB thin;z-index:2}.timeBar .timeBar__verticalLineDisabled{height:30%;margin-top:0.8rem;border-left:solid #53676D thin;z-index:2}.timeBar .timeBar__largeVerticalLine{z-index:2;height:50%;border-left:solid white thin}.timeBar .timeBar__largeVerticalLineDisabled{z-index:2;height:50%;border-left:solid #53676D thin}";
var TimeStep = /** @class */ (function () {
    function TimeStep(hostRef) {
        registerInstance(this, hostRef);
    }
    TimeStep.prototype.render = function () {
        if (this.timeData) {
            var cssClass = 'timeBar';
            if (!this.timeData.enabled) {
                cssClass += ' timeBar__disabledTimestep';
            }
            return (h("div", { class: cssClass, style: this.timeData.style }, this.renderLabel(), this.renderVerticalLine()));
        }
        else {
            return null;
        }
    };
    TimeStep.prototype.renderLabel = function () {
        if (this.largeVerticalLineRequired()) {
            return (h("div", { class: 'timeBar__label' }, this.timeData.timeStep.format(this.labelFormat)));
        }
        else {
            return (h("div", { class: 'timeBar__label' }));
        }
    };
    TimeStep.prototype.renderVerticalLine = function () {
        var cssClass = 'timeBar__';
        if (this.largeVerticalLineRequired()) {
            cssClass += 'largeVerticalLine';
        }
        else {
            cssClass += 'verticalLine';
        }
        if (!this.timeData.enabled) {
            cssClass += 'Disabled';
        }
        return (h("div", { class: cssClass }));
    };
    TimeStep.prototype.largeVerticalLineRequired = function () {
        return this.timeDivisionChange();
    };
    TimeStep.prototype.timeDivisionChange = function () {
        var prevTimeStepDay = hooks(this.timeData.previousTimeStep).day();
        var thisTimeStepDay = hooks(this.timeData.timeStep).day();
        return !this.timeData.previousTimeStep || prevTimeStepDay !== thisTimeStepDay;
    };
    return TimeStep;
}());
TimeStep.style = timeStepCss;
var EWarningSeverity;
(function (EWarningSeverity) {
    EWarningSeverity["RED"] = "RED";
    EWarningSeverity["AMBER"] = "AMBER";
    EWarningSeverity["YELLOW"] = "YELLOW";
})(EWarningSeverity || (EWarningSeverity = {}));
var timelineWarningsCss = ".warningsContainer{width:100%;height:1.1rem;margin-top:2.5rem;position:absolute;z-index:1;left:0;display:grid;display:-ms-grid;-ms-grid-rows:1fr 1fr 1fr;overflow-x:hidden;grid-template-areas:\"redWarning\" \"amberWarning\" \"yellowWarning\"}.warningsContainer__redWarnings{grid-area:redWarning;-ms-grid-row:1;margin-bottom:0.075rem;position:absolute;width:100%}.warningsContainer__amberWarnings{grid-area:amberWarning;-ms-grid-row:2;margin-bottom:0.075rem;position:absolute;width:100%}.warningsContainer__yellowWarnings{-ms-grid-row:3;grid-area:yellowWarning;margin-bottom:0.075rem;position:absolute;width:100%}.warningsContainer__warning{height:4.5px;position:absolute;background-clip:content-box;margin-bottom:0.075rem}#severityRED{background-color:#CC0033}#severityAMBER{background-color:#FF9900}#severityYELLOW{background-color:#FFE923}";
var TimelineWarnings = /** @class */ (function () {
    function TimelineWarnings(hostRef) {
        registerInstance(this, hostRef);
        this.warnings = [];
    }
    TimelineWarnings.prototype.render = function () {
        return (h("div", { class: 'warningsContainer' }, h("div", { class: 'warningsContainer__redWarnings' }, this.renderWarnings(EWarningSeverity.RED)), h("div", { class: 'warningsContainer__amberWarnings' }, this.renderWarnings(EWarningSeverity.AMBER)), h("div", { class: 'warningsContainer__yellowWarnings' }, this.renderWarnings(EWarningSeverity.YELLOW))));
    };
    TimelineWarnings.prototype.renderWarnings = function (severity) {
        var _this = this;
        return this.warnings.map(function (warning) {
            if (hooks(warning.validFrom).isBefore(hooks(_this.lastTimeStep))) {
                if (warning.severity === severity) {
                    return (h("div", { class: 'warningsContainer__warning', id: 'severity' + severity.toString(), style: _this.calculateWarningPosition(warning) }));
                }
            }
        });
    };
    TimelineWarnings.prototype.calculateWarningPosition = function (warning) {
        return {
            'width': this.calculateTimeDifferenceAsPercentage(hooks(warning.validTo), hooks(warning.validFrom)) + '%',
            'left': this.calculateTimeDifferenceAsPercentage(hooks(warning.validFrom), hooks(this.firstTimeStep)) + '%'
        };
    };
    TimelineWarnings.prototype.calculateTimeDifferenceAsPercentage = function (latestTimePoint, earliestTimePoint) {
        var timeFrom = (earliestTimePoint.isBefore(hooks(this.firstTimeStep))) ? hooks(this.firstTimeStep) : earliestTimePoint;
        var timeTo = (latestTimePoint.isBefore(hooks(this.firstTimeStep))) ? hooks(this.firstTimeStep) : latestTimePoint;
        var durationBetweenTimePoints = hooks.duration(hooks(timeTo).diff(timeFrom)).asSeconds();
        var timelineDuration = hooks.duration(hooks(this.lastTimeStep).diff(hooks(this.firstTimeStep))).asSeconds();
        return (Math.floor(((durationBetweenTimePoints / timelineDuration) * 100) * 100) / 100).toFixed(2);
    };
    return TimelineWarnings;
}());
TimelineWarnings.style = timelineWarningsCss;
export { TimeSlider as time_slider, TimeStep as time_step, TimelineWarnings as timeline_warnings };
