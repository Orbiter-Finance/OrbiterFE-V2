<template>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none">
        <rect rx="12.000000" width="24.000000" height="24.000000" fill="#DDF600" fill-opacity="0"/>
        <rect x="0.500000" y="0.500000" rx="11.500000" width="23.000000" height="23.000000" stroke="#979797" stroke-opacity="0" stroke-width="1.000000"/>
        <rect x="2.000000" y="2.000000" rx="10.000000" width="20.000000" height="20.000000" :fill="fill" fill-opacity="1.000000"/>
        <rect x="2.500000" y="2.500000" rx="9.500000" width="19.000000" height="19.000000" stroke="#979797" stroke-opacity="0" stroke-width="1.000000"/>
        <path d="M7.73 12.81L10.58 15.65L15.94 10.29" stroke="#000000" stroke-opacity="1.000000" stroke-width="1.500000" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
</template>

<script>
export default {
    name: "PrizesTaskSuccessIcon",
    props: {
        fillColor: {
      type: String,
      default: '',
    },
    },
    data() {
        return {
            fill: this.fillColor
        }
    }
}
</script>

<style>

</style>