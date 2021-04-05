function addControls(onLeft: () => void, onRight: () => void) {
  window.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
      onLeft();
    }

    if (event.key == 'ArrowRight') {
      onRight();
    }
  });
}

export { addControls };
