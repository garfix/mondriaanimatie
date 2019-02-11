function createColor() {
    var colors = ['red', 'blue', 'yellow'];
    var r = random(0, colors.length);
    return colors[r];
}

function createPosition(lines, direction, minimumLineDistance)
{
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

function createSpace(lines) {

    // sort
    var sorted = sortLines(lines);
    
    for (var i = 0; i < 20; i++) {

        var maxHorIndex = sorted.horizontal.length - 1;
        var hor1Index = random(0, maxHorIndex - 1);
        var hor2Index = Math.min(maxHorIndex, random(hor1Index + 1, hor1Index + 2));

        var hor1 = sorted.horizontal[hor1Index];
        var hor2 = sorted.horizontal[hor2Index];

        var maxVerIndex = sorted.vertical.length - 1;
        var ver1Index = random(0, maxVerIndex - 1);
        var ver2Index = Math.min(maxVerIndex, random(ver1Index + 1, ver1Index + 2));

        var ver1 = sorted.vertical[ver1Index];
        var ver2 = sorted.vertical[ver2Index];

        // check if the delimiting lines extend to this position
        if (hor1.pos < ver1.piece[0] || hor1.pos > ver1.piece[1]) {
            continue;
        }
        if (hor1.pos < ver2.piece[0] || hor1.pos > ver2.piece[1]) {
            continue;
        }

        if (hor2.pos < ver1.piece[0] || hor2.pos > ver1.piece[1]) {
            continue;
        }

        if (hor2.pos < ver2.piece[0] || hor2.pos > ver2.piece[1]) {
            continue;
        }


        if (ver1.pos < hor1.piece[0] || ver1.pos > hor1.piece[1]) {
            continue;
        }
        if (ver1.pos < hor2.piece[0] || ver1.pos > hor2.piece[1]) {
            continue;
        }

        if (ver2.pos < hor1.piece[0] || ver2.pos > hor1.piece[1]) {
            continue;
        }

        if (ver2.pos < hor2.piece[0] || ver2.pos > hor2.piece[1]) {
            continue;
        }

        return {
            horizontal: [ver1.pos, ver2.pos],
            vertical: [hor1.pos, hor2.pos]
        }
    }
    
    return false;
}

function createPiece(lines, direction, pos, allowAlmostOpenLines)
{
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
