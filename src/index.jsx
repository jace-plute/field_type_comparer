import ForgeUI, { useState, DashboardGadget, DashboardGadgetEdit, render, Text, Fragment, Table, Row, Cell, Badge, Head, useProductContext, Select, Option } from "@forge/ui";
import * as dataRetrieval from './utils/dataRetrieval';
import * as dataComparison from './utils/dataComparison';
let defaultProject = null;

const determineColorOfIssueType = (issueTypeAndField) => {
  let matchingDefault = defaultProject.issueTypesAndFields.filter(singleIssueTypeFieldPair => { 
    return singleIssueTypeFieldPair.issueTypeName === issueTypeAndField.issueTypeName
  })[0];

  if (matchingDefault) {
    return <Text>{issueTypeAndField.issueTypeName}</Text>
  } else {
    return <Text><Badge appearance="removed" text={issueTypeAndField.issueTypeName} /></Text>;
  }
}

const determineColorOfRow = (issueTypeAndField) => {
  let matchingDefault = defaultProject.issueTypesAndFields.filter(singleIssueTypeFieldPair => { 
    return singleIssueTypeFieldPair.fieldName === issueTypeAndField.fieldName && singleIssueTypeFieldPair.issueTypeName === issueTypeAndField.issueTypeName
  })[0];

  if (matchingDefault) {
    if (matchingDefault.issueTypeName === issueTypeAndField.issueTypeName &&
      matchingDefault.fieldName === issueTypeAndField.fieldName) {
      return (
        <Text><Badge appearance="added" text={issueTypeAndField.fieldName}></Badge></Text>
      );
    } else {
      return (
        <Text><Badge appearance="removed" text={issueTypeAndField.fieldName}></Badge></Text>
      );
    }
  } else {
    return <Text><Badge appearance="removed" text={issueTypeAndField.fieldName} /></Text>;
  } 
};

const createUiComponents = (projectData, defaultProjectId) => {
  projectData = projectData[0];
  defaultProject = projectData.filter(project => {
    return project.projectId === defaultProjectId;
  })[0];

  let uiOutput = projectData.map((project) => {
    return (
      <Fragment>
        <Text content={`${"Project(s): " + project.projectName}`} />
        <Table>
          <Head>
            <Cell>
              <Text>Issue Type</Text>
            </Cell>
            <Cell>
              <Text>
                Field Name
              </Text>
            </Cell>
          </Head>
          {project.issueTypesAndFields.map(issueTypeAndField => {
            return <Row>
              <Cell>
                {determineColorOfIssueType(issueTypeAndField)}
              </Cell>
              <Cell>
                {determineColorOfRow(issueTypeAndField)}
              </Cell>
            </Row>
          })}
        </Table>
      </Fragment>
    )
  });

  return uiOutput;
}

const createDropdownSelector = (projectOptions) => {
  projectOptions = projectOptions[0];

  let dropdownOptions = projectOptions.map(project => {
    return (
      <Option label={project.projectName} value={project.projectId} />
    );
  });

  return dropdownOptions;
}

const View = () => {
  const { extensionContext: { gadgetConfiguration } } = useProductContext();
  const projectData = useState(async () => await dataRetrieval.getAllData());
  dataComparison.compareDifferencesToBase(projectData, gadgetConfiguration.projectSelect);

  return (
    <DashboardGadget>
      {createUiComponents(projectData, gadgetConfiguration.projectSelect)}
    </DashboardGadget>
  );
};

export const runView = render(
  <View/>
);

const Edit = () => {
  const projectsToSelect = useState(async () => await dataRetrieval.getProjects());

  const onSubmit = values => {
      return values
  };

  return (
    <DashboardGadgetEdit onSubmit={onSubmit}>
      <Select label="Select a default Project." name="projectSelect">
        {createDropdownSelector(projectsToSelect)}
      </Select>
    </DashboardGadgetEdit>
  );
}

export const runEdit = render(<Edit/>)
