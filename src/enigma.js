/*
* This sketch simulates the Enigma Machine used by the German military during World War II.
* The Enigma Machine was a cipher machine that used a series of rotors to substitute the 
* letters of the alphabet with corresponding letters. The rotors would rotate after each 
* letter was encoded, so the same letter would not be substituted in the same way twice.
* In this sketch the user can interact with the rotors by clicking the buttons to rotate 
* them left or right. To encode a message, the user simply has to type the message and 
* the cipher text will be displayed on the screen along with the plain text. The rotors 
* will rotate automatically as the message is encoded. The user can also delete letters 
* from the message by pressing the backspace key.
*/

let rotors;
let reflector;
let initialRotorPositions = [0, 0, 0];
let encodingRotorPositions = [0, 0, 0];
let rotorButtonsForward = [];
let rotorButtonsBackward = [];

let plainText = "";
let cipherText = "";

let backgroundImage;
let cutiveFont;

// Load background image and font before setup
function preload() {
  backgroundImage = loadImage('Background.png');
  cutiveFont = loadFont('CutiveMono-Regular.ttf');
}

// Setup sketch and create rotor buttons
function setup() {
  // Create canvas and set text properties
  createCanvas(1280, 720);
  textFont(cutiveFont);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);

  // Create rotors and reflector with substitution mappings
  rotors = [
    'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''),
    'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''),
    'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split('') 
  ];
  reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');

  // Create buttons to rotate each rotor
  for (let r = 0; r < 3; r++) {
    let x = (width / 4) * (r + 1);
    let y = height / 8;
    rotorButtonsForward[r] = createButton('>');
    rotorButtonsForward[r].position(x + 40, y + 90);
    rotorButtonsForward[r].mousePressed(() => {
      initialRotorPositions[r] = (initialRotorPositions[r] + 1) % 26;
      encodeMessage();
    });

    rotorButtonsBackward[r] = createButton('<');
    rotorButtonsBackward[r].position(x - 40, y + 90);
    rotorButtonsBackward[r].mousePressed(() => {
      initialRotorPositions[r] = (initialRotorPositions[r] - 1 + 26) % 26;
      encodeMessage();
    });
  }
}
  
// Draw background and rotor positions
function draw() {
  background(backgroundImage);

  // Set fill color for rectangles
  fill('#045b98ff');
  
  rectMode(CENTER);

  // Draw rotor positions side by side
  for (let r = 0; r < 3; r++) {
    let x = (width / 4) * (r + 1);
    let y = height / 4;
    
    // Draw a rounded rectangle behind each rotor position
    rect(x, y, 140, 100, 20);

    // Set fill color back to white for the text
    fill(255);
    
    text(encodingRotorPositions[r] + 1, x, y);
    
    // Set fill color back to rectangle color for the next rectangle
    fill('#045b98ff');
  }

  // Draw rounded rectangles behind plain text and cipher text
  rect(width / 2, height / 2 + 80, textWidth(plainText) + 350, 150, 20);

  // Set fill color back to white for the text
  fill(255);

  text("Plain Text: " + plainText, width / 2, height / 2 + 50);
  text("Cipher Text: " + cipherText, width / 2, height / 2 + 100);
}

// Encode letter when an alphabetical key is pressed
function keyTyped() {
  if (keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122) {
    let letter = String.fromCharCode(keyCode).toUpperCase();
    plainText += letter;
    encodeMessage();
  }
}

// Delete letter when backspace key is pressed
function keyPressed() {
  if (keyCode === BACKSPACE) {
    plainText = plainText.slice(0, -1);
    encodeMessage();
  }
}

// Encode letter using the current rotor positions
function encodeLetter(letter, rotorPositions) {
  // Initial letter substitution
  for (let r = 0; r < 3; r++) {
    let index = (letter.charCodeAt(0) - 65 + rotorPositions[r]) % 26;
    letter = rotors[r][index];
  }

  // Bounce initial substitution off reflector to ensure symmetry
  letter = reflector[letter.charCodeAt(0) - 65];

  // Reverse letter substitution to get encoded letter
  for (let r = 2; r >= 0; r--) {
    let index = rotors[r].indexOf(letter);
    letter = String.fromCharCode((index - rotorPositions[r] + 26) % 26 + 65);
  }

  return letter;
}

// Encode message and rotate rotors
function encodeMessage() {
  // Reset cipher text and rotor positions to initial values
  encodingRotorPositions = [...initialRotorPositions];
  cipherText = "";

  // Encode each letter and rotate rotors
  for (let i = 0; i < plainText.length; i++) {
    // Encode letter
    cipherText += encodeLetter(plainText[i], encodingRotorPositions);
    
    // Rotate rotor 1 every time a letter is encoded
    encodingRotorPositions[0] = (encodingRotorPositions[0] + 1) % 26;
    
    // Rotate rotor 2 for every full rotation of rotor 1
    if (i % 26 == 25) {
      encodingRotorPositions[1] = (encodingRotorPositions[1] + 1) % 26;
    }
    
    // Rotate rotor 3 for every full rotation of rotor 2
    if (i % 676 == 675) {
      encodingRotorPositions[2] = (encodingRotorPositions[2] + 1) % 26;
    }
  }
}