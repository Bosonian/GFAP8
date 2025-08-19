// assets/js/utils/validation.js

export function validateForm(data, module) {
  const errors = {};
  let valid = true;

  // Define validation rules per module
  const rules = {
    coma: { GFAP: { required: true, min: 0 } },
    limited: {
      GFAP: { required: true, min: 0 },
      sbp: { required: true, min: 50, max: 300 }
    },
    full: {
      GFAP: { required: true, min: 0 },
      age: { required: true, min: 0, max: 120 },
      sbp: { required: true, min: 50, max: 300 }
      // extend with other inputs as needed
    }
  };

  const moduleRules = rules[module] || {};

  for (const [field, rule] of Object.entries(moduleRules)) {
    const value = data[field];
    if (rule.required && (!value || value === '')) {
      errors[field] = [`${field} is required`];
      valid = false;
      continue;
    }
    if (rule.min !== undefined && parseFloat(value) < rule.min) {
      errors[field] = [`Value must be at least ${rule.min}`];
      valid = false;
    }
    if (rule.max !== undefined && parseFloat(value) > rule.max) {
      errors[field] = [`Value must be at most ${rule.max}`];
      valid = false;
    }
  }

  return { valid, errors };
}

export function restoreFormData(module, container) {
  const saved = localStorage.getItem('gfapAppData');
  if (!saved) return;
  const formData = JSON.parse(saved);
  const data = formData[module];
  if (!data) return;

  Object.entries(data).forEach(([field, value]) => {
    const input = container.querySelector(`[name="${field}"]`);
    if (input) input.value = value;
  });
}
