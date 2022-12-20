<template>
  <svg-icon
    :iconName="logoName(id)"
    style="width: 1.6rem; height: 1.6rem"
  ></svg-icon>
</template>

<script>
export default {
  name: 'ChainLogoIcon',
  props: {
    id: [String, Number]
  },
  methods: {
    logoName(chainID) {
      if (chainID == '2' || chainID == '22') {
        return 'arblogo'
      } else if (chainID == '3' || chainID == '33') {
        return 'zklogo'
      } else if (chainID == '4' || chainID == '44') {
        return 'sknlogo'
      } else if (chainID == '6' || chainID == '66') {
        return 'pglogo'
      } else if (chainID == '7' || chainID == '77') {
        return 'oplogo'
      } else if (chainID == '8' || chainID == '88') {
        return 'imxlogo'
      } else if (chainID == '9' || chainID == '99') {
        return 'loopringlogo'
      } else if (chainID == '10' || chainID == '510') {
        return 'metislogo'
      } else if (chainID == '11' || chainID == '511') {
        return 'dydxlogo'
      } else if (chainID == '12' || chainID == '512') {
        return 'zkspacelogo'
      } else if (chainID == '13' || chainID == '513') {
        return 'bobalogo'
      } else if (chainID == '14' || chainID == '514') { // zksync2
        return 'zk2logo'
      }else if (chainID == '15' || chainID == '515') {
        return 'bsclogo'
      }else if (chainID == '16' || chainID == '516') {
        return 'arnavologo'
      }else if (chainID == '17' || chainID == '517') {
        return 'polygon_zkevm_logo'
      } else if (chainID == '518' || chainID == '519') {
        return 'scrolllogo'
      } else {
        return 'ethlogo'
      }
    },
  }
}
</script>
