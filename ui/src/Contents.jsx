import React from "react"
import { Switch, Route, Redirect} from "react-router-dom"

import IssueReport from "./IssueReport.jsx"
import IssueEdit from "./IssueEdit.jsx";
import IssueList from "./IssueList.jsx";

const NotFound = ()=><h1>Page NoT found.</h1>;

export default function Contents(){
    return (
        <Switch>
            {/* redirects home "/" to /issues */}
            <Redirect exact from="/" to="/issues"/>
            
            <Route exact path="/issues" component={IssueList}/>
            <Route exact path="/edit/:id" component={IssueEdit}/>
            <Route path="/report" component={IssueReport}/>
            <Route component={NotFound} />
        </Switch>
    )
}