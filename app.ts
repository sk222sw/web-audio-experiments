import { AudioScheduler } from "./audio-scheduler";
import { repeat } from "./util";

const range = document.querySelector("#range");
const tempoText = document.querySelector("#tempo");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");

const intervalLengths = [];
const quarter = 1;
const eight = 0.5;

repeat(() => (intervalLengths.push(quarter), intervalLengths.push(eight)), 2);

const context = new AudioContext();
const scheduler = new AudioScheduler({
  tempo: 60,
  context,
  intervalLengths,
  infinite: true
});

range.addEventListener("change", v => {
  tempoText.innerHTML = (v.target as any).value;
  scheduler.setTempo((v.target as any).value);
});

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
  scheduler.pop();
});
stopButton.addEventListener("click", e => scheduler.stopInterval(interval));
