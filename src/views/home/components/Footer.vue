<template>
  <div class="footer-wrap">
    <div class="top-line" />
    <div class="footer-content">
      <div class="footer-title">
        <div class="footer-icon" @click="handlerScrollTop">
          <img :src="footerIcon" />
        </div>
      </div>
      <div class="nav-list">
        <div
          class="nav-type-list"
          v-for="typeItem in navList"
          :key="typeItem.title"
        >
          <div class="nav-type-title">
            {{ typeItem.title }}
          </div>
          <div class="item-nav-list-wrap">
            <div
              v-for="navItem in typeItem.list"
              :key="navItem.label"
              :class="['item-nav-item', { disabled: navItem.disabled }]"
              @click="clickItem(navItem)"
            >
              {{ navItem.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['handlerClickJump'],
  props: {
    footerIcon: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      navList: [
        {
          title: 'Products',
          list: [
            {
              label: 'Orbiter bridge',
            },
            {
              label: 'Orbiter Data',
            },
            {
              label: 'Orbiterscan',
              disabled: true,
            },
            {
              label: 'AAzkprover SDK',
            },
          ],
        },
        {
          title: 'Community',
          list: [
            {
              label: 'Twitter',
            },
            {
              label: 'Discord',
            },
            {
              label: 'Medium',
            },
          ],
        },
        {
          title: 'Help',
          list: [
            {
              label: 'User Docs',
            },
            {
              label: 'Yellowpaper',
            },
          ],
        },
      ],
    }
  },
  methods: {
    clickItem (item) {
      if (item?.disabled) return
      this.handlerClickJump({ target: { innerText: item.label } })
    },
    handlerScrollTop () {
      document.getElementById('app').scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.footer-wrap {
  height: 400px;
  box-sizing: border-box;
  width: 100%;
  text-align: left;
  position: relative;
  padding: 80px 0 0 0;
  background-color: #fff;
  .footer-content {
    margin: 0 auto;
    display: flex;
    width: fit-content;
  }
  .top-line {
    position: absolute;
    top: -4px;
    left: 0;
    width: 100%;
    height: 4px;
    background: #000000;
  }
}
.footer-icon {
  width: 248px;
  cursor: pointer;
  height: 48px;
  img {
    width: 100%;
    height: 100%;
  }
}
.nav-list {
  margin-left: 312px;
  display: flex;
  flex: 1;
}
.nav-type-list {
  width: 200px;
  height: 240px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  &:last-of-type {
    margin-right: 0;
  }
}
.nav-type-title {
  font-size: 16px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
}
.item-nav-list-wrap {
  margin-top: 25px;
}
.item-nav-item {
  margin-bottom: 16px;
  font-size: 14px;
  font-family: OpenSans-Regular, OpenSans;
  font-weight: 400;
  cursor: pointer;
  color: #666666;
  &:last-of-type {
    margin-bottom: 0;
  }
}
.disabled {
  color: #b6b6b6;
}
@media (max-width: 1240px) {
  .footer-wrap {
    padding: 20px 16px 20px 16px;
    height: 468px;
    .footer-content {
      flex-direction: column;
      width: auto;
    }
    .footer-title {
      width: 100%;
      height: 32px;
    }
    .footer-icon {
      width: 165px;
      height: 32px;
    }
    .nav-list {
      margin-left: 0;
      width: 100%;
      flex-wrap: wrap;
      margin-top: 16px;
      padding-top: 16px;
      padding-bottom: 35px;
      .nav-type-list {
        width: 50%;
        height: auto;
        margin-bottom: 50px;
        margin-right: 0;
        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
