export function renderProgress(currentStep) {
const steps = [ { id: 1, label: 'Triage' }, { id: 2, label: 'Assessment' }, { id: 3, label: 'Results' } ];
let html = `<div class="progress-indicator">`;
steps.forEach((step, index) => {
const isActive = step.id === currentStep;
const isCompleted = step.id < currentStep;
html += `
<div class="progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
${isCompleted ? '' : step.id}
</div>
`;
if (index < steps.length - 1) {
html += `<div class="progress-line ${isCompleted ? 'completed' : ''}"></div>`;
}
});
html += `</div>`;
return html;
}
