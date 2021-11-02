import "../style/custom.scss";

import React, { useEffect, useState } from "react";

import Legal from "../components/Legal";
import Nav from "../components/Nav";
import { useAuth } from "../store/auth";

const LandingPage: React.FC = () => {
  const currentUser = useAuth((state) => state.currentUser);

  return (
    <div>
      <Nav />
      <img
        alt="userImage"
        src={
          currentUser?.avatar_url
            ? currentUser.avatar_url
            : "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
        }
      />
      <main style={{ minHeight: "100%" }}></main>
      <Legal />
    </div>
  );
};

export default LandingPage;
