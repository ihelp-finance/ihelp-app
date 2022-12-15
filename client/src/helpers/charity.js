export const getCharityPrevNextIds = (charities, ind) => {
  let prevCharityId = null;
  let nextCharityId = null;
  if (ind === 0) {
    nextCharityId = charities[ind + 1]?.["CharityPool Contract"];
  } else if (ind > 0) {
    prevCharityId = charities[ind - 1]?.["CharityPool Contract"];
    nextCharityId = charities[ind + 1]?.["CharityPool Contract"];
  } else if (ind + 1 <= charities.length) {
    prevCharityId = charities[ind - 1]?.["CharityPool Contract"];
  } else {
    prevCharityId = null;
    nextCharityId = null;
  }
  localStorage.setItem(
    "prev-next-charity",
    JSON.stringify({
      prevCharityId,
      nextCharityId,
    }),
  );
};
