function createRandomFrame() {

    var frame = {
        lines: [],
        areas: [],
        all: []
    };

    var rooms = [];

    var minimumLineDistance = 5;
    var planeColors = [];
    var colorVariations = ['none', 'darker', 'lighter'];
    var count;

    shuffleArray(planeColors);
    shuffleArray(colorVariations);

    // add frame borders
    frame.lines.push({ type: 'line', orientation: 'horizontal', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', orientation: 'horizontal', pos: 100, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', orientation: 'vertical', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', orientation: 'vertical', pos: 100, piece: [0, 100], color: 'none'});

    rooms.push({ left: 0, right: 100, top: 0, bottom: 100, color: 'none' });

    // create a set of instructions
    var instructions = [];

    // each painting has at least a horizontal and a vertical line
    instructions.push('horizontal-line');
    instructions.push('vertical-line');

    // create up to 16 lines
    count = random(0, 14);
    for (var i = 0; i < count; i++) {
        var r = random(1, 2);
        if (r === 1) {
            instructions.push('horizontal-line');
        } else {
            instructions.push('vertical-line');
        }
    }

    // randomize
    shuffleArray(instructions);

    // add up to 5 planes between the lines, somewhere at the end
    count = random(0, 5);
    for (var i = 0; i < count; i++) {
        var position = random(Math.max(0, instructions.length - 2), instructions.length);
        instructions.splice(position, 0, 'plane');
    }

    // add steps in up to 2 rooms
    count = random(0, 2);
    for (var i = 0; i < count; i++) {
        instructions.push('steps');
    }

    for (var i = 0; i < instructions.length; i++) {

        var instruction = instructions[i];

        if (instruction === 'horizontal-line') {
            var line = createLine(frame.lines, 'horizontal', minimumLineDistance);
            frame.lines.push(line);
            frame.all.push(line);
            rooms = updateRooms(rooms, line);
        } else if (instruction === 'vertical-line') {
            var line = createLine(frame.lines, 'vertical', minimumLineDistance);
            frame.lines.push(line);
            frame.all.push(line);
            rooms = updateRooms(rooms, line);
        } else if (instruction === 'plane') {
            var roomIndex = pickARoom(rooms);
            if (roomIndex !== false) {
                var room = rooms[roomIndex];
                var plane = createPlane(room);

                var result = pickAPlaneColor(planeColors, room);
                plane.color = result.color;
                planeColors = result.planeColors;
                plane.colorVariation = colorVariations[0];

                frame.areas.push(plane);
                frame.all.push(plane);
                rooms = replaceRoom(rooms, roomIndex, plane);
            }
        } else if (instruction === 'steps') {
            var result = pickARoomForSteps(rooms);
            if (result) {
                var roomIndex = result[0];
                var orientation = result[1];
                var room = rooms[roomIndex];
                var steps = createRandomSteps(room, orientation, colorVariations[0]);
                frame.all.push(steps);
                room['has-steps'] = true;
            }
        }
    }

    return frame;
}

function pickAPlaneColor(planeColors, room) {

    const allColors = ['red', 'yellow', 'blue', 'grey', 'black'];
    const primaryColors = ['red', 'yellow', 'blue'];
    const bignessSize = 30 * 30;

    if (planeColors.length === 0) {
        planeColors = allColors;
        shuffleArray(planeColors);
    }

    var color = planeColors.shift();

    // large room?
    var width = room.right - room.left;
    var height = room.bottom - room.top;
    if (width * height > bignessSize) {
        // not a primary color?
        if (primaryColors.indexOf(color) === -1) {
            // pick another color
            return pickAPlaneColor(planeColors, room);
        }
    }

    return { color: color, planeColors: planeColors };
}

function createLine(lines, orientation, minimumLineDistance) {
    var pos = createPosition(lines, orientation, minimumLineDistance);
    var piece = createPiece(lines, orientation, pos);

    var line = {
        type: 'line',
        width: 2,
        color: 'black',
        orientation: orientation,
        pos: pos,
        piece: piece,
    };

    return line;
}

function createPlane(room) {
    var plane = Object.assign({}, room);
    plane.type = 'plane';

    return plane;
}

function createPosition(lines, orientation, minimumLineDistance) {
    var sorted = sortLines(lines);
    var sortedLines = sorted[orientation];
    var segments = findFreeSegments(sortedLines, minimumLineDistance);

    if (segments.length === 0) {
        return false;
    }

    var segmentIndex = random(0, segments.length - 1);
    var segment = segments[segmentIndex];

    return random(segment[0], segment[1]);
}

function pickARoom(rooms) {

    // filter allowed rooms
    var allowedIndexes = [];

    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        if (room.left === 0 && room.right === 100) {
            continue;
        }

        if (room.top === 0 && room.bottom === 100) {
            continue;
        }

        if (room.color !== 'none') {
            continue;
        }

        allowedIndexes.push(i);
    }

    if (allowedIndexes.length === 0) {
        return false;
    }

    var r = random(0, allowedIndexes.length - 1);

    return allowedIndexes[r];
}

function pickARoomForSteps(rooms) {

    const minWidth = 15;
    const maxHeight = 15;

    // filter allowed rooms
    var allowedIndexes = [];

    for (var i = 0; i < rooms.length; i++) {

        var room = rooms[i];
        var orientation = null;
        var width = room.right - room.left;
        var height = room.bottom - room.top;

        if (room['has-steps']) {
            continue;
        }

        if (width > height) {
            if (width >= minWidth) {
                if (height < maxHeight) {
                    orientation = "horizontal";
                }
            }
        } else {
            if (height >= minWidth) {
                if (width < maxHeight) {
                    orientation = "vertical";
                }
            }
        }

        if (orientation !== null) {
            allowedIndexes.push([i, orientation]);
        }
    }

    if (allowedIndexes.length === 0) {
        return false;
    }

    var r = random(0, allowedIndexes.length - 1);

    return allowedIndexes[r];
}

function createRandomSteps(room, orientation, colorVariation) {

    var allColors = ['red', 'yellow', 'blue', 'black'];
    const maxSteps = 5;

    // exception case: all steps have same color
    if ((random(1, 20)) === 1) {
        allColors = [allColors[random(0, allColors.length - 1)]];
    }

    var steps = [];
    var colors = allColors.slice(0);

    var width = room.right - room.left;
    var height = room.bottom - room.top;
    var size = (orientation === 'horizontal') ? width : height;

    var stepSize = random(4, 6);
    var interStepSize = random(stepSize, 6 * stepSize);
    var stepSpan = stepSize + interStepSize;
    var maxStepCount = Math.min(size / stepSpan, maxSteps);
    var stepCount = random(1, maxStepCount);
    var spaceUsed = stepCount * stepSpan - interStepSize;
    var stepStart = random(0, size - spaceUsed);

     shuffleArray(colors);

    for (var i = 0; i < stepCount; i++) {

        var color = colors.shift();

        if (colors.length === 0) {
            colors = allColors.slice(0);
        }

        if (orientation === 'horizontal') {

            steps.push({
                left: stepStart + room.left + i * (stepSize * 2),
                right: stepStart + room.left + i * (stepSize * 2) + stepSize,
                top: room.top,
                bottom: room.bottom,
                color: color,
                colorVariation: colorVariation
            });

        } else {

            steps.push({
                left: room.left,
                right: room.right,
                top: stepStart + room.top + i * (stepSize * 2),
                bottom: stepStart + room.top + i * (stepSize * 2) + stepSize,
                color: color,
                colorVariation: colorVariation
            });

        }
    }

    return {type: 'steps', elements: steps };
}

function replaceRoom(rooms, index, room) {

    var newRooms = [];

    for (var i = 0; i < rooms.length; i++) {
        if (i === index) {
            newRooms.push(room);
        } else {
            newRooms.push(rooms[i]);
        }
    }

    return newRooms;
}

function createPiece(lines, orientation, pos) {
    var r = random(1, 2);

    if (r === 1) {
        return [0, 100];
    } else {

        var orthoLines = [];
        var sorted = sortLines(lines);

        if (orientation === 'horizontal') {
            orthoLines = sorted.vertical;
        } else {
            orthoLines = sorted.horizontal;
        }

        var maxIndex = orthoLines.length - 1;
        var index1 = random(0, maxIndex - 1);
        var index2 = Math.min(maxIndex, random(index1 + 1, index1 + 2));

        var start = orthoLines[index1].pos;
        var end = orthoLines[index2].pos;

        // check if the delimiting lines extend to this position
        if (pos >= orthoLines[index1].piece[0] && pos <= orthoLines[index1].piece[1]) {
            if (pos >= orthoLines[index2].piece[0] && pos <= orthoLines[index2].piece[1]) {
                return [start, end];
            }
        }

        // fallback
        return [0, 100];
    }
}

function updateRooms(rooms, line) {

    var newRooms = [];

    for (var i = 0; i < rooms.length; i++) {

        var room = rooms[i];

        if (line.orientation === "horizontal") {

            if (room.top < line.pos && room.bottom > line.pos &&
                room.left >= line.piece[0] && room.right <= line.piece[1]) {

                newRooms = newRooms.concat([
                    {left: room.left, right: room.right, top: room.top, bottom: line.pos, color: room.color },
                    {left: room.left, right: room.right, top: line.pos, bottom: room.bottom, color: room.color }]);

            } else {
                newRooms.push(room)
            }

        } else {

            if (room.left < line.pos && room.right > line.pos &&
                room.top >= line.piece[0] && room.bottom <= line.piece[1]) {

                newRooms = newRooms.concat([
                    { left: room.left, right: line.pos, top: room.top, bottom: room.bottom, color: room.color },
                    { left: line.pos, right: room.right, top: room.top, bottom: room.bottom, color: room.color }]);

            } else {
                newRooms.push(room)
            }

        }
    }

    return newRooms;
}