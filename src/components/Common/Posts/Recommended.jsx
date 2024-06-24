import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useFetch from "../../hooks/useFetch";
import { readTime } from "../.././../utils/helper";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Recommended = ({ post: singlePost }) => {
  const { data } = useFetch("posts");
  const [commonTags, setCommonTags] = useState([]);

  useEffect(() => {
    let recommendedPost = [];
    data &&
      data.forEach((post) => {
        if (post.id === singlePost.id) {
          return;
        }

        const postTags = post.tags || [];
        const commonTags = postTags.filter((tag) =>
          singlePost?.tags?.includes(tag)
        );

        if (commonTags.length > 0) {
          recommendedPost.push({
            ...post,
            commonTags,
          });
        }
      });

    recommendedPost.sort(() => Math.random() - 0.5); // Corrected sorting logic

    const minRecommendation = 4;
    const slicePost = recommendedPost.slice(0, minRecommendation);
    setCommonTags(slicePost);
  }, [data, singlePost]);

  return (
    <section className="bg-gray-100">
      <div className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto py-[3rem]">
        <h2 className="text-xl font-bold">Recommended from Medium</h2>
        {commonTags.length === 0 ? (
          <p>No recommended posts found based on your preference</p>
        ) : (
          <div className="grid grid-cols-card gap-[2rem] my-[3rem]">
            {commonTags.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

Recommended.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Recommended;

const Post = ({ post }) => {
  const { title, desc, created, postImg, id: postId, userId } = post;
  const { data } = useFetch("users");

  const navigate = useNavigate();

  const user = data && data.find((user) => user.id === userId);
  const { username, userImg } = user || {};

  return (
    <div
      onClick={() => navigate(`/post/${postId}`)}
      className="w-full cursor-pointer"
    >
      {postImg && (
        <img
          className="w-full h-[200px] object-cover"
          src={postImg}
          alt="post-img"
        />
      )}
      <div className="flex items-center gap-1 py-3">
        <img
          className="w-[2rem] h-[2rem] object-cover rounded-full"
          src={userImg || "/default-avatar.png"} // Provide a fallback avatar image
          alt="userImg"
        />
        <h3 className="text-sm capitalize">{username || "Unknown User"}</h3>
      </div>
      <h2 className="font-extrabold leading-5 line-clamp-2">{title}</h2>
      <div
        className="line-clamp-2 my-3 text-gray-500 leading-5"
        dangerouslySetInnerHTML={{ __html: desc }}
      />
      <p className="text-sm text-gray-600">
        {readTime({ __html: desc })} min read
        <span className="ml-3">{moment(created).format("MMM DD")}</span>
      </p>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    postImg: PropTypes.string,
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
};
