import { useQuery, useMutation } from "@apollo/client"
import { GET_BLOGS } from "../graphql/queries"
import BlogList from "./BlogList";

function Blogs() {
    const {loading, data, error} =  useQuery(GET_BLOGS)
    if(loading) return <p>Loading.....</p>;
    if(error) return <p>Error.....</p>;
  return (
    <div>
      <BlogList blogs={data.blogs}  />
    </div>
  )
}

export default Blogs