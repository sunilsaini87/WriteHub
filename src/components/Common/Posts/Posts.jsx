import PostsCard from "./PostsCard";
import { Blog } from "../../../Context/Context";

const Posts = () => {
  const { postData, postLoading } = Blog();

  if (postLoading) {
    return <p>Loading posts....</p>;
  }

  return (
    <section className="flex flex-col gap-[2.5rem]">
      {postData && postData.length > 0 ? (
        postData.map((post, i) => <PostsCard post={post} key={i} />)
      ) : (
        <p>No posts available</p>
      )}
    </section>
  );
};

export default Posts;
