<template>
  <div>
    <div
      ref="tooltip"
      id="overlay-panel"
      class="tooltip click-off"
      v-if="showTooltip"
    >
      <div class="w-[26rem] max-h-fit rounded-3xl">
        <div class="px-2 py-2 flex justify-start items-center">
          <p
            class="inline-flex justify-end place-items-end text-lg text-gray-1"
          >
            <span class="text-white-1">p</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="text-white h-5 w-5 my-0.5"
            >
              <path
                fillRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
            <span class="text-white-1">a</span>
          </p>
        </div>
        <div class="click-off">
          <div
            class="mt-1 pt-1.5 px-1 text-sm font-medium relative h-48 max-h-48 min-h-full overflow-y-auto scrollbar"
          >
            <div class="flex flex-wrap items-center gap-1 flex-row">
              <div v-for="className in cssClassDisplay">
                <div :key="className" class="px-0.5 rounded">
                  <div
                    class="click-off px-0.5 py-1 relative flex flex-row flex-wrap items-center cursor-pointer group"
                  >
                    <button
                      type="button"
                      className="click-off hidden
                      _group-hover:block
                      border-none
                      rounded-full
                      items-center
                      justify-center
                      absolute
                      -right-1.5
                      -top-1
                      bg-red-600
                      h-4
                      w-4
                      z-50
                      cursor-pointer"
                    >
                      <!--   -1 ? "" : "group-hover:block hover:bg-red-600  text-[#fff] `} data-button="delete" " } -->
                      >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        strokeWidth="{2}"
                        fill="currentColor"
                        class="w-4 h-4 z-20 text-white"
                        data-button="delete"
                      >
                        <path
                          d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                          data-button="delete"
                        />
                      </svg>
                    </button>
                  </div>
                  {{ className }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import throttle from "lodash.throttle"; // Import lodash throttle function

export default {
  name: "CssPanel",
  data() {
    return {
      cssClassDisplay: [],
      popperInstance: null,
      mousePosition: {
        x: 0,
        y: 0,
      },
      showTooltip: false,
    };
  },
  methods: {
    createVirtualElement() {
      return {
        getBoundingClientRect: () => ({
          top: this.mousePosition.y,
          left: this.mousePosition.x,
          right: this.mousePosition.x,
          bottom: this.mousePosition.y,
          width: 0,
          height: 0,
        }),
        contextElement: this.$refs.tooltip,
      };
    },
    updateMousePosition(event) {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
      if (this.popperInstance) {
        this.popperInstance.update();
      }
    },
    onMouseOver(event) {
      const { classList } = event?.target;
      this.cssClassDisplay = [...classList];
      this.showTooltip = true;
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
      this.$nextTick(() => {
        console.log(
          `this.createVirtualElement() :`,
          this.createVirtualElement()
        );
        this.popperInstance = createPopper(
          this.createVirtualElement(),
          this.$refs.tooltip,
          {
            placement: "top",
            modifiers: [
              {
                name: "eventListeners",
                options: { scroll: true },
              },
              {
                name: "offset",

                options: {
                  offset: [30, 30],
                },
              },
            ],
          }
        );
        // Add mousemove event listener
        document.addEventListener(
          "mousemove",
          this.throttledUpdateMousePosition
        );
      });
      console.log(`this.popperInstance :`, this.popperInstance);
    },
    onMouseLeave() {
      this.cssClassDisplay = [];
      this.showTooltip = false;
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
      // Remove mousemove event listener
      document.removeEventListener(
        "mousemove",
        this.throttledUpdateMousePosition
      );
    },
    handleDocumentMouseOver(event) {
      this.onMouseOver(event);
    },
    handleDocumentMouseLeave() {
      this.onMouseLeave();
    },
  },
  created() {
    this.throttledUpdateMousePosition = throttle(this.updateMousePosition, 100); // Throttle to 100ms
  },
  mounted() {
    document.addEventListener("mouseover", this.handleDocumentMouseOver);
    document.addEventListener("mouseleave", this.handleDocumentMouseLeave);
  },
  beforeUnmount() {
    document.removeEventListener("mouseover", this.handleDocumentMouseOver);
    document.removeEventListener("mouseleave", this.handleDocumentMouseLeave);
    document.removeEventListener(
      "mousemove",
      this.throttledUpdateMousePosition
    ); // Ensure it is removed
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
  },
};
</script>

<style scoped>
.tooltip {
  position: absolute;
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 3px;
  pointer-events: none;
}
.click-off {
  pointer-events: none;
}
.tag-icon {
  width: 1.25rem /* 20px */;
  height: 1.25rem /* 20px */;
}
</style>
