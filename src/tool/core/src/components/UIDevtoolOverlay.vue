<template>
  <div class="vue-inspector-size-indicator">
    <svg
      :style="{ width: screen.width + 'px', height: screen.height + 'px' }"
      :viewBox="`${screen.zero} ${screen.zero} ${screen.width} ${screen.height}`"
    >
      <line
        stroke="#6171fe"
        stroke-width="2"
        stroke-dasharray="10,10"
        :x1="mark.lX1"
        y1="0"
        :x2="mark.lX2"
        y2="7820"
      ></line>
      <line
        stroke="#6171fe"
        stroke-width="2"
        stroke-dasharray="10,10"
        :x1="mark.rX1"
        y1="0"
        :x2="mark.rX2"
        y2="7820"
      ></line>
      <line
        stroke="#6171fe"
        stroke-width="2"
        stroke-dasharray="10,10"
        x1="0"
        :y1="mark.tY1"
        :y2="mark.tY2"
        x2="1512"
      ></line>
      <line
        stroke="#6171fe"
        stroke-width="2"
        stroke-dasharray="10,10"
        x1="0"
        x2="1512"
        :y1="mark.bY1"
        :y2="mark.bY2"
      ></line>
    </svg>
  </div>
</template>

<script>
const DAFAULT_MARK = {
  lX1: "0",
  lX2: "0",
  rX1: "0",
  rX2: "0",
  tY1: "0",
  tY2: "0",
  bY1: "0",
  bY2: "0",
};
export default {
  name: "Mark",
  props: {
    currentElement: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      screen: {
        // TODO windoe resize update
        zero: 1,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      mark: DAFAULT_MARK,
    };
  },
  methods: {
    getMark(currentElement) {
      const { left, right, top, bottom } =
        currentElement.getBoundingClientRect();
      return {
        lX1: left,
        lX2: left,

        rX1: right,
        rX2: right,

        tY1: top,
        tY2: top,

        bY1: bottom,
        bY2: bottom,
      };
    },
    setMark(currentElement) {
      let mark = currentElement ? this.getMark(currentElement) : DAFAULT_MARK;
      this.mark = mark;
    },
  },
  watch: {
    currentElement: {
      immediate: true,
      handler(currentElement) {
        this.setMark(currentElement);
      },
    },
  },
};
</script>

<style scoped>
.vue-inspector-size-indicator {
  z-index: 2147483630;
  position: fixed;
  transition: all 0.1s ease-in;
  pointer-events: none;
}
</style>
