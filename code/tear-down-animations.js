function tearDownAnimation1(canvas, frame) {

    const duration = 100;

    let f = function(lookup) {
        let count = canvas.childNodes.length;

        for (let i = 0; i < count; i++) {

            let element = canvas.childNodes[count - 1 - i];

            fadeOut(element, i * duration, duration);
        }
    };

    f.duration = frame.all.length * duration;

    return f;
}

function tearDownAnimation2(canvas, frame) {

    const shutterCount = 5;
    const duration = 500;

    let f = function(lookup) {

        const shutterHeight = 100 / shutterCount;

        for (let i = 0; i < shutterCount; i++) {

            let shutter = createRectangle('shutter');
            shutter.style.width = "100%";
            shutter.style.height = shutterHeight + "%";
            shutter.style.top = (i * shutterHeight) + "%";

            let from = (i % 2) === 0 ? "-100" : "100";
            let start = (i * 500);
            let duration = 500;

            shutter.style.visibility = "hidden";
            canvas.appendChild(shutter);

            moveHorizontal(shutter, from, "0", start, duration)
        }
    };

    f.duration = shutterCount  * duration;

    return f;
}

function tearDownAnimation3(canvas, frame) {

    const duration = 500;

    let f = function(lookup) {

        moveHorizontal(canvas, 0, -100, 0, duration);
    };

    f.duration = duration;

    return f;
}

function tearDownAnimation4(canvas, frame) {

    const duration = 1500;

    let f = function(lookup) {

        let count = canvas.childNodes.length;

        for (let i = 0; i < count; i++) {

            let node = canvas.childNodes[i];
            let element = lookup[i];

            if (element.type === "plane") {
                moveVertical(node, element.top, 125, 700, 200);
            } else if (element.type === "step") {
                moveVertical(node, element.top, 125, 700, 200);
            } else if (element.type === "line") {
                if (element.orientation === "horizontal") {
                    moveHorizontal(node, element.start, 100, 0, 500);
                } else {
                    fadeOut(node, 1300, 200)
                }
            }

        }
    };

    f.duration = duration;

    return f;
}

function tearDownAnimation5(canvas, frame) {

    const duration = 1500;

    let f = function(lookup) {

        let count = canvas.childNodes.length;

        for (let i = 0; i < count; i++) {

            let node = canvas.childNodes[i];
            let element = lookup[i];

            if (element.type === "plane") {
                expandFromCenter(node, 100, 0, 1000, 500);
            } else if (element.type === "step") {
                expandFromCenter(node, 100, 0, 1000, 500);
            } else if (element.type === "line") {
                if (element.orientation === "horizontal") {
                    if (element.pos < 50) {
                        moveVertical(node, element.pos, 105, 50 - element.pos, 1000);
                    } else {
                        moveVertical(node, element.pos, -5, element.pos - 50, 1000);
                    }
                } else {
                    if (element.pos < 50) {
                        moveHorizontal(node, element.pos, 105, 50 - element.pos, 1000);
                    } else {
                        moveHorizontal(node, element.pos, -5, element.pos - 50, 1000);
                    }
                }
            }

        }
    };

    f.duration = duration;

    return f;
}
