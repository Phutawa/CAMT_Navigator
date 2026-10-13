import { INITIAL_DEPARTMENTS, INITIAL_CATEGORIES } from '../src/data/mockData.ts';

const catTargets = {
  student: { alloc: 1650000, spent: 1120000 },
  academic: { alloc: 2450000, spent: 1720000 },
  research: { alloc: 1680000, spent: 1150000 },
  service: { alloc: 1220000, spent: 780000 },
  org: { alloc: 1550000, spent: 1050000 },
};

const catKeys = ['student', 'academic', 'research', 'service', 'org'];
const targetDeptS = INITIAL_DEPARTMENTS.map(d => d.spent);
const targetDeptR = INITIAL_DEPARTMENTS.map(d => d.amount - d.spent);
const targetCatS = catKeys.map(c => catTargets[c].spent);
const targetCatR = catKeys.map(c => catTargets[c].alloc - catTargets[c].spent);

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

const mask = Array.from({ length: 37 }, () => Array(5).fill(0));
INITIAL_DEPARTMENTS.forEach((dept, dIdx) => {
  for (let i = 0; i < dept.prjCount; i++) {
    const cat = getProjectCategory(dept.code, i, dIdx);
    const cIdx = catKeys.indexOf(cat);
    mask[dIdx][cIdx] += 1;
  }
});

function solveRAS(targetRow, targetCol, baseMask) {
  let M = baseMask.map(row => [...row]);
  for (let iter = 0; iter < 2000; iter++) {
    for (let r = 0; r < 37; r++) {
      let rSum = 0;
      for (let c = 0; c < 5; c++) rSum += M[r][c];
      if (rSum > 0) {
        const factor = targetRow[r] / rSum;
        for (let c = 0; c < 5; c++) M[r][c] *= factor;
      }
    }
    for (let c = 0; c < 5; c++) {
      let cSum = 0;
      for (let r = 0; r < 37; r++) cSum += M[r][c];
      if (cSum > 0) {
        const factor = targetCol[c] / cSum;
        for (let r = 0; r < 37; r++) M[r][c] *= factor;
      }
    }
  }
  return M;
}

const matrixS = solveRAS(targetDeptS, targetCatS, mask);
const matrixR = solveRAS(targetDeptR, targetCatR, mask);

function roundMatrix(M, targetRow, targetCol) {
  const rounded = M.map(row => row.map(v => Math.round(v)));
  
  for (let r = 0; r < 37; r++) {
    const currentSum = rounded[r].reduce((a, b) => a + b, 0);
    const diff = targetRow[r] - currentSum;
    if (diff !== 0) {
      const candidates = [];
      for (let c = 0; c < 5; c++) {
        if (M[r][c] > 0) {
          candidates.push({ c, frac: M[r][c] - rounded[r][c] });
        }
      }
      if (diff > 0) {
        candidates.sort((a, b) => b.frac - a.frac);
        for (let i = 0; i < diff; i++) {
          rounded[r][candidates[i % candidates.length].c]++;
        }
      } else {
        candidates.sort((a, b) => a.frac - b.frac);
        for (let i = 0; i < -diff; i++) {
          rounded[r][candidates[i % candidates.length].c]--;
        }
      }
    }
  }

  for (let c = 0; c < 5; c++) {
    let colSum = 0;
    for (let r = 0; r < 37; r++) colSum += rounded[r][c];
    let diff = targetCol[c] - colSum;
    if (diff !== 0) {
      for (let r = 0; r < 37 && diff !== 0; r++) {
        if (M[r][c] > 0) {
          for (let otherC = 0; otherC < 5 && diff !== 0; otherC++) {
            if (otherC !== c && M[r][otherC] > 0) {
              let otherColSum = 0;
              for (let ro = 0; ro < 37; ro++) otherColSum += rounded[ro][otherC];
              const otherDiff = targetCol[otherC] - otherColSum;
              if (diff > 0 && otherDiff < 0 && rounded[r][otherC] > 0) {
                const shift = Math.min(diff, -otherDiff);
                rounded[r][c] += shift;
                rounded[r][otherC] -= shift;
                diff -= shift;
              } else if (diff < 0 && otherDiff > 0 && rounded[r][c] > 0) {
                const shift = Math.min(-diff, otherDiff);
                rounded[r][c] -= shift;
                rounded[r][otherC] -= shift;
                diff += shift;
              }
            }
          }
        }
      }
    }
  }

  // Final fixup if any row drifted during column transfers
  for (let r = 0; r < 37; r++) {
    const currentSum = rounded[r].reduce((a, b) => a + b, 0);
    const diff = targetRow[r] - currentSum;
    if (diff !== 0) {
      // Find a column where this row has M[r][c] > 0 and column sum can take it
      for (let c = 0; c < 5; c++) {
        if (M[r][c] > 0) {
          rounded[r][c] += diff;
          break;
        }
      }
    }
  }

  return rounded;
}

const intS = roundMatrix(matrixS, targetDeptS, targetCatS);
const intR = roundMatrix(matrixR, targetDeptR, targetCatR);

// Ensure column sums of intR match targetCatR perfectly:
for (let c = 0; c < 5; c++) {
  let colSum = 0;
  for (let r = 0; r < 37; r++) colSum += intR[r][c];
  const diff = targetCatR[c] - colSum;
  if (diff !== 0) {
    // transfer with another column in a row that has both
    for (let r = 0; r < 37; r++) {
      if (mask[r][c] > 0) {
        for (let otherC = 0; otherC < 5; otherC++) {
          if (otherC !== c && mask[r][otherC] > 0) {
            let otherColSum = 0;
            for (let ro = 0; ro < 37; ro++) otherColSum += intR[ro][otherC];
            const otherDiff = targetCatR[otherC] - otherColSum;
            if (diff > 0 && otherDiff < 0 && intR[r][otherC] >= diff) {
              intR[r][c] += diff;
              intR[r][otherC] -= diff;
              break;
            } else if (diff < 0 && otherDiff > 0 && intR[r][c] >= -diff) {
              intR[r][c] += diff;
              intR[r][otherC] -= diff;
              break;
            }
          }
        }
      }
    }
  }
}

// Now verify intS and intR row sums and col sums:
let errCount = 0;
for (let r = 0; r < 37; r++) {
  const sumS = intS[r].reduce((a,b)=>a+b, 0);
  const sumR = intR[r].reduce((a,b)=>a+b, 0);
  if (sumS !== targetDeptS[r]) { console.log(`Dept ${r} S err: ${sumS} vs ${targetDeptS[r]}`); errCount++; }
  if (sumR !== targetDeptR[r]) { console.log(`Dept ${r} R err: ${sumR} vs ${targetDeptR[r]}`); errCount++; }
}
for (let c = 0; c < 5; c++) {
  let sumS = 0, sumR = 0;
  for (let r = 0; r < 37; r++) { sumS += intS[r][c]; sumR += intR[r][c]; }
  if (sumS !== targetCatS[c]) { console.log(`Cat ${catKeys[c]} S err: ${sumS} vs ${targetCatS[c]}`); errCount++; }
  if (sumR !== targetCatR[c]) { console.log(`Cat ${catKeys[c]} R err: ${sumR} vs ${targetCatR[c]}`); errCount++; }
}
console.log("Total errors in intS and intR:", errCount);
