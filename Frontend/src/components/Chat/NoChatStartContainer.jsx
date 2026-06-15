import React from "react";
import { Sparkles, MessageCircle, Users } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import Avatar from "../../assets/Avatar.png";

function NoChatStartContainer() {
  const { newContacts, selectUser } = useChat();

  const users = newContacts.slice(0, 6);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#271111] via-[#2a0f15] to-[#170206]">
      {/* Glow Effects */}
      <div className="absolute top-[-120px] left-[15%] h-[320px] w-[320px] rounded-full bg-red-700/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[10%] h-[320px] w-[320px] rounded-full bg-pink-700/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <MessageCircle size={42} className="text-red-400" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Welcome to QuickChat
          </h1>

          <p className="mt-4 max-w-xl text-zinc-400">
            Start a conversation with your friends or chat with
            <span className="font-medium text-red-300"> Namaste AI</span>. Share
            messages, media, and stay connected in real time.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mb-10 grid w-full max-w-3xl gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <MessageCircle size={26} className="mb-3 text-red-400" />

            <h3 className="font-semibold text-white">Real-Time Chat</h3>

            <p className="mt-2 text-sm text-zinc-400">
              Instant messaging with live updates and delivery.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <Users size={26} className="mb-3 text-blue-400" />

            <h3 className="font-semibold text-white">Connect People</h3>

            <p className="mt-2 text-sm text-zinc-400">
              Discover and connect with new contacts effortlessly.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <Sparkles size={26} className="mb-3 text-yellow-400" />

            <h3 className="font-semibold text-white">AI Assistant</h3>

            <p className="mt-2 text-sm text-zinc-400">
              Get answers, timetables, coding help and more.
            </p>
          </div>
        </div>

        {/* Suggested Users */}
        <div className="w-full max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <Users size={18} className="text-zinc-400" />

            <h2 className="text-lg font-semibold text-white">
              Suggested Users
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
              <p className="text-zinc-500">No users available right now.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profileimg || Avatar}
                      alt={user.name}
                      className="h-12 w-12 rounded-2xl object-cover border border-white/10"
                    />

                    <div>
                      <h3 className="font-medium text-white">{user.name}</h3>

                      <p className="text-xs text-zinc-500">
                        Start a conversation
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => selectUser(user)}
                    className="rounded-2xl bg-gradient-to-r from-red-600 to-red-800 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-900/30 transition-all duration-300 hover:from-red-700 hover:to-red-900"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoChatStartContainer;
