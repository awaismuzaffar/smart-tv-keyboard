import { createSignal, createEffect, For } from 'solid-js';
import { dictionary } from './constants/dictionary';
import { UpButton, LeftButton, RightButton, DownButton, SelectButton } from "./components/remoteButtons";
import './App.css';

// Define all keyboard letters
const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function App() {
  const [currentInput, setCurrentInput] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [predictiveMode, setPredictiveMode] = createSignal(true);
  const cols = 6; // number of columns in the keyboard grid

  // Generate keyboard keys (letters + SPACE + backspace)
  const extendedKeys = () => [...allLetters, "SPACE", "BACKSPACE"];

  // Predict next likely characters based on current input prefix
  const getLikelyNextLetters = () => {
    const input = currentInput().toUpperCase();
    const prefix = input.split(" ").pop();
    const nextLetters = new Set();

    dictionary.forEach(word => {
      if (word.startsWith(prefix) && word.length > prefix.length) {
        const nextChar = word[prefix.length];
        nextLetters.add(nextChar === " " ? "SPACE" : nextChar);
      }
    });

    return nextLetters.size > 0 ? Array.from(nextLetters) : allLetters;
  };

  // Check if a key should be active based on prediction
  const isKeyActive = (key) => {
    if (!predictiveMode()) return true;
    return getLikelyNextLetters().includes(key) || key === "SPACE" || key === "BACKSPACE";
  };

  // Fallback: find the first available active key
  const findNearestActiveKey = () => {
    const keys = extendedKeys();
    for (let i = 0; i < keys.length; i++) {
      if (isKeyActive(keys[i])) return i;
    }
    return 0;
  };

  // Watch selected key; if it becomes inactive, fallback to a valid one
  createEffect(() => {
    const keys = extendedKeys();
    const selected = keys[selectedIndex()];
    if (!isKeyActive(selected)) {
      const fallback = findNearestActiveKey();
      setSelectedIndex(fallback);
    }
  });

  // Navigate to the closest active key in the given direction
  const moveSelection = (direction) => {
    const keys = extendedKeys();
    const index = selectedIndex();
    const row = Math.floor(index / cols);
    const col = index % cols;
    const rows = Math.ceil(keys.length / cols);

    // Helper to convert row/column back to index
    const getIndex = (r, c) => r * cols + c;

    let closest = null;
    let minDistance = Infinity;

    // Loop through every possible key position
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = getIndex(r, c);

        // Skip invalid indices or inactive keys
        if (i >= keys.length || !isKeyActive(keys[i])) continue;

        const deltaR = r - row;
        const deltaC = c - col;

        // Check if the candidate key is in the direction of movement
        const matchesDirection = (
          (direction === 'up' && deltaR < 0) ||
          (direction === 'down' && deltaR > 0) ||
          (direction === 'left' && deltaC < 0) ||
          (direction === 'right' && deltaC > 0)
        );

        if (matchesDirection) {
          // Manhattan distance gives total movement cost
          const distance = Math.abs(deltaR) + Math.abs(deltaC);

          // Select the nearest valid key in that direction
          if (distance < minDistance) {
            closest = i;
            minDistance = distance;
          }
        }
      }
    }

    // If a closest match was found, update selection
    if (closest !== null) setSelectedIndex(closest);
  };

  // Add the selected key to input or handle SPACE/backspace
  const selectKey = () => {
    const keys = extendedKeys();
    const key = keys[selectedIndex()];
    if (!isKeyActive(key)) return;
    if (key === "SPACE") {
      setCurrentInput(currentInput() + " ");
    } else if (key === "BACKSPACE") {
      setCurrentInput(currentInput().slice(0, -1));
    } else {
      setCurrentInput(currentInput() + key);
    }
  };

  return (
    <div class="app-wrapper">
      <div class="instructions">
        <h2>Smart Predictive TV Keyboard</h2>
        <p>
          This demo showcases a smart predictive keyboard interface designed for TVs.
          It simulates a real TV remote experience to make input entry faster and more intuitive.
          Use the virtual remote control to navigate the on-screen keyboard.
          For example, try spelling out <strong>BATMAN</strong>.
        </p>
      </div>

      <div class="simulator-container">
        {/* TV frame with keyboard */}
        <div class="tv-frame">
          <div class="input-area">{currentInput()}</div>
          <div class="keyboard">
            <For each={extendedKeys()}>
              {(key, i) => (
                <div
                  class={`key ${!isKeyActive(key) ? 'inactive' : ''} ${i() === selectedIndex() ? 'selected' : ''}`}
                >
                  {key === "SPACE" ? "␣" : key === "BACKSPACE" ? "←" : key}
                </div>
              )}
            </For>
          </div>
        </div>
        {/* Remote control layout */}
        <div class="remote-control">
          <div class="remote-btns">
            <div class="remote-row remote-up">
              <UpButton onClick={() => moveSelection('up')} />
            </div>
            <div class="remote-row remote-middle">
              <LeftButton onClick={() => moveSelection('left')} />
              <SelectButton onClick={() => selectKey()} />
              <RightButton onClick={() => moveSelection('right')} />
            </div>
            <div class="remote-row remote-down">
              <DownButton onClick={() => moveSelection('down')} />
            </div>
          </div>
          <button class="btn toggle" onClick={() => setPredictiveMode(!predictiveMode())}>
            {predictiveMode() ? "Turn off" : "Turn on"} predictive
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
