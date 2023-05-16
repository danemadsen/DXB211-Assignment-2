let rotors;
let reflector;
let initialRotorPositions = [0, 0, 0];
let encodingRotorPositions = [0, 0, 0];
let rotorSize;
let inputMessage = "";
let encodedMessage = "";
let decodedMessage = "";

let rotorButtonsForward = [];
let rotorButtonsBackward = [];
let backgroundImage;
let cutiveFont;

function preload() {
    backgroundImage = loadImage('Background.png');
    cutiveFont = loadFont('CutiveMono-Regular.ttf');
}

function setup() {
    createCanvas(1280, 720);
    textFont(cutiveFont);
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255);
    rotorSize = width / 26;
  
    // Create rotors and reflector with substitution mappings
    rotors = [
      'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''), // Rotor 1
      'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''), // Rotor 2
      'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split('')  // Rotor 3
    ];
    reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''); // Reflector B
  
    // Create buttons for each rotor
    for (let r = 0; r < 3; r++) {
      let x = (width / 4) * (r + 1);
      let y = height / 8;
      rotorButtonsForward[r] = createButton('>');
      rotorButtonsForward[r].position(x + 40, y - 20);
      rotorButtonsForward[r].mousePressed(() => {
        initialRotorPositions[r] = (initialRotorPositions[r] + 1) % 26;
        encodingRotorPositions = [...initialRotorPositions];
        encodeMessage();
      });
  
      rotorButtonsBackward[r] = createButton('<');
      rotorButtonsBackward[r].position(x - 60, y - 20);
      rotorButtonsBackward[r].mousePressed(() => {
        initialRotorPositions[r] = (initialRotorPositions[r] - 1 + 26) % 26;
        encodingRotorPositions = [...initialRotorPositions];
        encodeMessage();
      });
    }
  }
  

  function draw() {
    background(backgroundImage);
  
    fill('#045b98ff');  // Set fill color for rectangles
    rectMode(CENTER);    // Draw rectangles from the center
  
    // Draw rotor positions side by side
    for (let r = 0; r < 3; r++) {
      let x = (width / 4) * (r + 1);
      let y = height / 8;
      
      // Draw a rounded rectangle behind each rotor position
      rect(x, y, 140, 100, 20);  // 140x100px rectangles with 20px corner radius
  
      fill(255);  // Set fill color back to white for the text
      text(encodingRotorPositions[r] + 1, x, y);
      fill('#045b98ff');  // Set fill color back to rectangle color for the next rectangle
    }
  
    // Draw rounded rectangles behind input and encoded messages
    rect(width / 2, height / 2 - 20, textWidth(inputMessage) + 450, 150, 20);  // Rectangle for encoded message
  
    fill(255);  // Set fill color back to white for the text
  
    // Display messages
    text("Input: " + inputMessage, width / 2, height / 2 - 50);
    text("Encoded / Decoded: " + encodedMessage, width / 2, height / 2);
  }
  

function keyTyped() {
    if (keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122) {
        let letter = String.fromCharCode(keyCode).toUpperCase();
        inputMessage += letter;
        encodeMessage();
    }
}
  
function keyPressed() {
    if (keyCode === BACKSPACE) {
        inputMessage = inputMessage.slice(0, -1);
        encodeMessage();
    }
}

function encodeLetter(letter, rotorPositions) {
    for (let r = 0; r < 3; r++) {
        let index = (letter.charCodeAt(0) - 65 + rotorPositions[r]) % 26;
        letter = rotors[r][index];
    }
    letter = reflector[letter.charCodeAt(0) - 65];
    for (let r = 2; r >= 0; r--) {
        let index = rotors[r].indexOf(letter);
        letter = String.fromCharCode((index - rotorPositions[r] + 26) % 26 + 65);
    }
    return letter;
}

function encodeMessage() {
    encodingRotorPositions = [...initialRotorPositions];
    encodedMessage = "";
    for (let i = 0; i < inputMessage.length; i++) {
        encodedMessage += encodeLetter(inputMessage[i], encodingRotorPositions);
        encodingRotorPositions[0] = (encodingRotorPositions[0] + 1) % 26;
        if (i % 26 == 25) {
            encodingRotorPositions[1] = (encodingRotorPositions[1] + 1) % 26;
        }
        if (i % 676 == 675) {
            encodingRotorPositions[2] = (encodingRotorPositions[2] + 1) % 26;
        }
    }
}