import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Database, Coffee, AlertTriangle, Box, Zap } from 'lucide-react';

const inventoryItems = [
    {
        id: 1,
        name: "Python",
        type: "Main Weapon",
        level: 80,
        description: "Excellent for scripts, bad for speed battles.",
        icon: Terminal,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/50",
        barColor: "bg-yellow-400"
    },
    {
        id: 2,
        name: "React.js",
        type: "Sidearm",
        level: 50,
        description: "Versatile, modular, occasionally temperamental.",
        icon: Zap,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/50",
        barColor: "bg-blue-400"
    },
    {
        id: 3,
        name: "Coffee",
        type: "Consumable",
        description: "Restores +50 Energy. Increases jitters.",
        icon: Coffee,
        color: "text-amber-700",
        bg: "bg-amber-700/10",
        border: "border-amber-700/50",
        barColor: "bg-amber-700"
    },
    {
        id: 4,
        name: "Stack Overflow",
        type: "Consumable",
        description: "Summons ancient wisdom. 50% chance of obsolescence.",
        icon: Database,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/50",
        barColor: "bg-orange-500"
    },
    {
        id: 5,
        name: "CSS Centering",
        type: "Debuff",
        description: "Causes confusion. -10 Sanity per div.",
        icon: Box,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/50",
        barColor: "bg-purple-400"
    },
    {
        id: 6,
        name: "Force Push",
        type: "Ability",
        description: "Deletes history. Dangerous. Do not try at home.",
        icon: AlertTriangle,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/50",
        barColor: "bg-red-500"
    }
];

const TechArsenal = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="py-20 px-4 relative z-10 w-full max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-12">
                <Box className="text-neon-purple" size={32} />
                <h2 className="text-4xl font-mono font-bold">TECH_ARSENAL</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Inventory Grid */}
                <div className="bg-card-charcoal/40 backdrop-blur-md border border-white/10 p-6 rounded-xl">
                    <h3 className="text-sm font-mono text-gray-400 mb-4 border-b border-white/5 pb-2">INVENTORY_SLOTS</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {inventoryItems.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedItem(item)}
                                className={`aspect-square rounded-lg border-2 ${item.border} ${item.bg} flex items-center justify-center cursor-pointer relative group transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                            >
                                <item.icon size={32} className={item.color} />
                                {/* Level Badge */}
                                {item.level && (
                                    <div className="absolute -bottom-2 -right-2 bg-dark-base border border-white/20 text-[10px] font-mono px-1 rounded text-white">
                                        LVL.{item.level}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {/* Empty Slots Filler */}
                        {[...Array(6)].map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square rounded-lg border border-white/5 bg-white/5 flex items-center justify-center opacity-30 cursor-not-allowed">
                            </div>
                        ))}
                    </div>
                </div>

                {/* Item Detail View */}
                <div className="bg-card-charcoal/40 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col justify-center min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {selectedItem ? (
                            <motion.div
                                key={selectedItem.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center space-x-6">
                                    <div className={`p-6 rounded-xl border-2 ${selectedItem.border} ${selectedItem.bg}`}>
                                        <selectedItem.icon size={48} className={selectedItem.color} />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-bold ${selectedItem.color}`}>{selectedItem.name}</h3>
                                        <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-gray-300">
                                            {selectedItem.type.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-300 font-mono leading-relaxed">
                                        "{selectedItem.description}"
                                    </p>
                                    {selectedItem.level && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                                                <span>MASTERY</span>
                                                <span>{selectedItem.level}/100</span>
                                            </div>
                                            <div className="h-2 bg-dark-base rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${selectedItem.barColor}`}
                                                    style={{ width: `${selectedItem.level}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gray-500 font-mono"
                            >
                                <div className="mb-4 flex justify-center opacity-20">
                                    <Box size={64} />
                                </div>
                                <p>SELECT AN ITEM TO VIEW DETAILS</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TechArsenal;
