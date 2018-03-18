import { lastWithDefault, first, last } from "./util";

const scheduleAheadTime = 0.1;
let tempo = 100;
const quarter = tempo / tempo;

const minuteInMs = 60000;
const msTempo = minuteInMs / tempo;
const context = new AudioContext();
let noteTimes: number[] = setTimeForNote([quarter, quarter, quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter,quarter]);
const startTime = 0;
const scheduler = (currentTime, cb) => {
  const next = (startTime + first(noteTimes) * msTempo) / 1000;
  const shouldBeScheduled = currentTime + scheduleAheadTime
  if (next < shouldBeScheduled) {
    cb(next);
  }
};

let currentNote = 0;

function playNote(time) {
    console.log('schedule at', time)
  noteTimes = noteTimes.slice(1, noteTimes.length);
    
  const osc = context.createOscillator();
  osc.connect(context.destination);

  const stopTime = time + 0.1;
  console.log('stop time', stopTime)
  osc.start(time);
  osc.stop(stopTime);
//   console.log("starting at", currentNote)

//   const stopTime = time + msTempo;
//   console.log("stopping at", stopTime)
}

// scheduler(0.0, mockPlayNote)
// scheduler(0.1, mockPlayNote)
// scheduler(0.2, mockPlayNote)
// scheduler(0.3, mockPlayNote)
// scheduler(0.4, mockPlayNote)
// scheduler(0.5, mockPlayNote)
// scheduler(0.6, mockPlayNote)

for (var i = 0.0; i < 10; i+=0.1) {
    scheduler(i, playNote)
}

// scheduler(2.0, mockPlayNote)
// scheduler(3.0, mockPlayNote)
// scheduler(4.0, mockPlayNote)
// scheduler(5.0, mockPlayNote)

// function playNote(time) {
//   noteTimes = noteTimes.slice(1, noteTimes.length);
//   const osc = context.createOscillator();
//   osc.connect(context.destination);
//   currentNote = time;
//   osc.start(currentNote);

//   const stopTime = time + 0.5;
//   osc.stop(stopTime);
// }


// function toMs(noteLength) {
//   if (noteLength === 0) return 0;
//   return 60000 / noteLength;
// }

export function startInterval() {
//   const firstNote = first(noteTimes);
//   const lookAhead = 50; // kanske inte blir look ahead?
//   if (firstNote <= lookAhead)
//     playNote(context.currentTime + toMs(first(noteTimes)));
//   const interval = setInterval(_ => scheduler(context.currentTime, playNote), lookAhead);
//   return interval;
}
export function stopInterval(interval) {
//   clearInterval(interval);
}
function setTimeForNote(notes) {
  return notes.reduce((acc, curr) => {
    return [...acc, curr + last(acc) || 0];
  }, []);
}
