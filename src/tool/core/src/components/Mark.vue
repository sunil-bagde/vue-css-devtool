<template>
  <div :class="`pointer-events-none ${false ? 'invisible' : 'visible'}`">
    <div :class="`${isMouseClick ? 'invisible' : 'visible'}`">
      <div
        class="bg-[#4a92d866] z-[2147483640] fixed _pointer-events-none"
        :style="{
          width: hoverWidthOf + 'px',
          height: hoverHeigthOf + 'px',
          left: hoverLeft + 'px',
          top: hoverTop + 'px',
        }"
      >
        <div
          class="absolute text-[11px] text-black bg-[#4a92d86e] px-0.5"
          :style="{ top: '-14px', right: '0px' }"
        >
          {{ hoverWidthOf.toFixed(2) }} x {{ hoverHeigthOf.toFixed(2) }}
        </div>
      </div>

      <!-- Padding -->
      <div
        class="border-lime-400/40 z-[2147483640] fixed"
        :style="{
          display:
            paddingTop > 0 ||
            paddingBottom > 0 ||
            paddingLeft > 0 ||
            paddingRight > 0
              ? 'block'
              : 'none',
          width: hoverWidthOf + 'px',
          height: hoverHeigthOf + 'px',
          left: hoverLeft + 'px',
          top: hoverTop + 'px',
          borderWidth: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        }"
      >
        <div
          v-for="p in padding"
          :key="p.id"
          :style="{
            display: p.val > 0 ? 'block' : 'none',
            [p.pos]: `-${p.val}px`,
          }"
          :class="`absolute ${
            p.pos === 'bottom' || p.pos === 'top' ? 'right-1/2' : 'top-1/2'
          } text-[9px] text-white bg-lime-600 px-0.5 _max-w-[20px]`"
        >
          {{ p.val }}
        </div>
      </div>

      <!-- Margin -->
      <div
        class="border-amber-600/40 z-[2147483640] fixed"
        :style="{
          display:
            marginTop > 0 ||
            marginBottom > 0 ||
            marginLeft > 0 ||
            marginRight > 0
              ? 'block'
              : 'none',
          width: hoverWidthOf + marginRight + marginLeft + 'px',
          height: hoverHeigthOf + marginTop + marginBottom + 'px',
          left: hoverLeft - marginLeft + 'px',
          top: hoverTop - marginTop + 'px',
          borderWidth: `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`,
        }"
      >
        <div
          v-if="marginTop > 0"
          class="absolute right-1/2 text-[9px] text-white bg-amber-800/70 px-0.5 z-[2147483642]"
          :style="{ top: `-${marginTop}px` }"
        >
          {{ marginTop }}
        </div>
        <div
          v-if="marginBottom > 0"
          class="absolute right-1/2 text-[9px] text-white bg-amber-800/70 px-0.5"
          :style="{ bottom: `-${marginBottom}px` }"
        >
          {{ marginBottom }}
        </div>
        <div
          v-if="marginLeft > 0"
          class="absolute top-1/2 text-[9px] text-white bg-amber-800/70 px-0.5"
          :style="{ left: `-${marginLeft}px` }"
        >
          {{ marginLeft }}
        </div>
        <div
          v-if="marginRight > 0"
          class="absolute top-1/2 text-[9px] text-white bg-amber-800/70 px-0.5"
          :style="{ right: `-${marginRight}px` }"
        >
          {{ marginRight }}
        </div>
      </div>
    </div>
    <svg
      id="mark-svg"
      :viewBox="`0 0 ${windowWidth} ${windowHeight}`"
      :class="`z-[2147483640] overflow-hidden pointer-events-none ${
        isMouseClick ? 'absolute' : 'fixed'
      }`"
      :style="{
        width: windowWidth + 'px',
        height: windowHeight + 'px',
        top: isMouseClick ? top + 'px' : 'auto',
        pointerEvents: 'none',
      }"
    >
      <line
        stroke="#2338f7"
        stroke-width="2px"
        stroke-dasharray="10,10"
        :x1="isMouseClick ? mark.lX1 : mark.lX1"
        :x2="isMouseClick ? mark.lX2 : mark.lX1"
        y1="0"
        y2="100%"
      />
      <line
        stroke="#2338f7"
        stroke-width="2px"
        stroke-dasharray="10,10"
        :x1="isMouseClick ? mark.rX1 : mark.rX1"
        :x2="isMouseClick ? mark.rX2 : mark.rX2"
        y1="0"
        y2="100%"
      />
      <line
        stroke="#2338f7"
        stroke-width="2px"
        stroke-dasharray="10,10"
        x1="0"
        x2="100%"
        :y1="mark.tY1"
        :y2="mark.tY2"
      />
      <line
        stroke="#2338f7"
        stroke-width="2px"
        stroke-dasharray="10,10"
        x1="0"
        x2="100%"
        :y1="mark.bY1"
        :y2="mark.bY2"
      />
    </svg>
  </div>
</template>

<script lang="ts">
export default {
  name: "UIDevtoolOverlay",
  props: {
    isMouseClick: {
      type: Boolean,
      required: true,
    },
    currentElement: {
      type: Object as PropType<HTMLElement | null>,
      required: true,
    },
  },
  data() {
    return {
      mark: {
        lX1: "0",
        lX2: "0",
        rX1: "0",
        rX2: "0",
        tY1: "0",
        tY2: "0",
        bY1: "0",
        bY2: "0",
      },
      hoverLeft: 0,
      hoverTop: 0,
      hoverWidthOf: 0,
      hoverHeigthOf: 0,
      top: window.scrollY === 0 ? 0 : window.scrollY,
      paddingLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      marginLeft: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };
  },
  computed: {
    padding() {
      return [
        this.paddingTop,
        this.paddingBottom,
        this.paddingLeft,
        this.paddingRight,
      ].map((p, i) => ({
        id: i,
        val: p,
        pos: ["top", "bottom", "left", "right"][i],
      }));
    },
  },
  methods: {
    getMark(element) {
      if (!element)
        return {
          lX1: 0,
          tY1: 0,
          rX1: 0,
          bY1: 0,
          tY2: 0,
          bY2: 0,
        };
      const { left, right, top, bottom } = element.getBoundingClientRect();
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
  },
  watch: {
    currentElement(newVal, oldVal) {
      if (newVal) {
        this.mark = this.getMark(newVal);
        console.log(` this.mark :`, this.mark);
      }
      console.log("Prop message changed from", oldVal, "to", newVal);
    },
  },
  mounted() {
    console.log(`this.currentElement:`, this.currentElement, this.isMouseClick);
    if (this.currentElement) {
      const style = window.getComputedStyle(this.currentElement);

      this.paddingLeft = parseFloat(style.paddingLeft);
      this.paddingTop = parseFloat(style.paddingTop);
      this.paddingRight = parseFloat(style.paddingRight);
      this.paddingBottom = parseFloat(style.paddingBottom);

      this.marginLeft = parseFloat(style.marginLeft);
      this.marginTop = parseFloat(style.marginTop) || 0;
      this.marginRight = parseFloat(style.marginRight);
      this.marginBottom = parseFloat(style.marginBottom);
    }

    this.hoverLeft = this.mark.lX1;
    this.hoverTop = this.mark.tY1;
    this.hoverWidthOf = this.mark.rX1 - this.mark.lX1;
    this.hoverHeigthOf = this.mark.bY1 - this.mark.tY1;
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
