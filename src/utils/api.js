import api, { route } from "@forge/api";

export const fetchAllProjects = async () => {
  let totalProjects = 51;
  let startAtIndex = 0;
  let data = { values: [] };
  let allBlocksOfData = [];

  while (startAtIndex + 50 < totalProjects) {
    const res = await api
      .asUser()
      .requestJira(route`/rest/api/3/project/search?startAt=${startAtIndex}`);

    const tempData = await res.json();

    totalProjects = tempData.total;
    verifyDataReturnStatus(tempData);

    allBlocksOfData.push(tempData.values);
    startAtIndex += 50;
  }

  allBlocksOfData.forEach((block) => {
    block.forEach((projectMapping) => {
      data.values.push(projectMapping);
    });
  });

  return data;
};

export const fetchIssueTypesAndExpandFieldsByProjectKey = async (
  projectKey
) => {
  const res = await api
    .asUser()
    .requestJira(
      route`/rest/api/2/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`
    );

  const data = await res.json();
  verifyDataReturnStatus(data);
  return data;
};

export const getProjectsByCategory = async (categoryID) => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/project/search?categoryId=${categoryID}`);

  const data = await res.json();
  verifyDataReturnStatus(data);
  return data;
};

export const getTempProjectCategory = async (projectId) => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/project/search?id=${projectId}`);

  const data = await res.json();
  verifyDataReturnStatus(data);
  return data;
};

const verifyDataReturnStatus = (data) => {
  if (data.status && data.status !== "200") {
    console.log(JSON.stringify(data));
    throw new Error(
      `An error has occured: \n\tError: ${data.error}\n\tMessage: ${data.message}`
    );
  }
};
