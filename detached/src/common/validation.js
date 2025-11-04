const validateCarPayload = (payload, requireAllFields = true) => {
  const { plate, make, model, year, owner } = payload || {};
  const missing = [];
  if (requireAllFields) {
    if (!plate) missing.push('plate');
    if (!make) missing.push('make');
    if (!model) missing.push('model');
    if (year === undefined || year === null) missing.push('year');
    if (!owner) missing.push('owner');
  }

  if (missing.length) return { valid: false, message: `Missing required fields: ${missing.join(', ')}` };

  if (year !== undefined && year !== null) {
    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 1886 || yearNum > 3000) {
      return { valid: false, message: 'Invalid value for year' };
    }
  }

  return { valid: true };
};

module.exports = { validateCarPayload };