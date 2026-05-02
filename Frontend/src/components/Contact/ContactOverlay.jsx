import React, { useState, useEffect } from "react";
import ContactSearchBar from "./ContactSearchBar";
import NewContacts from "../NewContacts";
function ContactOverlay() {
  return (
    <div className="absolute inset-0 bg-[#161717] flex items-center justify-center z-50">
      <div className="p-6 w-full h-full flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <p className="text-3xl font-bold bg-gradient-to-r from-[#0f7ee8] via-[#8c288d] to-[#d20a70] bg-clip-text text-transparent ">
            QuickChat
          </p>
          <h2 className="font-semibold text-xl px-2">All Contacts</h2>
          <ContactSearchBar />
        </div>
        <div>
          <NewContacts/>
        </div>
      </div>
    </div>
  );
}

export default ContactOverlay;
