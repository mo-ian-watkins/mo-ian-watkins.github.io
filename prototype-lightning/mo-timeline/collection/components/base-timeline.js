import { Component, Element, Event, h, Listen, Prop, Watch, State, Method } from '@stencil/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import moment from 'moment-timezone';
import { TimeStepUtils } from './common/utils/timestep-utils';
import clone from 'lodash/clone';
export class BaseTimeline {
    constructor() {
        this.timeStepArray = [];
        this.loadedTimeStepMap = null;
        this.timeStepUtils = new TimeStepUtils();
        this.dateLabelFormat = 'ddd D MMMM - HH:mm zz';
        this.timeLineLabelFormat = 'ddd';
        this.mobileTimelineBreakPoint = 700;
        this.timeStepIndex = 0;
        this.warnings = [];
        this.timesteps = [];
        this.loadedTimesteps = null;
        this.defaultTimestepState = 'enabled';
        this.disablePlayButton = false;
        this.constrainTimeline = false;
        this.timezone = 'Europe/London';
        this.playing = false;
        this.timeLineConstraint = { left: 0, right: Number.MAX_SAFE_INTEGER };
        this.disableTimesteps = false;
    }
    // boolean describing if the timeline is being constrained or not
    constrainTimelineHandler() {
        this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timesteps.length);
    }
    onDefaultTimestepStateChange(newVal) {
        this.defaultTimestepState = newVal;
        this.disableTimesteps = (newVal === 'disabled') ? true : false;
    }
    onInitialTimeStepIndexChange(newVal) {
        this.timeStepIndex = newVal;
    }
    onTimeStepsChange(newVal) {
        this.timeStepArray = this.timeStepUtils.createSortedTimeStepArrayFromJSON(newVal);
        this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timesteps.length);
    }
    onLoadedTimeStepsChange(newVal) {
        if (newVal !== null) {
            // if any timesteps are being loaded we need to set the disableTimesteps flag to true so that they are
            // initially displayed as disabled (becoming enabled once they are loaded)
            const sortedLoadedTimeSteps = this.timeStepUtils.createSortedTimeStepArrayFromJSON(newVal);
            // create a map with successfully loaded timesteps, with the key being the corresponding position in the
            // timestep array.
            this.loadedTimeStepMap = this.timeStepUtils.createMatchingTimeStepMap(this.timeStepArray, sortedLoadedTimeSteps);
        }
    }
    // Mouse state object to keep track of all the mouse events across the component
    watchMouseState(newVal) {
        this.mouseState = newVal;
    }
    // Listen for changes to the constraint object (describes the left and right constraint values)
    constraintChangedHandler(event) {
        if (event.detail !== null) {
            this.timeLineConstraint = event.detail;
        }
    }
    dateClickedHandler(event) {
        // If clicked on timestep is disabled then event detail can be null.  Don't want to emit anything
        // in this situation
        if (event.detail !== null) {
            const timeStepMap = this.disableTimesteps ? this.loadedTimeStepMap : null;
            this.timeStepIndex = this.timeStepUtils.findNearestActiveTimeStep(event.detail, this.timeStepArray.length, timeStepMap, this.timeLineConstraint);
            this.emitCurrentlySelectedTimeStep();
        }
    }
    forwardClickedHandler() {
        this.forward();
    }
    backClickedHandler() {
        this.backward();
    }
    playPauseClickedHandler() {
        this.play(!this.playing);
    }
    play(play) {
        this.playing = (typeof play !== 'undefined') ? play : !this.playing;
        (this.playing) ? this.startTimer() : clearInterval(this.timerId);
    }
    // Capturing mouse events at this level allows interactions such as dragging the time slider to be tracked
    // across the whole timeline component rather than just on the time bar.  This makes it much easier to drag the
    // slider from side to side without accidentally exiting the target area
    mouseLeaveHandler(event) {
        const newMouseState = clone(this.mouseState);
        newMouseState.over = false;
        newMouseState.xPos = event.clientX;
        newMouseState.target = event.target;
        this.mouseState = newMouseState;
    }
    mouseOverHandler(event) {
        // No need to update mouse over status if we are already over the timeline component.  Avoids unnecessary
        // re-renders
        if (!this.mouseState.over) {
            const newMouseState = clone(this.mouseState);
            newMouseState.over = true;
            newMouseState.xPos = event.clientX;
            newMouseState.target = event.target;
            if (event.button === 0 && event.buttons === 1) {
                newMouseState.down = true;
                newMouseState.up = false;
            }
            this.mouseState = newMouseState;
        }
    }
    mouseDownHandler(event) {
        if (event.button === 0) {
            const newMouseState = clone(this.mouseState);
            newMouseState.down = true;
            newMouseState.up = false;
            newMouseState.xPos = event.clientX;
            newMouseState.target = event.target;
            this.mouseState = newMouseState;
        }
    }
    mouseUpHandler(event) {
        if (event.button === 0) {
            const newMouseState = clone(this.mouseState);
            newMouseState.down = false;
            newMouseState.up = true;
            newMouseState.xPos = event.clientX;
            newMouseState.target = event.target;
            this.mouseState = newMouseState;
        }
    }
    mouseMoveHandler(event) {
        // No need to track the mouse movement unless the main button is down and we are dragging
        // Causes needless re-renders due to the state change
        if (this.mouseState.down) {
            const newMouseState = clone(this.mouseState);
            newMouseState.xPos = event.clientX;
            newMouseState.target = event.target;
            this.mouseState = newMouseState;
        }
    }
    componentWillLoad() {
        this.onTimeStepsChange(this.timesteps);
        this.onLoadedTimeStepsChange(this.loadedTimesteps);
        this.onDefaultTimestepStateChange(this.defaultTimestepState);
        this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timesteps.length);
        this.setInitialSelectedTimeStep();
        // reset the mouse statecd dmo
        this.mouseState = {
            down: false,
            up: false,
            xPos: 0,
            over: false,
            target: null
        };
    }
    componentDidLoad() {
        // tslint:disable-next-line: no-unused-expression
        new ResizeSensor(this.element.firstElementChild, () => {
            this.currentContainerWidth = this.element.firstElementChild.getBoundingClientRect().width;
            if (this.isMobileScreen()) {
                clearInterval(this.timerId);
            }
        });
    }
    render() {
        return (h("div", { class: 'timelineContainer_normalView' },
            h("div", { class: 'timelineContainer__controlBar' },
                h("div", { class: 'timelineContainer__controlBar__playButtons' }, !this.isMobileScreen() &&
                    h("play-buttons", { playing: this.playing, "disable-play-button": this.disablePlayButton })),
                h("div", { class: 'timelineContainer__controlBar__dateLabel' }, this.dateLabel((this.isMobileScreen()) ? 'ddd HH:mm zz' : this.dateLabelFormat)),
                h("div", { class: 'timelineContainer__controlBar__slot' },
                    h("slot", null))),
            this.timeStepArray.length > 0 &&
                h("div", { class: 'timelineContainer__timeline' }, this.isMobileScreen() ? (this.renderMobileTimeline()) : (this.renderTimeline()))));
    }
    // Called when the timeline loads to make sure that the initially selected timestep is one that is loaded,
    // If nothing is loaded yet, defaults to the timestep passed in (or 0 if one wasn't),
    setInitialSelectedTimeStep() {
        const newIndex = this.timeStepUtils.findNearestActiveTimeStep(this.timeStepIndex, this.timesteps.length, this.loadedTimeStepMap, this.timeLineConstraint);
        if (this.timeStepIndex !== newIndex) { // only emit the event if it is different
            this.timeStepIndex = newIndex;
            this.emitCurrentlySelectedTimeStep();
        }
    }
    isMobileScreen() {
        return (this.currentContainerWidth < this.mobileTimelineBreakPoint);
    }
    dateLabel(momentFormat) {
        const timezones = moment.tz.names();
        if (timezones.indexOf(this.timezone) === -1) {
            console.error('Timezone input ', this.timezone, ' not valid, resetting to Europe/london');
            this.timezone = 'Europe/London';
        }
        if (this.timeStepArray.length > 0) {
            return moment(this.timeStepArray[this.timeStepIndex]).tz(this.timezone).format(momentFormat);
        }
        else {
            return 'Timeline not available';
        }
    }
    renderMobileTimeline() {
        // need to make sure we are not trying to constrain the timeline if we move to a mobile view
        this.constrainTimeline = false;
        return (h("mobile-timeline", { timeSteps: this.timeStepArray, disableTimesteps: this.disableTimesteps, loadedTimeStepMap: this.loadedTimeStepMap, timeStepIndex: this.timeStepIndex }));
    }
    renderTimeline() {
        return (h("time-line", { timeSteps: this.timeStepArray, disableTimesteps: this.disableTimesteps, loadedTimeStepMap: this.loadedTimeStepMap, timeStepIndex: this.timeStepIndex, labelFormat: this.timeLineLabelFormat, warnings: this.warnings, mouseState: this.mouseState, constrainTimeline: this.constrainTimeline }));
    }
    startTimer() {
        this.timerId = setInterval(() => {
            this.forward();
        }, 1000);
    }
    forward() {
        const timeStepMap = this.disableTimesteps ? this.loadedTimeStepMap : null;
        this.timeStepIndex = this.timeStepUtils.findNearestNextActiveTimeStep(this.timeStepIndex + 1, this.timeStepArray.length, timeStepMap, this.timeLineConstraint);
        this.emitCurrentlySelectedTimeStep();
    }
    backward() {
        const timeStepMap = this.disableTimesteps ? this.loadedTimeStepMap : null;
        this.timeStepIndex = this.timeStepUtils.findNearestPreviousActiveTimeStep(this.timeStepIndex - 1, this.timeStepArray.length, timeStepMap, this.timeLineConstraint);
        this.emitCurrentlySelectedTimeStep();
    }
    emitCurrentlySelectedTimeStep() {
        const selectedTimeStep = {
            selectedTimeStepIndex: this.timeStepIndex,
            selectedTimeStep: this.timeStepArray[this.timeStepIndex],
        };
        this.newTimeStepSelected.emit(selectedTimeStep);
    }
    static get is() { return "mo-timeline"; }
    static get originalStyleUrls() { return {
        "$": ["base-timeline.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["base-timeline.css"]
    }; }
    static get properties() { return {
        "dateLabelFormat": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "date-label-format",
            "reflect": false,
            "defaultValue": "'ddd D MMMM - HH:mm zz'"
        },
        "timeLineLabelFormat": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "time-line-label-format",
            "reflect": false,
            "defaultValue": "'ddd'"
        },
        "mobileTimelineBreakPoint": {
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
            "attribute": "mobile-timeline-break-point",
            "reflect": false,
            "defaultValue": "700"
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
            "reflect": false,
            "defaultValue": "0"
        },
        "warnings": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "IWarning[]",
                "resolved": "IWarning[]",
                "references": {
                    "IWarning": {
                        "location": "import",
                        "path": "./common/types"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "[]"
        },
        "timesteps": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "timesteps",
            "reflect": false,
            "defaultValue": "[]"
        },
        "loadedTimesteps": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "loaded-timesteps",
            "reflect": false,
            "defaultValue": "null"
        },
        "defaultTimestepState": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "default-timestep-state",
            "reflect": false,
            "defaultValue": "'enabled'"
        },
        "disablePlayButton": {
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
            "attribute": "disable-play-button",
            "reflect": false,
            "defaultValue": "false"
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
            "reflect": false,
            "defaultValue": "false"
        },
        "mouseState": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "IMouseState",
                "resolved": "IMouseState",
                "references": {
                    "IMouseState": {
                        "location": "local"
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
        "timezone": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "timezone",
            "reflect": false,
            "defaultValue": "'Europe/London'"
        }
    }; }
    static get states() { return {
        "currentContainerWidth": {},
        "playing": {},
        "timeLineConstraint": {},
        "disableTimesteps": {}
    }; }
    static get events() { return [{
            "method": "newTimeStepSelected",
            "name": "newTimeStepSelected",
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
    static get methods() { return {
        "play": {
            "complexType": {
                "signature": "(play?: any) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {},
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "forward": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {},
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "backward": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {},
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        }
    }; }
    static get elementRef() { return "element"; }
    static get watchers() { return [{
            "propName": "constrainTimeline",
            "methodName": "constrainTimelineHandler"
        }, {
            "propName": "defaultTimestepState",
            "methodName": "onDefaultTimestepStateChange"
        }, {
            "propName": "timeStepIndex",
            "methodName": "onInitialTimeStepIndexChange"
        }, {
            "propName": "timesteps",
            "methodName": "onTimeStepsChange"
        }, {
            "propName": "loadedTimesteps",
            "methodName": "onLoadedTimeStepsChange"
        }, {
            "propName": "mouseState",
            "methodName": "watchMouseState"
        }]; }
    static get listeners() { return [{
            "name": "constraintChanged",
            "method": "constraintChangedHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }, {
            "name": "dateClicked",
            "method": "dateClickedHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }, {
            "name": "forwardClicked",
            "method": "forwardClickedHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }, {
            "name": "backClicked",
            "method": "backClickedHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }, {
            "name": "playPauseClicked",
            "method": "playPauseClickedHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }, {
            "name": "mouseleave",
            "method": "mouseLeaveHandler",
            "target": undefined,
            "capture": false,
            "passive": true
        }, {
            "name": "mouseover",
            "method": "mouseOverHandler",
            "target": undefined,
            "capture": false,
            "passive": true
        }, {
            "name": "mousedown",
            "method": "mouseDownHandler",
            "target": undefined,
            "capture": false,
            "passive": true
        }, {
            "name": "mouseup",
            "method": "mouseUpHandler",
            "target": undefined,
            "capture": false,
            "passive": true
        }, {
            "name": "mousemove",
            "method": "mouseMoveHandler",
            "target": undefined,
            "capture": false,
            "passive": true
        }]; }
}
