
let styleElementConfigurations = [];

const defaultStyleConfig = {
    "thick-lines": false,
    "double-lines": false,
    "grid": false,
    "white-lines": false,
    "colored-lines": false,
    "tape": false,
};

const styleOrder = [
    "plain",
    "grid",
    "double-lines",
    "thick-lines",
    "colored-lines",
    "white-lines",
    "tape",
];

function createRandomFrame() {

    if (styleElementConfigurations.length === 0) {
        styleElementConfigurations = buildStyleElementConfigurations();
    }

    let styleElementConfiguration = styleElementConfigurations.shift();

console.log(styleElementConfiguration);

    let instructions = createInstructionsFromStyleElementConfiguration(styleElementConfiguration);

    return createFrameFromInstructions(instructions, styleElementConfiguration);
}

function buildStyleElementConfigurations() {

    let configs = [];

    let baseElements = styleOrder.slice(0);

    for (let i = 0 ; i < baseElements.length; i++) {

        let baseElement = baseElements[i];

        // config with just style element X
        let config = Object.assign({}, defaultStyleConfig);
        config[baseElement] = true;
        configs.push(config);

        // pick 3 random other style elements
        let others1 = removeFromArray(Object.keys(defaultStyleConfig), baseElement);
        shuffleArray(others1);
        others1 = others1.slice(0, 3);

        // create a random order to remove these elements
        let others2 = others1.slice(0);
        shuffleArray(others2);

        let others1Length = others1.length;
        let others2Length = others2.length;

        for (let j = 0; j < others1Length; j++) {
            config = Object.assign({}, config);
            config[others1.pop()] = true;
            configs.push(config);
        }

        for (let j = 0; j < others2Length; j++) {
            config = Object.assign({}, config);
            config[others2.pop()] = false;
            configs.push(config);
        }
    }

    return configs;
}

function createInstructionsFromStyleElementConfiguration(config) {

    // create a set of instructions
    let instructions = [];
    let doubleLinesCount = 0;
    let doubleLinesSpec = random(1, 5);

    // each painting has at least a horizontal and a vertical line
    if (config["double-lines"] && doubleLinesSpec <= 3) {
        instructions.push('double-horizontal-line');
        doubleLinesCount++;
    } else {
        instructions.push('horizontal-line');
    }
    if (config["double-lines"] && doubleLinesSpec >= 3) {
        instructions.push('double-vertical-line');
        doubleLinesCount++;
    } else {
        instructions.push('vertical-line');
    }

    // create up to 11 lines total
    let minLineCount = config['grid'] ? 12 : 0;
    let maxLineCount = config['grid'] ? 23 : 9;
    let lineInstructions = getLineInstructions(random(minLineCount, maxLineCount - doubleLinesCount));
    instructions = instructions.concat(lineInstructions);

    // add the standard hor and vert lines
    lineCount = lineInstructions.length + 2;

    // mix required lines with optional lines
    if (doubleLinesCount === 0) {
        shuffleArray(instructions);
    }

    // add up to 5 planes between the lines, somewhere at the end
    let maxPlaneCount = config['grid'] ? 10 : 5;
    let planeInstructions = getPlaneInstructions(maxPlaneCount);
    instructions = instructions.concat(planeInstructions);

    // a minimum of lines is present in paintings with steps
    if (lineCount >= 8) {
        // add steps in up to 2 rooms
        let stepsCount = random(0, 2);
        for (let i = 0; i < stepsCount; i++) {
            instructions.push('steps');
        }
    }

    return instructions;
}


function createFrameFromInstructions(instructions, config) {

    const defaultLineThickness = 2;

    let frame = {
        all: [],
        backgroundColor: "none"
    };

    // default room: entire canvas
    let rooms = [
        { left: 0, right: 100, top: 0, bottom: 100, color: 'none' }
    ];

    let minimumLineDistance = 6;
    let planeColors = [];
    let colorVariations = ['none', 'darker', 'lighter'];
    let lines = [];

    shuffleArray(planeColors);
    shuffleArray(colorVariations);

    // add grey background
    if (config["white-lines"]) {
        frame.backgroundColor = "grey";
    }

    // add frame borders
    lines.push({ type: 'line', orientation: 'horizontal', pos: 0, start: 0, end: 100, width: 0, color: 'none'});
    lines.push({ type: 'line', orientation: 'horizontal', pos: 100, start: 0, end: 100, width: 0, color: 'none'});
    lines.push({ type: 'line', orientation: 'vertical', pos: 0, start: 0, end: 100, width: 0, color: 'none'});
    lines.push({ type: 'line', orientation: 'vertical', pos: 100, start: 0, end: 100, width: 0, color: 'none'});

    // the thickness of lines
    let horizontalLineThickness = defaultLineThickness;
    let verticalLineThickness = defaultLineThickness;
    // one in five paintings uses thicker horizontal lines
    if (config["thick-lines"]) {
        horizontalLineThickness = pickFromArray([3, 3.5, 4]);
    }

    let useTape = config['tape'];

    for (let i = 0; i < instructions.length; i++) {

        let instruction = instructions[i];

        let lineColor = "black";

        if (config["colored-lines"]) {
            lineColor = pickFromArray(["yellow", "yellow", "red", "red", "blue"]);
        }
        if (config["white-lines"]) {
            lineColor = pickFromArray(["yellow", "red", "blue", "white", "white", "black"]);
        }

        if (instruction === 'double-horizontal-line') {
            let line = createLine(lines, 'horizontal', minimumLineDistance, defaultLineThickness, lineColor, useTape);
            if (line) {
                line.start = 0; line.end = 100;
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);

                let secondLine = Object.assign({}, line);
                secondLine.pos += line.pos < 90 ? (2 * defaultLineThickness) : (-2 * defaultLineThickness);
                lines.push(secondLine);
                frame.all.push(secondLine);
                rooms = updateRooms(rooms, secondLine);
            }

        } else if (instruction === 'double-vertical-line') {
            let line = createLine(lines, 'vertical', minimumLineDistance, defaultLineThickness, lineColor, useTape);
            if (line) {
                line.start = 0;
                line.end = 100;
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);

                let secondLine = Object.assign({}, line);
                secondLine.pos += line.pos < 90 ? (2 * defaultLineThickness) : (-2 * defaultLineThickness);
                lines.push(secondLine);
                frame.all.push(secondLine);
                rooms = updateRooms(rooms, secondLine);
            }

        } else if (instruction === 'horizontal-line') {
            // exceptions to general thickness
            let thickness = (random(1, 4) === 1) ? defaultLineThickness : horizontalLineThickness;
            let line = createLine(lines, 'horizontal', minimumLineDistance, thickness, lineColor, useTape);
            if (line) {
                if (config['grid']) {
                    line.start = 0;
                    line.end = 100;
                }
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);
            }
        } else if (instruction === 'vertical-line') {
            let line = createLine(lines, 'vertical', minimumLineDistance, verticalLineThickness, lineColor, useTape);
            if (line) {
                if (config['grid']) {
                    line.start = 0;
                    line.end = 100;
                }
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);
            }
        } else if (instruction === 'plane') {
            let roomIndex = pickARoomForAPlane(rooms);
            if (roomIndex !== false) {
                let room = rooms[roomIndex];
                let plane = createPlane(room);

                let result = pickAPlaneColor(planeColors, room);
                plane.color = result.color;
                planeColors = result.planeColors;
                plane.colorVariation = colorVariations[0];

                frame.all.push(plane);

                room.color = plane.color;
                rooms = replaceRoom(rooms, roomIndex, room);
            }
        } else if (instruction === 'steps') {
            let result = pickARoomForSteps(rooms);
            if (result) {
                let roomIndex = result[0];
                let orientation = result[1];
                let room = rooms[roomIndex];
                let steps = createRandomSteps(room, orientation, colorVariations[0]);
                frame.all.push(steps);
                room['has-steps'] = true;
            }
        }
    }

    return frame;
}

function getLineInstructions(n) {
    let instructions = [];
    let lineCount = random(0, n);
    for (let i = 0; i < lineCount; i++) {
        let r = random(1, 2);
        if (r === 1) {
            instructions.push('horizontal-line');
        } else {
            instructions.push('vertical-line');
        }
    }
    return instructions;
}

function getPlaneInstructions(n) {
    let instructions = [];
    let planeCount = random(0, n);
    for (let i = 0; i < planeCount; i++) {
        let position = random(Math.max(0, instructions.length - 2), instructions.length);
        instructions.splice(position, 0, 'plane');
    }
    return instructions;
}
