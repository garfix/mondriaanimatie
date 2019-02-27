function draw(canvas, frame, duration) {

    for (var i = 0; i < frame.all.length; i++) {

        var element = frame.all[i];
        var start = i * duration;

        if (element.type === 'line') {
            drawLine(canvas, element, start, duration);
        } else if (element.type === 'plane') {
            drawPlane(canvas, element, start, duration);
        } else if (element.type === 'steps') {
            drawSteps(canvas, element, start, duration);
        }
    }
}

function createRectangle(className)
{
    var rect = document.createElement('div');

    rect.classList.add(className);

    return rect;
}

function drawLine(canvas, line, start, duration) {

    var rect = createRectangle("line");

    if (line.orientation === 'horizontal') {

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

    if (line.orientation === 'horizontal') {

        rect.style.visibility = "hidden";
        canvas.appendChild(rect);
        expandLeftToRight(rect, line.piece[0], line.piece[1], start, duration);

    } else {
        rect.style.visibility = "hidden";
        canvas.appendChild(rect);
        expandTopToBottom(rect, line.piece[0], line.piece[1], start, duration);
    }

    rect.classList.add(line.color);
}

function drawPlane(canvas, plane, start, duration) {

    var rect = createRectangle("plane");

    rect.style.top = plane.top + '%';
    rect.style.left = plane.left + '%';

    rect.style.height = (plane.bottom - plane.top) + '%';
    rect.style.width = (plane.right - plane.left) + "%";

    rect.classList.add(plane.color);
    rect.classList.add(plane.colorVariation);

    rect.style.visibility = "hidden";

    canvas.appendChild(rect);

    expandBottomToTop(rect, plane.top, plane.bottom, start, duration);
}

function drawSteps(canvas, steps, start, duration) {

    for (var i = 0; i < steps.elements.length; i++) {

        var step = steps.elements[i];
        var rect = createRectangle("step");

        rect.style.top = step.top + '%';
        rect.style.left = step.left + '%';

        rect.style.height = (step.bottom - step.top) + '%';
        rect.style.width = (step.right - step.left) + "%";

        rect.classList.add(step.color);
        rect.classList.add(step.colorVariation);

        rect.style.visibility = "hidden";

        canvas.appendChild(rect);

        var stepDuration = duration / steps.elements.length;
        var stepStart = start + stepDuration * i;

        expandBottomToTop(rect, step.top, step.bottom, stepStart, stepDuration);
    }
}