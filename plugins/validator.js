class ValidatorService {
  constructor(context) {
    this.context = context;
  }

  isRequiredCheckbox(content) {
    return content === false
  }

  isRequiredPicker(content) {
    return content === null;
  }

  isRequired(content) {
    return content.length === 0;
  }

  isEmail(email) {
    const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(String(email).toLowerCase());
  }

  isPhone(phone) {
    const regExp = /^[0-9]$/;
    return regExp.test(String(phone).toLowerCase());
  }

  isPasswordLengthMin(password) {
    return password.length < 6;
  }

  isMinMax(string, min, max) {
    return string.length < min || string.length > max;
  }
}

export default (context, inject) => {
  inject("validatorService", new ValidatorService(context));
};
