System.register(["./p-b627769f.system.js"],(function(t){"use strict";var e;return{setters:[function(t){e=t.h}],execute:function(){var i=function(){function t(t){this.timeSteps=t}t.prototype.setTimesteps=function(t){this.timeSteps=t};t.prototype.generatePaddingWidths=function(t){return{"padding-right":this.calculateRHSWidthPercentage(t)+"%","padding-left":this.calculateLHSWidthPercentage(t)+"%",left:(parseFloat(this.calculateLHSPosPercentage(t))-parseFloat(this.calculateLHSWidthPercentage(t))).toFixed(2)+"%"}};t.prototype.calculateLHSPosPercentage=function(t){if(t>0){return(Math.floor(this.getTimeStepDiffAsPercentage(e(this.timeSteps[t]),e(this.timeSteps[0]))*100)/100).toFixed(2)}else{return"0"}};t.prototype.calculateLHSWidthPercentage=function(t){if(t>0){return(Math.floor(this.getTimeStepDiffAsPercentage(e(this.timeSteps[t]),e(this.timeSteps[t-1]))/2*100)/100).toFixed(2)}else{return"0"}};t.prototype.calculateRHSWidthPercentage=function(t){if(t<this.timeSteps.length-1){return(Math.floor(this.getTimeStepDiffAsPercentage(e(this.timeSteps[t+1]),e(this.timeSteps[t]))/2*100)/100).toFixed(2)}else{return"0"}};t.prototype.getTimeStepDiffAsPercentage=function(t,i){var n=e.duration(t.diff(i)).asSeconds();return 100/this.getTimeLineDurationInSeconds()*n};t.prototype.getTimeLineDurationInSeconds=function(){var t=this.timeSteps.length-1;var i=e(this.timeSteps[t]);var n=e(this.timeSteps[0]);return e.duration(i.diff(n)).asSeconds()};return t}();t("T",i)}}}));