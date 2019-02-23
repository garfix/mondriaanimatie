function build(canvas, frame, duration) {

    for (var i = 0; i < frame.all.length; i++) {

        var element = frame.all[i];

        var start = i * duration;

        if (element.type === 'line') {
            drawLine(canvas, element, start, duration);
        } else if (element.type === 'plane') {
            drawPlane(canvas, element, start, duration);
        }
    }
}

function hideElement(element, time) {
    setTimeout(function(){
        element.style.display = 'none';
    }, time)
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

        rect.style.display = "none";
        canvas.appendChild(rect);
        animate(rect, start, duration, 'expand-left-to-right');

    } else {
        rect.style.display = "none";
        canvas.appendChild(rect);
        animate(rect, start, duration, 'expand-top-to-bottom');
    }

    rect.classList.add(line.color);
}

function animate(element, start, duration, cssClass) {

    setTimeout(function(){
        element.classList.add(cssClass);
        element.style['animation-duration'] = (duration / 1000) + "s";
        element.style.display = "";
    }, start);
}

function drawPlane(canvas, area, start, duration) {

    var rect = createRectangle();

    rect.classList.add("plane");

    rect.style.top = area.top + '%';
    rect.style.left = area.left + '%';

    rect.style.height = (area.bottom - area.top) + '%';
    rect.style.width = (area.right - area.left) + "%";

    rect.classList.add(area.color);

    rect.style.display = 'none';
    canvas.appendChild(rect);

    animate(rect, start, duration, 'expand-bottom-to-top');
}
