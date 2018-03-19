import { lastWithDefault, first, last } from "./util";

const scheduleAheadTime = 0.1;
let tempo = 100;
const quarter = tempo / tempo;

const msTempo = 60000 / tempo;
const context = new AudioContext();
let noteTimes: number[] = setTimeForNote([quarter, quarter, quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter]);
let startTime = 0;

function calculateNextTime(noteTime) {
  return startTime + (noteTime * msTempo / 1000)
}

const scheduler = (currentTime) => {
  const next = calculateNextTime(first(noteTimes))
  const shouldBeScheduled = currentTime + scheduleAheadTime
  if (next < shouldBeScheduled) {
    calculateNextTime(first(noteTimes))
    playNote(next);
  }
};

let currentNote = 0;

function playNote(time) {
  noteTimes = noteTimes.slice(1, noteTimes.length);
    
  const osc = context.createOscillator();
  osc.connect(context.destination);

  const stopTime = time + 0.1;
  osc.start(time);
  osc.stop(stopTime);
}

export function startInterval() {
  const firstNote = first(noteTimes);
  startTime = context.currentTime
  playNote(context.currentTime + first(noteTimes));
  const interval = setInterval(_ => scheduler(context.currentTime), 50);
  return interval;
}

export function stopInterval(interval) {
  clearInterval(interval);
}

function setTimeForNote(notes) {
  return notes.reduce((acc, curr) => {
    return [...acc, curr + last(acc) || 0];
  }, []);
}
