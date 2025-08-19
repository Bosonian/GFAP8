import { config } from '../../core/config.js';


export default function coma({ renderProgress }) {
return `
<div class="container">
${renderProgress(2)}
<h2>Coma Module</h2>
<p class="subtitle">ICH Risk Assessment for Comatose Patients</p>
<div class="critical-alert">
<h4><span class="alert-icon">🚨</span> Critical Patient</h4>
<p>Patient is comatose (GCS &lt; 8). Rapid assessment required.</p>
</div>
<form data-module="coma">
<div class="input-grid">
<div class="input-group">
<label for="gfap_value">
GFAP Value (pg/mL)
<span class="tooltip">ℹ️
<span class="tooltiptext">Glial Fibrillary Acidic Protein - Brain injury biomarker</span>
</span>
</label>
<input type="number" id="gfap_value" name="gfap_value" min="${config.gfapRanges.min}" max="${config.gfapRanges.max}" step="0.1" required aria-describedby="gfap-help">
<div id="gfap-help" class="input-help">
Range: ${config.gfapRanges.min} - ${config.gfapRanges.max} pg/mL
</div>
</div>
</div>
<button type="submit" class="primary">Analyze ICH Risk</button>
<button type="button" class="secondary" data-action="reset">Start Over</button>
</form>
</div>
`;
}