
const SectionHeaders = ({mainHeader, subHeader}) => {
  return (

    <>
        <h3 className="uppercase text-gray-600 font-semibold leading-4">
          {mainHeader}
        </h3>
        <h2 className="text-primary text-4xl font-bold">{subHeader}
        </h2>
    </>

    
  )
}

export default SectionHeaders