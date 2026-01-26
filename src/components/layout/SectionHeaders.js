
const SectionHeaders = ({mainHeader, subHeader}) => {
  return (

    <>
      <h3 className="uppercase text-gray-500 font-semibold leading-4 tracking-widest text-sm mb-2">
        {subHeader}
      </h3>
      <h2 className="text-primary font-heading font-black text-4xl italic mb-8">
        {mainHeader}
      </h2>
    </>

    
  )
}

export default SectionHeaders