import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { postFetch } from "@/reusableFuncs/postFetch";

function VerifyEmailAddress() {
  const router = useRouter();
  const { token } = router.query;

  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");

  const verifyUserEmail = async () => {
    if (!token) return;
    setloading(true);
    let data = await postFetch("verify-owner-email", {
      token,
    });
    setmessage(data.msg);
    setloading(false);
  };

  useEffect(() => {
    verifyUserEmail();
  }, [token]);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!token) {
    return (
      <div>
        <h1>No Token provided</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default VerifyEmailAddress;
