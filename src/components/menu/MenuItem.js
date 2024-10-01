export default function MenuItem() {
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center hover:bg-white hover:shadow-md transition-all">
      <div className="text-center">
        <img className="max-h-auto max-h-24 block mx-auto" src="/food1.jpg" alt="Food Images" />
      </div>
      <h4 className="font-semibold text-xl my-3">Pepperoni Pizza</h4>
      <p className="text-gray-600 ">
        lorem ipsun dolor emmet kanc mlkn xcv j kliags dfl
      </p>
      <button className="bg-primary text-white rounded-full px-6 py-2 mt-4">
        Add to cart $12
      </button>
    </div>
  );
}
