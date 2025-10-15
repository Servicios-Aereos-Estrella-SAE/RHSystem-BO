<template>
  <div class="dialog-confirm-delete">
    <div class="content-wrapper">
      <div class="content">
        <div class="icon-wrapper">
          <div class="icon">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.45 2.15C14.992 4.057 17.587 5 20.25 5a.75.75 0 0 1 .75.75V11c0 5.001-2.958 8.676-8.725 10.948a.75.75 0 0 1-.55 0C5.958 19.676 3 16 3 11V5.75A.75.75 0 0 1 3.75 5c2.663 0 5.258-.943 7.8-2.85a.75.75 0 0 1 .9 0ZM12 16a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0-9.018a.75.75 0 0 0-.743.648l-.007.102v6.5l.007.102a.75.75 0 0 0 1.486 0l.007-.102v-6.5l-.007-.102A.75.75 0 0 0 12 6.982Z"
                fill="#fff" class="fill-212121"></path>
            </svg>
          </div>
        </div>
        <div class="title">
          {{ $t('shift_exceptions_with_some_error') }}
        </div>
        <p class="description">
          {{ $t('the_following_dates_could_not_be_registered') }}
          <br>
          <br>
          {{ $t('verify_the_information') }}
        </p>
        <div class="table-container">
          <table border="1" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th class="wide-column">{{ $t('date') }}</th>
                <th>{{ $t('employee') }}</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(exception, index) in shiftExceptions" :key="index">
                <td>{{ exception.shiftExceptionsDate }}</td>
                <td> {{ exception.employee.person?.personFirstname }}
                  {{ exception.employee.person?.personLastname }}
                  {{ exception.employee.person?.personSecondLastname }}</td>
                <td>{{ exception.error }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="tools">
          <Button class="btn btn-block btn-info" @click="handlerConfirm">
            {{ $t('confirm') }}
          </Button>
          <Button class="btn btn-block" @click="handlerCancel">
            {{ $t('cancel') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>