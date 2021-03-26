class Clock {
  private startTime: number = null

  reset() {
    this.startTime = null
  }

  getDelta(): number {
    if (this.startTime == null) {
      this.startTime = performance.now()
    }

    const newTime = performance.now()
    const delta = newTime - this.startTime
    return delta / 1000
  }
}

export { Clock }
