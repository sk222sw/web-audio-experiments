import { first, last } from "./util";

export class AudioScheduler {
  private scheduleAheadTime = 0.1;
  private tempo: number;
  private msTempo: number;
  private context: AudioContext;
  private startTime = 0;
  private noteTimes: number[] = [];
  private initialNoteTimes: number[] = [];

  constructor(tempo, initialNoteTimes, context?) {
    this.initialNoteTimes = initialNoteTimes;
    this.tempo = tempo;
    this.context = context || new AudioContext();
  }

  _init() {
    this.startTime = this.context.currentTime;
    this.msTempo = 60000 / this.tempo;
    this.noteTimes = this._setTimeForNote(this.initialNoteTimes);
  }

  _tempoInMs() {
    return this.msTempo / 1000;
  }

  setTempo(newTempo) {
    this.tempo = newTempo;
    this.msTempo = 60000 / this.tempo;
  }

  _scheduler(currentTime, cb) {
    const next = this._calculateNextTime(first(this.noteTimes));
    const shouldBeScheduled = currentTime + this.scheduleAheadTime;
    if (next < shouldBeScheduled) {
      this._runCallback(next, cb);
    }
  }

  _calculateNextTime(noteTime) {
    return this.startTime + noteTime * this._tempoInMs();
  }

  _runCallback(time, cb) {
    this.noteTimes = this.noteTimes.slice(1, this.noteTimes.length);
    cb(time);
  }

  startInterval(cb) {
    this._init();

    this._runCallback(this.context.currentTime + first(this.noteTimes), cb);

    const interval = setInterval(
      _ => this._scheduler(this.context.currentTime, cb),
      50
    );

    return interval;
  }

  stopInterval(interval) {
    clearInterval(interval);
  }

  _setTimeForNote(notes) {
    return notes.reduce((acc, curr) => {
      return [...acc, curr + last(acc) || 0];
    }, []);
  }
}
