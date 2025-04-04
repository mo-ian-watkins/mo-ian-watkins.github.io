/*jshint strict: global, esversion: 6 */
/*global window, document, console, MomentumSlider */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.timeline = (function() {

    var timeSlider, timeSliderContainer, dateSlider, dateSliderContainer, playInterval, currentTimestepGroups,
        map, playing = false,
        dateSliderCssClass = "scrubber-container__date",
        timeSliderCssClass = "scrubber-container__time";

    var init = function() {
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MAP_READY, initTimeline);
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.TIME_DIMENSION_CHANGED, updateTimeline);

        // Pause animation on layer picker interactions
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.LAYER_CHANGED, function() {
            if (playing) {
                pause();
            }
        });

        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.ALTITUDE_CHANGED, function() {
            if (playing) {
                pause();
            }
        });


    };

    var initTimeline = function(mapPayload) {

        var controlElement, configuration;

        map = mapPayload;

        addMapInteractions();

        configuration = window.metoffice.enthusiast.core.getConfiguration();

        if (typeof configuration.models !== "undefined") {
            controlElement = createControl();
            document.getElementById("lower-controls").appendChild(controlElement);

        } else {
            console.error("No data layers found in configuration, control not created");
        }

    };

    var addMapInteractions = function() {
        map.on("movestart resize", function(event) {
            if (playing) {
                pause();
            }
        });
    };

    var updateTimeline = function(timelineConfigPayload) {

        var timesteps = timelineConfigPayload.timeSteps,
            queryParameters = window.metoffice.queryStringUtils.getAllHashedQueryStringParameters(),
            timeTimestepCount, dateTimestepCount,
            timeSliderElement, dateSliderElement,
            startingTimeIndex = 0, startingDateIndex = 0,
            timestepDefaultIndex;

        currentTimestepGroups = groupTimestepsByDate(timesteps);

        timeTimestepCount = timesteps.length;
        dateTimestepCount = currentTimestepGroups.length;

        if (timeTimestepCount > 0) {

            // override default timestep if available in query parameters
            if (queryParameters.timestep) {
                timestepDefaultIndex = timesteps.indexOf(parseInt(queryParameters.timestep));

                if (timestepDefaultIndex !== -1) {
                    startingTimeIndex = timestepDefaultIndex;
                }
            }

            // select last timestep if none set via query string and configured for this layer
            if (timelineConfigPayload.defaultTimeStep === "last" && startingTimeIndex === 0) {
                startingTimeIndex = timeTimestepCount - 1;
                startingDateIndex = dateTimestepCount - 1;
            }

            timeSliderElement = createTimeSlider(timesteps);
            dateSliderElement = createDateSlider(currentTimestepGroups);
            timeSliderContainer.innerHTML = "";
            timeSliderContainer.appendChild(timeSliderElement);

            dateSliderContainer.innerHTML = "";
            dateSliderContainer.appendChild(dateSliderElement);

            // Create the date and time scrubbers, this needs to be done after adding to map so sizing is correctly calculated
            dateSlider = buildMomentumSlider(dateSliderCssClass, startingDateIndex, dateSliderChange, dateSliderUp);
            timeSlider = buildMomentumSlider(timeSliderCssClass, startingTimeIndex, timeSliderChange);

            addTimelineInteractions();

        }

    };

    var buildMomentumSlider = function(cssClass, startIndex, changeFunction, upFunction) {

        var slider = new MomentumSlider({
            el: "." + cssClass,
            currentIndex: startIndex,
            bounceCoefficient: 0.1,
            showIntermediateValues: false,
            change: changeFunction,
            up: upFunction
        });

        return slider;

    };

    var dateSliderChange = function(newIndex, oldIndex) {
        var dateSlideElements = document.getElementsByClassName("date-slide");
        highlightSelectedElement(newIndex, dateSlideElements, "date-slide--selected");
    };

    var dateSliderUp = function(newIndex) {

        var dateSlideElements = document.getElementsByClassName("date-slide"),
            timeIndex = 0;

        highlightSelectedElement(newIndex, dateSlideElements, "date-slide--selected");

        if (typeof timeSlider !== "undefined") {
            timeIndex = timeSlider.currentIndex;
        }

        updateTimeElements(newIndex, timeIndex);

    };

    var timeSliderChange = function(newIndex, oldIndex) {
        var timeSlideElements = document.getElementsByClassName("time-slide"),
            isRewindingWhilePlaying = newIndex < oldIndex && playing,
            currentTimestep = map.timeDimension.getAvailableTimes()[newIndex];

        highlightSelectedElement(newIndex, timeSlideElements, "time-slide--selected");

        updateDateElements(newIndex);

        window.metoffice.queryStringUtils.setHashedQueryStringParameter("timestep", currentTimestep);

        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.TIMELINE_CHANGED, {
            timestepIndex: newIndex,
            isRewindingWhilePlaying: isRewindingWhilePlaying
        });

    };


    var highlightSelectedElement = function(index, elementList, selectedClass) {
        for (let i=0; i < elementList.length; i++) {
            elementList[i].classList.remove(selectedClass);
        }

        elementList[index].classList.add(selectedClass);
    };

    var groupTimestepsByDate = function(timesteps) {
        var groupedTimesteps = {},
            outputArray = [],
            currentTimestep,
            currentDate,
            dateOptions = {weekday: "short", month: "short", day: "numeric"};

        for (let i=0; i < timesteps.length; i++) {
            currentTimestep = new Date(timesteps[i]);
            currentDate = currentTimestep.toLocaleDateString("en-GB", dateOptions).replace(",", "");


            if (! groupedTimesteps.hasOwnProperty(currentDate)) {
                groupedTimesteps[currentDate] = [];
            }

            groupedTimesteps[currentDate].push(timesteps[i]);

        }

        for (let key in groupedTimesteps) {
            outputArray.push({"date": key, "timesteps": groupedTimesteps[key]});
        }

        return outputArray;

    };

    var createControl = function() {
        var controlContainerElement = document.createElement("div"),
            upperContainerElement = document.createElement("div"),
            lowerContainerElement = document.createElement("div"),
            timelineMarker = document.createElement("span"),
            timelineArrow = document.createElement("span"),
            playButtonElement = createPlayButton();

        timeSliderContainer = document.createElement("div");
        dateSliderContainer = document.createElement("div");

        timelineMarker.setAttribute("class", "timeline-marker");
        timelineArrow.setAttribute("class", "timeline-arrow");
        timelineMarker.appendChild(timelineArrow);

        timeSliderContainer.setAttribute("class", "time-slider");
        timeSliderContainer.setAttribute("id", "time-slider-container");

        dateSliderContainer.setAttribute("class", "time-slider");
        dateSliderContainer.setAttribute("id", "date-slider-container");

        upperContainerElement.setAttribute("class", "upper-control-container");
        upperContainerElement.appendChild(dateSliderContainer);

        lowerContainerElement.setAttribute("class", "lower-control-container");
        lowerContainerElement.appendChild(playButtonElement);
        lowerContainerElement.appendChild(timeSliderContainer);

        controlContainerElement.setAttribute("class", "control-container");
        controlContainerElement.appendChild(timelineMarker);
        controlContainerElement.appendChild(upperContainerElement);
        controlContainerElement.appendChild(lowerContainerElement);

        return controlContainerElement;

    };

    var createPlayButton = function() {
        var playButtonElement = document.createElement("button"),
        playButtonIconElement = document.createElement("span");

        playButtonIconElement.setAttribute("class", "icon icon--play");
        playButtonIconElement.setAttribute("id", "play-icon");
        playButtonIconElement.textContent = "Play";

        playButtonElement.setAttribute("id", "play-button");
        playButtonElement.setAttribute("class", "button button--play");
        playButtonElement.appendChild(playButtonIconElement);

        playButtonElement.addEventListener("click", playEventHandler);

        return playButtonElement;

    };

    var playEventHandler = function() {
        playing = !playing;

        if (playing) {
            start();
        } else {
            pause();
        }

    };

    var createTimeSlider = function(timesteps) {

        var timeStepList, timestepElement,
            timeScrubberDiv = document.createElement("div"),
            timeStepCount = timesteps.length;

        timeScrubberDiv.setAttribute("class", "scrubber-container " + timeSliderCssClass);
        timeScrubberDiv.setAttribute("tabindex", "0");

        timeScrubberDiv.addEventListener("keydown", function(event) {

            var keys = window.metoffice.keys;

            switch (event.keyCode) {

                case keys.LEFT:
                    event.preventDefault();
                    timeSlider.prev();
                    break;

                case keys.RIGHT:
                    event.preventDefault();
                    timeSlider.next();
                    break;
            }

        });

        // Generate ticks for each timestep
        timeStepList = document.createElement("ul");
        timeStepList.setAttribute("class", "ms-track time-track");

        for (let i=0; i < timeStepCount; i++) {
            timestepElement = document.createElement("li");
            timestepElement.setAttribute("class","ms-slide time-slide");
            timestepElement.textContent = formatTime(timesteps[i]);
            timeStepList.appendChild(timestepElement);
        }

        timeScrubberDiv.appendChild(timeStepList);

        return timeScrubberDiv;

    };

    var createDateSlider = function(timestepGroups) {

        var timeStepList, timestepElement, timestepInnerElement,
            dateScrubberDiv = document.createElement("div"),
            timeStepCount = timestepGroups.length;

        dateScrubberDiv.setAttribute("class", "scrubber-container " + dateSliderCssClass);
        dateScrubberDiv.setAttribute("tabindex", "0");

        dateScrubberDiv.addEventListener("keydown", function(event) {

            var keys = window.metoffice.keys;

            switch (event.keyCode) {

                case keys.LEFT:
                    event.preventDefault();
                    dateSlider.prev();
                    updateTimeElements(dateSlider.currentIndex, timeSlider.currentIndex);
                    break;

                case keys.RIGHT:
                    event.preventDefault();
                    dateSlider.next();
                    updateTimeElements(dateSlider.currentIndex, timeSlider.currentIndex);
                    break;
            }

        });

        // Generate ticks for each timestep
        timeStepList = document.createElement("ul");
        timeStepList.setAttribute("class", "date-track");

        for (let i=0; i < timeStepCount; i++) {
            timestepElement = document.createElement("li");
            timestepElement.setAttribute("class","ms-slide date-slide");

            timestepInnerElement = document.createElement("span");
            timestepInnerElement.setAttribute("class","date-slide-inner");

            timestepInnerElement.textContent = timestepGroups[i].date;
            timestepElement.appendChild(timestepInnerElement);
            timeStepList.appendChild(timestepElement);

        }

        dateScrubberDiv.appendChild(timeStepList);

        return dateScrubberDiv;

    };


    var isPlaying = function() {
        return playing;
    };

    var start = function() {
        var playIcon = document.getElementById("play-icon");
        playIcon.setAttribute("class", "icon icon--pause");
        playIcon.textContent = "Pause";
        playing = true;
        playInterval = window.setInterval(playFrame, 1000);

        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.TIMELINE_ANIMATING_CHANGED, {
            isPlaying: playing
        });
    };

    var pause = function() {
        var playIcon = document.getElementById("play-icon");
        playIcon.setAttribute("class", "icon icon--play");
        playIcon.textContent = "Play";
        playing = false;
        window.clearInterval(playInterval);

        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.TIMELINE_ANIMATING_CHANGED, {
            isPlaying: playing
        });
    };

    var playFrame = function() {
        if (timeSlider.currentIndex >= timeSlider.sliderLength - 1) {
            timeSlider.select(0);
        } else {
            timeSlider.next();
        }
    };

    var addTimelineInteractions = function() {

        var scrubberContainers = document.getElementsByClassName("scrubber-container");

        for (let i=0; i < scrubberContainers.length; i++) {
            // On interaction with the scrubber, stop animation if running
            scrubberContainers[i].addEventListener("pointerdown", function() {
                if (playing) {
                    pause();
                }
            });
        }
    };

    var updateDateElements = function(selectedTimeStepIndex) {

        var requiredTimestep = map.timeDimension.getAvailableTimes()[selectedTimeStepIndex],
            totalDateTimesteps = currentTimestepGroups.length;

        for (let i=0 ; i < totalDateTimesteps; i++) {
            for(let j=0; j < currentTimestepGroups[i].timesteps.length; j++) {

                if (currentTimestepGroups[i].timesteps[j] === requiredTimestep) {
                    dateSlider.select(i);
                }
            }
        }

    };

    var updateTimeElements = function(newDateIndex, selectedTimeIndex) {

        var currentDateTime = new Date(map.timeDimension.getAvailableTimes()[selectedTimeIndex]),
            requiredDateTimeSteps = currentTimestepGroups[newDateIndex].timesteps,
            comparisonDateTime,
            requiredTimestepIndex;

        // look through timesteps to see if we have a matching time on the required day
        for(let i=0; i < requiredDateTimeSteps.length; i++) {
            comparisonDateTime = new Date(requiredDateTimeSteps[i]);

            if (currentDateTime.getHours() === comparisonDateTime.getHours() && currentDateTime.getMinutes() === comparisonDateTime.getMinutes()) {
                requiredTimestepIndex = findTimeSliderIndexOfTimeStep(requiredDateTimeSteps[i]);
            }

        }

        // select first timestep of new day if exact time is not found
        if (typeof requiredTimestepIndex === "undefined") {
            requiredTimestepIndex = findTimeSliderIndexOfTimeStep(requiredDateTimeSteps[0]);
        }

        if (typeof timeSlider !== "undefined") {
            timeSlider.select(requiredTimestepIndex);
        }


    };

    var findTimeSliderIndexOfTimeStep = function(timestep) {
        var timestepIndex, indexCount = 0;

        for (let i=0 ; i < currentTimestepGroups.length; i++) {

            if (currentTimestepGroups[i].timesteps.indexOf(timestep) !== -1) {
                timestepIndex = indexCount + currentTimestepGroups[i].timesteps.indexOf(timestep);
                break;
            }

            indexCount = indexCount + currentTimestepGroups[i].timesteps.length;
        }

        return timestepIndex;

    };

    var formatTime = function (epochString) {

        var dateTime = new Date(epochString),
            hoursString = String(dateTime.getHours() < 10? '0' : '') + String(dateTime.getHours()),
            minutesString = String(dateTime.getMinutes() < 10? '0' : '') + String(dateTime.getMinutes());

        return hoursString + ":" + minutesString;

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init,
        isPlaying: isPlaying,
        pause: pause
    };


})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.timeline.init);