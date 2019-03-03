function random(min, max) {
    return min + Math.round(Math.random() * (max - min));
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function pickFromArray(array) {
    return array[random(0, array.length - 1)];
}

// Sort lines by orientation and position
function sortLines(lines) {

    // sort
    var hor = [];
    var ver = [];

    for (var i = 0; i < lines.length; i++) {

        var line = lines[i];

        if (line.orientation === 'horizontal') {
            hor.push(line);
        } else {
            ver.push(line);
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

    var segments = [];

    if (sortedLines.length === 0) {
        return [];
    }

    for (var i = 0; i < sortedLines.length - 1; i++) {
        var line1 = sortedLines[i];
        var line2 = sortedLines[i + 1];

        var minPos = line1.pos + minimumLineDistance;
        var maxPos = line2.pos - minimumLineDistance;

        if (minPos <= maxPos) {
            segments.push([minPos, maxPos]);
        }
    }

    return segments;
}