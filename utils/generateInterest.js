export const generateInterestDoc = (baseRate) => {
  const S = (baseRate + 0.5) * 0;
  const RDS12 = baseRate + 1;
  const RDS24 = RDS12 + 0.25;
  const RDM36 = RDS24 + 0.25;
  const RDM48 = RDM36 + 0.25;
  const RDL60 = RDM48 + 0.25;
  const RDL72 = RDL60 + 0.25;
  const FDS12 = baseRate + 1.25;
  const FDS24 = FDS12 + 0.25;
  const FDM36 = FDS24 + 0.5;
  const FDM48 = FDM36 + 0.5;
  const FDL60 = FDM48 + 0.5;
  const FDL72 = FDL60 + 0.5;
  const FLEX = baseRate * 3;
  const FIXED = FLEX - 2;
  return {
    baseRate,
    S,
    RDS12,
    RDS24,
    RDM36,
    RDM48,
    RDL60,
    RDL72,
    FDS12,
    FDS24,
    FDM36,
    FDM48,
    FDL60,
    FDL72,
    FIXED,
    FLEX,
  };
};
