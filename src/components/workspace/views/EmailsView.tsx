import { Globe, Shield, Inbox, Zap, MailOpen } from 'lucide-react';

export function EmailsView() {
  const features = [
    {
      icon: <Globe className="w-5 h-5 text-zinc-400" />,
      title: "Emails come from your brand",
      description: "Send from your own domain so every message reinforces your identity."
    },
    {
      icon: <Shield className="w-5 h-5 text-zinc-400" />,
      title: "Better deliverability and inbox placement",
      description: "Dedicated sending reputation keeps your emails out of spam."
    },
    {
      icon: <Inbox className="w-5 h-5 text-zinc-400" />,
      title: "Build trust with professional sender addresses",
      description: "Users see your domain, not a third-party address."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col h-full">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-white">Emails</h1>
      </div>

      {/* Main Content Centered */}
      <div className="flex-1 flex justify-center items-start pt-4">
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-8 max-w-[600px] w-full shadow-lg">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-sm">
                 <MailOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Emails</h2>
            </div>
            <a href="#" className="text-sm text-zinc-400 hover:text-white underline decoration-zinc-600 underline-offset-4 transition-colors">
              Read more
            </a>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
            Send emails from your own domain to build trust with your users and securely improve deliverability.
          </p>

          {/* Feature List */}
          <div className="space-y-6 mb-10">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mr-5 shrink-0">
                  {feature.icon}
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[15px] font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade Button */}
          <button className="w-full flex items-center justify-center py-3 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-medium transition-colors shadow-sm">
            <Zap className="w-4 h-4 mr-2 fill-white" /> Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
