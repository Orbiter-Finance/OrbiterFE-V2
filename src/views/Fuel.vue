<template>
  <div>
    <div @click="connect">fuel</div>
  </div>
</template>

<script>
import fuelsHelper from "../util/fuels/fuels_helper"
export default {
    name: "Fuel",
    methods: {
        async connect() {
           await fuelsHelper.connect()
        }
    }
}

</script>

<style>

</style>