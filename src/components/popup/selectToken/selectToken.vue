<template>
  <o-box-content class="selectTokenBody" style="width: 34.5rem">
    <div @click.stop="stopPenetrate" class="selectTokenContent">
      <div class="topItem">
        <span>Select a Token</span>
        <div @click="closerButton">
          <svg-icon
            style="width: 1.5rem; height: 1.5rem"
            iconName="close"
          ></svg-icon>
        </div>
      </div>
      <div style="width: 100%; position: relative">
        <input
          type="text"
          v-model="keyword"
          class="input"
          @input="checkKeyWord()"
          :placeholder="`More tokens will be supported soon.`"
        />
        <svg-icon
          @click="search"
          class="searchIcon"
          iconName="search"
        ></svg-icon>
      </div>

      <div
        v-for="(item, index) in newTokenData"
        :key="index"
        @click="getTokenInfo(item)"
        class="contentItem"
      >
        <img
          v-if="item.icon"
          :src="item.icon"
          class="logo"
          style="margin-right: 1.5rem; margin-left: 1rem"
          alt=""
        />
        <svg-icon v-else class="logo token_icon" iconName="tokenLogo"></svg-icon>

        <span style="margin-top: 0.2rem">{{ item.token }}</span>
        <!-- <span class="right">{{item.amount}}</span> -->
      </div>
    </div>
  </o-box-content>
</template>

<script>
export default {
  name: "SelectToken",
  props: {
    tokenData: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      keyword: "",
    };
  },
  computed: {
    newTokenData: function () {
      if (!this.keyword || this.keyword === "") {
        return this.tokenData;
      }
      return this.tokenData.filter(
        (item) =>
          item.token.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1
      );
    },
  },
  watch: {},
  mounted() {},
  methods: {
    closerButton() {
      this.$emit("closeSelect");
    },
    getTokenInfo(e) {
      this.$emit("getTokenInfo", e);
      this.closerButton();
    },
    stopPenetrate(e) {
      e.stopPropagation;
    },
    search() {},
    checkKeyWord() {},
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.selectTokenBody {
  background-color: #fff;
  margin: 4.2rem auto;
  height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  height: calc(
    var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  overflow-y: scroll;
  .selectTokenContent {
    margin: 1rem 1.5rem;
    position: relative;
    .topItem {
      width: 100%;
      height: 2rem;
      font-size: 2rem;
      font-weight: bold;
      line-height: 2rem;
      color: var(--default-black);
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      margin-bottom: 1.5rem;
    }
    .input {
      position: relative;
      border-width: 0.15rem 0.2rem 0.3rem 0.2rem;
      border-color: black;
      border-style: solid;
      border-radius: 2rem;
      margin-bottom: 2rem;
      height: 4rem;
      width: 100%;
      outline: none;
      color: var(--default-black);
      font-size: 1.4rem;
      padding: 0 4rem 0 2rem;
    }
    input::placeholder {
      color: #adadb0;
      font-size: 1.4rem;
    }
    .searchIcon {
      position: absolute;
      right: 1.2rem;
      top: 0.8rem;
      width: 2.4rem;
      height: 2.4rem;
    }
    .contentItem {
      width: 100%;
      font-size: 1.4rem;
      line-height: 2rem;
      color: var(--default-black);
      margin: 0 auto 2.4rem auto;
      align-items: center;
      display: flex;
      position: relative;
      .logo {
        width: 2rem;
        height: 2rem;
      }
      .right {
        text-align: right;
        position: absolute;
        margin-top: 0.2rem;
        right: 1.5rem;
      }
    }
  }
}

// .ant-input-affix-wrapper >>> .ant-input {
//   background-color: transparent;
//   border: 0;
// }

::v-deep .ant-input {
  background-color: transparent;
  border: 0;
  outline: none;
  color: var(--default-black);
  font-size: 1.4rem;
  height: 100%;
}

::v-deep .ant-input-affix-wrapper {
  border: none;
  background: transparent;
  outline: none;
  box-shadow: none;
}
</style>
