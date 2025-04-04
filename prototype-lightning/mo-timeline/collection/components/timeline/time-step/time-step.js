import { Component, h, Prop } from '@stencil/core';
import moment from 'moment';
export class TimeStep {
    render() {
        if (this.timeData) {
            let cssClass = 'timeBar';
            if (!this.timeData.enabled) {
                cssClass += ' timeBar__disabledTimestep';
            }
            return (h("div", { class: cssClass, style: this.timeData.style },
                this.renderLabel(),
                this.renderVerticalLine()));
        }
        else {
            return null;
        }
    }
    renderLabel() {
        if (this.largeVerticalLineRequired()) {
            return (h("div", { class: 'timeBar__label' }, this.timeData.timeStep.format(this.labelFormat)));
        }
        else {
            return (h("div", { class: 'timeBar__label' }));
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
        return (h("div", { class: cssClass }));
    }
    largeVerticalLineRequired() {
        return this.timeDivisionChange();
    }
    timeDivisionChange() {
        const prevTimeStepDay = moment(this.timeData.previousTimeStep).day();
        const thisTimeStepDay = moment(this.timeData.timeStep).day();
        return !this.timeData.previousTimeStep || prevTimeStepDay !== thisTimeStepDay;
    }
    static get is() { return "time-step"; }
    static get originalStyleUrls() { return {
        "$": ["time-step.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["time-step.css"]
    }; }
    static get properties() { return {
        "timeData": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "ITimeStepProps",
                "resolved": "ITimeStepProps",
                "references": {
                    "ITimeStepProps": {
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
        }
    }; }
}
