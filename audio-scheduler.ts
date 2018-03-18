import { lastWithDefault, first, last } from "./util";

const scheduleAheadTime = 0.1;
let tempo = 100;
const quarter = tempo;

const minuteInMs = 60000;
const msTempo = minuteInMs / tempo;
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


function toMs(noteLength) {
  if (noteLength === 0) return 0;
  return 60000 / noteLength;
}

export function startInterval(interval) {
  const firstNote = first(noteTimes);
  const lookAhead = 50; // kanske inte blir look ahead?
  if (firstNote <= lookAhead)
    playNote(context.currentTime + toMs(first(noteTimes)));
  interval = setInterval(scheduler, lookAhead);
}
export function stopInterval(interval) {
  clearInterval(interval);
}
function setTimeForNote(notes) {
  return notes.reduce((acc, curr) => {
    return [...acc, curr + last(acc) || 0];
  }, []);
}