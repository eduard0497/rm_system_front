import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";
import AuthContext from "@/components/AuthContext";
import { validateEmail } from "@/reusableFuncs/validateEmail";
import { postFetch } from "@/reusableFuncs/postFetch";

function Login() {
  const [toggle, settoggle] = useState(false);
  return (
    <div>
      <button onClick={() => settoggle(!toggle)}>Toggle Log Reg</button>
      {toggle ? <OwnerLogin /> : <OwnerRegister />}
    </div>
  );
}

export default Login;

const OwnerLogin = () => {
  const { setIsLoggedIn, setaccount_type } = useContext(AuthContext);
  const router = useRouter();
  const [modal, setmodal] = useState(false);
  const [message, setmessage] = useState("");
  const [formMessage, setformMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [owner_email_address, setowner_email_address] = useState("");
  const [owner_password, setowner_password] = useState("");

  const ownerLogin = async () => {
    if (!owner_email_address || !owner_password) {
      setformMessage("all fields are required");
      return;
    }
    if (!validateEmail(owner_email_address)) {
      setformMessage("Please enter a valid email address");
      return;
    }

    setloading(true);
    let data = await postFetch("owner-login", {
      owner_email_address: owner_email_address.toLowerCase(),
      owner_password,
    });
    if (!data.status) {
      setformMessage(data.msg);
      setloading(false);
      return;
    }

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
          setformMessage(data.msg);
          setloading(false);
          return;
        }
        setloading(false);
        setIsLoggedIn(true);
        setaccount_type("owner");
        await router.push("/dashboard");
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      ownerLogin();
    }
  };

  return (
    <>
      <Modal
        modal={modal}
        setmodal={setmodal}
        message={message}
        setmessage={setmessage}
      />
      <div className="col_gap width_600">
        <h1>Login</h1>

        <input
          type="text"
          placeholder="Email"
          value={owner_email_address}
          onChange={(e) => {
            setformMessage("");
            setowner_email_address(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Password"
          value={owner_password}
          onChange={(e) => {
            setformMessage("");
            setowner_password(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />

        {loading ? (
          <button>Loading...</button>
        ) : (
          <button onClick={ownerLogin}>Login</button>
        )}
        {formMessage.length ? <p>{formMessage}</p> : null}
      </div>
    </>
  );
};

const OwnerRegister = () => {
  const [modal, setmodal] = useState(false);
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(false);
  const [formMessage, setformMessage] = useState("");
  const [owner_first_name, setowner_first_name] = useState("");
  const [owner_last_name, setowner_last_name] = useState("");
  const [owner_email_address, setowner_email_address] = useState("");
  const [owner_password, setowner_password] = useState("");
  const [owner_confirmed_password, setowner_confirmed_password] = useState("");

  const clearFields = () => {
    setowner_first_name("");
    setowner_last_name("");
    setowner_email_address("");
    setowner_password("");
    setowner_confirmed_password("");
  };

  const registerOwner = async () => {
    if (
      !owner_first_name ||
      !owner_last_name ||
      !owner_email_address ||
      !owner_password ||
      !owner_confirmed_password
    ) {
      setformMessage("all fields are required");
      //   setmodal(true);
      //   setmessage("All fields are required");
      return;
    }
    if (!validateEmail(owner_email_address)) {
      setformMessage("Please enter a valid email address");
      return;
    }
    if (owner_password.length < 8) {
      setformMessage("Passwordmust be at least 8 characters");
      return;
    }
    if (owner_password.includes(" ")) {
      setformMessage("Password may not contain spaces");
      return;
    }
    if (owner_password != owner_confirmed_password) {
      setformMessage("Passwords do not match");
      return;
    }

    setloading(true);
    let data = await postFetch("register-owner", {
      owner_first_name,
      owner_last_name,
      owner_email_address: owner_email_address.toLowerCase(),
      owner_password,
    });

    if (data.status == 1) {
      clearFields();
    }
    setmodal(true);
    setmessage(data.msg);
    setloading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      registerOwner();
    }
  };

  return (
    <>
      <Modal
        modal={modal}
        setmodal={setmodal}
        message={message}
        setmessage={setmessage}
      />
      <div className="col_gap width_600">
        <h1>Register</h1>
        <input
          type="text"
          placeholder="First Name"
          value={owner_first_name}
          onChange={(e) => {
            setformMessage("");
            setowner_first_name(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={owner_last_name}
          onChange={(e) => {
            setformMessage("");
            setowner_last_name(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Email"
          value={owner_email_address}
          onChange={(e) => {
            setformMessage("");
            setowner_email_address(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Password"
          value={owner_password}
          onChange={(e) => {
            setformMessage("");
            setowner_password(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Confirm Password"
          value={owner_confirmed_password}
          onChange={(e) => {
            setformMessage("");
            setowner_confirmed_password(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        {loading ? (
          <button>Loading...</button>
        ) : (
          <button onClick={registerOwner}>Register Owner</button>
        )}
        {formMessage.length ? <p>{formMessage}</p> : null}
      </div>
    </>
  );
};
