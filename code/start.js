
var tearDownAnimations = [
    tearDownAnimation1,
    tearDownAnimation2,
    tearDownAnimation3,
    tearDownAnimation4
];

var tearDownAnimationIndex = 0;
var state = "running";
var stateChangeListeners = [];

function start(borderEementId, stateElementId) {

    var border = document.getElementById(borderEementId);
    var stateButton = document.getElementById(stateElementId);

    stateButton.focus();

    stateButton.onclick = function() { processStateButtonClick() };

    window.onresize = function(){ resize(border) };

    window.onpopstate = function() { setTimeout(function () {

        border.innerHTML = "";

        setState("paused");

        loadFrameFromLocation(border, document.location.href)
    })};

    stateChangeListeners.push(function(newState){
        if (newState === "running") {
            animateRandomFrame(border);
            stateButton.classList.remove("play");
        } else {
            stateButton.classList.add("play")
        }
    });

    resize(border);
    loadFrameFromLocation(border, window.location.href);
}

function processStateButtonClick() {
    if (state === "running") {
        setState("paused");
    } else {
        setState("running");
    }
}

function setState(newState) {

    if (state === newState) {
        return;
    }

    state = newState;

    for (var i = 0; i < stateChangeListeners.length; i++) {
        stateChangeListeners[i](state);
    }
}

function loadFrameFromLocation(border, location) {

    var frame = null;

    var matches = location.match(/\?frame=(.*)/);
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

    // update url
    var urlEncodedFrame = urlEncodeFrame(frame);
    history.pushState(null, window.location.pathname, "?frame=" + urlEncodedFrame);

    animateFrame(border, frame);
}

function animateFrame(border, frame) {

    var canvas = createRectangle('canvas');

    document.title = "Composition with " + frame.all.length + " elements";

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
         elementDuration = 100;
         holdDuration = 500;
         buildDuration = (frame.all.length * elementDuration);
         interFrameDuration = 100;
         tearDownAnimationDuration = 500
         fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;
    }

    // draw the picture on the canvas
    var lookup = draw(canvas, frame, elementDuration);

    setTimeout(function () {

        if (state === "paused") {
            return;
        }

        tearDownAnimation(lookup);
    }, buildDuration + holdDuration);

    setTimeout(function () {

        if (state === "paused") {
            return;
        }

        animateRandomFrame(border)
    }, fullDuration);
}
