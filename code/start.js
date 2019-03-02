
var tearDownAnimations = [
    tearDownAnimation1,
    tearDownAnimation2,
    tearDownAnimation3,
    tearDownAnimation4
];

var tearDownAnimationIndex = 0;
var state = "running";
var stateChangeListeners = [];
var nextFrameTimer = null;
var tearDownAnimationTimer = null;

function start(borderEementId, stateElementId) {

    var border = document.getElementById(borderEementId);
    var stateButton = document.getElementById(stateElementId);

    stateButton.focus();

    stateButton.onclick = function() { processStateButtonClick() };

    window.onresize = function(){ resize(border) };

    window.onpopstate = function() { setTimeout(function () {

        var frame = loadFrameFromLocation(document.location.href);
        if (frame) {
            setState("paused");
            animateFrame(border, frame, true);
        }
    })};

    stateChangeListeners.push(function(newState){
        if (newState === "running") {
            animateRandomFrame(border);
            stateButton.classList.remove("play");
        } else {
            stopExistingAnimation();
            stateButton.classList.add("play")
        }
    });

    document.addEventListener("keydown", function (event) {
        var key = event.key;

        if (key === "ArrowLeft") {
            history.go(-1);
        } else if (key === "ArrowRight") {
            history.go(1);
        } else if (key === " ") {
            processStateButtonClick();
            event.preventDefault();
        }
    });

    resize(border);

    var frame = loadFrameFromLocation(window.location.href);

    if (frame) {
        setState("paused");
        animateFrame(border, frame, true);
    } else {
        animateRandomFrame(border);
    }
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

function loadFrameFromLocation(location) {

    var frame = null;

    var matches = location.match(/\?frame=(.*)/);
    if (matches && typeof matches[1] !== "undefined") {
        var encodedFrame = matches[1];
        frame = urlDecodeFrame(encodedFrame);
    }

    return frame;
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

    animateFrame(border, frame, false);
}

function stopExistingAnimation() {
    if (nextFrameTimer) {
        clearTimeout(nextFrameTimer);
    }
    if (tearDownAnimationTimer) {
        clearTimeout(tearDownAnimationTimer);
    }
}

function animateFrame(border, frame, singleFrame) {

    var canvas = createRectangle('canvas');
    var title = "Composition with " + frame.all.length + " elements";

    document.title = title;

    // remove old canvas
    border.innerHTML = "";

    // stop any scheduled frames
    stopExistingAnimation();

    // create new canvas
    border.appendChild(canvas);

    // select the animation
    var tearDownAnimation = tearDownAnimations[tearDownAnimationIndex](canvas, frame);

    tearDownAnimationIndex = (tearDownAnimationIndex === tearDownAnimations.length - 1) ? 0 : tearDownAnimationIndex + 1;

    var elementDuration = singleFrame ? 50 : 500;
    var holdDuration = 3000;
    var buildDuration = (frame.all.length * elementDuration);
    var interFrameDuration = 1000;
    var tearDownAnimationDuration = tearDownAnimation.duration;
    var fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;

    // dev mode
    if (1) {
         elementDuration = 100;
         holdDuration = 500;
         buildDuration = (frame.all.length * elementDuration);
         interFrameDuration = 100;
         tearDownAnimationDuration = 500;
         fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;
    }

    // draw the picture on the canvas
    var lookup = draw(canvas, frame, elementDuration);

    if (singleFrame) {
        return;
    }

    tearDownAnimationTimer = setTimeout(function () {
        tearDownAnimation(lookup);
    }, buildDuration + holdDuration);

    nextFrameTimer = setTimeout(function () {
        animateRandomFrame(border)
    }, fullDuration);
}
