import * as apiUtil from "./api";

export const getProjects = async () => {
  const projectDataExpanded = (await apiUtil.fetchAllProjects()).values;

  let projectsToSelect = [];
  projectDataExpanded.forEach((project) => {
    projectsToSelect.push({
      projectName: project.name,
      projectId: project.id,
    });
  });

  return projectsToSelect;
};

export const getAllData = async (defaultCategoryId) => {
  const projectDataExpanded = (
    await apiUtil.getProjectsByCategory(defaultCategoryId)
  ).values;

  let projects = [];

  projectDataExpanded.forEach((project) => {
    projects.push({
      projectId: project.id,
      projectName: project.name,
      projectKey: project.key,
      issueTypesAndFields: [],
      differences: 0,
      differenceLog: [],
      defaultFlag: false,
    });
  });

  await Promise.all(
    projects.map(async (project) => {
      let issueTypesAndFieldsForProject =
        await apiUtil.fetchIssueTypesAndExpandFieldsByProjectKey(
          project.projectKey
        );
      if (issueTypesAndFieldsForProject.projects) {
        issueTypesAndFieldsForProject.projects[0].issuetypes.forEach(
          (issueType) => {
            for (const property in issueType.fields) {
              project.issueTypesAndFields.push({
                issueTypeName: issueType.name,
                fieldName: issueType.fields[property].name,
              });
            }
          }
        );
      }
    })
  );

  return projects;
};
