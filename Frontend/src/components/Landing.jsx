import React from "react";
import {
  MessageCircle,
  ShieldCheck,
  Zap,
  Image,
  Users,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full overflow-hidden bg-linear-to-br from-[#970404] via-[#350006] to-[#3d030d] relative">

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 md:px-14 py-3 relative z-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="./Logo.png"
            alt="logo"
            className="w-12 h-12 object-contain"
          />

          <h1 className="text-3xl font-bold text-white tracking-wide">
            Quick<span className="text-red-400">Chat</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-5">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-2xl cursor-pointer bg-red-600 hover:bg-red-700 text-white text-lg font-semibold transition shadow-xl shadow-red-900/40"
          >
            Login {'->'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center px-6 md:px-14 pt-3 relative z-10">
        {/* Left Side */}
        <div className="space-y-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-5 py-2 rounded-full text-red-300 font-medium">
            <Zap size={18} />
            Fast. Secure. Real-Time.
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
              Welcome to <br />
              <span className="text-red-400">QuickChat</span>
            </h1>

            <p className="mt-7 text-lg md:text-xl text-zinc-300 leading-relaxed max-w-xl">
              Experience seamless communication with instant messaging,
              real-time typing indicators, online presence, secure chats, media
              sharing, and lightning-fast connections — all in one modern
              platform.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex justify-center mt-20 lg:mt-0">
          {/* Glow */}
          <div className="absolute w-md h-112 bg-red-600/20 blur-3xl rounded-full"></div>

          {/* Phone */}
          <div className="relative z-10 w-[320px] bg-[#1c1c1c]/90 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden">
            {/* Top */}
            <div className="bg-[#2a0b0f] border-b border-white/10 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt=""
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <h2 className="text-white font-semibold">Friends Group</h2>

                  <p className="text-xs text-green-400">8 members online</p>
                </div>
              </div>

              <Phone className="text-red-400" size={20} />
            </div>

            {/* Chats */}
            <div className="p-4 space-y-4 min-h-132 bg-[#160204]">
              {/* Left */}
              <div className="bg-[#2b1518] border border-white/5 p-3 rounded-2xl w-fit max-w-55">
                <p className="text-sm text-zinc-200">
                  Hey! Welcome to QuickChat 👋
                </p>
              </div>

              {/* Right */}
              <div className="bg-red-600 text-white p-3 rounded-2xl w-fit max-w-55 ml-auto shadow-lg shadow-red-900/30">
                <p className="text-sm">Real-time messaging feels amazing 🚀</p>
              </div>

              {/* Left */}
              <div className="bg-[#2b1518] border border-white/5 p-3 rounded-2xl max-w-55">
                <p className="text-sm text-zinc-200">
                  Share images, videos and files instantly.
                </p>

                <div className="mt-3 flex items-center gap-2 bg-black/20 p-2 rounded-xl">
                  <Image size={18} className="text-red-400" />

                  <span className="text-sm text-zinc-300">Project_UI.png</span>
                </div>
              </div>

              {/* Right */}
              <div className="bg-red-600 text-white p-3 rounded-2xl w-fit ml-auto max-w-55">
                <p className="text-sm">Everything is secure 🔒</p>
              </div>

              {/* Left */}
              <div className="bg-[#2b1518] border border-white/5 p-3 rounded-2xl max-w-55">
                <p className="text-sm text-zinc-200">
                  Typing indicators & online status included.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Card Left */}
          <div className="absolute top-10 left-0 hidden md:block">
            <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-400" size={28} />

                <div>
                  <h2 className="text-white font-semibold">
                    End-to-End Security
                  </h2>

                  <p className="text-zinc-400 text-sm">
                    Private & encrypted chats
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card Right */}
          <div className="absolute bottom-10 right-0 hidden md:block">
            <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <Users className="text-red-400" size={28} />

                <div>
                  <h2 className="text-white font-semibold">Connect Anywhere</h2>

                  <p className="text-zinc-400 text-sm">
                    Chat anytime on any device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-14 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {/* Card 1 */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-7 hover:scale-105 transition duration-300">
            <Zap className="text-red-400 mb-5" size={38} />

            <h2 className="text-white text-xl font-bold mb-3">
              Real-Time Messaging
            </h2>

            <p className="text-zinc-400">
              Instant message delivery with typing indicators and online status.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-7 hover:scale-105 transition duration-300">
            <ShieldCheck className="text-green-400 mb-5" size={38} />

            <h2 className="text-white text-xl font-bold mb-3">Secure Chats</h2>

            <p className="text-zinc-400">
              Your conversations stay encrypted and protected.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-7 hover:scale-105 transition duration-300">
            <Image className="text-orange-400 mb-5" size={38} />

            <h2 className="text-white text-xl font-bold mb-3">Media Sharing</h2>

            <p className="text-zinc-400">
              Share files, videos, images and voice notes instantly.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-7 hover:scale-105 transition duration-300">
            <MessageCircle className="text-blue-400 mb-5" size={38} />

            <h2 className="text-white text-xl font-bold mb-3">
              Group Conversations
            </h2>

            <p className="text-zinc-400">
              Create communities and stay connected together.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
