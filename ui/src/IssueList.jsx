/**globals React*/
/** eslint "react/jsx-no-undef": "off" */
import React from "react"
import URLSearchParams from 'url-search-params'


import IssueFilter from "./IssueFilter.jsx";
import IssueTable from "./IssueTable.jsx";
import IssueAdd from "./IssueAdd.jsx";
import graphQLFetch from "./graphQLFetch.js";

export default class IssueList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps){
    const {location: {search: prevSearch}} = prevProps;
    const {location: {search}} = this.props;
    if(prevSearch !== search){
      this.loadData()
    }
  }

  async loadData() {
    const {location: {search}} = this.props;
    const params = new URLSearchParams(search);
    const vars = {};
    if(params.get('status')) vars.status = params.get('status')
    const query = `query issueList($status: StatusType){
        issueList(status: $status){
          _id id title status owner
          created effort due
        }
      }`;

    const data = await graphQLFetch(query, vars);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
          id
        }
      }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  render() {
    return (
      <div>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </div>
    );
  }
}
