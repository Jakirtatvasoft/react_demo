type ValidationErrorType = {
  [key: string]: string;
};
type ValidationErrorMessageType = {
  [key: string]: string[];
};
type ValidationMessageType = {
  [key: string]: string;
};
type SetFormErrors = React.Dispatch<React.SetStateAction<ValidationErrorType>>;

export const setValidationErrors = (
  formErrors: ValidationErrorType,
  setFormErrors: SetFormErrors,
  errors: ValidationErrorMessageType
) => {
  Object.keys(formErrors).map((error, i) => {
    if (errors[error] && errors[error].length > 0) {
      // Set the first error for the current field
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        [error]: errors[error][0],
      }));
    } else {
      // If there are no errors for the current field, reset it to blank
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        [error]: "",
      }));
    }
  });
};

export const validator = <T extends Record<string, any>>(
  data: T,
  rules: ValidationErrorType,
  messages: ValidationMessageType = {},
  customAttributes = []
) => {
  let errors: ValidationErrorMessageType = {};

  if (Object.keys(rules).length > 0) {
    Object.keys(rules).map((validate) => {
      const validateArr = rules[validate].split("|");

      validateArr.map((rule) => {
        if (!errors[validate]) {
          let error = "";

          if (rule === "required") {
            error = validateRequired(
              validate,
              data[validate],
              messages[validate]
            );
          }

          if (rule === "email") {
            error = validateEmail(validate, data[validate], messages[validate]);
          }

          if (rule.includes("min")) {
            let minValue = parseInt(rule.split(":")[1]);
            error = validateMinimum(
              validate,
              data[validate],
              minValue,
              messages[validate]
            );
          }

          if (rule === "numbers") {
            error = validateNumbers(
              validate,
              data[validate],
              messages[validate]
            );
          }

          if (rule.includes("with_country_call_code")) {
            let countryCallCode = rule.split(":")[1];

            error = validateMobileWithCountryCallCode(
              validate,
              data[validate],
              countryCallCode,
              messages[validate]
            );
          }

          if (rule.includes("max_file")) {
            let maxFile = parseInt(rule.split(":")[1]);

            error = validateFileMaxFile(
              validate,
              data[validate],
              maxFile,
              messages[validate]
            );
          }

          if (rule.includes("max_size")) {
            let maxSize = parseInt(rule.split(":")[1]);

            error = validateFileMaxSize(
              validate,
              data[validate],
              maxSize,
              messages[validate]
            );
          }

          if (error) {
            errors[validate] = [error];
          }
        }
      });
    });
  }

  return errors;
};

const validateRequired = (
  validate: string,
  data: string | File[],
  message: string
) => {
  let errMsg = "";

  if (
    (Array.isArray(data) && data.length == 0) ||
    (!Array.isArray(data) && !data.trim())
  ) {
    errMsg = message || `The ${validate.replace(/_/g, " ")} field is required.`;
  }

  return errMsg;
};

const validateEmail = (validate: string, data: string, message: string) => {
  let errMsg = "";
  if (!data.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    errMsg =
      message ||
      `The ${validate.replace(/_/g, " ")} must be a valid email address.`;
  }

  return errMsg;
};

const validateMinimum = (
  validate: string,
  data: string,
  minValue: number,
  message: string
) => {
  let errMsg = "";
  if (data.length < minValue) {
    errMsg =
      message ||
      `The ${validate.replace(/_/g, " ")} must be at least 8 characters.`;
  }

  return errMsg;
};

const validateNumbers = (validate: string, data: string, message: string) => {
  let errMsg = "";
  if (!data.match(/^\d+$/)) {
    errMsg = message || `The ${validate.replace(/_/g, " ")} must be a digit.`;
  }

  return errMsg;
};

const validateFileMaxFile = (
  validate: string,
  data: File[],
  maxFile: number,
  message: string
) => {
  let errMsg = "";
  if (Object.keys(data).length > maxFile) {
    errMsg =
      message ||
      `Please upload maximum ${maxFile} ${validate.replace(/_/g, " ")}.`;
  }

  return errMsg;
};

const validateFileMaxSize = (
  validate: string,
  data: File[],
  maxSize: number,
  message: string
) => {
  let errMsg = "";
  let maxSizeInBytes = 1024 * 1024 * maxSize;
  let fileWithMaxSize = [];

  if (typeof data !== 'string') {
    fileWithMaxSize = Object.keys(data).filter(
      (file, key) => data[key].size > maxSizeInBytes
    );
  }


  if (fileWithMaxSize.length > 0) {
    errMsg =
      message ||
      `The ${validate.replace(/_/g, " ")} size must be ${maxSize}mb or less.`;
  }

  return errMsg;
};

const validateMobileWithCountryCallCode = (
  validate: string,
  data: string,
  countryCallCode: string,
  message: string
) => {
  let errMsg = "";

  switch (countryCallCode) {
    // AF/AU
    case "+93":
    case "+61":
      if (!data.match(/^\d{9}$/)) {
        errMsg =
          message || `The ${validate.replace(/_/g, " ")} must be 9 digit.`;
      }

    // NZ
    case "+64":
      if (!data.match(/^\d{8,10}$/)) {
        errMsg =
          message ||
          `The ${validate.replace(/_/g, " ")} must be 8 to 10 digit.`;
      }

    default:
      if (!data.match(/^\d{10}$/)) {
        errMsg =
          message || `The ${validate.replace(/_/g, " ")} must be 10 digit.`;
      }
  }

  return errMsg;
};
