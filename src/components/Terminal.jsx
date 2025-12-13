import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Terminal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([
        "Welcome to MananOS v1.0.0",
        "Type 'help' for available commands."
    ]);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [output, isOpen]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            let response = "";

            switch (cmd) {
                case 'help':
                    response = "Available commands: whoami, skills, contact, clear, sudo hack-nasa";
                    break;
                case 'whoami':
                    response = "User: Visitor | Access: Guest | Current Location: Portfolio";
                    break;
                case 'skills':
                    response = "Frontend: React, Tailwind | Backend: Node, Python | Database: Supabase, SQL";
                    break;
                case 'contact':
                    response = "Opening mail client...";
                    window.location.href = "mailto:hello@manan.dev"; // Replace with actual email
                    break;
                case 'sudo hack-nasa':
                    response = "Access Denied. I'm on the AI Whitelist, I can't risk it. 🚨";
                    break;
                case 'clear':
                    setOutput([]);
                    setInput('');
                    return;
                case '':
                    response = "";
                    break;
                default:
                    response = `Command not found: ${cmd}. Type 'help' for list.`;
            }

            setOutput([...output, `> ${input}`, response].filter(Boolean));
            setInput('');
        }
    };

    return (
        <>
            {/* Minimized Button */}
            <motion.div
                className="fixed bottom-4 right-4 z-50 pointer-events-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-card-charcoal border border-neon-purple/50 text-neon-purple p-3 rounded-full hover:bg-neon-purple hover:text-white transition-all shadow-[0_0_15px_rgba(208,0,255,0.3)]"
                >
                    <TerminalIcon size={24} />
                </button>
            </motion.div>

            {/* Terminal Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-20 right-4 w-80 md:w-96 h-80 bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col font-mono text-sm pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                            <span className="text-gray-400 text-xs">manan_terminal</span>
                            <div className="flex space-x-2">
                                <Minus size={12} className="text-gray-500 cursor-pointer hover:text-white" onClick={() => setIsOpen(false)} />
                                <Square size={10} className="text-gray-500 cursor-pointer hover:text-white" />
                                <X size={12} className="text-gray-500 cursor-pointer hover:text-red-500" onClick={() => setIsOpen(false)} />
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-green-400 scrollbar-hide">
                            {output.map((line, i) => (
                                <div key={i} className="break-words">{line}</div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center">
                            <span className="text-neon-purple mr-2">➜</span>
                            <span className="text-blue-400 mr-2">~</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleCommand}
                                className="bg-transparent border-none outline-none text-white w-full font-mono"
                                autoFocus
                                placeholder="Type a command..."
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Terminal;
