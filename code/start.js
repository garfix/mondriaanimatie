
var tearDownAnimations = [
    tearDownAnimation1,
    tearDownAnimation2,
    tearDownAnimation3,
    tearDownAnimation4
];

var tearDownAnimationIndex;

function start(borderEementId) {

    var border = document.getElementById(borderEementId);
    var frame = null;

    resize(border);
    window.onresize = function(){ resize(border) };

    tearDownAnimationIndex = 0;

     var matches = window.location.href.match(/\?frame=(.*)/);
     if (matches && typeof matches[1] !== "undefined") {
         var encodedFrame = matches[1];
         frame = urlDecodeFrame(encodedFrame);
     }

    if (frame) {
        animateFrame(border, frame);

    } else {
        animateRandomFrame(border);
    }
}

function resize(border) {
    var minSize = Math.min(window.innerWidth, window.innerHeight);

    border.style.width = minSize + 'px';
    border.style.height = minSize + 'px';
}

function animateRandomFrame(border) {

    // create a new frame
    var frame = createRandomFrame();

    animateFrame(border, frame);
}

function animateFrame(border, frame) {

    var canvas = createRectangle('canvas');

    // remove old canvas
    while (border.firstChild) {
        border.removeChild(border.firstChild);
    }

    // create new canvas
    border.appendChild(canvas);

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
         elementDuration = 200;
         holdDuration = 1000;
         buildDuration = (frame.all.length * elementDuration);
         interFrameDuration = 100;
         tearDownAnimationDuration = 500
         fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;
    }

    // update url
    var urlEncodedFrame = urlEncodeFrame(frame);
    history.pushState(null, window.location.pathname, "?frame=" + urlEncodedFrame);

    // draw the picture on the canvas
    var lookup = draw(canvas, frame, elementDuration);

    setTimeout(function () {
       tearDownAnimation(lookup);
    }, buildDuration + holdDuration);

    setTimeout(function () {
        animateRandomFrame(border)
    }, fullDuration);
}
