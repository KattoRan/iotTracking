import { CellTowerDto } from './dto/submit-data.dto';

export function isValidCell(c: CellTowerDto): boolean {
  if (!c.mcc || !c.mnc || !c.lac || !c.cid) return false;
  if (c.cid <= 0) return false;
  if (!c.signalDbm || c.signalDbm === 0) return false;
  return true;
}

export function markServingCell(cells: CellTowerDto[]) {
  let bestIndex = -1;
  let bestDbm = -9999;

  cells.forEach((c, i) => {
    if (c.signalDbm > bestDbm) {
      bestDbm = c.signalDbm;
      bestIndex = i;
    }
  });

  return cells.map((c, i) => ({
    ...c,
    isServing: i === bestIndex,
  }));
}