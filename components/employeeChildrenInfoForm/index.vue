<template>
  <div class="box children-info-form">
    <Toast />
    <h4>
      {{ isNewChildren ? 'New children' : 'Update children' }}
    </h4>
    <div v-if="isReady" class="children-form">
      <div class="form-container">
        <div class="input-box">
          <label for="employeeChildrenFirstname">First Name</label>
          <InputText v-model="employeeChildren.employeeChildrenFirstname" placeholder="Enter First Name" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employeeChildren.employeeChildrenFirstname">First name is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeChildrenLastname">Last Name</label>
          <InputText v-model="employeeChildren.employeeChildrenLastname" placeholder="Enter Last Name" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employeeChildren.employeeChildrenLastname">Last name is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeChildrenSecondLastName">Second Last Name</label>
          <InputText v-model="employeeChildren.employeeChildrenSecondLastname" placeholder="Enter Second Last Name" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employeeChildren.employeeChildrenSecondLastname">Second last name is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeChildrenGender">Gender</label>
          <Dropdown v-model="employeeChildren.employeeChildrenGender" :options="genders" optionLabel="label" optionValue="value"
          placeholder="Select Gender" class="w-full md:w-14rem" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employeeChildren.employeeChildrenGender">Gender is required.</small>
        </div>
        <div class="input-box">
          <div class="hire-date-box-container">
            <label for="employeeChildrenBirthDate">Birthday</label>
            <div v-if="!displayChildrenBirthDateCalendar" class="hire-date-box">
              <InputText v-model="childrenBirthday" readonly class="capitalize" :disabled="isDeleted" />
              <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="handlerDisplayChildrenBirthDate"
                :disabled="isDeleted">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayChildrenBirthDateCalendar" class="date-box-controller">
              <Calendar v-model="employeeChildren.employeeChildrenBirthday" placeholder="Select birthday" :disabled="isDeleted" />
              <Button type="button" class="btn btn-block" id="display-input-hiredate"
                @click="displayChildrenBirthDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div><br>
          </div><small style="position: absolute;" class="p-error" v-if="submitted && !employeeChildren.employeeChildrenBirthday">Birthday is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
</style>