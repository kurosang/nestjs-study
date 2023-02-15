import { SelectQueryBuilder } from 'typeorm';

export const conditionUtils = <T>(
  qb: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k]) {
      qb.andWhere(`${k} = :${k}`, { [k]: obj[k] });
    }
  });

  return qb;
};
