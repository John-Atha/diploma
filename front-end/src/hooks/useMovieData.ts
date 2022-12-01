export const useMovieData = (data: any) => {
  const { fields, neighbours } = data;
  const neighboursGroupped = {
    Cast: [],
    Crew: [],
    ProductionCompany: [],
    ProductionCountry: [],
    Language: [],
    Genre: [],
    Keyword: [],
  };

  neighbours.forEach((elem: any) => {
    const type = elem.nodeType;
    (neighboursGroupped as any)[type].push(elem);
  });

  return { fields, neighbours: neighboursGroupped };
};
