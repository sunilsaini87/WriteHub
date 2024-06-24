import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import Input from "../../../utils/Input";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUp = ({ setSignReq, setModal }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      form.username.trim() === "" ||
      form.email.trim() === "" ||
      form.password.trim() === "" ||
      form.rePassword.trim() === ""
    ) {
      toast.error("All fields are required");
      return;
    }

    if (form.password !== form.rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const ref = doc(db, "users", user.uid);
      const userDoc = await getDoc(ref);

      if (!userDoc.exists()) {
        await setDoc(ref, {
          userId: user.uid,
          username: form.username,
          email: form.email,
          userImg: "",
          bio: "",
          created: Date.now(),
        });
        navigate("/");
        toast.success("New Account has been Created");
        setModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[6rem] text-center">
      <h2 className="text-3xl">Sign up with email</h2>
      <p className="w-full sm:w-[25rem] mx-auto py-[3rem]">
        Enter the email address associated with your account, and we’ll send a
        magic link to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input form={form} setForm={setForm} type="text" title="Username" />
        <Input form={form} setForm={setForm} type="email" title="Email" />
        <Input form={form} setForm={setForm} type="password" title="Password" />
        <Input
          form={form}
          setForm={setForm}
          type="password"
          title="Confirm Password"
        />
        <button
          type="submit"
          className={`px-4 py-1 text-sm rounded-full bg-green-700
            hover:bg-green-800 text-white w-fit mx-auto
            ${loading ? "opacity-50 pointer-events-none" : ""}`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <button
        onClick={() => setSignReq("")}
        className="mt-5 text-sm text-green-600 hover:text-green-700
          flex items-center mx-auto"
      >
        <MdKeyboardArrowLeft />
        All sign Up Options
      </button>
    </div>
  );
};

// PropTypes for SignUp component
SignUp.propTypes = {
  setSignReq: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
};

export default SignUp;
