function draw(canvas, frame, duration) {

    let lookup = [];
    let transparent = false;
    let suppressTransparency = false;

    if (frame.backgroundColor !== "none") {
        canvas.classList.add(frame.backgroundColor);
        canvas.classList.add("light");
        transparent = true;
    }

    for (let i = 0; i < frame.all.length; i++) {
        let element = frame.all[i];
        if (element.type === "line" && element.color !== 'black') {
            transparent = true;
        }
        if (element.checkered) {
            suppressTransparency = true;
        }
    }

    if (transparent && !suppressTransparency) {
        canvas.classList.add("add-transparency");
    }

    for (let i = 0; i < frame.all.length; i++) {

        let element = frame.all[i];
        let start = i * duration;

        if (element.type === 'line') {
            let rect = drawLine(canvas, lookup, element, start, duration);

            if (element.checkered) {
                drawCheckers(element, rect, frame.all);
            }

        } else if (element.type === 'plane') {

            if (element.checkered) {
                drawNestedPlanes(canvas, lookup, element, start, duration);
            } else {
                drawPlane(canvas, lookup, element, start, duration);
            }

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

    return rect;
}

function drawCheckers(line, lineRect, allElements) {

    let lineLength = (line.end - line.start);
    let unit = 100 / (lineLength / line.width);
    let sortedLines = sortLines(allElements);

    let orthoLines;
    let colors = [];

    if (line.orientation === "horizontal") {
        orthoLines = sortedLines.vertical;
    } else {
        orthoLines = sortedLines.horizontal;
    }
    orthoLines.push({pos: 100, width: 0});

    let pos = 2 * Math.random() * unit;

    for (let i = 0; i < orthoLines.length; i++) {

        let orthoLine = orthoLines[i];
        let nextCrossingPos = orthoLine.pos - orthoLine.width / 2;
        let width = (1 + 0.25 * Math.random()) * unit;

        while (pos + width <= nextCrossingPos) {

            let distance = pickFromArray([0, width, 2 * width]);

            drawChecker(lineRect, pos, width, line.orientation, colors);

            pos += width + distance;
        }

        let orthoUnit = 100 / (lineLength / orthoLine.width);

        drawChecker(lineRect, nextCrossingPos, orthoUnit, line.orientation, colors);

        pos = nextCrossingPos + orthoUnit + pickFromArray([0, width]);
    }
}

function drawChecker(lineRect, pos, width, orientation, colors) {

    if (colors.length === 0) {
        colors.push('grey'); colors.push('blue'); colors.push('red');
        shuffleArray(colors);
    }

    color = colors.pop();

    let checker = createRectangle("checker");

    if (orientation === "horizontal") {
        checker.style.left = pos + '%';
        checker.style.top = '0';
        checker.style.width = width + '%';
        checker.style.height = '100%';
    } else {
        checker.style.left = '0';
        checker.style.top = pos + '%';
        checker.style.width = '100%';
        checker.style.height = width + '%';
    }

    checker.classList.add(color);
    lineRect.appendChild(checker);
}

function drawPlane(canvas, lookup, plane, start, duration) {

    let rect = createRectangle("plane");

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

function drawNestedPlanes(canvas, lookup, plane, start, duration) {

    const secondPlaneWidth = 9;
    const secondPlaneHeight = 10;

    let colors = ["red", "blue", "grey", "yellow"];

    colors = removeFromArray(colors, plane.color);

    let left = parseInt(plane.left);
    let right = parseInt(plane.right);
    let top = parseInt(plane.top);
    let bottom = parseInt(plane.bottom);

    let width = right - left;
    let height = bottom - top;

    let rect;

    if (width < 9) {
        return;
    }

    if (height < 10) {
        return;
    }

    // first plane
    left += Math.random() * (width - secondPlaneWidth);
    right = left + secondPlaneWidth;
    top += (height - secondPlaneHeight) / 2;
    bottom = top + secondPlaneHeight;

    rect = createNestedPlane(plane, plane.color, plane.colorVariation, colors, left, top, right, bottom);
    rect.style.visibility = "hidden";
    canvas.appendChild(rect);
    lookup.push(plane);
    expandBottomToTop(rect, plane.top, plane.bottom, start, duration);

    // second plane
    color = pickFromArray(colors);
    colors = removeFromArray(colors, color);

    left = 0;
    right = 100;
    let newHeight = (secondPlaneHeight / height) * 100;
    top = 50 - newHeight / 2;
    bottom = 50 + newHeight / 2;
    let secondRect = createNestedPlane(plane, color, plane.colorVariation, colors, left, top, right, bottom);
    rect.appendChild(secondRect);

    // third plane
    color = pickFromArray(colors);
    colors = removeFromArray(colors, color);

    left = 20;
    right = 80;
    top = 30;
    bottom = 70;
    let thirdRect = createNestedPlane(plane, color, plane.colorVariation, colors, left, top, right, bottom);
    secondRect.appendChild(thirdRect);

}

function createNestedPlane(plane, color, colorVariation, colors, left, top, right, bottom) {

    let rect = createRectangle("plane");

    rect.style.top = top + '%';
    rect.style.left = left + '%';

    rect.style.height = (bottom - top) + '%';
    rect.style.width = (right - left) + "%";

    rect.classList.add(color);
    rect.classList.add(colorVariation);

    return rect;
}

function drawSteps(canvas, lookup, steps, start, duration) {

    for (let i = 0; i < steps.elements.length; i++) {

        let step = steps.elements[i];
        let rect = createRectangle("step");

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