export const queryResultToClassObject = (record: any, class_: any) => {
  let datum: any = {};
  record.keys.forEach((field: PropertyKey) => {
    const properties = record.toObject()[field].properties || {
      [field]: record.toObject()[field],
    };
    datum = { ...datum, ...properties };
    Object.keys(properties).forEach((key: string) => {
      if (!!datum[key]?.["low"]) datum[key] = datum[key]["low"];
    });
  });
  const classObject = new class_({ ...datum });
  return classObject;
};

export const flattenNumericFields = (object: any) => {
  const res = { ...object };
  Object.keys(object).forEach((key: string) => {
    if (!!object[key]?.["low"]) res[key] = object[key]["low"];
    else res[key] = object[key];
  });
  return res;
}