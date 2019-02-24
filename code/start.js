
function start(borderEementId) {

    var border = document.getElementById(borderEementId);

    resize();
    window.onresize = resize;

    nextFrame(border);
}

function nextFrame(border) {

    var canvas = createRectangle();
    canvas.classList.add('canvas');

    // remove old canvas
    while (border.firstChild) {
        border.removeChild(border.firstChild);
    }

    // create new canvas
    border.appendChild(canvas);

    // create a new frame and animation
    var frame = createRandomFrame();
    var tearDownAnimation = createRandomTearDownAnimation(canvas);

    var elementDuration = 100;
    var holdDuration = 1000;
    var buildDuration = (frame.all.length * elementDuration);
    var interFrameDuration = 1000;
    var tearDownAnimationDuration = tearDownAnimation.duration;
    var fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;

    build(canvas, frame, elementDuration);

    setTimeout(function () {
        tearDownAnimation();
    }, buildDuration + holdDuration);

    setTimeout(function () {
        nextFrame(border)
    }, fullDuration);
}

function resize() {
    var minSize = Math.min(window.innerWidth, window.innerHeight);

    border.style.width = minSize + 'px';
    border.style.height = minSize + 'px';
}

function createRandomTearDownAnimation(canvas) {
    var r = random(1, 3);

//var r = 2;

    if (r === 1) {
        return tearDownAnimation1(canvas);
    } else if (r === 2) {
        return tearDownAnimation2(canvas);
    } else if (r === 3) {
        return tearDownAnimation3(canvas);
    }
}
