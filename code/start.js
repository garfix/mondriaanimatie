
let tearDownAnimations = [
    tearDownAnimation1,
    tearDownAnimation2,
    tearDownAnimation3,
    tearDownAnimation4
];

let devMode = false;

let tearDownAnimationIndex = 0;
let state = "running";
let stateChangeListeners = [];
let nextFrameTimer = null;
let tearDownAnimationTimer = null;

function start(borderEementId, stateElementId) {

    let border = document.getElementById(borderEementId);
    let stateButton = document.getElementById(stateElementId);

    stateButton.focus();

    // button: toggle state
    stateButton.onclick = function() { processStateButtonClick() };

    // resize: resize border size in pixels
    window.onresize = function(){ resize(border) };

    // back, forward browser buttons
    window.onpopstate = function() { setTimeout(function () {

        let frame = loadFrameFromLocation(document.location.href);
        if (frame) {
            setState("paused");
            animateFrame(border, frame, true);
        }
    })};

    // state change actions
    stateChangeListeners.push(function(newState){
        if (newState === "running") {
            animateRandomFrame(border);
            stateButton.classList.remove("play");
        } else {
            stopExistingAnimation();
            stateButton.classList.add("play")
        }
    });

    // left, right, space buttons
    document.addEventListener("keydown", function (event) {
        let key = event.key;

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

    // get frame from url
    let frame = loadFrameFromLocation(window.location.href);

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

    for (let i = 0; i < stateChangeListeners.length; i++) {
        stateChangeListeners[i](state);
    }
}

function loadFrameFromLocation(location) {

    let frame = null;

    let matches = location.match(/\?frame=(.*)/);
    if (matches && typeof matches[1] !== "undefined") {
        let encodedFrame = matches[1];
        frame = urlDecodeFrame(encodedFrame);
    }

    return frame;
}

function resize(border) {
    let minSize = Math.min(window.innerWidth, window.innerHeight) - 40;

    border.style.width = minSize + 'px';
    border.style.height = minSize + 'px';
}

function animateRandomFrame(border) {

    // create a new frame
    let frame = createRandomFrame();

    // update url
    let urlEncodedFrame = urlEncodeFrame(frame);
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

    let title = "Composition in M with " + frame.all.length + " elements";

    document.title = title;

    // remove old canvas
    border.innerHTML = "";

    // stop any scheduled frames
    stopExistingAnimation();

    // create new canvas
    let canvas = createRectangle('canvas');

    border.appendChild(canvas);

    // select the animation
    let tearDownAnimation = tearDownAnimations[tearDownAnimationIndex](canvas, frame);

    tearDownAnimationIndex = (tearDownAnimationIndex === tearDownAnimations.length - 1) ? 0 : tearDownAnimationIndex + 1;

    let elementDuration = singleFrame ? 50 : 500;
    let holdDuration = 3000;
    let buildDuration = (frame.all.length * elementDuration);
    let interFrameDuration = 1000;
    let tearDownAnimationDuration = tearDownAnimation.duration;
    let fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;

    // dev mode
    if (devMode) {
         elementDuration = 100;
         holdDuration = 500;
         buildDuration = (frame.all.length * elementDuration);
         interFrameDuration = 100;
         tearDownAnimationDuration = 500;
         fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;
    }

    // draw the picture on the canvas
    let lookup = draw(canvas, frame, elementDuration);

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
