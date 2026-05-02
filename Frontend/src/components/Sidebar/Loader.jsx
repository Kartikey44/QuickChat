import { PuffLoader } from "react-spinners";

const Loader = ({ fullScreen }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? "h-screen" : "py-20"}`}>
      <PuffLoader color="#3b82f6" size={60} />
      <p className="text-gray-400 mt-4 text-sm">Checking authentication...</p>
    </div>
  );
};

export default Loader;