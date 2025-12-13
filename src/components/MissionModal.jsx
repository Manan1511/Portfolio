import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, CheckCircle } from 'lucide-react';

const MissionModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-dark-lighter border border-neon-purple/30 rounded-xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(208,0,255,0.1)] overflow-hidden"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fluoro-green/10 rounded-full blur-3xl" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-8">
                            <Terminal className="text-fluoro-green" size={28} />
                            <div>
                                <h2 className="text-2xl font-mono font-bold text-white">SOURCE_CODE_ACCESS</h2>
                                <p className="text-xs text-fluoro-green font-mono tracking-widest">MISSION_PROTOCOL_INITIATED</p>
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="space-y-6 font-mono">
                            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex-1">
                                    <span className="text-gray-400 text-xs block mb-1">CURRENT OBJECTIVE</span>
                                    <span className="text-xl font-bold text-white block">Mission: Engineer Impact</span>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="flex-1">
                                    <span className="text-gray-400 text-xs block mb-1">PRIMARY DIRECTIVE</span>
                                    <span className="text-xl font-bold text-white block">Goal: Solve Real Problems</span>
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed border-l-2 border-neon-purple pl-4 italic">
                                I don't just write code; I build solutions. My drive comes from using technology to genuinely improve lives.
                            </p>

                            <div className="space-y-3">
                                <p className="text-white font-semibold">Every idea I pursue must pass three checks:</p>
                                <ul className="space-y-2">
                                    {[
                                        "Does it actually Solve a real-world problem?",
                                        "Is it Scalable?",
                                        "Is it Profitable?"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center space-x-3 text-gray-300">
                                            <CheckCircle size={16} className="text-fluoro-green flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                <p className="text-xl font-bold text-white animate-pulse">
                                    If the answer is yes, I build it.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MissionModal;
