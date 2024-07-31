<template>
  <div class="last-transactions">
    <div class="transaction-title">
      <div class="label">Latest Transactions</div>
    </div>
    <div class="transaction-table">
      <div class="table-header border-b">
        <div class="header-item transaction-box-left">Status</div>
        <div class="header-item transaction-box-left">From/To</div>
        <div class="header-item transaction-box-left">Asset</div>
        <div class="header-item transaction-box-center">Amount</div>
        <div class="header-item transaction-box-right">Source TX</div>
        <div class="header-item transaction-box-right">Destination TX</div>
        <div class="header-item transaction-box-right">Time</div>
      </div>
      <div class="table-row border-b">
        <div class="header-item transaction-box-left">
            <div>
                <svg class="status-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none">
                    <rect id="vuesax/linear/refresh-2" width="16.000000" height="16.000000" fill="#FFCC2D" fill-opacity="0"/>
                    <path id="Vector" d="M14.66 8C14.66 11.67 11.68 14.66 8 14.66C4.32 14.66 2.07 10.96 2.07 10.96M1.33 8C1.33 4.32 4.29 1.33 8 1.33C12.44 1.33 14.66 5.04 14.66 5.04M11.7 5.04L14.66 5.04L14.66 1.7M2.07 14.29L2.07 10.96L5.08 10.96" stroke="#3478F5" stroke-opacity="1.000000" stroke-width="1.000000" stroke-linejoin="round" stroke-linecap="round"/>
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none">
                    <circle cx="8.000000" cy="8.000000" r="7.500000" stroke="#1EB4AB" stroke-opacity="1.000000" stroke-width="1.000000"/>
                    <mask id="mask_2176_1251" fill="white">
                        <path d="M11.1795 5.93555C10.9843 5.74023 10.6677 5.74023 10.4724 5.93555L7.29034 9.11719L5.52106 7.34766C5.32581 7.15234 5.00922 7.15234 4.81396 7.34766C4.61871 7.54297 4.61871 7.85938 4.81396 8.05469L6.9353 10.1758C6.94238 10.1836 6.94965 10.1914 6.95709 10.1973C7.15344 10.373 7.45532 10.3672 7.64398 10.1777L11.1795 6.64258C11.3748 6.44727 11.3748 6.13086 11.1795 5.93555Z" clip-rule="evenodd" fill="" fill-opacity="1.000000" fill-rule="evenodd"/>
                    </mask>
                    <path d="M11.1795 5.93555C10.9843 5.74023 10.6677 5.74023 10.4724 5.93555L7.29034 9.11719L5.52106 7.34766C5.32581 7.15234 5.00922 7.15234 4.81396 7.34766C4.61871 7.54297 4.61871 7.85938 4.81396 8.05469L6.9353 10.1758C6.94238 10.1836 6.94965 10.1914 6.95709 10.1973C7.15344 10.373 7.45532 10.3672 7.64398 10.1777L11.1795 6.64258C11.3748 6.44727 11.3748 6.13086 11.1795 5.93555Z" clip-rule="evenodd" fill="#1EB4AB" fill-opacity="1.000000" fill-rule="evenodd" mask="url(#mask_2176_1251)"/>
                    <path d="" clip-rule="evenodd" fill="#979797" fill-opacity="0.000000" fill-rule="evenodd"/>
                </svg>
            </div>
        </div>
        <div class="header-item transaction-box-left">
            <svg-icon class="token-icon" iconName="324"></svg-icon>
            <svg-icon class="token-icon" iconName="arrow-right"></svg-icon>
            <svg-icon class="token-icon" iconName="1"></svg-icon>
        </div>
        <div class="header-item transaction-box-left">Asset</div>
        <div class="header-item transaction-box-center">Amount</div>
        <div class="header-item transaction-box-right">Source TX</div>
        <div class="header-item transaction-box-right">Destination TX</div>
        <div class="header-item transaction-box-right">Time</div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon.vue'
export default {
  components: { SvgIcon },
  name: 'LatestTransactions',
}
</script>

<style scoped lang="scss">
.last-transactions {
  width: 100%;
  margin: 4px 0 20px;
  .transaction-box-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    text-align: left;
  }
  .transaction-box-center {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    text-align: right;
  }
  .transaction-box-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    white-space: nowrap;
    text-align: right;
  }
  .border-b {
    border-bottom: 1px solid rgb(230, 230, 230);
  }
  .transaction-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label {
      font-size: 20px;
      font-family: 'Kodchasan-SemiBold';
      line-height: 32px;
      letter-spacing: 0px;
    }
  }
  .transaction-table {
    width: 100%;
    margin-top: 10px;
    border-radius: 12px;
    background: rgb(255, 255, 255);
    .table-header {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0%;
      color: #a3a3a3;
      padding: 12px 16px;
      font-family: GeneralSans-Regular;
      .header-item {
        flex: 1;
      }
      .header-item.transaction-box-center{
        flex: 0.8;
      }
    }
    .table-row {
        width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0%;
      padding: 18px 16px;
      font-family: GeneralSans-Medium;
      color: #1A1A1A;
      .header-item {
        flex: 1;
        .status-icon {
            width: 16px;
            height: 16px;
        }
        .token-icon {
            width: 28px;
            height: 28px;
        }
      }
      .header-item.transaction-box-center{
        flex: 0.8;
      }
    }
  }
}
</style>
