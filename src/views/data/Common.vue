<template>
    <div></div>
</template>

<script>
  export default {
    name: 'common',
    components: {},
    props: {},
    data () {
      return {
          allTab: ['arbitrum', 'optimism', 'zksync', 'arbitrumnova', 'starknet']
      }
    },
    methods: {
      onRowClick(row) {
        this.handleRoute({ floater: row.dapp_name });
      },
      rollupChange(rollup_tab) {
        this.handleRoute({ rollup_tab });
      },
      closeDappDetail() {
        const { path, query } = this.$route;
        const newQuery = JSON.parse(JSON.stringify(query || {}));
        delete newQuery.floater;
        const suffixArr = [];
        for (const key in newQuery) {
          suffixArr.push(`${ key }=${ newQuery[key] }`);
        }
        const newPath = path + '?' + suffixArr.join('&');
        this.$router.replace({ path: newPath, query: newQuery });
      },
      handleRoute({ rollup_tab, floater }) {
        const { path, query } = this.$route;
        const newQuery = JSON.parse(JSON.stringify(query || {}));
        if (rollup_tab instanceof Array) {
            rollup_tab = rollup_tab[0];
        }
        if (floater instanceof Array) {
            floater = floater[0];
        }
        if (rollup_tab) {
            if (!this.allTab.includes(rollup_tab)) {
                rollup_tab = 'arbitrum';
            }
          if (newQuery?.rollup_tab !== rollup_tab) {
            newQuery.rollup_tab = rollup_tab;
            this.currentRollup = rollup_tab;
            const suffixArr = [];
            for (const key in newQuery) {
              suffixArr.push(`${ key }=${ newQuery[key] }`);
            }
            const newPath = path + '?' + suffixArr.join('&');
            this.$router.replace({ path: newPath, query: newQuery });
          } else {
            this.currentRollup = rollup_tab;
          }
        }
        if (floater) {
          if (newQuery?.floater !== floater) {
            newQuery.floater = floater;
            this.$refs.dappDetail.show(this.currentRollup, (this.currentTableData || this.tableData).find(item=>item.dapp_name === floater));
            let suffixArr = [];
            for (const key in newQuery) {
              suffixArr.push(`${ key }=${ newQuery[key] }`);
            }
            const newPath = path + '?' + suffixArr.join('&');
            this.$router.replace({ path: newPath, query: newQuery });
          } else {
              const row = (this.currentTableData || this.tableData).find(item=>item.dapp_name === floater);
              if (row) {
                  this.$refs.dappDetail.show(this.currentRollup, row);
              } else {
                  this.closeDappDetail();
              }
          }
        }
      }
    },
    watch:{
      tableData(){
        if(this.tableData && this.tableData.length){
          const { query } = this.$route;
          if (query?.floater) {
            this.handleRoute({
              floater: query?.floater
            });
          }
        }
      },
      rollups(){
        if(this.rollups && this.rollups.length){
          const { query } = this.$route;
          this.handleRoute({
            rollup_tab: query?.rollup_tab || this.rollups[0].value
          });
        }
      }
    },
    computed: {}
  }
</script>
