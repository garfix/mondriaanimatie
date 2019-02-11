function start(canvasElementId) {

    resize();
    window.onresize = resize;

    var canvas = document.getElementById(canvasElementId);
    var frame = createRandomFrame();

    draw(canvas, frame);
}

function resize() {
    var minSize = Math.min(window.innerWidth, window.innerHeight);

    canvas.style.width = minSize + 'px';
    canvas.style.height = minSize + 'px';
}

function createRandomFrame() {

    var frame = {
        lines: [],
        areas: []
    };

    var allowAlmostOpenLines = random(0, 1);

    // add frame borders
    frame.lines.push({ direction: 'horizontal', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ direction: 'horizontal', pos: 100, piece: [0, 100], color: 'none'});
    frame.lines.push({ direction: 'vertical', pos: 0, piece: [0, 100], color: 'none'});
    frame.lines.push({ direction: 'vertical', pos: 100, piece: [0, 100], color: 'none'});

    // ensure a minimum of both types of lines
    var directions = [];

    for (var i = 0; i < random(2, 15); i++) {
        directions.push('horizontal');
    }
    for (var i = 0; i < random(2, 15); i++) {
        directions.push('vertical');
    }

    shuffleArray(directions);

    for (var i = 0; i < directions.length; i++) {

        var direction = directions[i];
        var pos = createPosition(frame.lines, direction);
        var piece = createPiece(frame.lines, direction, pos, allowAlmostOpenLines);

        var line = {
            width: 2,
            color: 'black',
            direction: direction,
            pos: pos,
            piece: piece,
        };

        frame.lines.push(line);
    }

    for (var i = 0; i < random(1, 3); i++) {

        var color = createColor();
        var space = createSpace(frame.lines);

        if (!space) {
            break;
        }

        var area = {
            color: color,
            space: space,
        };

        frame.areas.push(area);

    }

    return frame;
}


