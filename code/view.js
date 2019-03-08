function draw(canvas, frame, duration) {

    let lookup = [];

    if (frame.backgroundColor) {
        canvas.classList.add(frame.backgroundColor);
        canvas.classList.add("light");
    }

    for (let i = 0; i < frame.all.length; i++) {

        let element = frame.all[i];
        let start = i * duration;

        if (element.type === 'line') {
            drawLine(canvas, lookup, element, start, duration);
        } else if (element.type === 'plane') {
            drawPlane(canvas, lookup, element, start, duration);
        } else if (element.type === 'steps') {
            drawSteps(canvas, lookup, element, start, duration);
        }
    }

    return lookup;
}

function createRectangle(className)
{
    let rect = document.createElement('div');

    rect.classList.add(className);

    return rect;
}

function drawLine(canvas, lookup, line, start, duration) {

    let rect = createRectangle("line");

    if (line.orientation === 'horizontal') {

        rect.style.left = line.start + '%';
        rect.style.width = (line.end - line.start) + '%';

        rect.style.top = line.pos - (line.width / 2) + '%';
        rect.style.height = line.width + "%";

    } else {

        rect.style.top = line.start + '%';
        rect.style.height = (line.end - line.start) + '%';

        rect.style.left = line.pos - (line.width / 2) + '%';
        rect.style.width = line.width + "%";
    }

    rect.style.visibility = "hidden";
    canvas.appendChild(rect);

    lookup.push(line);

    if (line.orientation === 'horizontal') {
        expandLeftToRight(rect, line.start, line.end, start, duration);
    } else {
        expandTopToBottom(rect, line.start, line.end, start, duration);
    }

    rect.classList.add(line.color);

    if (line.useTape) {
        rect.classList.add("tape");
    }
}

function drawPlane(canvas, lookup, plane, start, duration) {

    let rect = createRectangle("plane");

    rect.setAttribute('mondriaan-element-type', "plane");

    rect.style.top = plane.top + '%';
    rect.style.left = plane.left + '%';

    rect.style.height = (plane.bottom - plane.top) + '%';
    rect.style.width = (plane.right - plane.left) + "%";

    rect.classList.add(plane.color);
    rect.classList.add(plane.colorVariation);

    rect.style.visibility = "hidden";

    canvas.appendChild(rect);

    lookup.push(plane);

    expandBottomToTop(rect, plane.top, plane.bottom, start, duration);
}

function drawSteps(canvas, lookup, steps, start, duration) {

    for (let i = 0; i < steps.elements.length; i++) {

        let step = steps.elements[i];
        let rect = createRectangle("step");

        rect.setAttribute('mondriaan-element', step);

        rect.style.top = step.top + '%';
        rect.style.left = step.left + '%';

        rect.style.height = (step.bottom - step.top) + '%';
        rect.style.width = (step.right - step.left) + "%";

        rect.classList.add(step.color);
        rect.classList.add(step.colorVariation);

        rect.style.visibility = "hidden";

        canvas.appendChild(rect);

        lookup.push(step);

        let stepDuration = duration / steps.elements.length;
        let stepStart = start + stepDuration * i;

        expandBottomToTop(rect, step.top, step.bottom, stepStart, stepDuration);
    }
}