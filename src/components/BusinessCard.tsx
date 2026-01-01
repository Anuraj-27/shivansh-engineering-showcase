import businessCard from "@/assets/business-card.jpeg";

const BusinessCard = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[20%] min-w-[180px] max-w-[280px] z-40 hidden lg:flex items-center justify-center p-4 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full">
        <img 
          src={businessCard} 
          alt="Shivansh Engineering - Sunil Kokate, Proprietor"
          className="w-full h-auto rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
        />
      </div>
    </div>
  );
};

export default BusinessCard;
