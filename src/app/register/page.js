"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false); // To store any errors

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false)
  
    const response = await fetch('api/register', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
      setUserCreated(true);
    }
    else{
      setError(true)
    }
    setCreatingUser(false)
  }

  return (
    <section className="mt-12">
      <h1 className="text-center text-primary text-4xl font-semibold">
        Register
      </h1>

      {userCreated && (
        <div className="text-center mt-4 text-gray-500"> 
          User Created. <br />
          Now you can{' '}
          <Link className='underline' href={'/login'}>Login &raquo;</Link>
        </div>
      )}

      {error && (
        <div className="text-center mt-4 text-gray-500">
          An error has occured. <br />
          Please try again later
        </div>
      )}

      <form className="block max-w-xs mx-auto" onSubmit={onSubmitHandler}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={creatingUser}>
          Register
        </button>

        <div className="my-2 text-center text-gray-500">
          or login with provider
        </div>

        <div className="max-w-xs mx-auto mt-4">
          <button className="flex gap-4 justify-center">
            <Image src={"/google.png"} alt={"google"} width={24} height={24} />
            Sign in with Google
          </button>

          <div className="text-center text-gray-500 mt-4 border-t pt-8">
            Existing account ? {'  '} 
            <Link href={'/login'} className="underline">Login here &raquo;</Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RegisterPage;
