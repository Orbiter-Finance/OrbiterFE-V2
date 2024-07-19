<template>
  <div>
    <div class="user-ball">
        <img
            class="user-logo"
            :src="`${require('../../../assets/prizes/v2/rank-top-3.png')}`"
            alt=""
          />

    </div>
    
  </div>
</template>

<script >
export default {
  name: 'PrizesUserBall',
  computed: {
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>


@keyframes fade_in {
    from {
        transform: translateX(50%) rotate(-45deg);
    }
    to {
        transform: translateX(10%) rotate(0deg);
    }
  }

.user-ball {
    position: fixed;
    top: 50%;
    right: 0;
    z-index: 5;
    .user-logo {
        width: 64px;
        height: 64px;
        transform: translateX(50%) rotate(-45deg);
        transform-origin: 50% 50%;
        cursor: pointer;
    }

    .user-logo:hover {
        animation: fade_in 0.5s forwards;
    }
}

</style>