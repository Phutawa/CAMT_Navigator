import fs from 'fs';
import { INITIAL_DEPARTMENTS, INITIAL_CATEGORIES } from '../src/data/mockData.ts';

const catTargets = {
  student: { alloc: 1650000, spent: 1120000 },
  academic: { alloc: 2450000, spent: 1720000 },
  research: { alloc: 1680000, spent: 1150000 },
  service: { alloc: 1220000, spent: 780000 },
  org: { alloc: 1550000, spent: 1050000 },
};

// Natural category probabilities/preferences for each department
const getCategoryCandidates = (code) => {
  if (code === 'EDU-01') return ['academic'];
  if (code === 'EDU-02') return ['student'];
  if (code === 'EDU-03') return ['org', 'student'];
  if (code === 'EDU-04') return ['service'];
  if (code === 'EDU-05') return ['student'];
  if (code.startsWith('ADM') || code.startsWith('FIN') || code === 'CEN' || code === 'PLN-01') return ['org'];
  if (code === 'RES-01' || code === 'MST-DTM-LAB') return ['research'];
  if (code === 'RES-02') return ['research', 'academic'];
  if (code === 'STR') return ['research', 'org', 'academic'];
  if (code === 'DITC') return ['service', 'academic'];
  if (code === 'ACA') return ['academic'];
  if (code.startsWith('PHD')) return ['research', 'academic'];
  if (code.startsWith('MST')) return ['academic', 'research', 'service'];
  if (code.startsWith('BSC')) return ['student', 'academic', 'service'];
  return ['academic'];
};

console.log("Categories mapped.");
