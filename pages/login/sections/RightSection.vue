<template>
  <div class="right-side">
    <div class="right-side__block">
      <div class="right-side__block__title">
        {{$t('ThePageLogin_RightSection_Title')}}
      </div>
      <form>
      <recaptcha/>
      <AppFieldControllDefault
        class="right-side__block__field-controll"
        :label="$t('App_Email')"
      >
        <AppInputDefault
          @blur="handleOnBlur('email')"
          v-model="form.email"
          :disabled="isLoading"
          class="form__field form-control"
          :class="{
            'input-default--error': errors.email,
            'is-invalid': errors.email,
            'input-default--success': errors.email === false,
            'is-valid': errors.email === false
          }"
        />
        <transition name="fade">
          <small v-if="errors.email" id="email" class="form-text text-danger">
            {{ errors.email }}
          </small>
        </transition>
      </AppFieldControllDefault>
      <AppFieldControllDefault
        class="right-side__block__field-controll"
        :label="$t('App_Password')"
      >
        <AppInputDefault
          type="password"
          @blur="handleOnBlur('password')"
          v-model="form.password"
          :disabled="isLoading"
          class="form__field form-control"
          :class="{
            'input-default--error': errors.password,
            'is-invalid': errors.password,
            'input-default--success': errors.password === false,
            'is-valid': errors.password === false
          }"
        />
        <transition name="fade">
          <small
            v-if="errors.password"
            id="password"
            class="form-text text-danger"
          >
            {{ errors.password }}
          </small>
        </transition>
      </AppFieldControllDefault>
      <div class="right-side__block__forgot-password d-flex align-items-center justify-content-md-start">
        <span>{{ $t('ThePageLogin_RightSection_ForgotTitle') }}</span>
        <NuxtLink to="/forgot_password">{{$t('ThePageLogin_RightSection_ForgotDescription')}}</NuxtLink>
      </div>
      <AppButtonDefault @click.native="handleFormSubmited"  :disabled="isLoading">
        <div v-if="!isLoading">
          {{$t('ThePageLogin_RightSection_Button')}}
          <AppIconNext class="ml-4 " />
        </div>
        <div v-else>
          <b-spinner small/>
        </div>
      </AppButtonDefault>
      </form>
    </div>
  </div>
</template>

<script>
import AppIconNext from "@/components/AppIconNext";
import AppFieldControllDefault from "@/components/AppFieldControllDefault";
import AppInputDefault from "@/components/AppInputDefault";
import AppButtonDefault from "@/components/AppButtonDefault";

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errors: {
        email: null,
        password: null
      },
      formIsTouched:false,
      formIsDirty: false,
      formIsValid: false,
      mounted: false,
      isLoading: false
    };
  },
  watch: {
    "form.email": function() {
      if(!this.formIsTouched) return
      this.formIsDirty = true;
      this.errors.email = this.emailValidation();
      this.checkFormIsValid();
    },
    "form.password": function() {
      if(!this.formIsTouched) return
      this.formIsDirty = true;
      this.errors.password = this.passwordValidation();
      this.checkFormIsValid();
    }
  },
  components: {
    AppIconNext,
    AppFieldControllDefault,
    AppInputDefault,
    AppButtonDefault
  },
  methods: {
    async cleanForm(event) {
      // Do reset form
      event.target.reset();
      // Clean form
      this.clearFormFields();
      // Set form is not dirty
      this.formIsDirty = false;
      // Check form is valid
      await this.checkFormIsValid();
      // Do clear errors
      this.clearErrors();
    },
    clearFormFields() {
      this.form.email = "";
      this.form.password = "";
    },
    clearErrors() {
      this.errors.email = null;
      this.errors.password = null;
    },
    handleOnBlur(fieldName) {
      // Set form is dirty
      this.formIsDirty = true;
      // Validate field
      this.validateField(fieldName);
      // Do validate
      this.checkFormIsValid();
    },
    async handleFormSubmited(e) {
      e.preventDefault()
      this.formIsTouched = true
      // Do validate form
      this.validateForm();
      if (!this.errors.email && !this.errors.password) {
        // Get the toast ID on creation
        this.isLoading = true
        try {
          this.form.recaptchaToken = await this.$recaptcha.getResponse()

          const res = await this.$auth.loginWith("local", { data: this.form });
          await this.$fraestechnik.user.fetchItem()
          await this.$fraestechnik.user.loadItems([res.data.user]);
          this.isLoading = false
          this.$toast.success(this.$i18n.t('WELCOME'));
          this.$router.push("/");
        } catch (error) {
          this.isLoading = false
        }
      }
    },
    validateField(fieldName) {
      if (fieldName === "email") {
        this.errors.email = this.emailValidation();
      }
      if (fieldName === "password") {
        this.errors.password = this.passwordValidation();
      }
    },
    validateForm() {
      this.errors.email = this.emailValidation();
      this.errors.password = this.passwordValidation();
    },
    checkFormIsValid() {
      for (const key in this.errors) {
        if (this.errors[key] !== false && this.formIsDirty) {
          this.formIsValid = false;
          return;
        }
      }
      this.formIsValid = true;
    },
    // ----------------------------
    passwordValidation() {
      if (this.$validatorService.isRequired(this.form.password)) {
        return this.$i18n.t('ERROR_FIELD_REQUIRED')
      }
      if (this.$validatorService.isPasswordLengthMin(this.form.password)) {
        return this.$i18n.t('ERROR_FIELD_CHARS')
      }
      return false;
    },
    emailValidation() {
      if (this.$validatorService.isRequired(this.form.email)) {
        return this.$i18n.t('ERROR_FIELD_REQUIRED')
      } else if (!this.$validatorService.isEmail(this.form.email)) {
        return this.$i18n.t('ERROR_FIELD_INVALID_EMAIL')
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>

  .right-side {
    &__block {

      &__title {
        color: #0d2f3d;
        font-family: "IBM Plex Sans", sans-serif;
        font-weight: Bold;
        font-size: 26px;
        line-height: 34px;
        margin-bottom: 27px;
      }

      &__field-controll {
        margin-bottom: 20px;
      }

      &__forgot-password {
        margin-bottom: 45px;

        span {
          margin-bottom: 12px;
          font-family: "Roboto", sans-serif;
          font-weight: 400;
          font-size: 18px;
          line-height: 32px;
        }

        a {
          color: #88b09f;
          text-decoration: underline;
          margin-bottom: 12px;
          font-family: "Roboto", sans-serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 32px;
          margin-left: 15px;
        }
      }
    }
  }

</style>
