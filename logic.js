function createColor() {
    var colors = ['red', 'blue', 'yellow'];
    var r = random(0, colors.length);
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

function createArea(boxes) {

    var r = random(0, boxes.length - 1);

    var area = boxes[r];

    area.color = createColor();

    return area;
}

function createPiece(lines, direction, pos, allowAlmostOpenLines) {
    var r;

    if (allowAlmostOpenLines) {
        r = random(2, 3);
    } else {
        r = random(1, 3);
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

function updateBoxes(boxes, line) {

    var newBoxes = [];

    for (var i = 0; i < boxes.length; i++) {

        var box = boxes[i];

        if (line.direction === "horizontal") {

            if (box.top < line.pos && box.bottom > line.pos &&
                box.left >= line.piece[0] && box.right <= line.piece[1]) {

                newBoxes = newBoxes.concat([
                    {left: box.left, right: box.right, top: box.top, bottom: line.pos},
                    {left: box.left, right: box.right, top: line.pos, bottom: box.bottom}]);

            } else {
                newBoxes.push(box)
            }

        } else {

            if (box.left < line.pos && box.right > line.pos &&
                box.top >= line.piece[0] && box.bottom <= line.piece[1]) {

                newBoxes = newBoxes.concat([
                    { left: box.left, right: line.pos, top: box.top, bottom: box.bottom },
                    { left: line.pos, right: box.right, top: box.top, bottom: box.bottom }]);

            } else {
                newBoxes.push(box)
            }

        }
    }

    return newBoxes;
}