import { Activity, Coffee, Moon, Shield, Code, Bug, Sword } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, subValue, icon: Icon, color }) => (
    <div className="bg-card-charcoal/50 backdrop-blur-sm border border-gray-800 p-4 rounded-lg flex items-center space-x-4 hover:border-neon-purple transition-colors duration-300">
        <div className={`p-3 rounded-full bg-dark-lighter border border-${color}/30 text-${color}`}>
            <Icon size={24} color={color === 'neon-purple' ? '#D000FF' : '#00FFFF'} />
        </div>
        <div>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">{label}</p>
            <h4 className="text-xl font-bold text-gray-100">{value}</h4>
            {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
        </div>
    </div>
);

const Vitals = () => {
    return (
        <div className="bg-card-charcoal/50 backdrop-blur-sm border border-gray-800 p-4 rounded-lg w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-gray-400">VITALS MONITOR</span>
                <Activity size={16} className="text-green-500 animate-pulse" />
            </div>

            <div className="space-y-4">
                {/* Caffeine */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center space-x-1">
                            <Coffee size={12} className="text-yellow-500" />
                            <span>CAFFEINE.INTAKE</span>
                        </div>
                        <span className="text-red-500 blink">CRITICAL HIGH (9999mg)</span>
                    </div>
                    <div className="h-2 bg-dark-base rounded-full overflow-hidden border border-gray-800">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                        />
                    </div>
                </div>

                {/* Sleep */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center space-x-1">
                            <Moon size={12} className="text-blue-500" />
                            <span>SLEEP.HOURS</span>
                        </div>
                        <span className="text-red-500">CRITICAL LOW (3h)</span>
                    </div>
                    <div className="h-2 bg-dark-base rounded-full overflow-hidden border border-gray-800">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '15%' }}
                            className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DevMetric = () => (
    <div className="bg-card-charcoal/50 backdrop-blur-sm border border-gray-800 p-4 rounded-lg flex flex-col justify-center items-center">
        <div className="flex items-center space-x-4 text-2xl font-mono font-bold">
            <span className="text-electric-blue flex items-center gap-2"><Code size={20} /> LINES</span>
            <span className="text-gray-600">&gt;</span>
            <span className="text-red-500 flex items-center gap-2"> BUGS <Bug size={20} /></span>
        </div>
        <p className="text-xs text-gray-500 mt-2 font-mono text-center">PRODUCTIVITY RATIO: POSITIVE</p>
    </div>
)

const Stats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 z-10 relative max-w-6xl mx-auto mt-10">
            <StatCard
                label="VALORANT RANK"
                value="Hardstuck Silver"
                icon={Shield}
                color="neon-purple"
            />
            <StatCard
                label="CHESS RATING"
                value="1000 ELO"
                subValue="Grandmaster in training"
                icon={Sword} // Using Sword as proxy for pawn/battle
                color="electric-blue"
            />
            <Vitals />
            <DevMetric />
        </div>
    );
};

export default Stats;
