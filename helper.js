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

// Sort lines by direction and position
function sortLines(lines) {

    // sort
    var hor = [];
    var ver = [];

    for (var i = 0; i < lines.length; i++) {

        var line = lines[i];

        if (line.direction === 'horizontal') {
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

    return {hor: hor, ver: ver};
}

// Creates segments that have enough distance to the other lines, for a new line to be places
function findFreeSegments(sortedLines) {

}