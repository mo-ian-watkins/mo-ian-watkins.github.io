import { Component, h, Prop } from '@stencil/core';
import moment from 'moment';
import { EWarningSeverity } from '../../common/types';
export class TimelineWarnings {
    constructor() {
        this.warnings = [];
    }
    render() {
        return (h("div", { class: 'warningsContainer' },
            h("div", { class: 'warningsContainer__redWarnings' }, this.renderWarnings(EWarningSeverity.RED)),
            h("div", { class: 'warningsContainer__amberWarnings' }, this.renderWarnings(EWarningSeverity.AMBER)),
            h("div", { class: 'warningsContainer__yellowWarnings' }, this.renderWarnings(EWarningSeverity.YELLOW))));
    }
    renderWarnings(severity) {
        return this.warnings.map((warning) => {
            if (moment(warning.validFrom).isBefore(moment(this.lastTimeStep))) {
                if (warning.severity === severity) {
                    return (h("div", { class: 'warningsContainer__warning', id: 'severity' + severity.toString(), style: this.calculateWarningPosition(warning) }));
                }
            }
        });
    }
    calculateWarningPosition(warning) {
        return {
            'width': this.calculateTimeDifferenceAsPercentage(moment(warning.validTo), moment(warning.validFrom)) + '%',
            'left': this.calculateTimeDifferenceAsPercentage(moment(warning.validFrom), moment(this.firstTimeStep)) + '%'
        };
    }
    calculateTimeDifferenceAsPercentage(latestTimePoint, earliestTimePoint) {
        const timeFrom = (earliestTimePoint.isBefore(moment(this.firstTimeStep))) ? moment(this.firstTimeStep) : earliestTimePoint;
        const timeTo = (latestTimePoint.isBefore(moment(this.firstTimeStep))) ? moment(this.firstTimeStep) : latestTimePoint;
        const durationBetweenTimePoints = moment.duration(moment(timeTo).diff(timeFrom)).asSeconds();
        const timelineDuration = moment.duration(moment(this.lastTimeStep).diff(moment(this.firstTimeStep))).asSeconds();
        return (Math.floor(((durationBetweenTimePoints / timelineDuration) * 100) * 100) / 100).toFixed(2);
    }
    static get is() { return "timeline-warnings"; }
    static get originalStyleUrls() { return {
        "$": ["timeline-warnings.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["timeline-warnings.css"]
    }; }
    static get properties() { return {
        "firstTimeStep": {
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
            "attribute": "first-time-step",
            "reflect": false
        },
        "lastTimeStep": {
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
            "attribute": "last-time-step",
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
                        "path": "../../common/types"
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
        }
    }; }
}
