let rotors;
let reflector;
let initialRotorPositions = [0, 0, 0];
let encodingRotorPositions = [0, 0, 0];
let rotorSize;
let inputMessage = "";
let encodedMessage = "";
let decodedMessage = "";

function setup() {
  createCanvas(1280, 720);
  textSize(32);
  textAlign(CENTER, CENTER);
  rotorSize = width / 26;

  // Create rotors and reflector with substitution mappings
  rotors = [
    'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''), // Rotor 1
    'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''), // Rotor 2
    'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split('')  // Rotor 3
  ];
  reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''); // Reflector B
}

function draw() {
  background(220);

  // Draw rotors
  for (let r = 0; r < 3; r++) {
    for (let i = 0; i < 26; i++) {
      let x = i * rotorSize;
      let y = r * height / 4;
      let letter = rotors[r][(i + encodingRotorPositions[r]) % 26];
      text(letter, x + rotorSize / 2, y + rotorSize);
    }

    // Draw rotor position
    text(encodingRotorPositions[r] + 1, width / 2, (r * height / 4) + rotorSize + 40);
  }

  // Display messages
  text("Input: " + inputMessage, width / 2, 3 * height / 4 + 50);
  text("Encoded / Decoded: " + encodedMessage, width / 2, 3 * height / 4 + 100);
}

function mouseClicked() {
  let clickPosition = floor(mouseY / (height / 4));
  if (clickPosition >= 0 && clickPosition < 3) {
    if (mouseButton === LEFT) {
        initialRotorPositions[clickPosition] = (initialRotorPositions[clickPosition] + 1) % 26;
    }
    encodingRotorPositions = [...initialRotorPositions];
  }
}

function keyTyped() {
  if (keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122) {
    let letter = String.fromCharCode(keyCode).toUpperCase();
    inputMessage += letter;
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