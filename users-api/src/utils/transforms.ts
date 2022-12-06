import { MovieBrief } from "../models/Movie";
import { Rating } from "../models/Rating";
import { User } from "../models/User";

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
};

export const Neo4jRecordToRatingObject = (record: any) => {
  const { u, r, m, ratings_count, ratings_average } = record.toObject();
  const { datetime: seconds, rating } = r.properties;
  const datetime = new Date();
  datetime.setTime(seconds * 1000);
  const movie = new MovieBrief({
    ...m.properties,
    ratings_count:
      ratings_count?.low !== undefined ? ratings_count?.low : ratings_count,
    ratings_average,
  });
  const user = new User({
    username: u.properties.username,
    id: u.properties.id.low,
  });
  const ratingModel = new Rating({ user, movie, rating, datetime });
  return ratingModel;
};
