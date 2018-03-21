import { AudioScheduler } from "./audio-scheduler";
import { repeat } from "./util";

const range = document.querySelector("#range");
const tempoText = document.querySelector("#tempo");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");

const noteTimes = [];
const quarter = 1;
const eight = 0.5;

repeat(() => (noteTimes.push(quarter), noteTimes.push(quarter)), 1);

const context = new AudioContext();
const scheduler = new AudioScheduler(60, noteTimes, context);

range.addEventListener("change", v => {
  tempoText.innerHTML = (v.target as any).value;
  scheduler.setTempo((v.target as any).value);
});

var i = 0;
function playNote(time) {
  const osc = context.createOscillator();
  osc.connect(context.destination);

  const stopTime = time + 0.05;
  osc.start(time);
  osc.stop(stopTime);
}

let interval = null;

startButton.addEventListener("click", e => {
  interval = scheduler.startInterval(playNote);
});
stopButton.addEventListener("click", e => scheduler.stopInterval(interval));
