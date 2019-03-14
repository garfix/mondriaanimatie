
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
    let minLineCount = 0;
    let maxLineCount = 9;

    // grid: much more lines
    if (config.paintingType === "boogie-woogie") {
        minLineCount = 16;
        maxLineCount = 24;
    } else if (config.paintingType === "new-york") {
        minLineCount = 12;
        maxLineCount = 23;
    } else if (config.paintingType === "thin-grid") {
        minLineCount = 30;
        maxLineCount = 30;
    }

    let lineInstructions = getLineInstructions(minLineCount, maxLineCount - doubleLinesCount);
    instructions = instructions.concat(lineInstructions);

    // add the standard hor and vert lines
    lineCount = lineInstructions.length + 2;

    // mix required lines with optional lines
    if (doubleLinesCount === 0) {
        shuffleArray(instructions);
    }

    // add up to 5 planes between the lines, somewhere at the end
    // grid: just 1 plane
    let minPlaneCount = 0;
    let maxPlaneCount = 5;

    if (config.paintingType === 'new-york') {
        maxPlaneCount = 1;
    } else if (config.paintingType === 'boogie-woogie') {
        minPlaneCount = lineCount / 2;
        maxPlaneCount = lineCount / 2;
    } else if (config.paintingType === 'thin-grid') {
        minPlaneCount = 225;
        maxPlaneCount = 225;
    } else if (config.paintingType === 'crowded') {
        maxPlaneCount = lineCount;
    }

    let planeInstructions = getPlaneInstructions(minPlaneCount, maxPlaneCount);
    instructions = instructions.concat(planeInstructions);

    // a minimum of lines is present in paintings with steps
    if (config.paintingType === 'sparse-colored' || config.paintingType === 'sparse-black')
    if (lineCount >= 8) {
        // add steps in up to 2 rooms
        let maxStepsCount = 5;
        let stepsCount = random(0, maxStepsCount);
        for (let i = 0; i < stepsCount; i++) {
            instructions.push('steps');
        }
    }

    return instructions;
}

function getLineInstructions(min, max) {
    let instructions = [];
    let lineCount = random(min, max);
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

function getPlaneInstructions(min, max) {
    let instructions = [];
    let planeCount = random(min, max);

    for (let i = 0; i < planeCount; i++) {
        let position = random(Math.max(0, instructions.length - 2), instructions.length);
        instructions.splice(position, 0, 'plane');
    }
    return instructions;
}
