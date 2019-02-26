
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

    // create a new frame
    var frame = createRandomFrame();

    // select the animation
    var tearDownAnimation = tearDownAnimations[tearDownAnimationIndex](canvas, frame);

    tearDownAnimationIndex = (tearDownAnimationIndex === tearDownAnimations.length - 1) ? 0 : tearDownAnimationIndex + 1;

    var elementDuration = 500;
    var holdDuration = 3000;
    var buildDuration = (frame.all.length * elementDuration);
    var interFrameDuration = 1000;
    var tearDownAnimationDuration = tearDownAnimation.duration;
    var fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;

    // dev mode
    if (0) {
         elementDuration = 100;
         holdDuration = 100;
         buildDuration = (frame.all.length * elementDuration);
         interFrameDuration = 100;
         tearDownAnimationDuration = 500
         fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;
    }

    // draw the picture on the canvas
    draw(canvas, frame, elementDuration);

    setTimeout(function () {
        tearDownAnimation();
    }, buildDuration + holdDuration);

    setTimeout(function () {
        nextFrame(border)
    }, fullDuration);
}
