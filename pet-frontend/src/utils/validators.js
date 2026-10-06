export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");

export const isRequired = (value) => value !== undefined && value !== null && String(value).trim() !== "";

export const minLength = (value, len) => (value || "").trim().length >= len;

export const maxLength = (value, len) => (value || "").trim().length <= len;

export const isValidUsername = (value) => {
  const str = (value || "").trim();
  return /^[a-zA-Z0-9_ -]+$/.test(str) && /[a-zA-Z]/.test(str);
};

export const isPositiveNumber = (value) => !isNaN(value) && Number(value) > 0;

export const isNonNegativeInteger = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;

/**
 * Runs a set of field validators and returns an { field: message } error map.
 * rules: { fieldName: [[validatorFn, message], ...] }
 */
export const validateFields = (values, rules) => {
  const errors = {};
  Object.entries(rules).forEach(([field, checks]) => {
    for (const [check, message] of checks) {
      if (!check(values[field])) {
        errors[field] = message;
        break;
      }
    }
  });
  return errors;
};

