import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote, MessageSquare } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "My Mom",
        role: "Chief Support Officer",
        quote: "I don't know what he does, but he stares at a black screen all day. 5 stars.",
        avatar: "👩‍🦳"
    },
    {
        id: 2,
        name: "ChatGPT",
        role: "Co-Author",
        quote: "I wrote about 40% of his code, but he takes all the credit. Good prompter though.",
        avatar: "🤖"
    },
    {
        id: 3,
        name: "VS Code",
        role: "The Editor",
        quote: "He abuses the backspace key. Please send help.",
        avatar: "📝"
    },
    {
        id: 4,
        name: "Stack Overflow",
        role: "Knowledge Base",
        quote: "He copies my answers but I'm not even mad. It's honest work.",
        avatar: "📚"
    }
];

const ReviewCard = ({ review }) => (
    <div className="flex-shrink-0 w-80 md:w-96 p-6 rounded-2xl bg-card-charcoal/40 border border-white/5 backdrop-blur-sm mx-4 relative group hover:border-neon-purple/50 transition-colors">
        <Quote className="absolute top-4 right-4 text-white/5 group-hover:text-neon-purple/20 transition-colors" size={48} />
        <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/10">
                {review.avatar}
            </div>
            <div>
                <h4 className="font-bold text-white">{review.name}</h4>
                <p className="text-xs text-fluoro-green font-mono">{review.role}</p>
            </div>
        </div>
        <p className="text-gray-400 italic leading-relaxed">"{review.quote}"</p>
    </div>
);

const Testimonials = () => {
    return (
        <div className="py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 mb-12 flex items-center space-x-4">
                <MessageSquare className="text-neon-purple" size={32} />
                <h2 className="text-4xl font-mono font-bold">VERIFIED_REVIEWS</h2>
            </div>

            {/* Infinite Horizontal Scroll */}
            <div className="relative w-full overflow-hidden mask-gradient-x">
                <motion.div
                    className="flex py-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                    style={{ width: "fit-content" }}
                >
                    {/* Double the array for seamless loop */}
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </motion.div>

                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-dark-base to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-dark-base to-transparent z-10" />
            </div>
        </div>
    );
};

export default Testimonials;
