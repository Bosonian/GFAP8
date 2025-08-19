import { config } from '../core/config.js';


export function getRiskLevel(probabilityPercent, type) {
const p = Number(probabilityPercent);
const thresholds = config.criticalThresholds[type];
if (p >= thresholds.critical) return '🔴 CRITICAL RISK';
if (p >= thresholds.high) return '🟠 HIGH RISK';
if (p >= 30) return '🟡 MODERATE RISK';
return '🟢 LOW RISK';
}


export function generateRecommendations(ich, lvo) {
const recommendations = [];
if (ich) {
const ichPercent = ich.probability * 100;
if (ichPercent > 80) {
recommendations.push('🚨 IMMEDIATE: Urgent CT imaging required');
recommendations.push('🚨 Consider immediate BP management if SBP > 150');
recommendations.push('🚨 Prepare for potential neurosurgical consultation');
} else if (ichPercent > 60) {
recommendations.push('⚠️ HIGH PRIORITY: Expedite CT imaging');
recommendations.push('⚠️ Monitor blood pressure closely');
recommendations.push('⚠️ Consider withholding anticoagulation');
} else if (ichPercent > 30) {
recommendations.push('📍 Standard stroke protocol with close monitoring');
recommendations.push('📍 Obtain CT imaging as per protocol');
} else {
recommendations.push('✓ Low ICH risk - proceed with standard evaluation');
}
}
if (lvo && !lvo.notPossible) {
const lvoPercent = lvo.probability * 100;
if (lvoPercent > 70) {
recommendations.push('🚁 Consider direct transport to comprehensive stroke center');
recommendations.push('🚁 Alert interventional team for potential thrombectomy');
} else if (lvoPercent > 50) {
recommendations.push('🏥 Transport to stroke-capable facility');
recommendations.push('🏥 Consider CTA for LVO confirmation');
} else if (lvoPercent > 30) {
recommendations.push('📊 Moderate LVO risk - standard stroke evaluation');
}
}
recommendations.push('⏱️ Document symptom onset time accurately');
recommendations.push('📞 Notify receiving facility early for resource preparation');
return recommendations;
}