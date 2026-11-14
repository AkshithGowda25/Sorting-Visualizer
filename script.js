/**
 * AlgoPulse - Sorting Algorithm Visualizer
 * Core logic, animations, and algorithm implementations.
 * Written with clean, accessible vanilla JavaScript.
 */

// ==========================================================================
// 1. Algorithm Information & Complexities Database
// ==========================================================================
const ALGORITHM_DATA = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Compares adjacent elements and swaps them if they are in the wrong order. With each pass, the largest unsorted element bubbles up to its final position at the end of the array.',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    spaceNote: 'In-place sorting algorithm',
    stability: 'Stable'
  },
  selection: {
    name: 'Selection Sort',
    description: 'Divides the array into sorted and unsorted portions. In each iteration, it searches the unsorted part for the minimum value and swaps it into the beginning of the unsorted segment.',
    bestTime: 'O(n²)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    spaceNote: 'In-place sorting algorithm',
    stability: 'Unstable'
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Builds the sorted array one element at a time. It shifts larger preceding elements one position to the right to make room to insert the current key into its correct sorted location.',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    space: 'O(1)',
    spaceNote: 'In-place sorting algorithm',
    stability: 'Stable'
  },
  merge: {
    name: 'Merge Sort',
    description: 'A classic divide-and-conquer algorithm. It recursively splits the array in halves until individual elements remain, then repeatedly merges the halves back together in sorted order.',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    space: 'O(n)',
    spaceNote: 'Requires auxiliary merge buffer',
    stability: 'Stable'
  },
  quick: {
    name: 'Quick Sort',
    description: 'A divide-and-conquer algorithm that selects a pivot element, partitions the array so smaller elements move left and larger elements move right, then recursively sorts each partition.',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n²)',
    space: 'O(log n)',
    spaceNote: 'Recursion stack overhead',
    stability: 'Unstable'
  }
};

// ==========================================================================
// 2. Global State Variables
// ==========================================================================
let array = [];
let isSorting = false;
let isStopped = false;
let activeTimeoutId = null;
let activeReject = null;

let comparisonsCount = 0;
let swapsCount = 0;

// ==========================================================================
// 3. DOM Elements
// ==========================================================================
const algoSelect = document.getElementById('algo-select');
const sizeSlider = document.getElementById('size-slider');
const sizeValueBadge = document.getElementById('size-value');
const speedSlider = document.getElementById('speed-slider');
const speedValueBadge = document.getElementById('speed-value');

const generateBtn = document.getElementById('generate-btn');
const sortBtn = document.getElementById('sort-btn');
const stopBtn = document.getElementById('stop-btn');

const barsContainer = document.getElementById('bars-container');
const statusPill = document.getElementById('status-pill');
const statusText = document.getElementById('status-text');
const comparisonsDisplay = document.getElementById('comparisons-count');
const swapsDisplay = document.getElementById('swaps-count');
const metricSize = document.getElementById('metric-size');

// Complexity & Info elements
const algoTitle = document.getElementById('algo-title');
const algoStability = document.getElementById('algo-stability');
const algoDescription = document.getElementById('algo-description');
const timeBest = document.getElementById('time-best');
const timeAvg = document.getElementById('time-avg');
const timeWorst = document.getElementById('time-worst');
const spaceComplexity = document.getElementById('space-complexity');
const spaceNote = document.getElementById('space-note');

// ==========================================================================
// 4. Animation & Sleep Helpers
// ==========================================================================

/**
 * Calculates sleep delay in milliseconds based on the speed slider.
 * Uses a non-linear curve to give responsive, fine-grained control.
 */
function getDelay() {
  const speed = parseInt(speedSlider.value, 10);
  // Speed 1 -> ~550ms delay, Speed 65 -> ~40ms, Speed 100 -> 2ms delay
  const factor = (101 - speed) / 100;
  return Math.max(2, Math.floor(550 * Math.pow(factor, 2.2)));
}

/**
 * Asynchronous sleep helper with instant cancellation support.
 * If stop is requested, rejects immediately to unwind recursive calls.
 */
function sleep(ms = getDelay()) {
  return new Promise((resolve, reject) => {
    if (isStopped) {
      return reject(new Error('STOPPED'));
    }
    activeReject = reject;
    activeTimeoutId = setTimeout(() => {
      activeReject = null;
      activeTimeoutId = null;
      if (isStopped) {
        reject(new Error('STOPPED'));
      } else {
        resolve();
      }
    }, ms);
  });
}

// ==========================================================================
// 5. Visualizer Bar Management
// ==========================================================================

/**
 * Generates an array of random integers and creates corresponding bar elements.
 * @param {number} size - Number of elements in the array
 */
function generateNewArray(size = parseInt(sizeSlider.value, 10)) {
  if (isSorting) return;

  array = [];
  barsContainer.innerHTML = '';
  resetMetrics();
  setStatus('Ready', 'ready');

  // Generate values between 5 and 100
  for (let i = 0; i < size; i++) {
    const val = Math.floor(Math.random() * 95) + 5;
    array.push(val);
  }

  // Create bar DOM elements
  const showLabels = size <= 25;
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar bar-default';
    bar.id = `bar-${i}`;
    bar.style.height = `${array[i]}%`;
    bar.title = `Index: ${i}, Value: ${array[i]}`;

    if (showLabels) {
      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = array[i];
      bar.appendChild(label);
    }

    barsContainer.appendChild(bar);
  }

  metricSize.textContent = size;
  sizeValueBadge.textContent = size;
}

/**
 * Updates the visual state/color of a bar at the given index.
 * @param {number} index - Index of the bar
 * @param {'default'|'compare'|'swap'|'sorted'} state - Color state
 */
function setBarState(index, state) {
  const bar = document.getElementById(`bar-${index}`);
  if (!bar) return;

  bar.classList.remove('bar-default', 'bar-compare', 'bar-swap', 'bar-sorted', 'bar-celebrate');
  bar.classList.add(`bar-${state}`);
}

/**
 * Swaps two elements in the array and reflects the height swap in the DOM.
 * @param {number} i - First index
 * @param {number} j - Second index
 */
function swapValues(i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;

  updateBarHeight(i, array[i]);
  updateBarHeight(j, array[j]);
}

/**
 * Sets the value at a specific index and updates the bar height.
 * Used for Merge Sort and Insertion Sort shifts.
 * @param {number} index - Index of the bar
 * @param {number} value - New value
 */
function setBarHeight(index, value) {
  array[index] = value;
  updateBarHeight(index, value);
}

/**
 * Updates a bar DOM element's height and label.
 */
function updateBarHeight(index, value) {
  const bar = document.getElementById(`bar-${index}`);
  if (!bar) return;

  bar.style.height = `${value}%`;
  bar.title = `Index: ${index}, Value: ${value}`;

  const label = bar.querySelector('.bar-label');
  if (label) {
    label.textContent = value;
  }
}

/**
 * Resets all bars back to default color styling.
 */
function resetBarColors() {
  const bars = barsContainer.querySelectorAll('.bar');
  bars.forEach(bar => {
    bar.classList.remove('bar-compare', 'bar-swap', 'bar-sorted', 'bar-celebrate');
    bar.classList.add('bar-default');
  });
}

/**
 * Plays a cascading celebration animation when sorting completes successfully.
 */
async function celebrateSorted() {
  const count = array.length;
  const sweepDelay = Math.max(6, Math.floor(250 / count));

  for (let i = 0; i < count; i++) {
    if (isStopped) return;
    const bar = document.getElementById(`bar-${i}`);
    if (bar) {
      bar.classList.remove('bar-default', 'bar-compare', 'bar-swap');
      bar.classList.add('bar-sorted');
    }
    await new Promise(resolve => setTimeout(resolve, sweepDelay));
  }
}

// ==========================================================================
// 6. Metrics and Controls Management
// ==========================================================================

function incrementComparisons() {
  comparisonsCount++;
  comparisonsDisplay.textContent = comparisonsCount.toLocaleString();
}

function incrementSwaps() {
  swapsCount++;
  swapsDisplay.textContent = swapsCount.toLocaleString();
}

function resetMetrics() {
  comparisonsCount = 0;
  swapsCount = 0;
  comparisonsDisplay.textContent = '0';
  swapsDisplay.textContent = '0';
}

function setStatus(text, statusClass) {
  statusText.textContent = text;
  statusPill.className = `status-pill status-${statusClass}`;
}

/**
 * Disables or enables controls according to the sorting state.
 * While sorting, all controls are disabled EXCEPT the Stop button.
 */
function setControlsDisabled(disabled) {
  algoSelect.disabled = disabled;
  sizeSlider.disabled = disabled;
  speedSlider.disabled = disabled;
  generateBtn.disabled = disabled;
  sortBtn.disabled = disabled;
  stopBtn.disabled = !disabled;
}

/**
 * Updates the Algorithm Information Card next to the bars.
 */
function updateAlgorithmInfo(algoKey) {
  const info = ALGORITHM_DATA[algoKey];
  if (!info) return;

  algoTitle.textContent = info.name;
  algoStability.textContent = info.stability;
  algoDescription.textContent = info.description;
  timeBest.textContent = info.bestTime;
  timeAvg.textContent = info.avgTime;
  timeWorst.textContent = info.worstTime;
  spaceComplexity.textContent = info.space;
  spaceNote.textContent = info.spaceNote;
}

function updateSpeedLabel() {
  const speed = parseInt(speedSlider.value, 10);
  if (speed < 25) {
    speedValueBadge.textContent = 'Slow';
  } else if (speed < 55) {
    speedValueBadge.textContent = 'Normal';
  } else if (speed < 85) {
    speedValueBadge.textContent = 'Fast';
  } else {
    speedValueBadge.textContent = 'Max';
  }
}

// ==========================================================================
// 7. Sorting Algorithms Implementation
// ==========================================================================

/**
 * 1. Bubble Sort
 * Repeatedly walks through the array, compares adjacent elements, and swaps
 * them if they are in the wrong order. With every full pass, the highest
 * remaining element bubbles up to its final sorted position at the right.
 */
async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (isStopped) return;

      // Highlight bars being compared
      setBarState(j, 'compare');
      setBarState(j + 1, 'compare');
      incrementComparisons();
      await sleep();

      if (array[j] > array[j + 1]) {
        // Highlight bars being swapped
        setBarState(j, 'swap');
        setBarState(j + 1, 'swap');
        swapValues(j, j + 1);
        incrementSwaps();
        await sleep();
        swapped = true;
      }

      setBarState(j, 'default');
      setBarState(j + 1, 'default');
    }

    // Element at n - i - 1 is now in its permanent sorted place
    setBarState(n - i - 1, 'sorted');

    // If no two elements were swapped by inner loop, array is sorted
    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) {
        setBarState(k, 'sorted');
      }
      break;
    }
  }
  setBarState(0, 'sorted');
}

/**
 * 2. Selection Sort
 * Divides the list into a sorted sublist on the left and unsorted on the right.
 * It finds the smallest value in the unsorted portion and swaps it into the
 * first unsorted index, slowly expanding the sorted sublist.
 */
async function selectionSort() {
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    if (isStopped) return;
    let minIdx = i;
    setBarState(minIdx, 'compare');

    for (let j = i + 1; j < n; j++) {
      if (isStopped) return;

      setBarState(j, 'compare');
      incrementComparisons();
      await sleep();

      if (array[j] < array[minIdx]) {
        if (minIdx !== i) {
          setBarState(minIdx, 'default');
        }
        minIdx = j;
        setBarState(minIdx, 'compare');
      } else {
        setBarState(j, 'default');
      }
    }

    if (minIdx !== i) {
      setBarState(i, 'swap');
      setBarState(minIdx, 'swap');
      swapValues(i, minIdx);
      incrementSwaps();
      await sleep();
    }

    setBarState(minIdx, 'default');
    setBarState(i, 'sorted');
  }
  setBarState(n - 1, 'sorted');
}

/**
 * 3. Insertion Sort
 * Iterates through the array, taking one element at a time and inserting it into
 * its proper place within the already sorted elements to its left by shifting
 * any larger elements one step to the right.
 */
async function insertionSort() {
  const n = array.length;
  setBarState(0, 'sorted');

  for (let i = 1; i < n; i++) {
    if (isStopped) return;
    const key = array[i];
    setBarState(i, 'compare');
    await sleep();

    let j = i - 1;
    while (j >= 0) {
      if (isStopped) return;

      setBarState(j, 'compare');
      incrementComparisons();
      await sleep();

      if (array[j] > key) {
        setBarState(j + 1, 'swap');
        setBarHeight(j + 1, array[j]);
        incrementSwaps();
        await sleep();
        setBarState(j + 1, 'sorted');
        j--;
      } else {
        setBarState(j, 'sorted');
        break;
      }
    }

    setBarHeight(j + 1, key);
    for (let k = 0; k <= i; k++) {
      setBarState(k, 'sorted');
    }
  }
}

/**
 * 4. Merge Sort
 * A divide-and-conquer algorithm that recursively cuts the array in half
 * until length 1 sub-arrays remain, then merges adjacent sorted sub-arrays.
 */
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end || isStopped) return;

  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

/**
 * Merge helper for Merge Sort. Combines [start..mid] and [mid+1..end].
 */
async function merge(start, mid, end) {
  if (isStopped) return;

  const temp = [];
  let i = start;
  let j = mid + 1;

  while (i <= mid && j <= end) {
    if (isStopped) return;

    setBarState(i, 'compare');
    setBarState(j, 'compare');
    incrementComparisons();
    await sleep();

    if (array[i] <= array[j]) {
      temp.push(array[i]);
      setBarState(i, 'default');
      i++;
    } else {
      temp.push(array[j]);
      setBarState(j, 'default');
      j++;
    }
  }

  while (i <= mid) {
    temp.push(array[i]);
    i++;
  }
  while (j <= end) {
    temp.push(array[j]);
    j++;
  }

  // Write merged elements back into main array
  for (let k = 0; k < temp.length; k++) {
    if (isStopped) return;

    const targetIdx = start + k;
    setBarState(targetIdx, 'swap');
    setBarHeight(targetIdx, temp[k]);
    incrementSwaps();
    await sleep();
    setBarState(targetIdx, 'default');
  }
}

/**
 * 5. Quick Sort
 * Picks a pivot value (here, the last element), partitions the array such
 * that all elements smaller than the pivot are on the left and larger elements
 * are on the right, then recursively applies the same logic to both sides.
 */
async function quickSort(low = 0, high = array.length - 1) {
  if (low < high && !isStopped) {
    const pivotIdx = await partition(low, high);
    if (isStopped) return;

    await quickSort(low, pivotIdx - 1);
    await quickSort(pivotIdx + 1, high);
  }
}

/**
 * Partition helper using the Lomuto partition scheme for Quick Sort.
 */
async function partition(low, high) {
  const pivot = array[high];
  setBarState(high, 'compare');
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (isStopped) return low;

    setBarState(j, 'compare');
    incrementComparisons();
    await sleep();

    if (array[j] < pivot) {
      i++;
      setBarState(i, 'swap');
      setBarState(j, 'swap');
      swapValues(i, j);
      incrementSwaps();
      await sleep();
      setBarState(i, 'default');
    }
    setBarState(j, 'default');
  }

  // Place the pivot element into its final sorted position
  setBarState(i + 1, 'swap');
  setBarState(high, 'swap');
  swapValues(i + 1, high);
  incrementSwaps();
  await sleep();

  setBarState(high, 'default');
  setBarState(i + 1, 'sorted');

  return i + 1;
}

// ==========================================================================
// 8. Execution Orchestrator & Event Listeners
// ==========================================================================

/**
 * Starts the selected sorting visualization.
 */
async function startSorting() {
  if (isSorting) return;

  isSorting = true;
  isStopped = false;
  resetMetrics();
  resetBarColors();
  setControlsDisabled(true);
  setStatus('Sorting...', 'sorting');

  const selectedAlgo = algoSelect.value;

  try {
    if (selectedAlgo === 'bubble') {
      await bubbleSort();
    } else if (selectedAlgo === 'selection') {
      await selectionSort();
    } else if (selectedAlgo === 'insertion') {
      await insertionSort();
    } else if (selectedAlgo === 'merge') {
      await mergeSort();
    } else if (selectedAlgo === 'quick') {
      await quickSort();
    }

    if (!isStopped) {
      setStatus('Sorted!', 'sorted');
      await celebrateSorted();
    }
  } catch (err) {
    if (err.message === 'STOPPED') {
      setStatus('Stopped', 'stopped');
    } else {
      console.error('Visualization error:', err);
    }
  } finally {
    isSorting = false;
    setControlsDisabled(false);
    if (isStopped) {
      resetBarColors();
    }
  }
}

/**
 * Instantly stops the active sorting process.
 */
function stopSorting() {
  if (!isSorting) return;

  isStopped = true;

  if (activeTimeoutId) {
    clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
  }
  if (activeReject) {
    activeReject(new Error('STOPPED'));
    activeReject = null;
  }

  setStatus('Stopped', 'stopped');
  setControlsDisabled(false);
  resetBarColors();
  isSorting = false;
}

// Event Listeners
algoSelect.addEventListener('change', () => {
  updateAlgorithmInfo(algoSelect.value);
  resetBarColors();
});

sizeSlider.addEventListener('input', () => {
  const size = parseInt(sizeSlider.value, 10);
  sizeValueBadge.textContent = size;
  metricSize.textContent = size;
  generateNewArray(size);
});

speedSlider.addEventListener('input', () => {
  updateSpeedLabel();
});

generateBtn.addEventListener('click', () => {
  generateNewArray();
});

sortBtn.addEventListener('click', () => {
  startSorting();
});

stopBtn.addEventListener('click', () => {
  stopSorting();
});

// Keyboard shortcuts for convenience and accessibility
window.addEventListener('keydown', (e) => {
  // Avoid interfering when user is focusing form elements
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    return;
  }

  if (e.code === 'Space') {
    e.preventDefault();
    if (isSorting) {
      stopSorting();
    } else {
      startSorting();
    }
  } else if (e.code === 'KeyN' && !isSorting) {
    generateNewArray();
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateSpeedLabel();
  updateAlgorithmInfo(algoSelect.value);
  generateNewArray();
});
