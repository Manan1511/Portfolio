import { motion } from 'framer-motion';
import { ExternalLink, Github, Layers } from 'lucide-react';

const projects = [
    {
        title: "Khel-Mitra",
        category: "Accessibility Tech",
        description: "Empowering farmers with accessibility tools. Winner @ Startup Street.",
        tech: ["React", "Node.js", "IoT"],
        link: "#",
        color: "from-green-500 to-emerald-700"
    },
    {
        title: "AquaSafe",
        category: "Smart City",
        description: "A smart-city water testing web app measuring pH, turbidity, and quality.",
        tech: ["React", "Supabase", "Tailwind"],
        link: "#",
        color: "from-blue-500 to-cyan-700"
    },
    {
        title: "Sentiment Stocker",
        category: "FinTech",
        description: "Stock market sentiment analysis tool using NLP to predict trends.",
        tech: ["Python", "NLP", "Flask"],
        link: "#",
        color: "from-purple-500 to-indigo-700"
    },
    {
        title: "The Horror Project",
        category: "Interactive Web",
        description: "An interactive horror-themed website. Design-a-thon 3rd Place.",
        tech: ["Three.js", "GSAP", "Audio API"],
        link: "#",
        color: "from-red-500 to-rose-900"
    }
];

const ProjectCard = ({ project, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -10 }}
        className="relative group h-full"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-electric-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative h-full bg-card-charcoal/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between">

            {/* Background Gradient Mesh */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${project.color} rounded-full blur-[60px] opacity-20`} />

            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                        {project.category}
                    </div>
                    <div className="flex space-x-2">
                        <Github size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                        <ExternalLink size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {project.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((t, i) => (
                    <span key={i} className="text-xs font-mono text-electric-blue">
                        #{t}
                    </span>
                ))}
            </div>

        </div>
    </motion.div>
);

const Projects = () => {
    return (
        <div className="py-20 px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center space-x-4 mb-12">
                    <Layers className="text-neon-purple" size={32} />
                    <h2 className="text-4xl font-mono font-bold">PROJECT_LOGS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
