<template>
  <div :class="active && 'flex overflow-x-scroll'">
    <div :class="active && 'overflow-container'">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  active: { type: Boolean, required: false, default: true },
})
</script>

<style lang="postcss" scoped>
.overflow-container {
  padding-left: theme("container.padding.DEFAULT");
  padding-right: theme("container.padding.DEFAULT");

  @media (screen(sm)) {
    --margin: max(0px, calc((100vw - theme("container.screens.sm")) / 2));
    --margin-witch-padding: calc(
      var(--margin) + theme("container.padding.sm")
    );

    padding-left: var(--margin-witch-padding);
    padding-right: var(--margin-witch-padding);
  }

  @media (screen(md)) {
    --margin: max(0px, calc((100vw - theme("container.screens.md")) / 2));
    --margin-witch-padding: calc(
      var(--margin) + theme("container.padding.sm")
    );

    padding-left: var(--margin-witch-padding);
    padding-right: var(--margin-witch-padding);
  }

  @media (screen(lg)) {
    --margin: max(0px, calc((100vw - theme("container.screens.lg")) / 2));
    --margin-witch-padding: calc(
      var(--margin) + theme("container.padding.lg")
    );

    padding-left: var(--margin-witch-padding);
    padding-right: var(--margin-witch-padding);
  }

  /* stylelint-disable media-feature-range-notation */

  @media (min-width: 1180px) {
    --margin: max(0px, calc((100vw - theme("container.screens.xl")) / 2));
    --margin-witch-padding: calc(
      var(--margin) + theme("container.padding.xl")
    );

    padding-left: var(--margin-witch-padding);
    padding-right: var(--margin-witch-padding);
  }

  /* stylelint-enable media-feature-range-notation */

  @media (screen(xl)) {
    --margin: max(0px, calc((100vw - theme("container.screens.xl")) / 2));
    --margin-witch-padding: calc(
      var(--margin) + theme("container.padding.xl")
    );

    padding-left: var(--margin-witch-padding);
    padding-right: var(--margin-witch-padding);

    :nth-child(1) {
      border-radius: 0;
      padding-bottom: 0;
    }
  }

  @media (screen(2xl)) {
    --margin: max(0px, calc((100vw - theme("container.screens.2xl")) / 2));
    --margin-witch-padding: calc(
      var(--margin) + theme("container.padding.2xl")
    );

    padding-left: var(--margin-witch-padding);
    padding-right: var(--margin-witch-padding);
  }
}
</style>
