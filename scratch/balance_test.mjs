import { INITIAL_DEPARTMENTS, INITIAL_CATEGORIES } from '../src/data/mockData.ts';

const catTargets = {
  student: { alloc: 1650000, spent: 1120000 },
  academic: { alloc: 2450000, spent: 1720000 },
  research: { alloc: 1680000, spent: 1150000 },
  service: { alloc: 1220000, spent: 780000 },
  org: { alloc: 1550000, spent: 1050000 },
};

const catKeys = ['student', 'academic', 'research', 'service', 'org'];

const getProjectCategory = (code, projectIndex, deptIndex = 0) => {
  if (code === 'RES-01' || code === 'MST-DTM-LAB') return 'research';
  if (code === 'RES-02') return (projectIndex + deptIndex) % 2 === 0 ? 'research' : 'academic';
  if (code === 'ADM-03') {
    const c = (projectIndex + deptIndex) % 4;
    if (c === 0) return 'org';
    if (c === 1) return 'academic';
    if (c === 2) return 'student';
    return 'service';
  }
  if (code === 'STR') return (projectIndex + deptIndex) % 2 === 0 ? 'research' : 'academic';
  if (code === 'EDU-03') return (projectIndex + deptIndex) % 2 === 0 ? 'org' : 'student';
  if (code === 'CEN') {
    const c = (projectIndex + deptIndex) % 4;
    if (c === 0) return 'research';
    if (c === 1) return 'academic';
    if (c === 2) return 'student';
    return 'org';
  }
  if (code.startsWith('ADM') || code.startsWith('FIN') || code === 'PLN-01') return 'org';
  if (code === 'EDU-02' || code === 'EDU-05') return 'student';
  if (code === 'EDU-04') return 'service';
  if (code === 'DITC') return (projectIndex + deptIndex) % 2 === 0 ? 'service' : 'academic';
  if (code === 'EDU-01' || code === 'ACA') return 'academic';
  if (code.startsWith('PHD')) return (projectIndex + deptIndex) % 3 === 0 ? 'academic' : 'research';
  if (code.startsWith('MST')) {
    const cycle = (projectIndex + deptIndex) % 4;
    if (cycle === 0) return 'research';
    if (cycle === 1) return 'academic';
    if (cycle === 2) return 'student';
    return 'service';
  }
  if (code.startsWith('BSC')) {
    const cycle = (projectIndex + deptIndex) % 4;
    if (cycle === 0) return 'student';
    if (cycle === 1) return 'academic';
    if (cycle === 2) return 'student';
    return 'service';
  }
  return 'academic';
};

const edges = {};
INITIAL_DEPARTMENTS.forEach((dept, deptIdx) => {
  for (let i = 0; i < dept.prjCount; i++) {
    const cat = getProjectCategory(dept.code, i, deptIdx);
    const k = `${dept.code}:${cat}`;
    edges[k] = (edges[k] || 0) + 1;
  }
});

let wAlloc = {};
let wSpent = {};
Object.keys(edges).forEach(k => {
  wAlloc[k] = edges[k];
  wSpent[k] = edges[k];
});

for (let iter = 0; iter < 2000; iter++) {
  INITIAL_DEPARTMENTS.forEach(dept => {
    let rowA = 0, rowS = 0;
    catKeys.forEach(c => {
      rowA += (wAlloc[`${dept.code}:${c}`] || 0);
      rowS += (wSpent[`${dept.code}:${c}`] || 0);
    });
    if (rowA > 0) {
      const fA = dept.amount / rowA;
      catKeys.forEach(c => {
        const k = `${dept.code}:${c}`;
        if (wAlloc[k]) wAlloc[k] *= fA;
      });
    }
    if (rowS > 0) {
      const fS = dept.spent / rowS;
      catKeys.forEach(c => {
        const k = `${dept.code}:${c}`;
        if (wSpent[k]) wSpent[k] *= fS;
      });
    }
  });

  catKeys.forEach(c => {
    let colA = 0, colS = 0;
    INITIAL_DEPARTMENTS.forEach(dept => {
      colA += (wAlloc[`${dept.code}:${c}`] || 0);
      colS += (wSpent[`${dept.code}:${c}`] || 0);
    });
    if (colA > 0) {
      const fA = catTargets[c].alloc / colA;
      INITIAL_DEPARTMENTS.forEach(dept => {
        const k = `${dept.code}:${c}`;
        if (wAlloc[k]) wAlloc[k] *= fA;
      });
    }
    if (colS > 0) {
      const fS = catTargets[c].spent / colS;
      INITIAL_DEPARTMENTS.forEach(dept => {
        const k = `${dept.code}:${c}`;
        if (wSpent[k]) wSpent[k] *= fS;
      });
    }
  });
}

// Verify convergence of both Alloc and Spent:
console.log("Checking convergence:");
let maxRowErrA = 0, maxRowErrS = 0;
INITIAL_DEPARTMENTS.forEach(dept => {
  let rowA = 0, rowS = 0;
  catKeys.forEach(c => {
    rowA += (wAlloc[`${dept.code}:${c}`] || 0);
    rowS += (wSpent[`${dept.code}:${c}`] || 0);
  });
  maxRowErrA = Math.max(maxRowErrA, Math.abs(rowA - dept.amount));
  maxRowErrS = Math.max(maxRowErrS, Math.abs(rowS - dept.spent));
});

let maxColErrA = 0, maxColErrS = 0;
catKeys.forEach(c => {
  let colA = 0, colS = 0;
  INITIAL_DEPARTMENTS.forEach(dept => {
    colA += (wAlloc[`${dept.code}:${c}`] || 0);
    colS += (wSpent[`${dept.code}:${c}`] || 0);
  });
  maxColErrA = Math.max(maxColErrA, Math.abs(colA - catTargets[c].alloc));
  maxColErrS = Math.max(maxColErrS, Math.abs(colS - catTargets[c].spent));
});

console.log("Max Row Err A:", maxRowErrA, "S:", maxRowErrS);
console.log("Max Col Err A:", maxColErrA, "S:", maxColErrS);

// Check if any edge has wSpent > wAlloc:
let overEdges = 0;
Object.keys(edges).forEach(k => {
  if (wSpent[k] > wAlloc[k] + 0.01) {
    console.log("Over edge:", k, "Alloc:", wAlloc[k], "Spent:", wSpent[k]);
    overEdges++;
  }
});
console.log("Over edges count:", overEdges);
