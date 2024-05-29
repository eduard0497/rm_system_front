import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "./AuthContext";
const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

function Layout({ children }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [mainLoading, setmainLoading] = useState(false);

  // const router = useRouter();

  const validateToken = () => {
    setmainLoading(true);
    fetch(`${SERVER_LINK}/validate-token`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.status) {
          setIsLoggedIn(false);
          setmainLoading(false);
        } else {
          setIsLoggedIn(true);
          setmainLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error:");
        console.log(e);
        setmainLoading(false);
      });
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (mainLoading) {
    return (
      <div>
        <h1>Main Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {children}
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  const handleRouteChange = (path) => {
    if (router.pathname !== path) {
      router.push(path).catch((err) => console.error("Navigation error:", err));
    } else {
      console.log("You are already on the target path:", path);
    }
  };

  const clearAllCookies = async () => {
    try {
      const response = await fetch("/api/clearCookies", {
        method: "GET",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        router.push("/");
      } else {
        console.error("Failed to clear cookies");
      }
    } catch (error) {
      console.error("Error clearing cookies:", error);
    }
  };

  return (
    <div className="border row_space_around">
      <h1 onClick={() => handleRouteChange("/")}>LOGO</h1>
      {isLoggedIn ? (
        <div className="row_with_gap">
          <button onClick={() => handleRouteChange("/dashboard")}>
            Dashboard
          </button>
          <button onClick={clearAllCookies}>Log Out</button>
        </div>
      ) : (
        <>
          <button onClick={() => handleRouteChange("/login")}>
            Owner Login
          </button>
        </>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <div className="border">
      <h1>Footer</h1>
    </div>
  );
};
