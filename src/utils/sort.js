export const sortDiffLog = (a, b) => {
  if (a.issueTypeName < b.issueTypeName) {
    return -1;
  } else if (a.issueTypeName > b.issueTypeName) {
    return 1;
  } else {
    return 0;
  }
};

export const sortProjects = (a, b) => {
  if (a.defaultFlag) {
    return -1;
  } else if (b.defaultFlag) {
    return 1;
  } else if (a.differences === 0 && !a.defaultFlag) {
    return 1;
  } else if (b.differences === 0 && !b.defaultFlag) {
    return -1;
  }

  if (a.differences < b.differences) {
    return -1;
  } else {
    return 1;
  }
};
