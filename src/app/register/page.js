"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    setErrorMessage("");
    setUserCreated(false);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setUserCreated(true);
      } else {
        setErrorMessage(data?.error || "An error has occurred. Please try again later.");
      }
    } catch (err) {
      setErrorMessage("An error has occurred. Please try again later.");
    }
    setCreatingUser(false);
  };

  return (
    <section className="mt-12">
      <h1 className="text-center text-primary text-4xl font-semibold">
        Register
      </h1>

      {userCreated && (
        <div className="text-center mt-4 text-gray-500">
          User Created. <br />
          Now you can{" "}
          <Link className="underline" href={"/login"}>
            Login &raquo;
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="text-center mt-4 text-red-500 font-medium">
          {errorMessage}
        </div>
      )}

      <form className="block max-w-xs mx-auto" onSubmit={onSubmitHandler}>
        <input
          type="email"
          placeholder="email"
          value={email}
          disabled={creatingUser}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          disabled={creatingUser}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={creatingUser}>
          Register
        </button>
      </form>

      <div className="max-w-xs mx-auto mt-4">
        <div className="my-2 text-center text-gray-500">
          or login with provider
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex gap-4 justify-center"
        >
          <Image src={"/google.png"} alt={"google"} width={24} height={24} />
          Sign in with Google
        </button>

        <div className="text-center text-gray-500 mt-4 border-t pt-8">
          Existing account ? {"  "}
          <Link href={"/login"} className="underline">
            Login here &raquo;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
