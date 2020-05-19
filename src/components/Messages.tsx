import React from "react"

const Loading = (): JSX.Element => <div className="spinner-grow text-primary" role="status">
<span className="sr-only">Loading...</span>
</div>

const Error = ({ error }: {error: any}): JSX.Element => <div className="alert alert-danger" role="alert">
  <h4 className="alert-heading">Something went wrong</h4>
  <hr />
  <p className="mb-0">{error}</p>
</div>

const NoData = (): JSX.Element => <div className="alert alert-warning" role="alert">
  <h4 className="alert-heading">No data found</h4>
  <p>Select some routes, maybe?</p>
</div>
export { Loading, Error, NoData }