import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import TopographyMap from './components/TopographyMap';
import Stats from './components/Stats';
import Projects from './components/Projects';
import Footer from './components/Footer';
import TechArsenal from './components/TechArsenal';
import Testimonials from './components/Testimonials';
import Terminal from './components/Terminal';
import MissionModal from './components/MissionModal';
import { motion } from 'framer-motion';

function App() {
  const [isMissionOpen, setIsMissionOpen] = useState(false);

  return (
    <div id="canvas-container" className="bg-dark-base min-h-screen text-white overflow-x-hidden relative selection:bg-neon-purple selection:text-white">

      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 5, 5], fov: 45 }}
          style={{ background: '#0A0A0A' }}
        >
          <Suspense fallback={null}>
            <TopographyMap />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero Content */}
      <main className="relative z-10 pt-32 pb-20 pointer-events-none">
        {/* Pointer events none on container, auto on interactive children */}

        <div className="container mx-auto px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center pointer-events-auto"
          >
            <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                Manan
              </span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-400 mb-8 font-mono text-sm md:text-base">
              <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">CSE Core @ VIT</span>
              <span className="hidden md:inline text-gray-700">•</span>
              <span className="text-fluoro-green animate-pulse">● Open to work</span>
            </div>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12">
              Building <span className="text-white font-medium">scalable things</span> & <span className="text-white font-medium">breaking production</span> on Fridays.
            </p>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => document.getElementById('project-logs').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-neon-purple/10 border border-neon-purple/50 rounded-full hover:bg-neon-purple/20 transition-all text-neon-purple font-mono text-sm hover:shadow-[0_0_20px_rgba(208,0,255,0.3)] backdrop-blur-sm cursor-pointer"
                >
                  View Projects
                </button>
                <button
                  onClick={() => document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' })} // Added smooth scroll
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-mono text-sm backdrop-blur-sm text-gray-300 cursor-pointer"
                >
                  Contact Me
                </button>
              </div>

              <button
                onClick={() => setIsMissionOpen(true)}
                className="text-sm font-mono text-gray-500 hover:text-fluoro-green transition-colors cursor-pointer flex items-center gap-2 group"
              >
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">&gt;</span>
                Access Source Code
              </button>
            </div>

          </motion.div>
        </div>

        <div className="mt-32 w-full max-w-7xl mx-auto px-4 pointer-events-auto">
          <Stats />
        </div>

        <div className="mt-20 pointer-events-auto">
          <TechArsenal />
        </div>

      </main>

      <div className="relative z-10 pointer-events-auto bg-dark-base/80 backdrop-blur-xl border-t border-white/5">
        <Projects />
      </div>

      <div className="relative z-10 pointer-events-auto">
        <Testimonials />
      </div>

      <div className="relative z-10 pointer-events-auto">
        <Footer />
      </div>

      <Terminal />
      <MissionModal isOpen={isMissionOpen} onClose={() => setIsMissionOpen(false)} />

    </div>
  );
}

export default App;
