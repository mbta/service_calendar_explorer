import React from "react"

const Loading = (): JSX.Element => <div className="spinner-grow text-primary" role="status">
<span className="sr-only">Loading...</span>
</div>

const Error = ({ error }: {error: any}): JSX.Element => <div className="alert alert-danger" role="alert">
  <h4 className="alert-heading">Something went wrong</h4>
  <p>{error}</p>
  <hr />
  <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</div>

const NoData = (): JSX.Element => <div className="alert alert-warning" role="alert">
  <h4 className="alert-heading">No data found</h4>
  <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
</div>
export { Loading, Error, NoData }