import { lastWithDefault, first, last } from "./util";

const range = document.querySelector("#range");
const tempoText = document.querySelector("#tempo");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");

const scheduleAheadTime = 0.1;
let tempo = 100;
const quarter = tempo;

const minuteInMs = 60000;
const msTempo = minuteInMs / tempo;

range.addEventListener("change", v => {
  tempoText.innerHTML = (v.target as any).value;
  tempo = +(v.target as any).value;
});

const context = new AudioContext();
let noteTimes: number[] = setTimeForNote([
  quarter,
  quarter,
  quarter,
  quarter,
  quarter
]);

const scheduler = () => {
  console.log("current", currentNote);
  const currentTime = context.currentTime;
  const next = currentTime + toMs(nextNote) / 1000;
  console.log("next", next);
  if (next < currentTime + 50) {
    playNote(next);
  }
};
let currentNote = 0;
let nextNote = 0;
function playNote(time) {
  noteTimes = noteTimes.slice(1, noteTimes.length);
  nextNote = first(noteTimes);
  console.log("start", time);
  const osc = context.createOscillator();
  osc.connect(context.destination);
  currentNote = time;
  osc.start(currentNote);

  const stopTime = time + 0.5;
  console.log("stoptime@", stopTime);
  osc.stop(stopTime);
}

let interval = null;

function toMs(noteLength) {
  if (noteLength === 0) return 0;
  return 60000 / noteLength;
}

function startInterval() {
  const firstNote = first(noteTimes);
  const lookAhead = 50; // kanske inte blir look ahead?
  if (firstNote <= lookAhead)
    playNote(context.currentTime + toMs(first(noteTimes)));
  interval = setInterval(scheduler, lookAhead);
}
function stopInterval() {
  clearInterval(interval);
}

startButton.addEventListener("click", startInterval);
stopButton.addEventListener("click", stopInterval);

function setTimeForNote(notes) {
  return notes.reduce((acc, curr) => {
    return [...acc, curr + last(acc) || 0];
  }, []);
}
