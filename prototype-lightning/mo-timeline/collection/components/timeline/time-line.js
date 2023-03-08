import { Component, h, Prop, Watch, State, Listen } from '@stencil/core';
import moment from 'moment';
import { TimeStepService } from '../common/utils/timestep-service';
import clone from 'lodash/clone';
import { TimeStepUtils } from '../common/utils/timestep-utils';
export class Timeline {
    constructor() {
        this.timeStepProperties = [];
        this.warnings = [];
        this.timeLineConstraint = { left: 0, right: Number.MAX_SAFE_INTEGER };
    }
    constrainTimelineHandler() {
        this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timeSteps.length);
    }
    onTimeStepsChange(newTimesteps) {
        // Empty any existing timeStepProperties so everything is regenerated for the new timesteps
        this.timeStepProperties = [];
        this.timeStepSpacingService.setTimesteps(newTimesteps);
        this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timeSteps.length);
    }
    watchMouseState(newVal) {
        this.mouseState = newVal;
    }
    constraintChangedHandler(event) {
        if (event.detail !== null) {
            this.timeLineConstraint = event.detail;
        }
    }
    componentWillLoad() {
        this.timeStepSpacingService = new TimeStepService(this.timeSteps);
        this.timeStepUtils = new TimeStepUtils();
    }
    render() {
        if (this.timeSteps) {
            return (h("div", { class: 'timesteps' },
                h("time-slider", { timeSteps: this.timeSteps, timeStepProperties: this.timeStepProperties, loadedTimeStepMap: this.loadedTimeStepMap, timeStepIndex: this.timeStepIndex, disableTimesteps: this.disableTimesteps, mouseState: this.mouseState, constrainTimeline: this.constrainTimeline }),
                (this.warnings && this.warnings.length > 0) &&
                    h("timeline-warnings", { firstTimeStep: this.timeSteps[0], lastTimeStep: this.timeSteps[this.timeSteps.length - 1], warnings: this.warnings }),
                this.timeSteps.map((timeStep, index) => {
                    return (h("time-step", { timeData: this.generateTimeStepProp(timeStep, index, this.constrainTimeline), labelFormat: this.labelFormat }));
                })));
        }
        else {
            return null;
        }
    }
    generateTimeStepProp(time, timeStepIndex, constrainTimeline) {
        let timeStepProperty = this.timeStepProperties[timeStepIndex];
        // only regenerate if, either we have never set one or the timesteps have changed.
        if (timeStepProperty === null || typeof timeStepProperty === 'undefined') {
            const timeStep = moment(time);
            const previousTimeStep = (timeStepIndex > 0) ? moment(this.timeSteps[timeStepIndex - 1]) : undefined;
            const maxIndex = this.timeSteps.length - 1;
            const nextTimeStep = (timeStepIndex < maxIndex) ? moment(this.timeSteps[timeStepIndex + 1]) : undefined;
            timeStepProperty = {
                nextTimeStep,
                timeStep,
                previousTimeStep,
                style: this.timeStepSpacingService.generatePaddingWidths(timeStepIndex),
                enabled: !this.disableTimesteps
            };
        }
        const timeStepEnabled = timeStepProperty.enabled;
        // Need to detemine is this timestep should be enabled or disabled.
        // The timeStepMap is only relevant if we are loading timesteps.  If we aren't set it to null and only the
        // constraint will be used to determine if the timestep should be enabled or disabled.
        const timeStepMap = this.disableTimesteps ? this.loadedTimeStepMap : null;
        // tslint:disable-next-line:prefer-conditional-expression
        if (this.disableTimesteps && timeStepMap === null) {
            timeStepProperty.enabled = false;
        }
        else {
            timeStepProperty.enabled = this.timeStepUtils.isValidTimeStep(timeStepIndex, timeStepMap, this.timeLineConstraint);
        }
        if (!constrainTimeline && !this.disableTimesteps) {
            timeStepProperty.enabled = true;
        }
        if (timeStepEnabled !== timeStepProperty.enabled) {
            // the status of this timestep has changed.  Need to clone it to create a new object so that the timestep
            // is rerendered (changing object properties doesn't force a rerender)
            timeStepProperty = clone(timeStepProperty);
        }
        this.timeStepProperties[timeStepIndex] = timeStepProperty;
        return timeStepProperty;
    }
    static get is() { return "time-line"; }
    static get originalStyleUrls() { return {
        "$": ["time-line.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["time-line.css"]
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
        "labelFormat": {
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
            "attribute": "label-format",
            "reflect": false
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
                        "path": "../common/types"
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
        "mouseState": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "IMouseState",
                "resolved": "IMouseState",
                "references": {
                    "IMouseState": {
                        "location": "import",
                        "path": "../base-timeline"
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
    static get watchers() { return [{
            "propName": "constrainTimeline",
            "methodName": "constrainTimelineHandler"
        }, {
            "propName": "timeSteps",
            "methodName": "onTimeStepsChange"
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
        }]; }
}
