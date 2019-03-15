
function createFrameFromInstructions(instructions, config) {

    let defaultLineThickness = 2;

    if (config.paintingType === "thin-grid") {
        defaultLineThickness = 0.5;
    }

    let frame = {
        all: [],
        backgroundColor: "none",
        paintingType: config.paintingType
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

    let colorVariation = colorVariations[0];

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
    let thickLineThickness = defaultLineThickness;

    if (config["thick-lines"]) {
        thickLineThickness *= pickFromArray([1.5, 1.75, 2]);
    }

    let useTape = config['tape'];
    let checkered = config.paintingType === "boogie-woogie";

    let gridHorPos = 0;
    let gridVertPos = 0;

    for (let i = 0; i < instructions.length; i++) {

        let instruction = instructions[i];

        let lineColor = "black";

        if (config.paintingType === "new-york" || config.paintingType === "sparse-colored") {
            lineColor = pickFromArray(["yellow", "yellow", "red", "red", "blue", "blue", "black"]);
        }
        if (config["white-lines"]) {
            if (i === 0) {
                lineColor = "white";
            } else {
                lineColor = pickFromArray([lineColor, "white", "white"]);
            }
        }

        if (checkered) {
            lineColor = "yellow";
        }
        if (config.paintingType === "thin-grid") {
            lineColor = "grey";
        }

        if (instruction === 'double-horizontal-line') {
            let line = createLine(lines, 'horizontal', minimumLineDistance, defaultLineThickness, lineColor, colorVariation, useTape, checkered);
            if (line) {
                line.start = 0; line.end = 100;
                if (config.paintingType === 'thin-grid') {
                    line.pos = 10 * gridHorPos++;
                }
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
            let line = createLine(lines, 'vertical', minimumLineDistance, defaultLineThickness, lineColor, colorVariation, useTape, checkered);
            if (line) {
                line.start = 0;
                line.end = 100;
                if (config.paintingType === 'thin-grid') {
                    line.pos = 10 * gridVertPos++;
                }
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
            let thickness = (random(1, 4) === 1) ? defaultLineThickness : thickLineThickness;
            let line = createLine(lines, 'horizontal', minimumLineDistance, thickness, lineColor, colorVariation, useTape, checkered);
            if (line) {
                if (config.paintingType === 'thin-grid' || config.paintingType === 'new-york') {
                    line.start = 0;
                    line.end = 100;
                }
                if (config.paintingType === 'thin-grid') {
                    line.pos = 10 * gridHorPos++;
                }
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);
            }
        } else if (instruction === 'vertical-line') {
            let line = createLine(lines, 'vertical', minimumLineDistance, defaultLineThickness, lineColor, colorVariation, useTape, checkered);
            if (line) {
                if (config.paintingType === 'thin-grid' || config.paintingType === 'new-york') {
                    line.start = 0;
                    line.end = 100;
                }
                if (config.paintingType === 'thin-grid') {
                    line.pos = 10 * gridVertPos++;
                }
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);
            }
        } else if (instruction === 'plane') {
            let roomIndex = pickARoomForAPlane(rooms);
            if (roomIndex !== false) {
                let room = rooms[roomIndex];
                let plane = createPlane(room, checkered);

                let result = pickAPlaneColor(planeColors, room);
                plane.color = result.color;
                planeColors = result.planeColors;
                plane.colorVariation = colorVariation;

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
                let steps = createRandomSteps(room, orientation, colorVariation);
                frame.all.push(steps);
                room['has-steps'] = true;
            }
        }
    }

    return frame;
}
