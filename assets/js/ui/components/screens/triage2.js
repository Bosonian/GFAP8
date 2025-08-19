export default function triage2({ renderProgress }) {
return `
<div class="container">
${renderProgress(1)}
<h2>Examination Capability</h2>
<p class="subtitle">Determine Assessment Module</p>
<div class="triage-question">
Can the patient be reliably examined?
<small>Patient is not aphasic, confused, or uncooperative</small>
</div>
<div class="triage-buttons">
<button class="yes-btn" data-action="triage2" data-value="true">YES - Full Exam Possible</button>
<button class="no-btn" data-action="triage2" data-value="false">NO - Limited Exam Only</button>
</div>
</div>
`;
}