import { useState } from "react";
import ChevronDown from '@/components/icons/ChevronDown'
import ChevronUp from '@/components/icons/ChevronUp'
import Trash from '@/components/icons/Trash'

const MenuItemPriceProps = ({ name, addLabel, props, setProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    setProps((oldProps) => {
      return [...oldProps, { name: "", price: 0 }];
    });
  }

  function editProp(e, index, prop) {
    const newValue = e.target.value;
    setProps((prevSizes) => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function removeProp(indexToRemove) {
    setProps((prev) => prev.filter((_, index) => index !== indexToRemove));
  }
  

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button 
        className="inline-flex p-1 border-0 justify-center" 
        type="button"
        onClick={() => setIsOpen(prev => ! prev)}
    >
        {isOpen && <><ChevronUp /></>}
        {!isOpen && <><ChevronDown /></>}
        <span> {name}</span>
        <span>({props?.length})</span>
      </button>

      <div className={isOpen ? 'block' : 'hidden'}>
        {props?.length > 0 &&
          props.map((size, index) => (
            <div className="flex gap-2 items-end">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Size name"
                  value={size.name}
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>

              <div>
                <label>Extra price</label>
                <input
                  type="text"
                  placeholder="Extra price"
                  value={size.price}
                  onChange={(e) => editProp(e, index, "price")}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => removeProp(index)}
                  className="bg-white mb-2"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        <button type="button" onClick={addProp} className="bg-white">
          {addLabel}
        </button>
      </div>
    </div>
  );
};

export default MenuItemPriceProps;
