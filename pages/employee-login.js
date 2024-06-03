import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

function EmployeeLogin() {
  const router = useRouter();
  const { token } = router.query;

  // const [loading, setloading] = useState(false);
  // const [message, setmessage] = useState("");

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [setupPassword, setsetupPassword] = useState("");
  const [confirmSetupPassword, setconfirmSetupPassword] = useState("");

  const [showPasswordInputs, setshowPasswordInputs] = useState(false);
  const [passwordExists, setpasswordExists] = useState(false);

  console.log(token);

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
        <button>Search</button>
      )}
    </div>
  );
}

export default EmployeeLogin;
