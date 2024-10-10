<template>
  <div class="join-media-card">
    <div class="card-info">
      <div class="card-info-title">
        <div class="label">{{ $t("Join LIKWID Group")}}</div>
        <svg
          class="media-icon"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="16.000000"
          height="16.000000"
          viewBox="0 0 16 16"
          fill="none"
        >
          <defs>
            <clipPath id="clip812_520">
              <rect
                id="telegram.19a5a5db.svg"
                rx="4.000000"
                width="16.000000"
                height="16.000000"
                fill="white"
                fill-opacity="0"
              />
            </clipPath>
          </defs>
          <rect
            id="telegram.19a5a5db.svg"
            rx="4.000000"
            width="16.000000"
            height="16.000000"
            fill="#279EFF"
            fill-opacity="1.000000"
          />
          <g clip-path="url(#clip812_520)">
            <path
              id="Vector"
              d="M12.97 4.75L11.46 11.88C11.34 12.38 11.05 12.5 10.63 12.27L8.33 10.57L7.22 11.63C7.16 11.7 7.09 11.75 7.01 11.79C6.93 11.83 6.84 11.85 6.75 11.85L6.92 9.51L11.18 5.69C11.37 5.52 11.14 5.43 10.89 5.6L5.62 8.9L3.36 8.19C2.86 8.03 2.85 7.7 3.46 7.46L12.33 4.04C12.74 3.89 13.1 4.13 12.97 4.75Z"
              fill="#FFFFFF"
              fill-opacity="1.000000"
              fill-rule="evenodd"
            />
          </g>
        </svg>
      </div>
      <div class="card-info-des">
        {{ $t("ALPHA") }}
      </div>
      <div @click="openLink" class="link-url">{{ url }}</div>
    </div>
    <img
      class="card-qr"
      :src="require('../../assets/activity/likwid-qr.png')"
    />
  </div>
</template>

<script>
export default {
  name: 'JoinMediaCard',
  data() {
    return {
      name: 'LIKWID',
      url: 'https://t.me/likwid_meme',
    }
  },
  methods: {
    openLink() {
      const name = this.name + '_REWARD_MDOAL'
      const url = this.url
      this.$gtag.event(name, {
        event_category: name,
        event_label: url,
      })
      window.open(url, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.join-media-card {
  width: 100%;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 16px;
  background: linear-gradient(
    175.64deg,
    rgb(255, 251, 236) 14.882%,
    rgb(255, 202, 170) 76.231%
  );
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-info {
    flex: 1;
    margin-right: 4px;
    .card-info-title {
      width: 100%;
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
      letter-spacing: 0px;
      display: flex;
      justify-content: start;
      align-items: center;
      .label {
        margin-right: 4px;
      }

      .media-icon {
        width: 16px;
        height: 16px;
      }
    }
    .card-info-des {
      width: 100%;
      text-align: left;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      font-family: GeneralSans-Regular;
    }

    .link-url {
      width: 100%;
      color: #007cff;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      text-decoration: underline;
      text-align: left;
      cursor: pointer;
    }
  }

  .card-qr {
    width: 64px;
    height: 64px;
  }
}
</style>
