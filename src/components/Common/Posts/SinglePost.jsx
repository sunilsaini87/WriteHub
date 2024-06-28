import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { Blog } from "../../../Context/Context";
import FollowBtn from "../../Home/UserToFollow/FollowBtn";
import { readTime } from "../../../utils/helper";
import moment from "moment/moment";
import Actions from "../Posts/Actions/Actions";
import Like from "./Actions/Like";
import Comment from "./Actions/Comment";
import SharePost from "./Actions/SharePost";
import SavedPost from "../Posts/Actions/SavedPost";
import Recommended from "./Recommended";
import Comments from "../Comments/Comments";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const { currentUser } = Blog();
  const navigate = useNavigate();

  // Ref for initial render control
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Function to increment page views
    const incrementPageView = async () => {
      try {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          pageViews: increment(1),
        });
      } catch (error) {
        toast.error(error.message);
      }
    };

    // Increment page views only on initial render
    if (isInitialRender.current) {
      incrementPageView();
    }
    isInitialRender.current = false;
  }, [postId]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, "posts", postId);
        const snapshot = await getDoc(postRef);

        if (snapshot.exists()) {
          const postData = snapshot.data();
          const { userId } = postData;

          if (userId) {
            const userRef = doc(db, "users", userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              const { ...rest } = userData;
              setPost({ ...postData, ...rest, id: postId });
            } else {
              toast.error("User data not found");
            }
          } else {
            toast.error("User ID not found in post data");
          }
        } else {
          toast.error("Post not found");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return null; // Or render a loading indicator
  }

  const { title, desc, postImg, username, created, userImg, userId } = post;

  return (
    <>
      <section className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
        <h2 className="text-4xl font-extrabold capitalize">{title}</h2>
        <div className="flex items-center gap-2 py-[2rem]">
          <img
            onClick={() => navigate(`/profile/${userId}`)}
            className="w-[3rem] h-[3rem] object-cover rounded-full cursor-pointer"
            src={userImg}
            alt="user-img"
          />
          <div>
            <div className="capitalize">
              <span>{username}</span>
              {currentUser && currentUser.uid !== userId && (
                <FollowBtn userId={userId} />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {readTime({ __html: desc })} min read .
              <span className="ml-1">{moment(created).fromNow()}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-t border-gray-200 py-[0.5rem]">
          <div className="flex items-center gap-5">
            <Like postId={postId} />
            <Comment />
          </div>
          <div className="flex items-center pt-2 gap-5">
            {post && <SavedPost post={post} />}
            <SharePost />
            {currentUser && currentUser.uid === userId && (
              <Actions postId={postId} title={title} desc={desc} />
            )}
          </div>
        </div>
        <div className="mt-[3rem]">
          {postImg && (
            <img
              className="w-full h-[400px] object-cover"
              src={postImg}
              alt="post-img"
            />
          )}
          <div className="mt-6" dangerouslySetInnerHTML={{ __html: desc }} />
        </div>
      </section>
      {post && <Recommended post={post} />}
      <Comments postId={postId} />
    </>
  );
};

export default SinglePost;
