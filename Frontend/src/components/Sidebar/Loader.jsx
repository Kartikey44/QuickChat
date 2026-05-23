import { PuffLoader } from "react-spinners";

const messages = {
  auth: "Verifying your session...",
  chat: "Loading conversations...",
  upload: "Uploading file...",
};

const Loader = ({ type = "auth", fullScreen = true }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#161717] ${
        fullScreen ? "fixed inset-0 z-50" : "w-full py-20"
      }`}
    >
      <PuffLoader color="#3b82f6" size={60} />

      <p className="text-gray-400 mt-4 text-sm tracking-wide">
        {messages[type] || "Loading..."}
      </p>
    </div>
  );
};

export default Loader;