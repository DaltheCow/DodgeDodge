## DodgeDodge, A version of Cube Runner

### Background

Cube Runner is a time-based 3D driving game

The player moves forward at an incrementally increasing rate (speed increments each level). There are cubes that randomly spawn and the player has to use the arrow keys to steer around them. Score increases linearly with time.

### Functionality & MVP  

With this Cube Runner implementation, players will be able to:

- [ ] Smoothly move forward and steer left or right
- [ ] Cause a game ending collision if the flyer steers into a cube

In addition, this project will include:

- [ ] A menu with game rules and a short description
- [ ] A production README

### Wireframes

This app will consist of two main screens, a menu and game view, and will have nav links to the Github and my LinkedIn. The controls will be left and right arrow keys and also a pause key. The opening screen will be the game menu where it waits for a game to be started. There will be a start button in the middle which will launch the game view.

## Menu
[[/images/DodgeDodgeGame.png]]


## Gameplay
[[/images/DodgeDodgeMenu.png]]


### Architecture and Technologies

This project will be implemented with the following technologies:

- `JavaScript` for game logic,
- `three.js` for 3D rendering
- `Browserify` to bundle js files.

In addition to the entry file, there will be scripts involved in this project:

`board.js`: this script will handle the logic for creating and updating the necessary `three_d.js` elements and rendering them on the canvas.

`three_d.js`: this script will handle the logic behind the 3d rendering of objects. A `three_d.js` object will hold a `type` (cube, player) and position, and some other render related info.  It will be responsible for doing collision checks for each `three_d` upon iteration and updating the `three_d` array appropriately.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `three.js` installed. Write a basic entry file and the bare bones of all 3 scripts outlined above.  Learn the basics of `three.js`.  Goals for the day:

- Get a green bundle with `Browserify`
- Learn enough `three.js` to render an object to the `HTML5 canvas` element

**Day 2**: Dedicate this day to learning the `three.js` API.  First, build out the `three_d` object to connect to the `Board` object.  Then, use `board.js` to create and render the screen with the player in place and some blocks. Build in the ability to detect collisions for each `three_d` object.  Goals for the day:

- Render a cube and player to the `HTML5 Canvas` using `three.js`
- Make each cube collidable with the player

**Day 3**: Create the playing logic. Build out modular functions for handling the generating of the grid along with the movement and rendering of the cubes. Goals for the day:

**Day 4**: Install the controls for the user to interact with the game.  Style the frontend, making it polished and professional.  Goals for the day:

- Create controls for movements
- Have styled, nice looking controls and title

### Bonus features

There are many stylistic and gameplay features that can be added.  Some anticipated updates are:

- [ ] Add options for increased difficulty and increasing level speed plus complex levels
