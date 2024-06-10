 <div :class="`${isMouseClick ? 'invisible' : 'visible'}`">
      <div
        class="bg-[#4a92d866] z-[2147483640] absolute _pointer-events-none"
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

methods: {
markStyle(element) {
if (element) {
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
    getMark(element) {
      const { left, right, top, bottom } = element.getBoundingClientRect();
      console.log(`left:`, left);
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
if (newVal !== oldVal) {
console.log("Prop message changed from", oldVal, "to", newVal);
this.mark = this.getMark(newVal);
this.markStyle(newVal);
}
},
},
