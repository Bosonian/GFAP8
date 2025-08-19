import { renderProgress } from '../components/progress.js';
</div>
`;


return `
<div class="container">
${renderProgress(3)}
<h2>Assessment Results</h2>
<p class="subtitle">Clinical Decision Support Analysis</p>
${ich && ich.probability > 0.6 ? renderCriticalAlert() : ''}
<div style="display: flex; flex-direction: column; gap: 20px;">
${ichHtml}
${lvoHtml}
${recommendationsHtml}
</div>
<button type="button" class="primary" id="printResults"> 📄 Print Results </button>
<button type="button" class="secondary" data-action="reset"> Start New Assessment </button>
<div class="disclaimer">
<strong>⚠️ Important:</strong> These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols. Results generated at ${new Date().toLocaleTimeString()}.
</div>
</div>
`;
}


function renderDriversPanel(drivers, title, type) {
if (!drivers || Object.keys(drivers).length === 0) return '';
const sorted = Object.entries(drivers).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
const maxAbs = Math.max(...sorted.map(([, val]) => Math.abs(val)));
let html = `
<div class="drivers-panel">
<h4>
<span class="driver-icon ${type}">${type === 'ich' ? 'I' : 'L'}</span>
${title} Risk Factors
</h4>
`;
sorted.forEach(([feature, impact]) => {
const percentage = Math.abs(impact) * 100;
const width = maxAbs > 0 ? (Math.abs(impact) / maxAbs) * 100 : 0;
const isPositive = impact >= 0;
html += `
<div class="driver-item">
<span class="driver-label">${feature}</span>
<div class="driver-bar-container">
<div class="driver-bar ${isPositive ? 'positive' : 'negative'}" style="width: ${width}%">
<span class="driver-value">${isPositive ? '+' : ''}${percentage.toFixed(0)}%</span>
</div>
</div>
</div>
`;
});
html += `</div>`;
return html;
}


function renderCriticalAlert() {
return `
<div class="critical-alert">
<h4><span class="alert-icon">🚨</span> CRITICAL FINDING</h4>
<p>High probability of intracerebral hemorrhage detected.</p>
<p><strong>Immediate actions required:</strong></p>
<ul style="margin: 10px 0; padding-left: 20px;">
<li>Initiate stroke protocol immediately</li>
<li>Urgent CT imaging required</li>
<li>Consider blood pressure management</li>
<li>Prepare for potential neurosurgical consultation</li>
</ul>
</div>
`;
}