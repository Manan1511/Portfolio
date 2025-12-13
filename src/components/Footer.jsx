import { Github, Linkedin, Mail } from 'lucide-react';

const CreditCard = () => (
    <div className="w-80 h-48 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 relative overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 group">

        {/* Holographic Finish */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_200%] animate-gradient-xy" />

        <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex justify-between items-start">
                <h3 className="font-mono text-xs text-gray-400 tracking-widest">BANK OF RECURSION</h3>
                <div className="w-10 h-6 bg-yellow-500/20 rounded border border-yellow-500/50 flex items-center justify-center">
                    <div className="w-6 h-4 bg-yellow-500/40 rounded-sm" />
                </div>
            </div>

            <div className="space-y-1">
                <p className="font-mono text-lg text-gray-300 tracking-[0.2em] shadow-black drop-shadow-md">
                    WHILE TRUE DO THIS
                </p>
                <div className="flex space-x-4 text-[10px] text-gray-400 font-mono">
                    <span>VALID THRU: 404/ERR</span>
                    <span>CVV: NaN</span>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[8px] text-gray-500 font-mono mb-0.5">CARDHOLDER</p>
                    <p className="font-mono text-sm text-gray-200">RUNTIME ERROR</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-80" />
            </div>
        </div>
    </div>
);

const Footer = () => {
    return (
        <footer id="contact-section" className="py-20 relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-lg">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">

                <div className="mb-12 flex flex-col items-center">
                    <p className="text-gray-400 text-sm font-mono mb-4 text-center">For the ones who want my credit card details:</p>
                    <CreditCard />
                </div>

                <div className="flex justify-center items-center space-x-8">
                    <a href="https://github.com/Manan1511" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-all text-gray-400 border border-white/5 hover:border-white/20 hover:scale-110">
                        <Github size={24} />
                    </a>
                    <a href="https://www.linkedin.com/in/manan-shah-789b651b3/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-all text-gray-400 border border-white/5 hover:border-white/20 hover:scale-110">
                        <Linkedin size={24} />
                    </a>
                    <a href="mailto:contact@manan.dev" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-all text-gray-400 border border-white/5 hover:border-white/20 hover:scale-110">
                        <Mail size={24} />
                    </a>
                </div>

                <p className="mt-8 text-xs text-gray-600 font-mono">
                    © {new Date().getFullYear()} Manan. All systems operational.
                </p>

            </div>
        </footer>
    );
};

export default Footer;
