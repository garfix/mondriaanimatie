
function pickAPlaneColor(planeColors, room) {

    const allColors = ['red', 'yellow', 'blue', 'grey', 'black'];
    const primaryColors = ['red', 'yellow', 'blue'];
    const bignessSize = 30 * 30;

    if (planeColors.length === 0) {
        planeColors = allColors;
        shuffleArray(planeColors);
    }

    let color = planeColors.shift();

    // large room?
    let width = room.right - room.left;
    let height = room.bottom - room.top;
    if (width * height > bignessSize) {
        // not a primary color?
        if (primaryColors.indexOf(color) === -1) {
            // pick another color
            return pickAPlaneColor(planeColors, room);
        }
    }

    return { color: color, planeColors: planeColors };
}

function createLine(lines, orientation, minimumLineDistance, thickness, color) {
    let pos = createPosition(lines, orientation, minimumLineDistance);
    let piece = createPiece(lines, orientation, pos);

    return {
        type: 'line',
        width: thickness,
        color: color,
        orientation: orientation,
        pos: pos,
        start: piece[0],
        end: piece[1]
    };
}

function createPlane(room) {
    let plane = Object.assign({}, room);
    plane.type = 'plane';

    return plane;
}

function createPosition(lines, orientation, minimumLineDistance) {
    let sorted = sortLines(lines);
    let sortedLines = sorted[orientation];
    let segments = findFreeSegments(sortedLines, minimumLineDistance);

    if (segments.length === 0) {
        return false;
    }

    let segmentIndex = random(0, segments.length - 1);
    let segment = segments[segmentIndex];

    return random(segment[0], segment[1]);
}

function pickARoomForAPlane(rooms) {

    const tinyRoomSize = 5;

    // filter allowed rooms
    let allowedIndexes = [];

    for (let i = 0; i < rooms.length; i++) {
        let room = rooms[i];
        let width = room.right - room.left;
        let height = room.bottom - room.top;

        // no tiny rooms in the center
        if (room.left !== 0 && room.right !== 100 && width <= tinyRoomSize) {
            continue;
        }
        if (room.top !== 0 && room.bottom !== 100 && height <= tinyRoomSize) {
            continue;
        }

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

    let r = random(0, allowedIndexes.length - 1);

    return allowedIndexes[r];
}

function pickARoomForSteps(rooms) {

    const minWidth = 15;
    const maxHeight = 15;
    const maxDistanceToFrame = 22;

    // filter allowed rooms
    let allowedIndexes = [];

    for (let i = 0; i < rooms.length; i++) {

        let room = rooms[i];
        let orientation = null;
        let width = room.right - room.left;
        let height = room.bottom - room.top;

        if (room['has-steps']) {
            continue;
        }

        if (room.color !== 'none') {
            continue;
        }

        if (width > height) {
            if (width >= minWidth) {
                if (height < maxHeight) {
                    if (room.bottom <= maxDistanceToFrame || room.top >= 100 - maxDistanceToFrame) {
                        orientation = "horizontal";
                    }
                }
            }
        } else {
            if (height >= minWidth) {
                if (width < maxHeight) {
                    if (room.right <= maxDistanceToFrame || room.left >= 100 - maxDistanceToFrame) {
                        orientation = "vertical";
                    }
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

    let r = random(0, allowedIndexes.length - 1);

    return allowedIndexes[r];
}

function createRandomSteps(room, orientation, colorVariation) {

    let allColors = ['red', 'yellow', 'blue', 'black'];
    const maxSteps = 5;

    // exception case: all steps have same color
    if ((random(1, 20)) === 1) {
        allColors = [allColors[random(0, allColors.length - 1)]];
    }

    let steps = [];
    let colors = allColors.slice(0);

    let width = room.right - room.left;
    let height = room.bottom - room.top;
    let size = (orientation === 'horizontal') ? width : height;

    let stepSize = random(4, 6);
    let interStepSize = random(stepSize, 6 * stepSize);
    let stepSpan = stepSize + interStepSize;
    let maxStepCount = Math.min(size / stepSpan, maxSteps);
    let stepCount = random(1, maxStepCount);
    let spaceUsed = stepCount * stepSpan - interStepSize;
    let stepStart = random(0, size - spaceUsed);

     shuffleArray(colors);

    for (let i = 0; i < stepCount; i++) {

        let color = colors.shift();

        if (colors.length === 0) {
            colors = allColors.slice(0);
        }

        if (orientation === 'horizontal') {

            steps.push({
                type: "step",
                left: stepStart + room.left + i * (stepSize * 2),
                right: stepStart + room.left + i * (stepSize * 2) + stepSize,
                top: room.top,
                bottom: room.bottom,
                color: color,
                colorVariation: colorVariation
            });

        } else {

            steps.push({
                type: "step",
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

    let newRooms = [];

    for (let i = 0; i < rooms.length; i++) {
        if (i === index) {
            newRooms.push(room);
        } else {
            newRooms.push(rooms[i]);
        }
    }

    return newRooms;
}

function createPiece(lines, orientation, pos) {

    const tinyRoomSize = 4;

    let r = random(1, 2);

    if (r === 1) {
        return [0, 100];
    } else {

        let orthoLines = [];
        let sorted = sortLines(lines);

        if (orientation === 'horizontal') {
            orthoLines = sorted.vertical;
        } else {
            orthoLines = sorted.horizontal;
        }

        let maxIndex = orthoLines.length - 1;
        let index1 = random(0, maxIndex - 1);
        let index2 = Math.min(maxIndex, random(index1 + 1, index1 + 2));

        let start = orthoLines[index1].pos + orthoLines[index1].width / 2;
        let end = orthoLines[index2].pos - orthoLines[index2].width / 2;

        // check if the delimiting lines extend to this position
        if (pos >= orthoLines[index1].start && pos <= orthoLines[index1].end) {
            if (pos >= orthoLines[index2].start && pos <= orthoLines[index2].end) {
                // do not draw lines inside a double line
                if (end - start > tinyRoomSize) {
                    return [start, end];
                }
            }
        }

        // fallback
        return [0, 100];
    }
}

function updateRooms(rooms, line) {

    let newRooms = [];

    for (let i = 0; i < rooms.length; i++) {

        let room = rooms[i];

        if (line.orientation === "horizontal") {

            if (room.top < line.pos && room.bottom > line.pos &&
                room.left >= line.start && room.right <= line.end) {

                newRooms = newRooms.concat([
                    {left: room.left, right: room.right, top: room.top, bottom: line.pos, color: room.color },
                    {left: room.left, right: room.right, top: line.pos, bottom: room.bottom, color: room.color }]);

            } else {
                newRooms.push(room)
            }

        } else {

            if (room.left < line.pos && room.right > line.pos &&
                room.top >= line.start && room.bottom <= line.end) {

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