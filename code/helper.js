function random(min, max) {
    return min + Math.round(Math.random() * (max - min));
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function pickFromArray(array) {
    return array[random(0, array.length - 1)];
}

function removeFromArray(array, element) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== element) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

// Sort lines by orientation and position
function sortLines(lines) {

    // sort
    let hor = [];
    let ver = [];

    for (let i = 0; i < lines.length; i++) {

        let line = lines[i];

        if (typeof line.orientation !== "undefined") {
            if (line.orientation === 'horizontal') {
                hor.push(line);
            } else {
                ver.push(line);
            }
        }
    }

    hor.sort(function(a, b) {
        return a.pos - b.pos;
    });

    ver.sort(function(a, b) {
        return a.pos - b.pos;
    });

    return {horizontal: hor, vertical: ver};
}

// Creates segments that have enough distance to the other lines, for a new line to be places
function findFreeSegments(sortedLines, minimumLineDistance) {

    let segments = [];

    if (sortedLines.length === 0) {
        return [];
    }

    for (let i = 0; i < sortedLines.length - 1; i++) {
        let line1 = sortedLines[i];
        let line2 = sortedLines[i + 1];

        let minPos = line1.pos + line1.width / 2 + minimumLineDistance;
        let maxPos = line2.pos - line2.width / 2 - minimumLineDistance;

        if (minPos <= maxPos) {
            segments.push([minPos, maxPos]);
        }
    }

    return segments;
}