function tearDownAnimation1(canvas) {

    const duration = 100;

    var f = function() {
        var count = canvas.childNodes.length;

        for (var i = 0; i < count; i++) {

            var element = canvas.childNodes[count - 1 - i];

            hideElement(element, i * duration);
        }
    };

    f.duration = canvas.childNodes.length * duration;

    return f;
}

function tearDownAnimation2() {

    const shutterCount = 5;
    const duration = 500;

    var f = function() {

        const shutterHeight = 100 / shutterCount;

        for (var i = 0; i < shutterCount; i++) {
            var shutter = createRectangle();
            shutter.classList.add('shutter');
            shutter.style.width = "100%";
            shutter.style.height = shutterHeight + "%";
            shutter.style.top = (i * shutterHeight) + "%";

            var from = (i % 2) === 0 ? "-100" : "100";
            var start = (i * 500);
            var duration = 500;
            moveShutter(shutter, from, "0", start, duration)
        }
    };

    function moveShutter(element, from, to, start, duration) {

        element.style.left = to  + "%";
        element.style.display = "none";
        canvas.appendChild(element);

        if (from === "-100") {
            animate(element, start, duration, 'move-from-left-to-right');
        } else {
            animate(element, start, duration, 'move-from-right-to-left');
        }
    }

    f.duration = shutterCount  * duration;

    return f;
}

function tearDownAnimation3(canvas) {

    const duration = 500;

    var f = function() {

        setTimeout(function(){
            canvas.style.transform = "translateX(-100%)";
        }, 1);

        animate(canvas, 0, duration, 'move-from-right-to-left-2');
    };

    f.duration = duration;

    return f;
}