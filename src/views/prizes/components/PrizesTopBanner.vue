<template>
  <div id="prizes-top-banner" class="prizes-top-banner"
  @click="open"
  >PrizesTopBanner</div>
</template>

<script>
export default {
    name: "PrizesTopBanner",
    methods: {
      open() {
        window.open("https://twitter.com/i/oauth2/authorize?client_id=SFZlS05MS2cxLVNQNjBvU2xuVkE6MTpjaQ&redirect_uri=https://test.orbiter.finance/&response_type=code&scope=tweet.read+users.read+follows.read+like.read+offline.access&code_challenge=challenge&code_challenge_method=plain", "_blank")
      }
    }
}
</script>

<style scoped lang="scss">
  .prizes-top-banner {
    width: 100%;
    height: 560px;
  }
</style>