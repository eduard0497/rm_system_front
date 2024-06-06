import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/AuthContext";
import { postFetch } from "@/reusableFuncs/postFetch";

function ManageRestaurants() {
  const { isLoggedIn, setIsLoggedIn, account_type, setaccount_type } =
    useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const getRestaurants = async () => {
    console.log("mtav get restaurants to manage");
    setloading(true);
    let data = await postFetch("get-restaurants-to-manage", {});
    console.log(data);
    setloading(false);
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div>
      <h1>Manage Restaurants</h1>
    </div>
  );
}

export default ManageRestaurants;
