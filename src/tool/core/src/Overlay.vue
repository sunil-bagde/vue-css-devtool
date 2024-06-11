<script lang="ts">
import inspectorOptions from "virtual:vue-inspector-options";
import UIDevtoolOverlay from "./components/UIDevtoolOverlay.vue";
import CssPanel from "./components/CssPanel.vue";
import "./index.css";

const base = inspectorOptions.base;

const KEY_DATA = "data-v-src-location";
const KEY_IGNORE = "data-v-src-location-ignore";
const KEY_PROPS_DATA = "__v_inspector";

function getData(el) {
  return el?.__vnode?.props?.[KEY_PROPS_DATA] ?? el?.getAttribute?.(KEY_DATA);
}

export default {
  name: "VueInspectorOverlay",
  components: {
    UIDevtoolOverlay,
    CssPanel,
  },
  data() {
    return {
      containerRef: null,
      floatsRef: null,
      enabled: inspectorOptions.enabled,
      toggleCombo:
        inspectorOptions.toggleComboKey?.toLowerCase?.()?.split?.("-") ?? false,
      disableInspectorOnEditorOpen:
        inspectorOptions.disableInspectorOnEditorOpen,
      overlayVisible: false,
      currentElement: null,
      position: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      linkParams: {
        file: "",
        line: 0,
        column: 0,
        className: "",
      },
      KEY_IGNORE,
    };
  },
  setup() {},
  computed: {
    logoColors() {
      return this.enabled
        ? ["#2338f7", "#213547", "#2338f7"]
        : ["#E2C6C6", "#E2C6C6", "#E2C6C6"];
    },
    containerVisible() {
      const { toggleButtonVisibility } = inspectorOptions;
      return (
        toggleButtonVisibility === "always" ||
        (toggleButtonVisibility === "active" && this.enabled)
      );
    },
    containerPosition() {
      return inspectorOptions.toggleButtonPos
        .split("-")
        .map((p) => `${p}: 15px;`)
        .join("");
    },
    bannerPosition() {
      const [x, y] = inspectorOptions.toggleButtonPos.split("-");
      return {
        [x === "top" ? "bottom" : "top"]: "-45px",
        [y]: 0,
      };
    },
    floatsStyle() {
      let margin = 10;
      let x = this.position.x + this.position.width / 2;
      let y = this.position.y + this.position.height + 5;
      const floatsRef = this.$refs.floatsRef;
      let floatsWidth = floatsRef?.clientWidth ?? 0;
      let floatsHeight = floatsRef?.clientHeight ?? 0;

      x = Math.max(margin, x);
      x = Math.min(x, window.innerWidth - floatsWidth - margin);

      y = Math.max(margin, y);
      y = Math.min(y, window.innerHeight - floatsHeight - margin);

      return {
        left: `${x}px`,
        top: `${y}px`,
      };
    },
    sizeIndicatorStyle() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`,
        width: `${this.position.width}px`,
        height: `${this.position.height}px`,
      };
    },
  },
  watch: {
    enabled: {
      handler(val, oldVal) {
        if (val === oldVal) return;
        if (val) this.onEnabled();
        else this.onDisabled();
      },
    },
  },
  mounted() {
    this.toggleCombo &&
      document.body.addEventListener("keydown", this.onKeydown);
    this.toggleEventListener();

    // Expose control to global
    window.__VUE_INSPECTOR__ = this;
  },
  methods: {
    toggleEventListener() {
      const listener = this.enabled
        ? document.body.addEventListener
        : document.body.removeEventListener;

      listener?.call(document.body, "mousemove", this.updateLinkParams);
      listener?.call(document.body, "resize", this.closeOverlay, true);
      listener?.call(document.body, "click", this.handleClick, true);
    },
    toggleEnabled() {
      this.enabled = !this.enabled;
      this.overlayVisible = false;
      this.toggleEventListener();
    },
    onKeydown(event) {
      if (event.repeat || event.key === undefined) return;

      const isCombo = this.toggleCombo?.every((key) =>
        this.isKeyActive(key, event)
      );
      if (isCombo) this.toggleEnabled();
    },
    isKeyActive(key, event) {
      switch (key) {
        case "shift":
        case "control":
        case "alt":
        case "meta":
          return event.getModifierState(
            key.charAt(0).toUpperCase() + key.slice(1)
          );
        default:
          return key === event.key.toLowerCase();
      }
    },
    isChildOf(ele, target) {
      if (!ele || ele === document) return false;
      return ele === target ? true : this.isChildOf(ele.parentNode, target);
    },
    getTargetNode(e) {
      const splitRE = /(.+):([\d]+):([\d]+)$/;
      const path = e.path ?? e.composedPath();
      if (!path) {
        return {
          targetNode: null,
          params: null,
        };
      }
      const ignoreIndex = path.findIndex((node) =>
        node?.hasAttribute?.(KEY_IGNORE)
      );
      const targetNode = path
        .slice(ignoreIndex + 1)
        .find((node) => getData(node));
      if (!targetNode) {
        return {
          targetNode: null,
          params: null,
        };
      }
      const match = getData(targetNode)?.match(splitRE);
      const [_, file, line, column] = match || [];
      return {
        targetNode,
        params: match
          ? {
              file,
              line,
              column,
              title: file,
              className: targetNode.className,
            }
          : null,
      };
    },
    handleClick(e) {
      return;
      const { targetNode, params } = this.getTargetNode(e);
      if (!targetNode) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const { file, line, column } = params;
      this.overlayVisible = false;
      const url = new URL(
        `${base}__open-in-editor?file=${encodeURIComponent(
          `${file}:${line}:${column}`
        )}`,
        import.meta.url
      );
      this.openInEditor(url);
    },
    updateLinkParams(e) {
      const { targetNode, params } = this.getTargetNode(e);
      if (targetNode) {
        this.currentElement = targetNode;
        const rect = targetNode.getBoundingClientRect();
        this.overlayVisible = true;
        this.position.x = rect.x;
        this.position.y = rect.y;
        this.position.width = rect.width;
        this.position.height = rect.height;
        this.linkParams = params;
      } else {
        this.closeOverlay();
      }
      this.onUpdated();
    },
    closeOverlay() {
      this.overlayVisible = false;
      this.linkParams = {
        file: "",
        line: 0,
        column: 0,
        className: "",
      };
    },

    // Public methods
    enable() {
      if (this.enabled) return;
      this.toggleEnabled();
    },
    disable() {
      if (!this.enabled) return;
      this.toggleEnabled();
    },
    openInEditor(baseUrl, file, line, column) {
      /**
       * Vite built-in support
       * https://github.com/vitejs/vite/blob/d59e1acc2efc0307488364e9f2fad528ec57f204/packages/vite/src/node/server/index.ts#L569-L570
       */

      const _url =
        baseUrl instanceof URL
          ? baseUrl
          : `${baseUrl}/__open-in-editor?file=${file}:${line}:${column}`;
      const promise = fetch(_url, {
        mode: "no-cors",
      });

      if (this.disableInspectorOnEditorOpen) promise.then(this.disable);

      return promise;
    },
    onUpdated() {
      // to be replaced programmatically
    },
    onEnabled() {
      // to be replaced programmatically
    },
    onDisabled() {
      // to be replaced programmatically
    },
  },
};
</script>

<template>
  <div
    v-bind="{ [KEY_IGNORE]: 'true' }"
    style="position: absolute; top: 0px; left: 0px"
  >
    <!-- Overlay -->
    <CssPanel />
    <UIDevtoolOverlay v-if="overlayVisible" :current-element="currentElement" />
  </div>
</template>

<style></style>
