function createColor() {
    var colors = ['red', 'blue', 'yellow'];
    var r = random(0, colors.length - 1);
    return colors[r];
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

    //console.log(newRooms)

    return newRooms;
}