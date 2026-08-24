import { AI_CAPABILITY_VERSIONS, CAPABILITY_EVIDENCE } from "../data/ai-capabilities";
import {
  LAW_FIRM_ARCHETYPE,
  LAW_FIRM_FUNCTIONS,
  LAW_FIRM_TASK_CAPABILITY_MAPPINGS,
  LAW_FIRM_TASKS,
} from "../data/law-firm-model";
import { calculatePossibleBaseline } from "./calculate-baseline";

export const LAW_FIRM_BASELINE_DEFINITION = {
  archetype: LAW_FIRM_ARCHETYPE,
  functions: LAW_FIRM_FUNCTIONS,
  tasks: LAW_FIRM_TASKS,
  capabilityVersions: AI_CAPABILITY_VERSIONS,
  capabilityEvidence: CAPABILITY_EVIDENCE,
  mappings: LAW_FIRM_TASK_CAPABILITY_MAPPINGS,
};

export const calculateLawFirmBaseline = () =>
  calculatePossibleBaseline(LAW_FIRM_BASELINE_DEFINITION);
