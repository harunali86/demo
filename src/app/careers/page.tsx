import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';

const JOBS = [
    { title: 'Full Stack Developer', location: 'Pune', type: 'Full-time', dept: 'Engineering' },
    { title: 'UI/UX Designer', location: 'Remote', type: 'Full-time', dept: 'Design' },
    { title: 'Marketing Manager', location: 'Pune', type: 'Full-time', dept: 'Marketing' },
    { title: 'Customer Support', location: 'Remote', type: 'Part-time', dept: 'Support' },
];

export default function CareersPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
                    <p className="text-gray-400 text-lg">Build the future of e-commerce with us</p>
                </div>

                {/* Why Join */}
                <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-2xl p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-4">Why Harun Store?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>✅ Competitive salary</div>
                        <div>✅ Remote-friendly</div>
                        <div>✅ Health insurance</div>
                        <div>✅ Learning budget</div>
                        <div>✅ Flexible hours</div>
                        <div>✅ Great team culture</div>
                    </div>
                </div>

                {/* Open Positions */}
                <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
                <div className="space-y-4">
                    {JOBS.map((job, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between hover:border-primary/50 transition cursor-pointer">
                            <div>
                                <h3 className="font-bold text-lg">{job.title}</h3>
                                <div className="flex gap-4 text-sm text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.dept}</span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10 text-gray-400">
                    <p>Don't see a role that fits? Send your resume to <span className="text-primary">careers@harunstore.com</span></p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
