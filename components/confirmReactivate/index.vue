<template>
  <div class="dialog-confirm-reactivate">
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
          {{ $t('are_you_sure_you_want_to_reactivate') }}
        </div>
        <p class="description">
          {{ $t('if_you_continue_with_this_action_the_resource_will_be_reactivated') }}
          <br>
          <br>
          {{ $t('type_the_word') }}
          <span class="confirm-word uppercase">
            {{ securityWord }}
          </span>
          {{ $t('to_reactivate') }}
        </p>

        <InputText v-model="verifyWord" class="uppercase text-center" @keyup.enter="handlerConfirmReactivate" />

        <p v-if="isIncorrect" class="incorrect">
          {{ $t('incorrect_value_to_confirm') }}
        </p>
        <div class="tools">
          <Button class="btn btn-block btn-info" @click="handlerConfirmReactivate">
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