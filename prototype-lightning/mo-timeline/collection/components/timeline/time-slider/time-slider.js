import { Component, Element, Event, h, Prop, Watch, State } from '@stencil/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import 'nodelist-foreach-polyfill';
import { TimeStepService } from '../../common/utils/timestep-service';
import { TimeStepUtils } from '../../common/utils/timestep-utils';
export class TimeSlider {
    constructor() {
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
        this.timeStepSpacingService = new TimeStepService(this.timeSteps);
        this.timeStepUtils = new TimeStepUtils();
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
            return (h("div", { class: 'slider' },
                h("div", { class: 'slider__handle', ref: (el) => this.handleElement = el }),
                this.timeSteps.map((_timeStep, index) => {
                    return h("div", { class: 'slider__timeBarSpacing', style: this.timeStepProperties[index].style });
                }),
                this.constrainTimeline &&
                    h("div", { id: 'constraints' },
                        h("div", { id: 'constrainLeft', class: 'timeline-constraint', ref: (el3) => this.constraintLeft = el3 },
                            h("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '6', height: '45', viewBox: '0 0 6 45' },
                                h("polygon", { fill: '#007AA9', id: 'constrain_left', points: '0 0 6 0 6 45 0 30' }))),
                        h("div", { id: 'constrainRight', class: 'timeline-constraint', ref: (el4) => this.constraintRight = el4 },
                            h("svg", { xmlns: 'http://www.w3.org/2000/svg', width: '6', height: '45', viewBox: '0 0 6 45' },
                                h("polygon", { fill: '#007AA9', id: 'constrain_right', points: '0 0 6 0 6 30 0 45' }))))));
        }
        else {
            return (h("div", null));
        }
    }
    componentDidLoad() {
        this.refreshTimeBarsPositions();
        window.addEventListener('resize', () => {
            this.refreshTimeBarsPositions();
        });
        // tslint:disable-next-line: no-unused-expression
        new ResizeSensor(this.el.firstElementChild, () => {
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
    static get is() { return "time-slider"; }
    static get originalStyleUrls() { return {
        "$": ["time-slider.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["time-slider.css"]
    }; }
    static get properties() { return {
        "timeSteps": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "string[]",
                "resolved": "string[]",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            }
        },
        "loadedTimeStepMap": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "Map<number, string>",
                "resolved": "Map<number, string>",
                "references": {
                    "Map": {
                        "location": "global"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            }
        },
        "timeStepIndex": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "time-step-index",
            "reflect": false
        },
        "disableTimesteps": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "disable-timesteps",
            "reflect": false
        },
        "timeStepProperties": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "ITimeStepProps[]",
                "resolved": "ITimeStepProps[]",
                "references": {
                    "ITimeStepProps": {
                        "location": "import",
                        "path": "../time-step/time-step"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            }
        },
        "mouseState": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "IMouseState",
                "resolved": "IMouseState",
                "references": {
                    "IMouseState": {
                        "location": "import",
                        "path": "../../base-timeline"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            }
        },
        "constrainTimeline": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "constrain-timeline",
            "reflect": false
        }
    }; }
    static get states() { return {
        "timeLineConstraint": {}
    }; }
    static get events() { return [{
            "method": "dateClicked",
            "name": "dateClicked",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }, {
            "method": "constraintChanged",
            "name": "constraintChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
    static get elementRef() { return "el"; }
    static get watchers() { return [{
            "propName": "constrainTimeline",
            "methodName": "constrainTimelineHandler"
        }, {
            "propName": "timeStepIndex",
            "methodName": "watchHandler"
        }, {
            "propName": "timeSteps",
            "methodName": "timeStepsOnChangeHandler"
        }, {
            "propName": "mouseState",
            "methodName": "watchMouseState"
        }]; }
}
