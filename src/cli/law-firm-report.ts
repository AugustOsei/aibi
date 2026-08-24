import { calculateLawFirmBaseline } from "../possible/law-firm-baseline";

const report = calculateLawFirmBaseline();
const roleLabel = (role: string) => role.replaceAll("_", " ");

console.log(`Law Firm Practical AI Baseline — ${report.effectiveDate} / v${report.version}`);
console.log(`Experimental scoring configuration: v${report.scoreConfigurationVersion}`);
console.log(`Overall baseline: ${report.overallPracticality}/100`);
console.log("\nFunctions:");

for (const businessFunction of report.functions) {
  console.log(`\n- ${businessFunction.name}: ${businessFunction.practicality}/100`);
  for (const task of businessFunction.tasks) {
    console.log(`  - ${task.taskName}: ${task.practicality} | ${roleLabel(task.recommendedRole)} | limit: ${task.majorLimitingFactor} | evidence: ${task.evidenceConfidence}`);
  }
}

console.log(`\nTraceable inputs: ${report.inputs.length}`);
