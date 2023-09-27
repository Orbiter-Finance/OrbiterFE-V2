export default {
  data() {
    return {
      showData: false,
    }
  },
  mounted() {
    document
      .getElementById('app')
      .addEventListener('scroll', this.handleScroll, false)
  },
  destroyed() {
    document
      .getElementById('app')
      .removeEventListener('scroll', this.handleScroll, false)
  },
  methods: {
    handleScroll() {
      const screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      const content = document.getElementsByClassName('fade-content')
      Array.from(content).forEach((element, index) => {
        if (
          element?.getBoundingClientRect()?.top < screenHeight - 100 &&
          element?.getBoundingClientRect()?.top > 0
        ) {
          if (index === 0) {
            this.showData = true
            return
          }
          element?.classList.add('contain')
        }
      })
    },
  },
}
