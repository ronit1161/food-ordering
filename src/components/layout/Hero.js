import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero pt-12 mt-8">
      <div className="py-12">
        <h1 className="text-4xl font-bold ">Everything <br /> is better<br /> with a <span className="text-primary">Pizza</span></h1>
        <p className="my-4 text-gray-600 text-sm">
          Pizza is the missing piece that makes every day complete , a simple
          yet delicious joy in life
        </p>
        <div className="flex gap-4">
            <button className="bg-primary text-white px-8 py-2 rounded-full uppercase text-sm font-semibold">Order Now</button>
            <button className="text-gray-600 font-semibold">Learn More</button>
        </div>
      </div>
      <div className="relative object-cover overflow-hidden">
        <Image
          src={"/pancake.jpg"}
          layout="fill"
          objectFit="contain"
          alt="Pizza Image"
        />
      </div>
    </section>
  );
}
