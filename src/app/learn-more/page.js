import SectionHeaders from "@/components/layout/SectionHeaders";
import React from "react";

const LearnMorePage = () => {
  return (
    <section className="mt-8 text-center">
      <SectionHeaders subHeader={"About us"} />
      <p className='my-4'>
        Welcome to Delight Bites, your go-to destination for the most delicious
        pizzas, burgers, and sandwiches in town! We are a passionate team of
        food lovers dedicated to bringing you the ultimate comfort food
        experience, where every bite bursts with flavor, and every meal is
        crafted with love and care.
      </p>
      <SectionHeaders mainHeader={"Our Story"} />
      <p className='my-4'>
        At Delight Bites, we believe in the magic of good food. It all started
        with a simple dream: to create a place where people could come together
        and enjoy freshly prepared, mouthwatering meals that satisfy both the
        heart and the soul. Our journey began with the idea that food is not
        just fuel; it's an experience that brings joy, comfort, and connection.
      </p>
      <SectionHeaders mainHeader={"What We Offer"} />
      <p className='my-4'>
        We take pride in serving up a variety of irresistible pizzas, juicy
        burgers, and handcrafted sandwiches, each made with high-quality
        ingredients and a whole lot of passion. Whether you’re a fan of the
        classic Margherita pizza, a lover of a hearty double cheeseburger, or
        someone who craves a perfectly grilled sandwich, we’ve got something to
        satisfy your cravings.
      </p>
      <SectionHeaders mainHeader={"Innovation and Creativity"} />
      <p className='my-4'>
        We’re always experimenting with new flavors and creative combinations to
        keep our menu exciting and fresh. Our chefs are passionate about pushing
        culinary boundaries while staying true to the classic comfort food you
        love. Be sure to check out our seasonal specials for something new and
        exciting every time you visit!
      </p>
      <SectionHeaders mainHeader={"Join Us Today!"} />
      <p className='my-4'>
        At Delight Bites, we’re more than just a restaurant – we’re a community
        of food enthusiasts who believe that great food can bring people
        together. Whether you’re a pizza aficionado, a burger lover, or a
        sandwich connoisseur, we invite you to join us and discover why Delight
        Bites is the talk of the town. So, what are you waiting for? Come on
        over, grab a seat, and let us serve you some of the best pizzas,
        burgers, and sandwiches you’ll ever taste. We can’t wait to welcome you
        to the Delight Bites family! Delight Bites – Where every bite is a
        delight!
      </p>
    </section>
  );
};

export default LearnMorePage;
