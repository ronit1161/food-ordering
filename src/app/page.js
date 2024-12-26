import Hero from "@/components/layout/Hero";
import { HomeMenu } from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />

      <section className="text-center my-16" id="about">
        <SectionHeaders mainHeader={"Our story"} subHeader={"About us"} />
        <div className="max-w-2xl mx-auto mt-4 text-gray-500 flex flex-col gap-2">
          <p className="mb-4">
            Welcome to Delight Bites, your go-to destination for the most
            delicious pizzas, burgers, and sandwiches in town! We are a
            passionate team of food lovers dedicated to bringing you the
            ultimate comfort food experience, where every bite bursts with
            flavor, and every meal is crafted with love and care.
          </p>
          <SectionHeaders mainHeader={"What We Offer"} />
          <p>
            We take pride in serving up a variety of irresistible pizzas, juicy
            burgers, and handcrafted sandwiches, each made with high-quality
            ingredients and a whole lot of passion. Whether you’re a fan of the
            classic Margherita pizza, a lover of a hearty double cheeseburger,
            or someone who craves a perfectly grilled sandwich, we’ve got
            something to satisfy your cravings.
          </p>
        </div>
      </section>

      <section className="text-center my-16" id="contact">
        <SectionHeaders
          subHeader={"Don't hesitate"}
          mainHeader={"Contact Us "}
        />

        <div className="mt-8">
          <a className="text-4xl text-gray-500" href="tel:9879847545">
            +91 98798 47545
          </a>
        </div>
      </section>
    </>
  );
}
