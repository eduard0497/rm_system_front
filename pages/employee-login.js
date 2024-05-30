import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

function EmployeeLogin() {
  const router = useRouter();
  const { token } = router.query;

  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");

  console.log(token);

  if (!token) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>EmployeeLogin</h1>
    </div>
  );
}

export default EmployeeLogin;
