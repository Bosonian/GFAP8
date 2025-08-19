import { config } from '../core/config.js';


export function calculateDrivers(inputs, type) {
const drivers = {};
if (type === 'ich') {
if (inputs.gfap_value !== undefined) {
const gfapImpact = normalizeImpact(inputs.gfap_value, config.gfapRanges.min, config.gfapRanges.critical);
drivers['GFAP Value'] = gfapImpact * 0.5;
}
if (inputs.systolic_bp !== undefined) {
const bpImpact = normalizeImpact(inputs.systolic_bp, 120, 200);
drivers['Systolic BP'] = bpImpact * 0.3;
}
if (inputs.headache) drivers['Headache'] = 0.2;
if (inputs.vigilanzminderung) drivers['Vigilance↓'] = 0.15;
if (inputs.age_years !== undefined) {
const ageImpact = normalizeImpact(inputs.age_years, 40, 80);
drivers['Age'] = ageImpact * -0.1;
}
} else if (type === 'lvo') {
if (inputs.fast_ed_score !== undefined) {
const fastImpact = normalizeImpact(inputs.fast_ed_score, 0, 9);
drivers['FAST-ED'] = fastImpact * 0.6;
}
if (inputs.eye_deviation) drivers['Eye Deviation'] = 0.3;
if (inputs.armparese) drivers['Arm Paresis'] = 0.25;
if (inputs.beinparese) drivers['Leg Paresis'] = 0.2;
if (inputs.atrial_fibrillation) drivers['Atrial Fib'] = 0.15;
if (inputs.systolic_bp < 120) drivers['Low BP'] = -0.2;
}
return drivers;
}


export function normalizeImpact(value, min, max) {
return Math.max(0, Math.min(1, (value - min) / (max - min)));
}


export function calculateConfidence(inputs, module) {
let confidence = 0.5;
if (module === 'full') confidence = 0.85;
else if (module === 'limited') confidence = 0.65;
else if (module === 'coma') confidence = 0.75;
if (inputs.gfap_value > config.gfapRanges.critical) confidence += 0.1;
return Math.min(confide