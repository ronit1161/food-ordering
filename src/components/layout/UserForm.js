'use client';
import AddressInputs from "@/components/layout/AddressInputs";
import EditableImage from "@/components/layout/EditableImage";
import { UseProfile } from "@/components/UseProfile";
import { useState, useEffect } from "react";

export default function UserForm({ user, onSave }) {
  const { data: loggedInUserData } = UseProfile(); // Properly using the hook here
  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);

  // If loggedInUserData is available, use it to set the form fields
  useEffect(() => {
    if (loggedInUserData) {
      setUserName(loggedInUserData.name || '');
      setImage(loggedInUserData.image || '');
      setPhone(loggedInUserData.phone || '');
      setStreetAddress(loggedInUserData.streetAddress || '');
      setPostalCode(loggedInUserData.postalCode || '');
      setCity(loggedInUserData.city || '');
      setCountry(loggedInUserData.country || '');
      setAdmin(loggedInUserData.admin || false);
    }
  }, [loggedInUserData]); // Depend on loggedInUserData

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'postalCode') setPostalCode(value);
    if (propName === 'city') setCity(value);
    if (propName === 'country') setCountry(value);
  }

  return (
    <div className="md:flex gap-4">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev =>
          onSave(ev, {
            name: userName, image, phone, admin,
            streetAddress, city, country, postalCode,
          })
        }
      >
        <label>First and last name</label>
        <input
          type="text"
          placeholder="First and last name"
          value={userName} onChange={ev => setUserName(ev.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          disabled={true}
          value={user?.email || loggedInUserData?.email || ''}
          placeholder="email"
        />
        <AddressInputs
          addressProps={{ phone, streetAddress, postalCode, city, country }}
          setAddressProp={handleAddressChange}
        />
        {loggedInUserData?.admin && (
          <div>
            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
                id="adminCb"
                type="checkbox"
                value="1"
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>Admin</span>
            </label>
          </div>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
