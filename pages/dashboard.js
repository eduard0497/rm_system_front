import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@/components/AuthContext";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";
const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

function Dashboard() {
  const [currentView, setcurrentView] = useState("");
  //
  const [modal, setmodal] = useState(false);
  const [message, setmessage] = useState("");

  const renderView = () => {
    switch (currentView) {
      case "employees":
        return <Employees />;
      case "paymentActivity":
        return <PaymentActivity />;
      default:
        return <Restaurants setmodal={setmodal} setmessage={setmessage} />;
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
      <div>
        <br />
        <div className="row_with_gap">
          <button onClick={() => setcurrentView("")}>Restaurants</button>
          <button onClick={() => setcurrentView("employees")}>Employees</button>
          <button onClick={() => setcurrentView("paymentActivity")}>
            Payment Activity
          </button>
        </div>
        <br />
        <br />
        <br />
        {renderView()}
      </div>
    </>
  );
}

export default Dashboard;

const Restaurants = ({ setmodal, setmessage }) => {
  const { setIsLoggedIn } = useContext(AuthContext);

  const router = useRouter();
  const [restaurants, setrestaurants] = useState([]);
  const [loading, setloading] = useState(false);
  const [addRestaurantToggle, setaddRestaurantToggle] = useState(false);

  const sortRestaurants = (restaurants) => {
    return restaurants.sort((a, b) => a.restaurant_id - b.restaurant_id);
  };

  const getRestaurants = () => {
    setloading(true);
    fetch(`${SERVER_LINK}/get-restaurants`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.kick_out) {
          setIsLoggedIn(false);
          await router.push("/");
        } else if (!data.status) {
          setloading(false);
          setmessage(data.msg);
          setmodal(true);
        } else {
          setrestaurants(sortRestaurants(data.restaurants));
          setloading(false);
        }
      });
  };

  const addRestaurantToList = (restaurantAsObject) => {
    let restaurantsCopy = [...restaurants];
    restaurantsCopy.push(restaurantAsObject);
    setrestaurants(sortRestaurants(restaurantsCopy));
  };

  const findAndSwap = (restaurant) => {
    let restaurantsCopy = [...restaurants];

    let index = restaurantsCopy.findIndex(
      (obj) => obj["restaurant_id"] === restaurant.restaurant_id
    );

    if (index !== -1) {
      // Swap the objects
      restaurantsCopy[index] = restaurant;
      setrestaurants(sortRestaurants(restaurantsCopy));
    } else {
      return null;
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>LOADING RESTAURANTS...</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="row_space_around">
        <h1>Restaurants Page Here</h1>
        <button onClick={() => setaddRestaurantToggle(!addRestaurantToggle)}>
          Add Restaurant
        </button>
      </div>
      <br />
      {addRestaurantToggle ? (
        <AddRestaurantForm
          addRestaurantToList={addRestaurantToList}
          setaddRestaurantToggle={setaddRestaurantToggle}
        />
      ) : null}
      <br />
      {!restaurants.length && !addRestaurantToggle ? (
        <h2>Add restaurant to begin</h2>
      ) : null}
      <br />
      {restaurants.map((restaurant) => {
        return (
          <SingleRestaurant
            key={restaurant.restaurant_id}
            restaurant={restaurant}
            findAndSwap={findAndSwap}
          />
        );
      })}
    </div>
  );
};

const AddRestaurantForm = ({ addRestaurantToList, setaddRestaurantToggle }) => {
  const [restaurant_name, setrestaurant_name] = useState("");
  const [restaurant_address_street, setrestaurant_address_street] =
    useState("");
  const [restaurant_address_unit, setrestaurant_address_unit] = useState("");
  const [restaurant_address_city, setrestaurant_address_city] = useState("");
  const [restaurant_address_state, setrestaurant_address_state] = useState("");
  const [restaurant_address_zip, setrestaurant_address_zip] = useState("");
  const [restaurant_phone_number, setrestaurant_phone_number] = useState("");
  const [restaurant_fax_number, setrestaurant_fax_number] = useState("");
  const [restaurant_email_address, setrestaurant_email_address] = useState("");
  const [restaurant_menu_note, setrestaurant_menu_note] = useState("");

  //
  const [formMessage, setformMessage] = useState("");
  const [loading, setloading] = useState(false);

  const clearFields = () => {
    setrestaurant_name("");
    setrestaurant_address_street("");
    setrestaurant_address_unit("");
    setrestaurant_address_city("");
    setrestaurant_address_state("");
    setrestaurant_address_zip("");
    setrestaurant_phone_number("");
    setrestaurant_fax_number("");
    setrestaurant_email_address("");
    setrestaurant_menu_note("");
    setformMessage("");
  };

  const registerRestaurant = () => {
    if (!restaurant_name) {
      setformMessage("Restaurant name is required");
      return;
    }
    setloading(true);
    fetch(`${SERVER_LINK}/register-restaurant`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_name,
        restaurant_address_street,
        restaurant_address_unit,
        restaurant_address_city,
        restaurant_address_state,
        restaurant_address_zip,
        restaurant_phone_number,
        restaurant_fax_number,
        restaurant_email_address,
        restaurant_menu_note,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          setformMessage(data.msg);
          setloading(false);
        } else {
          addRestaurantToList(data.restaurantAsObject);
          clearFields();
          setaddRestaurantToggle(false);
          setloading(false);
        }
      });
  };

  return (
    <div className="col_gap border width_600">
      <h1>Add Restaurant form</h1>
      <p>
        !!! The details provided will be on the menu visible to the client !!!
      </p>
      <input
        type="text"
        placeholder="Restaurant Name*"
        value={restaurant_name}
        onChange={(e) => setrestaurant_name(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        value={restaurant_address_street}
        onChange={(e) => setrestaurant_address_street(e.target.value)}
      />
      <input
        type="text"
        placeholder="Unit No"
        value={restaurant_address_unit}
        onChange={(e) => setrestaurant_address_unit(e.target.value)}
      />
      <input
        type="text"
        placeholder="City"
        value={restaurant_address_city}
        onChange={(e) => setrestaurant_address_city(e.target.value)}
      />
      <input
        type="text"
        placeholder="State"
        value={restaurant_address_state}
        onChange={(e) => setrestaurant_address_state(e.target.value)}
      />
      <input
        type="text"
        placeholder="ZIP"
        value={restaurant_address_zip}
        onChange={(e) => setrestaurant_address_zip(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={restaurant_phone_number}
        onChange={(e) => setrestaurant_phone_number(e.target.value)}
      />
      <input
        type="text"
        placeholder="Fax Number"
        value={restaurant_fax_number}
        onChange={(e) => setrestaurant_fax_number(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email Address"
        value={restaurant_email_address}
        onChange={(e) => setrestaurant_email_address(e.target.value)}
      />
      <textarea
        rows="10"
        placeholder="Menu Note/Slogan"
        value={restaurant_menu_note}
        onChange={(e) => setrestaurant_menu_note(e.target.value)}
      ></textarea>
      {loading ? (
        <button>Loading...</button>
      ) : (
        <button onClick={registerRestaurant}>Register Restaurant</button>
      )}
      {formMessage && <p>{formMessage}</p>}
    </div>
  );
};

const SingleRestaurant = ({ restaurant, findAndSwap }) => {
  const [toggle, settoggle] = useState(false);
  const [loading, setloading] = useState(false);
  const [formMessage, setformMessage] = useState("");

  const [restaurant_name, setrestaurant_name] = useState(
    restaurant.restaurant_name
  );
  const [restaurant_address_street, setrestaurant_address_street] = useState(
    restaurant.restaurant_address_street
  );
  const [restaurant_address_unit, setrestaurant_address_unit] = useState(
    restaurant.restaurant_address_unit
  );
  const [restaurant_address_city, setrestaurant_address_city] = useState(
    restaurant.restaurant_address_city
  );
  const [restaurant_address_state, setrestaurant_address_state] = useState(
    restaurant.restaurant_address_state
  );
  const [restaurant_address_zip, setrestaurant_address_zip] = useState(
    restaurant.restaurant_address_zip
  );
  const [restaurant_phone_number, setrestaurant_phone_number] = useState(
    restaurant.restaurant_phone_number
  );
  const [restaurant_fax_number, setrestaurant_fax_number] = useState(
    restaurant.restaurant_fax_number
  );
  const [restaurant_email_address, setrestaurant_email_address] = useState(
    restaurant.restaurant_email_address
  );
  const [restaurant_menu_note, setrestaurant_menu_note] = useState(
    restaurant.restaurant_menu_note
  );

  const editRestaurantDetails = () => {
    if (!restaurant.restaurant_id) return;
    if (!restaurant_name) {
      setformMessage("The restaurant name may not be empty");
      return;
    }
    setloading(true);
    fetch(`${SERVER_LINK}/register-restaurant`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: restaurant.restaurant_id,
        restaurant_name,
        restaurant_address_street,
        restaurant_address_unit,
        restaurant_address_city,
        restaurant_address_state,
        restaurant_address_zip,
        restaurant_phone_number,
        restaurant_fax_number,
        restaurant_email_address,
        restaurant_menu_note,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          setformMessage(data.msg);
          setloading(false);
        } else {
          findAndSwap(data.restaurantAsObject);
          setloading(false);
          settoggle(!toggle);
        }
      });
  };

  const [manageSubscriptionRestId, setmanageSubscriptionRestId] =
    useState(null);

  if (!restaurant.restaurant_id) return;

  return (
    <>
      <ManageSubscription
        manageSubscriptionRestId={manageSubscriptionRestId}
        setmanageSubscriptionRestId={setmanageSubscriptionRestId}
        findAndSwap={findAndSwap}
      />
      <div className="col_gap border width_700">
        {toggle ? (
          <>
            <div className="row_space_around">
              <input
                type="text"
                placeholder="Restaurant Name*"
                value={restaurant_name}
                onChange={(e) => setrestaurant_name(e.target.value)}
              />
              <div className="col_gap">
                <input
                  type="text"
                  placeholder="Address"
                  value={restaurant_address_street}
                  onChange={(e) => setrestaurant_address_street(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Unit No"
                  value={restaurant_address_unit}
                  onChange={(e) => setrestaurant_address_unit(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={restaurant_address_city}
                  onChange={(e) => setrestaurant_address_city(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={restaurant_address_state}
                  onChange={(e) => setrestaurant_address_state(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  value={restaurant_address_zip}
                  onChange={(e) => setrestaurant_address_zip(e.target.value)}
                />
              </div>
            </div>

            <div className="row_space_around">
              <input
                type="text"
                placeholder="Phone Number"
                value={restaurant_phone_number}
                onChange={(e) => setrestaurant_phone_number(e.target.value)}
              />
              <input
                type="text"
                placeholder="Fax Number"
                value={restaurant_fax_number}
                onChange={(e) => setrestaurant_fax_number(e.target.value)}
              />
            </div>

            <div className="row_space_around">
              <input
                type="text"
                placeholder="Email Address"
                value={restaurant_email_address}
                onChange={(e) => setrestaurant_email_address(e.target.value)}
              />
              <textarea
                rows="10"
                placeholder="Menu Note/Slogan"
                value={restaurant_menu_note}
                onChange={(e) => setrestaurant_menu_note(e.target.value)}
              ></textarea>
            </div>

            <div className="row_space_around">
              <button onClick={() => settoggle(!toggle)}>Cancel</button>
              {loading ? (
                <button>Loading...</button>
              ) : (
                <button onClick={editRestaurantDetails}>Confirm Changes</button>
              )}
            </div>
            {formMessage && <p>{formMessage}</p>}
          </>
        ) : (
          <>
            <div className="row_space_between">
              <p>{restaurant.restaurant_name}</p>
              <p>
                {"Address: " +
                  restaurant.restaurant_address_street +
                  " " +
                  restaurant.restaurant_address_unit +
                  ", " +
                  restaurant.restaurant_address_city +
                  ", " +
                  restaurant.restaurant_address_state +
                  " " +
                  restaurant.restaurant_address_zip}
              </p>
            </div>
            <div className="row_space_between">
              <p>{"Phone: " + restaurant.restaurant_phone_number}</p>
              <p>{"FAX: " + restaurant.restaurant_fax_number}</p>
            </div>
            <div className="row_space_between">
              <p>{"Email: " + restaurant.restaurant_email_address}</p>
              <p>
                Status:{" "}
                {restaurant.restaurant_is_active ? "Active" : "!NOT! Active"}
              </p>
            </div>
            <pre>{"Menu Note: " + restaurant.restaurant_menu_note}</pre>
            <div className="row_space_around">
              <button>Visit Restaurant Page</button>
              <button>Employees who have access</button>
              <button onClick={() => settoggle(!toggle)}>
                Edit restaurant details
              </button>
              <button
                onClick={() =>
                  setmanageSubscriptionRestId(restaurant.restaurant_id)
                }
              >
                Manage Subscription
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const ManageSubscription = ({
  manageSubscriptionRestId,
  setmanageSubscriptionRestId,
  findAndSwap,
}) => {
  const [modalErrorMessage, setmodalErrorMessage] = useState("");
  const [mainLoading, setmainLoading] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [latestTransaction, setlatestTransaction] = useState([]);

  const getCurrentSubscriptionDetails = () => {
    if (!manageSubscriptionRestId) return;
    setmainLoading(true);
    fetch(`${SERVER_LINK}/get-current-subscription-details`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: manageSubscriptionRestId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          setmodalErrorMessage(data.msg);
          setmainLoading(false);
        } else {
          setlatestTransaction(data.latestTransaction);
          setmainLoading(false);
        }
      });
  };

  useEffect(() => {
    getCurrentSubscriptionDetails();
  }, [manageSubscriptionRestId]);

  const startTrial = () => {
    if (!manageSubscriptionRestId) return;

    setbuttonLoading(true);
    fetch(`${SERVER_LINK}/start-trial`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: manageSubscriptionRestId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          setmodalErrorMessage(data.msg);
          setbuttonLoading(false);
        } else {
          setlatestTransaction(data.latestTransaction);
          findAndSwap(data.updatedRestaurantDetails);
          setbuttonLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setbuttonLoading(false);
      });
  };

  const createCheckoutSession = () => {
    if (!manageSubscriptionRestId) return;
    setbuttonLoading(true);

    fetch(`${SERVER_LINK}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        restaurant_id: manageSubscriptionRestId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          setmodalErrorMessage(data.msg);
          setbuttonLoading(false);
        } else {
          setbuttonLoading(false);
          window.location.href = data.session_url;
        }
      });
  };

  if (!manageSubscriptionRestId) return;
  if (mainLoading) {
    return (
      <div className="modal_background">
        <div className="modal_box">
          <h1>mainLoading...</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="modal_background">
      <div className="modal_box">
        <h1>Manage Subscription - {manageSubscriptionRestId}</h1>
        {latestTransaction.length == 0 ? (
          <div>
            <h1>No history of payments</h1>
            {buttonLoading ? (
              <button>Loading...</button>
            ) : (
              <button onClick={startTrial}>Start Trial</button>
            )}
          </div>
        ) : (
          <div>
            <h2>
              Subscription End Date -{" "}
              {new Date(
                latestTransaction[0].subscription_end_date
              ).toLocaleDateString()}
            </h2>
            {buttonLoading ? (
              <button>Loading...</button>
            ) : (
              <button onClick={createCheckoutSession}>Buy another month</button>
            )}
          </div>
        )}
        <button onClick={() => setmanageSubscriptionRestId(null)}>
          Cancel
        </button>
        {modalErrorMessage && <p>{modalErrorMessage}</p>}
      </div>
    </div>
  );
};

const Employees = () => {
  return (
    <div>
      <h1>Employees here</h1>
    </div>
  );
};

const PaymentActivity = () => {
  return (
    <div>
      <h1>Payment Activity here</h1>
    </div>
  );
};
