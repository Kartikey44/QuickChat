import { useState, useRef, Children } from "react";

const BorderAnimated = ({children}) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top
        });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className="relative w-full h-full rounded-xl p-px bg-gray-900 backdrop-blur-md text-gray-800 overflow-hidden shadow-lg cursor-pointer"
        >
        
            <div
                className={`pointer-events-none blur-3xl rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-300 size-60 absolute z-0 transition-opacity duration-500 ${
                    visible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    top: position.y - 120,
                    left: position.x - 120
                }}
            />
            <div className="relative z-10 bg-gray-800/70 p-6 h-full w-full rounded-xl">
               {children} 
            </div>
        </div>
    );
};

export default BorderAnimated;