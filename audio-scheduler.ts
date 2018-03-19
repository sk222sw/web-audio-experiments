import { lastWithDefault, first, last } from "./util";

const scheduleAheadTime = 0.1;
let tempo = 100;
const quarter = tempo / tempo;

const minuteInMs = 60000;
const msTempo = minuteInMs / tempo;
const context = new AudioContext();
let noteTimes: number[] = setTimeForNote([quarter, quarter, quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter]);
let startTime = 0;

const scheduler = (currentTime, cb) => {
  const next = (startTime + first(noteTimes) * msTempo) / 1000;
  const shouldBeScheduled = currentTime + scheduleAheadTime
  if (next < shouldBeScheduled) {
    cb(next);
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
  const lookAhead = 50; // kanske inte blir look ahead?
  startTime = context.currentTime
  playNote(context.currentTime + first(noteTimes));
  const interval = setInterval(_ => scheduler(context.currentTime, playNote), lookAhead);
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
