"use client";
import EditableImage from "./EditableImage";
import { useState } from "react";

const UserForm = ({ user, OnSave }) => {
  const [userName, setUserName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [city, setCity] = useState(user?.city || "");
  return (
    <div className="flex gap-4">
      <div>
        <div className="bg-gray-100 p-2 rounded-lg max-w-[120px] min-w-[100px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>

      <form
        className="grow"
        onSubmit={(e) =>
          OnSave(e, {
            name: userName,
            image,
            phone,
            address,
            city,
            country,
            postalCode,
          })
        }
      >
        <label>First name and last name</label>
        <input
          type="text"
          placeholder="first and last name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>User email</label>
        <input
          type="email"
          disabled={true}
          value={user?.email}
        />
        <label>Phone number</label>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>Address</label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex gap-2">
          <div>
            <label>City</label>
            <input
              style={{ "margin-top": "0" }}
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label>Postal code</label>
            <input
              style={{ "margin-top": "0" }}
              type="text"
              placeholder="postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserForm;
