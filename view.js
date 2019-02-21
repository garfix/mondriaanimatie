function draw(canvas, frame) {

    for (var i = 0; i < frame.areas.length; i++) {
        drawArea(canvas, frame.areas[i], 0);
    }

    for (var i = 0; i < frame.lines.length; i++) {
        drawLine(canvas, frame.lines[i], 0);
    }
}

function animate(canvas, frame, duration) {

    for (var i = 0; i < frame.all.length; i++) {

        var element = frame.all[i];

        var start = i * duration;

        if (element.type === 'line') {
            drawLine(canvas, element, start, duration);
        } else if (element.type === 'plane') {
            drawArea(canvas, element, start);
        }
    }
}

function createRectangle()
{
    var rect = document.createElement('div');

    return rect;
}

function drawLine(canvas, line, start, duration) {

    var rect = createRectangle();

    rect.classList.add("line");

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

    if (line.direction === 'horizontal') {
        rect.style.width = '0%';
        canvas.appendChild(rect);
        rect.style.transition = 'width ' + (duration / 1000) + 's';

        setTimeout(function(){
            rect.style.width = (line.piece[1] - line.piece[0]) + '%';
        }, start)
    } else {
        rect.style.height = '0%';
        canvas.appendChild(rect);
        rect.style.transition = 'height ' + (duration / 1000) + 's';

        setTimeout(function(){
            rect.style.height = (line.piece[1] - line.piece[0]) + '%';
        }, start)
    }

    rect.classList.add(line.color);
}

function drawArea(canvas, area, start, duration) {

    var rect = createRectangle();

    rect.classList.add("plane");

    rect.style.top = area.top + '%';
    rect.style.left = area.left + '%';

    rect.style.height = (area.bottom - area.top) + '%';
    rect.style.width = (area.right - area.left) + "%";

    rect.classList.add(area.color);

    canvas.appendChild(rect);

    rect.style.display = 'none';

    setTimeout(function(){
        rect.style.display = 'block';
    }, start)

}
