import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, User, LineChart, Briefcase, LogOut, LayoutDashboard, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, role }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const studentLinks = [
        { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
        { name: 'My Profile', path: '/student/profile', icon: User },
        { name: 'Placement Predictor', path: '/student/predict', icon: LineChart },
        { name: 'My Analysis', path: '/student/analysis', icon: BookOpen },
    ];

    const facultyLinks = [
        { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
        { name: 'Company Data', path: '/faculty/companies', icon: Briefcase },
        { name: 'Student Analytics', path: '/faculty/analytics', icon: User },
    ];

    const links = role === 'student' ? studentLinks : facultyLinks;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg flex flex-col z-20">
                <div className="p-6 border-b flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-800">PlaceSense</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                <header className="bg-white shadow-sm p-6 sticky top-0 z-10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {links.find(l => l.path === location.pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{role === 'student' ? 'Student User' : 'Faculty Admin'}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {role === 'student' ? 'S' : 'F'}
                        </div>
                    </div>
                </header>
                <main className="p-8 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;

