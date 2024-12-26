import Image from "next/image";
import Link from "next/link";
import Right from "../icons/Right";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-bold ">
          Everything <br /> is better
          <br /> with a <span className="text-primary">Pizza</span>
        </h1>

        <p className="my-4 text-gray-600 text-sm">
          Pizza is the missing piece that makes every day complete , a simple
          yet delicious joy in life
        </p>

        <div className="flex border-0 items-center gap-4">
          <button className="bg-primary text-white px-8 py-2 rounded-full uppercase text-sm font-semibold">
            Order Now
          </button>
          <Link href={"/learn-more"} className="button text-center grid grid-cols-2">
            <span>Learn More </span>
          </Link>
        </div>
      </div>

      <div className="relative hidden md:block object-cover overflow-hidden">
        <Image
          src={"/pancake.jpg"}
          layout={"fill"}
          objectFit={"contain"}
          alt="Pizza Image"
        />
      </div>
    </section>
  );
}
