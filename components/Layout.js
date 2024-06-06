import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "./AuthContext";
import { postFetch } from "@/reusableFuncs/postFetch";
const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

const _routes_needed_authorization = [
  "/dashboard",
  "/payment-result",
  "/manage-restaurants",
];

function Layout({ children }) {
  const { setIsLoggedIn, setaccount_type } = useContext(AuthContext);
  const [mainLoading, setmainLoading] = useState(false);
  const [displayNavbar, setdisplayNavbar] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (router.pathname.includes("employee-login")) {
      setdisplayNavbar(false);
    } else {
      setdisplayNavbar(true);
    }
  }, [router.pathname]);

  const validateToken = async () => {
    // console.log("Validating user...");
    setmainLoading(true);
    let data = await postFetch("validate-token", {});
    if (data.kick_out || data.no_decoded_user) {
      const response = await fetch("/api/clearCookies", {
        method: "GET",
      });
      setIsLoggedIn(false);
      setaccount_type("");
      setmainLoading(false);
      if (_routes_needed_authorization.includes(router.pathname)) {
        await router.push("/");
      }
    } else {
      setIsLoggedIn(true);
      setaccount_type(data.account_type);
      setmainLoading(false);
    }
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
      {displayNavbar && <Navbar />}

      {children}
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, account_type } = useContext(AuthContext);
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
          {account_type === "owner" && (
            <button onClick={() => handleRouteChange("/dashboard")}>
              Dashboard
            </button>
          )}

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
