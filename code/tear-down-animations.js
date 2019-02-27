function tearDownAnimation1(canvas, frame) {

    const duration = 100;

    var f = function() {
        var count = canvas.childNodes.length;

        for (var i = 0; i < count; i++) {

            var element = canvas.childNodes[count - 1 - i];

            fadeOut(element, i * duration, duration);
        }
    };

    f.duration = frame.all.length * duration;

    return f;
}

function tearDownAnimation2(canvas, frame) {

    const shutterCount = 5;
    const duration = 500;

    var f = function() {

        const shutterHeight = 100 / shutterCount;

        for (var i = 0; i < shutterCount; i++) {

            var shutter = createRectangle('shutter');
            shutter.style.width = "100%";
            shutter.style.height = shutterHeight + "%";
            shutter.style.top = (i * shutterHeight) + "%";

            var from = (i % 2) === 0 ? "-100" : "100";
            var start = (i * 500);
            var duration = 500;

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

    var f = function() {

        moveHorizontal(canvas, 0, -100, 0, duration);
    };

    f.duration = duration;

    return f;
}

function tearDownAnimation4(canvas, frame) {

    const duration = 1500;

    var f = function() {

        for (var i = 0; i < frame.all.length; i++) {

            var element = frame.all[i];
            var node = canvas.childNodes[i];

            if (element.type === "plane") {
                moveVertical(node, element.top, 125, 700, 200);
            } else if (element.type === "line") {
                if (element.orientation === "horizontal") {
                    moveHorizontal(node, element.piece[0], 100, 0, 500);
                } else {
                    fadeOut(node, 1300, 200)
                }
            }

        }
    };

    f.duration = duration;

    return f;
}
