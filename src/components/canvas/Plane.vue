<template>
  <div></div>
</template>

<script>
export default {
  name: 'canvas-plane',
};

// css class names should match in funcs:
// getPlaneClass
// getPulseClass
</script>

<style lang="scss">
.plane.pulse.small::after {
  width: 6px;
  height: 6px;
  border: 2px solid limegreen;
  animation: pulse-small 1.5s infinite;
}

.plane.pulse::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 100%;
  border: 4px solid limegreen;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s infinite;
}

@keyframes pulse-small {
  0% {
    width: 6px;
    height: 6px;
    opacity: 0;
  }
  20% {
    width: 6px;
    height: 6px;
    opacity: 1;
  }
  100% {
    width: 50px;
    height: 50px;
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    width: 10px;
    height: 10px;
    opacity: 0;
  }
  20% {
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  100% {
    width: 80px;
    height: 80px;
    opacity: 0;
  }
}
</style>
