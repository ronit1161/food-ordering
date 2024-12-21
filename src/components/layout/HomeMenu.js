'use client';
import { useEffect, useState } from "react";
import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";

export const HomeMenu = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() =>{
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setBestSellers(menuItems.slice(-3));
      })
    })
  }, [])

  return (
    <section className="relative pt-10">
      <div className="text-center mb-8">
        <SectionHeaders 
        subHeader={"Check out"} 
        mainHeader={"Our best sellers"} 
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {bestSellers?.length > 0 && bestSellers.map((item) => (
          <MenuItem {...item} key={item.index}/>
        ))}
      </div>
    </section>
  );
};
