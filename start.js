function start(canvasElementId) {

    resize();
    window.onresize = resize;

    var canvas = document.getElementById(canvasElementId);

    nextFrame(canvas);
}

function nextFrame(canvas) {

    var frame = createRandomFrame();
    var duration = 500;
    var frameDuration = frame.all.length * duration + 1000;

    animate(canvas, frame, duration);

    setTimeout(function () {

        canvas.innerHTML = "";

        nextFrame(canvas)

    }, frameDuration)
}

function resize() {
    var minSize = Math.min(window.innerWidth, window.innerHeight);

    canvas.style.width = minSize + 'px';
    canvas.style.height = minSize + 'px';
}

function createRandomFrame() {

    var frame = {
        lines: [],
        areas: [],
        all: []
    };

    var boxes = [];

    var allowAlmostOpenLines = 0;//random(0, 1);
    var minimumLineDistance = 5;
    var planeColors = ['red', 'yellow', 'blue', 'grey', 'black'];

    shuffleArray(planeColors);

    // add frame borders
    frame.lines.push({ type: 'line', direction: 'horizontal', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', direction: 'horizontal', pos: 100, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', direction: 'vertical', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ type: 'line', direction: 'vertical', pos: 100, piece: [0, 100], color: 'none'});

    // frame.all.push({ type: 'line', direction: 'horizontal', pos: 0, piece: [0, 100], color: 'none'});
    // frame.all.push({ type: 'line', direction: 'horizontal', pos: 100, piece: [0, 100], color: 'none'});
    // frame.all.push({ type: 'line', direction: 'vertical', pos: 0, piece: [0, 100], color: 'none'});
    // frame.all.push({ type: 'line', direction: 'vertical', pos: 100, piece: [0, 100], color: 'none'});

    boxes.push({ left: 0, right: 100, top: 0, bottom: 100, color: 'none' });

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
            boxes = updateBoxes(boxes, line);
        } else if (instruction === 'vertical-line') {
            var line = createLine(frame.lines, 'vertical', minimumLineDistance, allowAlmostOpenLines);
            frame.lines.push(line);
            frame.all.push(line);
            boxes = updateBoxes(boxes, line);
        } else if (instruction === 'area') {
            var boxIndex = pickABox(boxes);
            if (boxIndex !== false) {
                var plane = Object.assign({}, boxes[boxIndex]);
                plane.type = 'plane';
                plane.color = planeColors.shift();
                if (planeColors.length === 0) {
                    planeColors = ['red', 'yellow', 'blue', 'grey', 'black'];
                    shuffleArray(planeColors);
                }
                frame.areas.push(plane);
                frame.all.push(plane);
                boxes = replaceBox(boxes, boxIndex, plane);
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