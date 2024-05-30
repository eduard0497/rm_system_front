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
  const { setIsLoggedIn, setaccount_type } = useContext(AuthContext);

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
        if (!data.status) {
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
        <button>Visit Restaurants Config Page</button>
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
  const [loading, setloading] = useState(false);
  const [addEmplButtonLoading, setaddEmplButtonLoading] = useState(false);
  const [employees, setemployees] = useState([]);
  //
  const [addEmployeeToggle, setaddEmployeeToggle] = useState(false);
  //
  const [employee_first_name, setemployee_first_name] = useState("");
  const [employee_last_name, setemployee_last_name] = useState("");
  const [employee_email_address, setemployee_email_address] = useState("");
  const [employee_username, setemployee_username] = useState("");

  const getEmployees = () => {
    setloading(true);
    fetch(`${SERVER_LINK}/get-employees`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          console.log(data.msg);
          setloading(false);
        } else {
          setemployees(data.employees);
          setloading(false);
        }
      });
  };

  const addEmployee = () => {
    if (
      !employee_first_name ||
      !employee_last_name ||
      !employee_email_address ||
      !employee_username
    ) {
      console.log("all fields are required");
      return;
    }
    if (!validateEmail(employee_email_address)) {
      console.log("valid email must be provided");
      return;
    }

    if (employee_username.includes(" ")) {
      console.log("username can not contain spaces");
      return;
    }
    setaddEmplButtonLoading(true);
    fetch(`${SERVER_LINK}/add-employee`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_first_name,
        employee_last_name,
        employee_email_address: employee_email_address.toLowerCase(),
        employee_username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          console.log(data.msg);
          setaddEmplButtonLoading(false);
        } else {
          setaddEmplButtonLoading(false);
          getEmployees();
          setaddEmployeeToggle(false);
        }
      });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  // if (!employees.length) {
  //   return (
  //     <div>
  //       <h1>No employees to display...</h1>
  //       <br />
  //       <button onClick={() => setaddEmployeeToggle(!addEmployeeToggle)}>
  //         Add Employee
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h1>Employees here</h1>
      <br />
      <button onClick={() => setaddEmployeeToggle(!addEmployeeToggle)}>
        Add Employee
      </button>
      <br />
      <br />
      <table className="width_700">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Is Active</th>
            <th>Manage Buttons</th>
          </tr>
        </thead>
        <tbody>
          {addEmployeeToggle ? (
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="First Name"
                  value={employee_first_name}
                  onChange={(e) => setemployee_first_name(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={employee_last_name}
                  onChange={(e) => setemployee_last_name(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Email Address"
                  value={employee_email_address}
                  onChange={(e) => setemployee_email_address(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Username"
                  value={employee_username}
                  onChange={(e) => setemployee_username(e.target.value)}
                />
              </td>
              <td></td>
              <td>
                {addEmplButtonLoading ? (
                  <button>Loading...</button>
                ) : (
                  <button onClick={addEmployee}>Confirm</button>
                )}
              </td>
            </tr>
          ) : null}
          {employees.map((employee) => {
            return (
              <SingleEmployee
                key={employee.employee_id}
                employee={employee}
                getEmployees={getEmployees}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const SingleEmployee = ({ employee, getEmployees }) => {
  const [emailLoginInstrLoading, setemailLoginInstrLoading] = useState(false);
  const [editEmployeeDetailsLoading, seteditEmployeeDetailsLoading] =
    useState(false);
  const [employeeDetailsToggle, setemployeeDetailsToggle] = useState(false);

  //
  const [employee_first_name, setemployee_first_name] = useState(
    employee.employee_first_name
  );
  const [employee_last_name, setemployee_last_name] = useState(
    employee.employee_last_name
  );
  const [employee_is_active, setemployee_is_active] = useState(
    employee.employee_is_active
  );

  const emailLoginInstructions = (employee_id) => {
    if (!employee_id) return;
    setemailLoginInstrLoading(true);
    fetch(`${SERVER_LINK}/email-login-instructions`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setemailLoginInstrLoading(false);
      });
  };

  const editEmployeeDetails = (employee_id) => {
    if (!employee_first_name || !employee_last_name || !employee_id) return;
    seteditEmployeeDetailsLoading(true);
    fetch(`${SERVER_LINK}/edit-employee-details`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id,
        employee_first_name,
        employee_last_name,
        employee_is_active,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          console.log(data.msg);
          seteditEmployeeDetailsLoading(false);
        } else {
          seteditEmployeeDetailsLoading(false);

          getEmployees();
        }
      });
  };

  if (!employee.employee_id) return;

  return (
    <tr>
      {employeeDetailsToggle ? (
        <>
          <td>
            <input
              type="text"
              placeholder="First Name"
              value={employee_first_name}
              onChange={(e) => setemployee_first_name(e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              placeholder="First Name"
              value={employee_last_name}
              onChange={(e) => setemployee_last_name(e.target.value)}
            />
          </td>
          <td>{employee.employee_email_address}</td>
          <td>{employee.employee_username}</td>
          <td>
            <select
              value={employee_is_active}
              onChange={(e) => setemployee_is_active(e.target.value)}
            >
              <option value={false}>Deactivate</option>
              <option value={true}>Activate</option>
            </select>
          </td>
          <td>
            {editEmployeeDetailsLoading ? (
              <button>Loading...</button>
            ) : (
              <button onClick={() => editEmployeeDetails(employee.employee_id)}>
                Save
              </button>
            )}
          </td>
        </>
      ) : (
        <>
          <td>{employee.employee_first_name}</td>
          <td>{employee.employee_last_name}</td>
          <td>{employee.employee_email_address}</td>
          <td>{employee.employee_username}</td>
          <td>{employee.employee_is_active.toString()}</td>
          <td className="row_with_gap">
            <button onClick={() => setemployeeDetailsToggle(true)}>
              Edit Employee Details
            </button>
            {emailLoginInstrLoading ? (
              <button>Loading...</button>
            ) : (
              <button
                onClick={() => emailLoginInstructions(employee.employee_id)}
              >
                Email Login Instructions
              </button>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

const PaymentActivity = () => {
  const [loading, setloading] = useState(false);
  const [payments, setpayments] = useState([]);
  const [filterItems, setfilterItems] = useState([]);
  const [restNameFilter, setrestNameFilter] = useState("");

  const getPaymentActivity = () => {
    setloading(true);
    fetch(`${SERVER_LINK}/get-payment-activity`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          console.log(data.msg);
          setloading(false);
        } else {
          let arrayOfFilters = [];
          data.payments.map((payment) => {
            if (!arrayOfFilters.includes(payment.restaurant_name)) {
              arrayOfFilters.push(payment.restaurant_name);
            }
          });
          setfilterItems(arrayOfFilters);
          setpayments(data.payments);
          setloading(false);
        }
      });
  };

  useEffect(() => {
    getPaymentActivity();
  }, []);

  const renderFilteredPayments = () => {
    if (!restNameFilter) return payments;
    return payments.filter(
      (payment) => payment.restaurant_name === restNameFilter
    );
  };

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div>
        <h1>No payments to display...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Payment Activity here</h1>
      <div className="row_space_around">
        {filterItems.map((item, index) => {
          return (
            <button key={index} onClick={() => setrestNameFilter(item)}>
              {item}
            </button>
          );
        })}
        <button onClick={() => setrestNameFilter("")}>Clear Filters</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Amount</th>
            {/* <th>Payment Status</th> */}
            <th>Name</th>
            <th>Email Address</th>
            <th>Card Details</th>
            <th>Last 4</th>
            <th>Subscription Ends</th>
            <th>Transaction Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {renderFilteredPayments().map((payment) => {
            return (
              <tr key={payment.transaction_id}>
                <td>{payment.restaurant_name}</td>
                <td>{"$" + (payment.amount_total / 100).toFixed(2)}</td>
                {/* <td>{payment.payment_status.toUpperCase()}</td> */}
                <td>{payment.provided_name}</td>
                <td>{payment.provided_email}</td>
                <td>
                  {payment.card_brand.toUpperCase() +
                    " " +
                    payment.card_exp_month +
                    "/" +
                    payment.card_exp_year}
                </td>
                <td>{payment.card_last_four}</td>
                <td>
                  {new Date(payment.subscription_end_date).toLocaleDateString()}
                </td>
                <td>
                  {new Date(payment.transaction_timestamp).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return regex.test(email);
};
