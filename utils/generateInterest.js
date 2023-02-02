export const generateInterestDoc = (baseRate) => {
  const s = (baseRate + 0.5) * 0;
  const rds12 = baseRate + 1;
  const rds24 = rds12 + 0.25;
  const rdm36 = rds24 + 0.25;
  const rdm48 = rdm36 + 0.25;
  const rdl60 = rdm48 + 0.25;
  const rdl72 = rdl60 + 0.25;
  const fds12 = baseRate + 1.25;
  const fds24 = fds12 + 0.25;
  const fdm36 = fds24 + 0.5;
  const fdm48 = fdm36 + 0.5;
  const fdl60 = fdm48 + 0.5;
  const fdl72 = fdl60 + 0.5;
  return {
    baseRate,
    s,
    rds12,
    rds24,
    rdm36,
    rdm48,
    rdl60,
    rdl72,
    fds12,
    fds24,
    fdm36,
    fdm48,
    fdl60,
    fdl72,
  };
};
