import Image from "next/image";
import Link from "next/link";
import Right from "../icons/Right";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-12 md:py-24">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Everything <br /> is better
          <br /> with a <span className="text-primary underline decoration-wavy decoration-orange-200">Pizza</span>
        </h1>

        <p className="my-8 text-gray-500 text-lg leading-relaxed max-w-lg">
          Pizza is the missing piece that makes every day complete, a simple
          yet delicious joy in life that brings people together.
        </p>

        <div className="flex items-center gap-6">
          <button className="bg-primary text-white px-8 py-4 rounded-full uppercase text-sm font-bold tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-600 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Order Now
          </button>
          <Link href={"/menu"} className="flex items-center gap-2 text-gray-600 font-bold hover:text-primary transition-colors">
            Learn More <Right className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="relative hidden md:block w-full h-full overflow-hidden">
        <Image
          src="/pancake.jpg"
          fill
          style={{ objectFit: 'contain' }}
          alt="Pizza Image"
        />
      </div>
    </section>
  );
}
