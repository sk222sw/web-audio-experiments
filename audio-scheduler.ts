import { lastWithDefault, first, last, repeat } from "./util";

export class AudioScheduler {
  scheduleAheadTime = 0.1;
  tempo: number;
  quarter: number;

  msTempo: number;
  context: AudioContext;
  startTime = 0;
  noteTimes: number[] = [];

  constructor(tempo, context?) {
    this.tempo = tempo;
    this.context = context || new AudioContext();
  }
  
  init() {
    this.quarter = this.tempo / this.tempo;
    this.msTempo = 60000 / this.tempo;
    
    const initialNotes = [];
    repeat(() => initialNotes.push(this.quarter), 2) 
    
    this.noteTimes = this.setTimeForNote(initialNotes)
  }

  get tempoInMs() {
    return this.msTempo / 1000;
  }

  setTempo(newTempo) {
    this.tempo = newTempo;
    this.msTempo = 60000 / this.tempo;
  }
  
  scheduler(currentTime) {
    const next = this.calculateNextTime(first(this.noteTimes));
    const shouldBeScheduled = currentTime + this.scheduleAheadTime;
    if (next < shouldBeScheduled) {
      this.playNote(next);
    }
  }

  calculateNextTime(noteTime) {
    return this.startTime + noteTime * this.tempoInMs;
  }

  playNote(time) {
    this.noteTimes = this.noteTimes.slice(1, this.noteTimes.length);

    const osc = this.context.createOscillator();
    osc.connect(this.context.destination);

    const stopTime = time + 0.1;
    osc.start(time);
    osc.stop(stopTime);
  }

  startInterval() {
    this.init();
    const firstNote = first(this.noteTimes);
    this.startTime = this.context.currentTime;
    this.playNote(this.context.currentTime + first(this.noteTimes));
    const interval = setInterval(
      _ => this.scheduler(this.context.currentTime),
      50
    );
    return interval;
  }

  stopInterval(interval) {
    clearInterval(interval);
  }

  setTimeForNote(notes) {
    return notes.reduce((acc, curr) => {
      return [...acc, curr + last(acc) || 0];
    }, []);
  }
}