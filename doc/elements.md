# Elements

Each Mondriaan painting consists of the following elements:

- The canvas
- The frame
- The Background color
- Lines
- Rooms
- Planes
- Steps

All of these are rectangles, but their characteristics differ.

### The canvas

The canvas is the surface on which all other elements are displayed

### The frame

The frame is the border of the painting, it is usually square, but there are some rectangular ones.

Some frames are diamond-shaped.

It can be useful to consider the frame as a set of four lines with zero thickness, or as a single room.

### The background color

The canvas often has a light background color that shows through when no other elements are visible.

### Lines

Aspects of lines

* thickness: some are thinner, others ticker
* lines of different thicknesses may appear in the same painting
* color: black, red, yellow, blue, white (each of them has several shades)
* orientation: horizontal, vertical
* a starting point and an end point

Each line may start

* on another line
* on the frame
* close to the frame (line-with-a-gap)

Types of lines

* a frame-to-frame line that intersects the canvas
* a line-to-frame line
* a line-to-line line

Combinations

* a double-line is a combination of two lines close-by

Restrictions

* A painting has at least one frame-to-frame line
* A painting has at least one horizontal and one vertical line
* There is a minimum distance between two lines
* There is a minimum distance between a line and the frame parallel to it

### Rooms

A room is the space bordered by two two horizontal and two vertical lines, not intersected by another line.

### Planes

A plane is a colored rectangle bordered by lines.

Aspects of planes

* color hue: black, red, yellow, blue, grey
* color chroma (brightness): colors vary from somewhat bright (mixed with some grey) to very bright
* color lightness: the lightness (or value) of the colors is different in different paintings but the colors within a single painting must have the same lightness
* a plane is bound by a line or a frame on each side
* a plane may be crossed by lines

Types of planes

* A plane-bordering-a-frame
* A plane-not-bordering-a-frame

Restrictions

* planes do not overlap
* when a plane is bordered by a line-with-a-gap, the plane may extend to the start of the gapped lines, to the end of it, or somewhere halfway
* when a painting has only a few planes, they all differ in color. Only when we're out of unique colors, duplicate colors kick in

### Steps

A step is a colored rectangle inside a room. It does not have borders on all sides.
I named them like this because they look like the steps of a ladder.

Aspects of steps

* color: red, yellow, blue
* One or more steps are located inside a plane-bordering-a-frame

Restrictions

* Steps do not touch
* Two steps next to each other have different colors
* A room with steps may not be crossed by a line
