function start(canvasElementId) {

    resize();
    window.onresize = resize;

    var border = document.getElementById(canvasElementId);

    nextFrame(border);
}

function nextFrame(border) {

    var canvas = createRectangle();
    canvas.position = "absolute";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // remove old canvas
    while (border.firstChild) {
        border.removeChild(border.firstChild);
    }

    // create new canvas
    border.appendChild(canvas);

    var frame = createRandomFrame();
    var tearDownAnimation = createRandomTearDownAnimation(canvas);
    var elementDuration = 500;
    var holdDuration = 3000;
    var buildDuration = (frame.all.length * elementDuration);
    var interFrameDuration = 1000;
    var fullDuration = buildDuration + holdDuration + tearDownAnimation.duration + interFrameDuration;

    build(canvas, frame, elementDuration);

    setTimeout(function () {
        tearDownAnimation();
    }, buildDuration + holdDuration);

    setTimeout(function () {
        nextFrame(border)
    }, fullDuration);
}

function resize() {
    var minSize = Math.min(window.innerWidth, window.innerHeight);

    canvas.style.width = minSize + 'px';
    canvas.style.height = minSize + 'px';
}

function createRandomTearDownAnimation(canvas) {
    var r = random(1, 3);

//var r = 3;

    if (r === 1) {
        return tearDownAnimation1(canvas);
    } else if (r === 2) {
        return tearDownAnimation2(canvas);
    } else if (r === 3) {
        return tearDownAnimation3(canvas);
    }
}

function createRandomFrame() {

    var frame = {
        lines: [],
        areas: [],
        all: []
    };

    var rooms = [];

    var allowAlmostOpenLines = 0;//random(0, 1);
    var minimumLineDistance = 5;
    var planeColors = ['red', 'yellow', 'blue', 'grey', 'black'];

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

    // add some horizontal and vertical lines, and some areas

    for (var i = 0; i < random(3, 30); i++) {
        var r = random(0, 9);
        if (r < 3) {
            instructions.push('horizontal-line');
        } else if (r < 6) {
            instructions.push('vertical-line');
        } else {
            instructions.push('area');
        }
    }

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
        } else if (instruction === 'area') {
            var roomIndex = pickARoom(rooms);
            if (roomIndex !== false) {
                var plane = createPlane(rooms[roomIndex]);

                plane.color = planeColors.shift();
                if (planeColors.length === 0) {
                    planeColors = ['red', 'yellow', 'blue', 'grey', 'black'];
                    shuffleArray(planeColors);
                }

                frame.areas.push(plane);
                frame.all.push(plane);
                rooms = replaceRoom(rooms, roomIndex, plane);
            }
        }
    }

    return frame;
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