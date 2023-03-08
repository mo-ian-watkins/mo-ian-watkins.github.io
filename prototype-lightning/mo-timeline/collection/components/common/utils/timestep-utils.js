export class TimeStepUtils {
    // Take a string representation of timesteps and converts to an Array.  Sort the array by time and remove any
    // duplicates
    createSortedTimeStepArrayFromJSON(json) {
        const parsedTimeSteps = (typeof json !== 'object') ? JSON.parse(json) : json;
        let sortedTimeSteps = new Array();
        parsedTimeSteps.forEach((timeStep) => {
            sortedTimeSteps.push(timeStep);
        });
        // don't assume the timeSteps are in date order, sort them
        sortedTimeSteps.sort();
        // remove any duplicates
        sortedTimeSteps = sortedTimeSteps.filter((item, index) => {
            return sortedTimeSteps.indexOf(item) === index;
        });
        return sortedTimeSteps;
    }
    // Takes two arrays of strings, the timesteps that define the timeline and a list of timesteps that have been loaded
    // Creates a map with successfully loaded timeSteps, the key being the corresponding position in the timestep array.
    // For example if the 4th timestep is loaded then the map will have an entry with a key of 3 (zero based index).
    // This allows for speedy lookup of whether a specific timestep has been loaded.
    createMatchingTimeStepMap(timeSteps, loadedTimeSteps) {
        const loadedTimeStepMap = new Map();
        let matchedTimestepIndex = 0;
        loadedTimeSteps.forEach((loadedTimeStep) => {
            for (matchedTimestepIndex; matchedTimestepIndex < timeSteps.length; matchedTimestepIndex++) {
                if (loadedTimeStep === timeSteps[matchedTimestepIndex]) {
                    loadedTimeStepMap.set(matchedTimestepIndex, timeSteps[matchedTimestepIndex]);
                    matchedTimestepIndex++;
                    break;
                }
            }
        });
        return loadedTimeStepMap;
    }
    // Given a timestep find the next (to the right) active timestep.  This can be the same as the timestep passed in if
    // it is active.  Active in this context means either loaded or within the constraints.  If timesteps are not being
    // loaded then only the constraints are used to define if a timestep is active.
    findNearestNextActiveTimeStep(selectedIndex, numberOfTimeSteps, loadedTimeSteps, timeLineConstraint) {
        return this.searchForNearestActiveTimeStep(selectedIndex, numberOfTimeSteps, loadedTimeSteps, timeLineConstraint, true, false);
    }
    // Given a timestep find the previous (to the left) active timestep.  This can be the same as the timestep passed in
    // if it is active.  Active in this context means either loaded or within the constraints.  If timesteps are not
    // being loaded then only the constraints are used to define if a timestep is active.
    findNearestPreviousActiveTimeStep(selectedIndex, numberOfTimeSteps, loadedTimeSteps, timeLineConstraint) {
        return this.searchForNearestActiveTimeStep(selectedIndex, numberOfTimeSteps, loadedTimeSteps, timeLineConstraint, false, true);
    }
    // Given a timestep find the nearest (left or right) active timestep.  This can be the same as the timestep passed
    // in if it is active.  Active in this context means either loaded or within the constraints.  If timesteps are not
    // being loaded then only the constraints are used to define if a timestep is active.
    findNearestActiveTimeStep(selectedIndex, numberOfTimeSteps, loadedTimeSteps, timeLineConstraint) {
        return this.searchForNearestActiveTimeStep(selectedIndex, numberOfTimeSteps, loadedTimeSteps, timeLineConstraint, false, false);
    }
    // Find the nearest active timestep. Active in this context means either loaded or within the constraints.
    // If timesteps are not being loaded then only the constraints are used to define if a timestep is active.
    searchForNearestActiveTimeStep(selectedIndex, numberOfTimeSteps, loadedTimeSteps, timeLineConstraint, onlySearchForward, onlySearchBackwards) {
        let nearestTimeStepIndex = selectedIndex;
        if (loadedTimeSteps === null || loadedTimeSteps.size > 0) {
            // If there is a timestep at selected index position then it has loaded.
            if (this.isValidTimeStep((selectedIndex), loadedTimeSteps, timeLineConstraint)) {
                nearestTimeStepIndex = selectedIndex;
            }
            else {
                let foundNearbyTimestep = false;
                let outsideLeftBounds = false;
                let outsideRightBounds = false;
                let count = 0;
                // keep track of the total number of steps that we have checked.
                let totalStepsChecked = 0;
                // keep searching until we find an active timestep or we run out of steps to check.
                // Important to keep this second test in.  The combination of loading new timesteps, constraints and
                // scrubbing of some of the elements can cause a situation where the active timesteps are changed while
                // the search is occurring and the active step is missed and the search continues forever!
                while (!foundNearbyTimestep && totalStepsChecked <= numberOfTimeSteps) {
                    totalStepsChecked++;
                    count++;
                    if (outsideLeftBounds && onlySearchBackwards) {
                        // If searching backwards, and we've hit the start of the timestep array, need to jump to the end
                        selectedIndex = numberOfTimeSteps - 1;
                        count = 0;
                        outsideLeftBounds = false;
                    }
                    if (outsideRightBounds && onlySearchForward) {
                        // If searching forward, and we've hit the end of the timestep array, need to jump to the start
                        selectedIndex = 0;
                        count = 0;
                        outsideRightBounds = false;
                    }
                    if (!onlySearchForward) {
                        if (selectedIndex - count >= 0) {
                            if (this.isValidTimeStep((selectedIndex - count), loadedTimeSteps, timeLineConstraint)) {
                                nearestTimeStepIndex = selectedIndex - count;
                                foundNearbyTimestep = true;
                            }
                        }
                        else {
                            outsideLeftBounds = true;
                        }
                    }
                    // No need to do this check if we have already found a timestep
                    if (!onlySearchBackwards && !foundNearbyTimestep) {
                        if ((selectedIndex + count) < numberOfTimeSteps) {
                            if (this.isValidTimeStep((selectedIndex + count), loadedTimeSteps, timeLineConstraint)) {
                                nearestTimeStepIndex = selectedIndex + count;
                                foundNearbyTimestep = true;
                            }
                        }
                        else {
                            outsideRightBounds = true;
                        }
                    }
                }
            }
        }
        return nearestTimeStepIndex;
    }
    // Tests whether a timestep is loaded and within the constraints passed in.  If timesteps are not being loaded then
    // the loadedTimeSteps argument will be null and ignored.
    isValidTimeStep(index, loadedTimeSteps, timeLineConstraint) {
        if ((loadedTimeSteps === null || typeof loadedTimeSteps.get(index) !== 'undefined')
            && (index >= timeLineConstraint.left)
            && (index <= timeLineConstraint.right)) {
            return true;
        }
        else {
            return false;
        }
    }
    resetTimelineConstraint(numberOfTimeSteps) {
        return { left: 0, right: numberOfTimeSteps === 0 ? Number.MAX_SAFE_INTEGER : numberOfTimeSteps - 1 };
    }
}
