import PropTypes from "prop-types"; // Import prop-types
import { Blog } from "../../../../Context/Context";

const ProfileAbout = ({ getUserData, setEditModal }) => {
  const { currentUser } = Blog();
  return (
    <div className="w-full">
      <p className="text-2xl first-letter:uppercase">
        {getUserData?.bio || getUserData?.username + " has no bio"}
      </p>
      <div className="text-right">
        {currentUser?.uid === getUserData.userId && (
          <button
            onClick={() => setEditModal(true)}
            className="border border-black py-2 px-5 rounded-full text-black mt-[3rem]"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

ProfileAbout.propTypes = {
  getUserData: PropTypes.shape({
    bio: PropTypes.string,
    username: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired, // Ensure getUserData is an object with the specified shape and is required
  setEditModal: PropTypes.func.isRequired, // Ensure setEditModal is a function and is required
};

export default ProfileAbout;
