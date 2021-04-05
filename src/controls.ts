function addControls(
  onLeft: () => void,
  onRight: () => void,
  onRelease: () => void
) {
  window.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
      onLeft();
    }

    if (event.key == 'ArrowRight') {
      onRight();
    }
  });

  window.addEventListener('keyup', onRelease);
}

export { addControls };
