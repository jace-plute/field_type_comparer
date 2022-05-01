import api, { route } from "@forge/api";

export const fetchAllProjects = async () => {
  console.log("Beginning FetchAllProjects");

  const res = await api.asUser().requestJira(route`/rest/api/2/project`);

  const data = await res.json();
  return data;
};

export const fetchAllIssueTypeItems = async () => {
  console.log(`Beginning FetchAllIssueTypeItems`);

  const res = await api
    .asUser()
    .requestJira(route`/rest/api/2/issuetypescheme/mapping`);

  const data = await res.json();
  return data;
};

export const fetchIssueTypesAndExpandFieldsByProjectKey = async (projectKey) => {
  console.log(`Beginning fetchIssueTypesAndExpandFieldsByProjectId for ProjectKey ${projectKey}`);

  const res = await api
    .asUser()
    .requestJira(
      route`/rest/api/2/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`
    );

  const data = await res.json();
  return data;
};
