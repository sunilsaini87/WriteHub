import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CiSearch } from "react-icons/ci";
import Modal from "../../../utils/Modal";
import { Blog } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const Search = ({ modal, setModal }) => {
  const [search, setSearch] = useState("");
  const { postData } = Blog();
  const navigate = useNavigate();

  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const debouncedFilter = debounce(() => {
      if (search.trim() !== "") {
        const filtered = postData?.filter((post) =>
          post.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredPosts(filtered);
      } else {
        setFilteredPosts([]);
      }
    }, 300);

    debouncedFilter();

    return () => {
      debouncedFilter.cancel();
    };
  }, [search, postData]);

  return (
    <Modal modal={modal} setModal={setModal}>
      <div
        className={`absolute sm:relative right-4 left-4 top-[4rem] sm:left-0 sm:top-0 ${
          modal
            ? "visible opacity-100"
            : "invisible sm:visible sm:opacity-100 opacity-0"
        } transition-all duration-100`}
      >
        <div className="flex items-center gap-1 bg-gray-100 px-2 rounded-full relative z-10">
          <span className="text-2xl text-gray-400">
            <CiSearch />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none py-[0.7rem] text-sm w-full"
            type="text"
            placeholder="Search Medium"
            aria-label="Search Medium"
          />
          {search !== "" && (
            <div className="absolute right-0 left-0 top-full bg-white shadow rounded-md">
              {filteredPosts.length > 0 ? (
                <>
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        navigate(`/post/${post.id}`);
                        setSearch("");
                        setModal(false); // Close modal after clicking on a post
                      }}
                      className="p-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
                    >
                      <h2 className="line-clamp-1 capitalize text-sm font-bold">
                        {post.title}
                      </h2>
                      <div
                        className="text-xs text-gray-500 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.desc }}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-500 p-3">No Post Found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

Search.propTypes = {
  modal: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
};

export default Search;
