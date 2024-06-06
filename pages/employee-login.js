import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { postFetch } from "@/reusableFuncs/postFetch";

function EmployeeLogin() {
  const router = useRouter();
  const { token } = router.query;

  const [searchLoading, setsearchLoading] = useState(false);
  const [message, setmessage] = useState("");

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [setupPassword, setsetupPassword] = useState("");
  const [confirmSetupPassword, setconfirmSetupPassword] = useState("");

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
              <button>Login</button>
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
              <button>Set Password & Login</button>
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
