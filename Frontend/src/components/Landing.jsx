import React from "react";

function Landing() {
  return (
    <div className=" relative w-screen h-screen flex justify-center items-center bg-[#413f3f] ">
      <div className="">
        <div className="flex items-center gap-2">
          <img src="./Logo.png" className="w-10 h-10 " alt="" />
          <label className="text-3xl font-semibold text-zinc-950">
            QuickChat
          </label>
        </div>
        <div className="grid grid-cols-2 ">
          <div>
            <h1>Welcome to QuickChat</h1>
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
