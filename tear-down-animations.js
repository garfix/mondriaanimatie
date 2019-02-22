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

        element.style.left = from  + "%";

        canvas.appendChild(element);

        element.style.transition = 'left ' + (duration / 500) + 's';

        setTimeout(function(){
            element.style.left = to + "%";
        }, start)
    }

    f.duration = shutterCount  * duration;

    return f;
}