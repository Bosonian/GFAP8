// assets/js/models/calculations.js

// Example logistic regression helpers
function logistic(x) {
  return 1 / (1 + Math.exp(-x));
}

function comaModel({ GFAP }) {
  // Placeholder: replace coefficients with validated study values
  const b0 = -2.5;
  const b1 = 0.01;
  const x = b0 + b1 * parseFloat(GFAP || 0);
  return logistic(x);
}

function limitedModel({ GFAP, sbp }) {
  const b0 = -3.2;
  const b1 = 0.02;
  const b2 = 0.01;
  const x =
    b0 +
    b1 * parseFloat(GFAP || 0) +
    b2 * parseFloat(sbp || 0);
  return logistic(x);
}

function fullModel({ GFAP, age, sbp }) {
  const b0 = -4.1;
  const b1 = 0.03;
  const b2 = 0.02;
  const b3 = 0.01;
  const x =
    b0 +
    b1 * parseFloat(GFAP || 0) +
    b2 * parseFloat(age || 0) +
    b3 * parseFloat(sbp || 0);
  return logistic(x);
}

export function calculateModels(formData, module) {
  let prob = 0;

  if (module === 'coma') {
    prob = comaModel(formData[module]);
  } else if (module === 'limited') {
    prob = limitedModel(formData[module]);
  } else if (module === 'full') {
    prob = fullModel(formData[module]);
  }

  return {
    module,
    probability: prob,
    riskCategory: prob > 0.5 ? 'High risk' : 'Low risk'
  };
}
