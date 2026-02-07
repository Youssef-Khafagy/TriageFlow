import { ShieldCheck, Zap, HeartPulse } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-gray-900">Our Purpose</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto italic">
            "Reducing the gap between arrival and care through intelligent automation."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-amber-500" />, title: "Speed", desc: "Automating data collection so medical staff can focus on immediate treatment." },
            { icon: <ShieldCheck className="text-blue-500" />, title: "Accuracy", desc: "Using AI to generate structured clinical summaries from natural patient dialogue." },
            { icon: <HeartPulse className="text-red-500" />, title: "Care", desc: "Prioritizing the most critical cases instantly to save lives in high-traffic ERs." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}