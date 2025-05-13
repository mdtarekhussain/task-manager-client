import React, { useState, useEffect } from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import AuthContext from "./AuthContext";
import { auth } from "../Components/Firebase/firebace.config";

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const GoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    return signInWithPopup(auth, provider).finally(() => setLoading(false));
  };

  const GithubLogin = () => {
    const provider = new GithubAuthProvider();
    setLoading(true);
    return signInWithPopup(auth, provider).finally(() => setLoading(false));
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    loading,
    user,
    GoogleLogin,
    GithubLogin,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
