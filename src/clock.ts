class Clock {
  private previousTime: number = null;

  reset() {
    this.previousTime = null;
  }

  getDelta(): number {
    const newTime = performance.now();
    const delta = !!this.previousTime ? newTime - this.previousTime : 0;

    this.previousTime = newTime;
    return delta / 1000;
  }
}

export { Clock };
