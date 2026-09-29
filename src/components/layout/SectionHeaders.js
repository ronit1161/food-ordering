const SectionHeaders = ({ mainHeader, subHeader }) => {
  if (!mainHeader && subHeader) {
    return (
      <div className="text-center my-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-display">
          {subHeader}
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-amber-500 mx-auto mt-2.5 rounded-full" />
      </div>
    );
  }

  if (mainHeader && !subHeader) {
    return (
      <div className="text-center my-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-display">
          {mainHeader}
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-amber-500 mx-auto mt-2.5 rounded-full" />
      </div>
    );
  }

  return (
    <div className="text-center my-6">
      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100/80 text-primary mb-2 shadow-xs">
        {subHeader}
      </span>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-display">
        {mainHeader}
      </h2>
    </div>
  );
};

export default SectionHeaders;