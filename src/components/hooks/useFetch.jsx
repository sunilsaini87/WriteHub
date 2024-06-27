import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

const useFetch = (collectionName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDatas = async () => {
      const postRef = query(
        collection(db, collectionName),
        orderBy("created", "desc")
      );

      const unsubscribe = onSnapshot(postRef, async (snapshot) => {
        const postData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const postItems = { ...doc.data(), id: doc.id };
            const userRef = doc(db, "users", postItems.userId);
            const getUser = await getDoc(userRef);

            if (getUser.exists()) {
              const { created, ...rest } = getUser.data();
              return { ...postItems, ...rest };
            } else {
              return postItems; // Return postItems if user doesn't exist
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
