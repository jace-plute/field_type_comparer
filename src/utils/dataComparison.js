import { sortDiffLog, sortProjects } from "./sort";

export const compareDifferencesToBase = (projectData, defaultProjectId) => {
  projectData = projectData[0];

  let defaultProject = projectData.filter((project) => {
    return project.projectId === defaultProjectId;
  })[0];

  defaultProject.defaultFlag = true;

  projectData.forEach((project) => {
    project.issueTypesAndFields.forEach((issueTypeAndFields) => {
      let matchingDefaultIssueTypeAndFields =
        defaultProject.issueTypesAndFields.filter(
          (matchingDefaultIssueTypeAndField) => {
            return (
              issueTypeAndFields.issueTypeName ===
                matchingDefaultIssueTypeAndField.issueTypeName &&
              issueTypeAndFields.fieldName ===
                matchingDefaultIssueTypeAndField.fieldName
            );
          }
        )[0];

        if (!matchingDefaultIssueTypeAndFields) {
            project.differences++;
            project.differenceLog.push({
                issueTypeName: issueTypeAndFields.issueTypeName,
                fieldName: issueTypeAndFields.fieldName,
            });
        }
    });

    project.differenceLog.sort((a, b) => sortDiffLog(a, b));
  });

  let removalArray = [];
  for (let project of projectData) {
    let matchingProject = projectData.filter((matchingProject) => {
      return objectsEqual(
        project.differenceLog,
        matchingProject.differenceLog
      );
    })[0];

    if (
      matchingProject &&
      matchingProject.projectName &&
      !project.projectName.includes(matchingProject.projectName)
    ) {
      removalArray.push(matchingProject);
      project.projectName = `${project.projectName}/${matchingProject.projectName}`;
    }
  }

  removalArray.forEach((removeObj) => {
    let index = projectData.indexOf(removeObj);
    projectData.splice(index, 1);
  });

  projectData.sort((a, b) => sortProjects(a, b));
};

const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;
