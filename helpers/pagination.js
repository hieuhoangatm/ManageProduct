module.exports = (objectPanigation, query, countProduct) => {
  if (query.page) {
    objectPanigation.currentPage = parseInt(query.page);
  }
  objectPanigation.skip =
    (objectPanigation.currentPage - 1) * objectPanigation.limitItems;

  const totalPage = Math.ceil(countProduct / objectPanigation.limitItems);
  objectPanigation.totalPage = totalPage;

  return objectPanigation;
};
