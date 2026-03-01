import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, ChevronRight, User, Users } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Brand */}
                <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <GraduationCap className="w-10 h-10" />
                            <span className="text-2xl font-bold tracking-wide">PlaceSense</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Master Your Placement Journey
                        </h1>
                        <p className="text-blue-100 text-lg opacity-90">
                            Intelligent prediction, skill gap analysis, and personalized guidance to help you land your dream job.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12">
                        <div className="flex items-center gap-2 text-sm font-medium opacity-75">
                            <span>Powered by AI</span>
                            <div className="h-1 w-1 bg-white rounded-full"></div>
                            <span>Student Centric</span>
                        </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-purple-500 rounded-full opacity-30 blur-3xl"></div>
                </div>

                {/* Right Side - Login Options */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 mb-10">Select your role to continue</p>

                    <div className="space-y-4">
                        <Link to="/student" className="group flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <User size={24} />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="font-bold text-gray-800">Student</h3>
                                <p className="text-sm text-gray-500">Access dashboard & predictions</p>
                            </div>
                            <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link to="/faculty" className="group flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Users size={24} />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="font-bold text-gray-800">Faculty / Admin</h3>
                                <p className="text-sm text-gray-500">Manage data & view insights</p>
                            </div>
                            <ChevronRight className="text-gray-400 group-hover:text-purple-500 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="mt-10 text-center text-sm text-gray-400">
                        &copy; 2024 PlaceSense System
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Landing;
