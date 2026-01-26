import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";

export const HomeMenu = ({ bestSellers = [] }) => {
  return (
    <section className="relative pt-10 sm:mx-8">
      <div className="text-center mb-8">
        <SectionHeaders
          subHeader={"Check out"}
          mainHeader={"Our best sellers"}
        />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
        {bestSellers?.length > 0 &&
          bestSellers.map((item) => <MenuItem {...item} key={item._id} />)}
      </div>
    </section>
  );
};
