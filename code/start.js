
var tearDownAnimations = [
    tearDownAnimation1,
    tearDownAnimation2,
    tearDownAnimation3,
    tearDownAnimation4
];

var tearDownAnimationIndex;

function start(borderEementId) {

    var border = document.getElementById(borderEementId);

    resize(border);
    window.onresize = function(){ resize(border) };

    tearDownAnimationIndex = 0;

    nextFrame(border);
}

function resize(border) {
    var minSize = Math.min(window.innerWidth, window.innerHeight);

    border.style.width = minSize + 'px';
    border.style.height = minSize + 'px';
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
    var tearDownAnimation = tearDownAnimations[tearDownAnimationIndex](canvas, frame);

    // choose the next animation
    tearDownAnimationIndex++;
    if (tearDownAnimationIndex === tearDownAnimations.length) {
        tearDownAnimationIndex = 0;
    }

    var elementDuration = 500;
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
