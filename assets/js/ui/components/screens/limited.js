import { config } from '../../core/config.js';


export default function limited({ renderProgress }) {
return `
<div class="container">
${renderProgress(2)}
<h2>Limited Data Module</h2>
<p class="subtitle">ICH Risk Assessment with Limited Examination</p>
<form data-module="limited">
<div class="input-grid">
<div class="input-group">
<label for="age_years">Age (years)</label>
<input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
<div id="age-help" class="input-help">Patient's age in years</div>
</div>
<div class="input-group">
<label for="systolic_bp">Systolic BP (mmHg)</label>
<input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help">
<div id="sbp-help" class="input-help">Normal: 90-140 mmHg</div>
</div>
<div class="input-group">
<label for="diastolic_bp">Diastolic BP (mmHg)</label>
<input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help">
<div id="dbp-help" class="input-help">Normal: 60-90 mmHg</div>
</div>
<div class="input-group">
<label for="gfap_value">
GFAP Value (pg/mL)
<span class="tooltip">ℹ️
<span class="tooltiptext">Glial Fibrillary Acidic Protein</span>
</span>
</label>
<input type="number" name="gfap_value" id="gfap_value" min="${config.gfapRanges.min}" max="${config.gfapRanges.max}" step="0.1" required>
</div>
</div>
<div class="checkbox-group">
<label class="checkbox-wrapper">
<input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
<span class="checkbox-label">Vigilance Reduction (Decreased alertness)</span>
</label>
</div>
<button type="submit" class="primary">Analyze ICH Risk</button>
<button type="button" class="secondary" data-action="reset">Start Over</button>
</form>
</div>
`;
}