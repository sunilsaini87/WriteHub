import PropTypes from "prop-types";
import PostsCard from "../../../Common/Posts/PostsCard";
import { Blog } from "../../../../Context/Context";

const ProfileHome = ({ getUserData }) => {
  const { postData, postLoading } = Blog();
  const userPost =
    postData &&
    postData?.filter((post) => post?.userId === getUserData?.userId);

  return (
    <div className="flex flex-col gap-5 mb-[4rem]">
      {userPost.length === 0 && (
        <p className="text-gray-500">
          <span className="capitalize">{getUserData?.username}</span> has no
          posts
        </p>
      )}
      {postLoading ? (
        <p>Loading...</p>
      ) : (
        userPost &&
        userPost?.map((post, i) => <PostsCard post={post} key={i} />)
      )}
    </div>
  );
};

ProfileHome.propTypes = {
  getUserData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired, // Ensure getUserData is an object with the specified shape and is required
};

export default ProfileHome;
