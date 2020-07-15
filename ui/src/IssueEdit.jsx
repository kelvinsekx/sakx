import React from "react"

function IssueEdit(props){
    const {match} = props
    return (
        <div>
            <p>Edit Page {match.params.id}</p>
        </div>
    )
}

export default IssueEdit;