import {
  collection,
  doc,
  getDoc,
  // eslint-disable-next-line no-unused-vars
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

const useFetch = (collectionName) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getDatas = async () => {
      const postRef = query(
        collection(db, collectionName),
        orderBy("created", "desc")
      );

      const unsubscribe = onSnapshot(postRef, async (snapshot) => {
        const postData = await Promise.all(
          snapshot.docs.map(async (docs) => {
            const postItems = { ...docs.data(), id: docs.id };
            const userRef = doc(db, "users", postItems?.userId);
            const getUser = await getDoc(userRef);

            if (getUser.exists()) {
              // eslint-disable-next-line no-unused-vars
              const { created, ...rest } = getUser.data();
              return { ...postItems, ...rest };
            }
          })
        );
        setData(postData);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    getDatas();
  }, [collectionName]);
  return {
    data,
    loading,
  };
};

export default useFetch;
