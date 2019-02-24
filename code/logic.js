function createRandomFrame() {

    var frame = {
        lines: [],
        areas: [],
        all: []
    };

    var rooms = [];

    var allowAlmostOpenLines = 0;//random(0, 1);
    var minimumLineDistance = 5;
    var planeColors = [];
    var count;

    shuffleArray(planeColors);

    // add frame borders
    frame.lines.push({ type: 'line', direction: 'horizontal', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', direction: 'horizontal', pos: 100, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', direction: 'vertical', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', direction: 'vertical', pos: 100, piece: [0, 100], color: 'none'});

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

    // add up to 5 planes
    count = random(0, 5);
    for (var i = 0; i < count; i++) {
        instructions.push('plane');
    }

    // randomize
    shuffleArray(instructions);

    for (var i = 0; i < instructions.length; i++) {

        var instruction = instructions[i];

        if (instruction === 'horizontal-line') {
            var line = createLine(frame.lines, 'horizontal', minimumLineDistance, allowAlmostOpenLines);
            frame.lines.push(line);
            frame.all.push(line);
            rooms = updateRooms(rooms, line);
        } else if (instruction === 'vertical-line') {
            var line = createLine(frame.lines, 'vertical', minimumLineDistance, allowAlmostOpenLines);
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

                frame.areas.push(plane);
                frame.all.push(plane);
                rooms = replaceRoom(rooms, roomIndex, plane);
            }
        }
    }

    return frame;
}

function pickAPlaneColor(planeColors, room) {

    const allColors = ['red', 'yellow', 'blue', 'grey', 'black'];
    const primaryColors = ['red', 'yellow', 'blue'];
    const bignessSize = 40;

    if (planeColors.length === 0) {
        planeColors = allColors;
        shuffleArray(planeColors);
    }

    var color = planeColors.shift();

    // large room?
    if ((room.right - room.left > bignessSize) || (room.bottom - room.top > bignessSize)) {
        // not a primary color?
        if (primaryColors.indexOf(color) === -1) {
            // pick another color
            return pickAPlaneColor(planeColors, room);
        }
    }

    return { color: color, planeColors: planeColors };
}

function createLine(lines, direction, minimumLineDistance, allowAlmostOpenLines) {
    var pos = createPosition(lines, direction, minimumLineDistance);
    var piece = createPiece(lines, direction, pos, allowAlmostOpenLines);

    var line = {
        type: 'line',
        width: 2,
        color: 'black',
        direction: direction,
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

function createPosition(lines, direction, minimumLineDistance) {
    var sorted = sortLines(lines);
    var sortedLines = sorted[direction];
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

function createPiece(lines, direction, pos, allowAlmostOpenLines) {
    var r;

    if (allowAlmostOpenLines) {
        r = random(1, 3);
    } else {
        r = random(2, 3);
    }

    if (r === 1) {
        return [1, 99];
    } else if (r === 2) {
        return [0, 100];
    } else {

        var orthoLines = [];
        var sorted = sortLines(lines);

        if (direction === 'horizontal') {
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

        if (line.direction === "horizontal") {

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