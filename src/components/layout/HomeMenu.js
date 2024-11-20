import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";

export const HomeMenu = () => {
  return (
    <section className="relative pt-10">
      <div className="text-center mb-8">
        <SectionHeaders 
        subHeader={"Checkout"} 
        mainHeader={"Menu"} 
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </div>
    </section>
  );
};