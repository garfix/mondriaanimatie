function draw(canvas, frame) {

    for (var i = 0; i < frame.areas.length; i++) {
        drawArea(canvas, frame.areas[i]);
    }

    for (var i = 0; i < frame.lines.length; i++) {
        drawLine(canvas, frame.lines[i]);
    }
}

function createRectangle()
{
    var rect = document.createElement('div');

    rect.classList.add("rectangle");

    return rect;
}

function drawLine(canvas, line) {

    var rect = createRectangle();

    if (line.direction === 'horizontal') {

        rect.style.left = line.piece[0] + '%';
        rect.style.width = (line.piece[1] - line.piece[0]) + '%';

        rect.style.top = line.pos - (line.width / 2) + '%';
        rect.style.height = line.width + "%";

    } else {

        rect.style.top = line.piece[0] + '%';
        rect.style.height = (line.piece[1] - line.piece[0]) + '%';

        rect.style.left = line.pos - (line.width / 2) + '%';
        rect.style.width = line.width + "%";
    }

    rect.classList.add(line.color);

    canvas.appendChild(rect);
}

function drawArea(canvas, area) {

    var rect = createRectangle();

    rect.style.top = area.space.vertical[0] + '%';
    rect.style.left = area.space.horizontal[0] + '%';

    rect.style.height = (area.space.vertical[1] - area.space.vertical[0]) + '%';
    rect.style.width = (area.space.horizontal[1] - area.space.horizontal[0]) + "%";

    rect.classList.add(area.color);

    canvas.appendChild(rect);
}
