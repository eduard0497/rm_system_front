import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { postFetch } from "@/reusableFuncs/postFetch";
import AuthContext from "@/components/AuthContext";

function EmployeeLogin() {
  const { setIsLoggedIn, setaccount_type } = useContext(AuthContext);
  const router = useRouter();
  const { token } = router.query;

  const [searchLoading, setsearchLoading] = useState(false);
  const [message, setmessage] = useState("");

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [passwordLoading, setpasswordLoading] = useState(false);

  const [setupPassword, setsetupPassword] = useState("");
  const [confirmSetupPassword, setconfirmSetupPassword] = useState("");
  const [setupPasswordLoading, setsetupPasswordLoading] = useState(false);

  const [showPasswordInputs, setshowPasswordInputs] = useState(false);
  const [passwordExists, setpasswordExists] = useState(false);

  const searchUsername = async () => {
    if (!token) return;
    if (!username) {
      setmessage("All fields are required");
      return;
    }
    setmessage("");
    setsearchLoading(true);
    let data = await postFetch("search-employee-username", {
      token,
      employee_username: username,
    });
    if (!data.status) {
      setmessage(data.msg);
    } else {
      setshowPasswordInputs(true);
      setpasswordExists(data.password_exists);
    }
    setsearchLoading(false);
  };

  const setupPasswordAndLogin = async () => {
    if (!token) return;
    if (!username || !setupPassword || !confirmSetupPassword) {
      setmessage("All fields are required");
      return;
    }
    if (setupPassword.includes(" ")) {
      setmessage("Password may not contain a space");
      return;
    }
    if (setupPassword !== confirmSetupPassword) {
      setmessage("Passwords must be the same");
      return;
    }
    setmessage("");
    setsetupPasswordLoading(true);
    let data = await postFetch("employee-set-password", {
      token,
      employee_username: username,
      employee_password: setupPassword,
    });
    if (!data.status) {
      setmessage(data.msg);
      setsetupPasswordLoading(false);
    } else {
      await fetch("/api/set-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: data.token }),
      })
        .then((responseFromSetCookie) => responseFromSetCookie.json())
        .then(async (data) => {
          if (!data.status) {
            setmessage(data.msg);
            setsetupPasswordLoading(false);
            return;
          }
          setsetupPasswordLoading(false);
          setIsLoggedIn(true);
          setaccount_type("employee");
          await router.push("/manage-restaurants");
        });
    }
  };

  const employeeLogin = async () => {
    if (!token) return;
    if (!username || !password) {
      setmessage("All fields are required");
      return;
    }

    setmessage("");
    setpasswordLoading(true);
    let data = await postFetch("employee-login", {
      token,
      employee_username: username,
      employee_password: password,
    });
    if (!data.status) {
      setmessage(data.msg);
      setpasswordLoading(false);
    } else {
      await fetch("/api/set-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: data.token }),
      })
        .then((responseFromSetCookie) => responseFromSetCookie.json())
        .then(async (data) => {
          if (!data.status) {
            setmessage(data.msg);
            setpasswordLoading(false);
            return;
          }
          setpasswordLoading(false);
          setIsLoggedIn(true);
          setaccount_type("employee");
          await router.push("/manage-restaurants");
        });
    }
  };

  if (!token) {
    return (
      <div>
        <h1>No token provided</h1>
      </div>
    );
  }

  return (
    <div className="col_gap width_600">
      <h1>EmployeeLogin</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      {showPasswordInputs ? (
        <div>
          {passwordExists ? (
            <>
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              {passwordLoading ? (
                <button>Loading...</button>
              ) : (
                <button onClick={employeeLogin}>Login</button>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Set Password"
                value={setupPassword}
                onChange={(e) => setsetupPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Confirm Password"
                value={confirmSetupPassword}
                onChange={(e) => setconfirmSetupPassword(e.target.value)}
              />
              {setupPasswordLoading ? (
                <button>Loading</button>
              ) : (
                <button onClick={setupPasswordAndLogin}>
                  Set Password & Login
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {searchLoading ? (
            <button>Loading...</button>
          ) : (
            <button onClick={searchUsername}>Search</button>
          )}
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default EmployeeLogin;
