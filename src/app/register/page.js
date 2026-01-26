"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { toast } from "react-hot-toast";

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
  
    const registrationPromise = new Promise(async (resolve, reject) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'},
          });
      
          if (response.ok) {
            setUserCreated(true);
            resolve();
          }
          else{
            setError(true)
            reject();
          }
    });

    await toast.promise(registrationPromise, {
        loading: 'Creating user...',
        success: 'User created!',
        error: 'Error creating user',
    });

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

      <form className="block max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100" onSubmit={onSubmitHandler}>
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
        <button type="submit" disabled={creatingUser} className="w-full py-3 text-lg shadow-lg shadow-primary/20">
          Register
        </button>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="bg-white px-4 relative z-10 text-sm">or login with provider</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 -z-0"></div>
        </div>

        <div className="mt-4">
          <button className="flex gap-4 justify-center items-center w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm font-medium transition-all rounded-xl py-3">
            <Image src={"/google.png"} alt={"google"} width={24} height={24} />
            Sign in with Google
          </button>

          <div className="text-center text-gray-500 mt-6 pt-6 border-t border-gray-100">
            Existing account ? {'  '} 
            <Link href={'/login'} className="text-primary font-bold hover:underline">Login here &raquo;</Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RegisterPage;
