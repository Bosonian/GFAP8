import { config } from '../core/config.js';
import { clamp01 } from './formatters.js';


export function runModels(inputs, module) {
return new Promise((resolve) => {
setTimeout(() => {
const results = calculateResults(inputs, module);
resolve(results);
}, 300); // snappy UX; adjust if you want longer simulated work
});
}


export function calculateResults(inputs, module) {
let results = {};


if (module === 'coma') {
const logGFAP = Math.log10(Math.max(inputs.gfap_value, 1));
const logit = -6.30 + 2.25 * logGFAP;
const probability = 1 / (1 + Math.exp(-logit));
results.ich = {
probability: Math.min(Math.max(probability, 0.01), 0.99),
module: 'Coma',
// drivers/confidence set in drivers.js helpers at render time, or here if you prefer
};
} else if (module === 'limited') {
let ichScore = 0;
if (inputs.systolic_bp > 180) ichScore += 3;
else if (inputs.systolic_bp > 160) ichScore += 2;
else if (inputs.systolic_bp > 140) ichScore += 1;


if (inputs.gfap_value > config.gfapRanges.critical) ichScore += 4;
else if (inputs.gfap_value > config.gfapRanges.elevated) ichScore += 3;
else if (inputs.gfap_value > config.gfapRanges.normal) ichScore += 1;


if (inputs.vigilanzminderung) ichScore += 2;
if (inputs.age_years > 75) ichScore += 1;


const ichProb = Math.min(0.05 + (ichScore * 0.1), 0.95);
results.ich = { probability: ichProb, module: 'Limited Data' };
results.lvo = { notPossible: true };
} else if (module === 'full') {
let ichScore = 0;
if (inputs.systolic_bp > 180) ichScore += 2;
else if (inputs.systolic_bp > 160) ichScore += 1.5;
else if (inputs.systolic_bp > 140) ichScore += 0.5;


if (inputs.gfap_value > config.gfapRanges.critical) ichScore += 3;
else if (inputs.gfap_value > config.gfapRanges.elevated) ichScore += 2;
else if (inputs.gfap_value > config.gfapRanges.normal) ichScore += 1;


if (inputs.headache) ichScore += 2;
if (inputs.vigilanzminderung) ichScore += 1.5;
if (inputs.anticoagulated_noak) ichScore += 1;


const ichProb = Math.min(0.05 + (ichScore * 0.08), 0.95);
results.ich = { probability: ichProb, module: 'Full Stroke' };


let lvoScore = 0;
if (inputs.fast_ed_score >= 6) lvoScore += 4;
else if (inputs.fast_ed_score >= 4) lvoScore += 3;
else if (inputs.fast_ed_score >= 2) lvoScore += 1;


if (inputs.eye_deviation) lvoScore += 2.5;
if (inputs.armparese) lvoScore += 2;
if (inputs.beinparese) lvoScore += 1.5;
if (inputs.atrial_fibrillation) lvoScore += 1;
if (inputs.systolic_bp < 120) lvoScore -= 1;
if (inputs.age_years < 50) lvoScore -= 0.5;


const lvoProb = clamp01(0.05 + (lvoScore * 0.1));
const finalLvo = Math.max(0.01, Math.min(0.95, lvoProb));


results.lvo = { probability: finalLvo, module: 'Full Stroke' };
}


return results;
}