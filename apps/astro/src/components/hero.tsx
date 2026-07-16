import React from 'react';
import { ArrowRight, Play, Layers, Cpu } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center overflow-hidden">
      {/* Grid pattern mimicking the React Flow canvas */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center z-10">
        {/* Release badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-fade-in">
          <Cpu className="w-4 h-4" />
          <span>React Flow Nodes v1.0 Pre-release</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 max-w-4xl mx-auto leading-tight">
          Visualize complex logic with drag-and-drop simplicity
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A powerful canvas for building interactive nodes and connections. Design complex workflows, manage application data, and automate processes on the fly.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:-translate-y-0.5">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300 font-semibold px-8 py-4 rounded-xl transition-all duration-200">
            <Play className="w-4 h-4 text-slate-400 fill-slate-400" />
            Watch Demo
          </button>
        </div>

        {/* Interactive Canvas Mockup */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-slate-500 font-mono ml-2">flow_workspace_main.json</span>
            </div>
            <div className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">
              Nodes: 12 | Edges: 15
            </div>
          </div>

          {/* Canvas Preview Area */}
          <div className="h-[400px] rounded-lg bg-slate-950/80 flex items-center justify-center border border-slate-800/50 relative">
            <div className="absolute top-1/4 left-1/4 p-4 bg-slate-900 border border-blue-500/30 rounded-lg shadow-lg text-left text-xs font-mono">
              <div className="text-blue-400 font-bold mb-1">➔ InputNode</div>
              <div className="text-slate-500">trigger: "on_click"</div>
            </div>
            <div className="absolute top-1/2 right-1/4 p-4 bg-slate-900 border border-emerald-500/30 rounded-lg shadow-lg text-left text-xs font-mono">
              <div className="text-emerald-400 font-bold mb-1">✓ ActionNode</div>
              <div className="text-slate-500">payload: {"{ status: 200 }"}</div>
            </div>

            {/* Animated SVG Path Connection */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 320 150 C 450 150, 450 240, 580 240" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
            </svg>
            <span className="text-slate-600 text-sm font-mono">Interactive React Flow Canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
}