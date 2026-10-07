import { CreditCard, ShoppingCart } from 'lucide-react';

export function PaymentsView() {
  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col h-full justify-center items-center pt-8">
      <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-8 max-w-[620px] w-full shadow-lg">
        {/* Card Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center shadow-sm">
            <CreditCard className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Accept payments</h2>
        </div>

        {/* Subtitle */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Add payments to your app and start earning. Lovable will help you set up the best option for your needs.
        </p>

        {/* Feature List */}
        <div className="space-y-6 mb-8">
          {/* Feature 1 */}
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mr-4 shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white">Built-in payments</h3>
                <a href="#" className="text-xs text-zinc-300 underline underline-offset-2 hover:text-white">
                  Learn about built-in payments
                </a>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Seamlessly set up & manage payments in your app. Lovable handles set-up with the optimal payment gateway for your product, helps you securely test changes, and makes managing your business easy.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mr-4 shrink-0 mt-0.5">
              <ShoppingCart className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white">Shopify connector</h3>
                <a href="#" className="text-xs text-zinc-300 underline underline-offset-2 hover:text-white">
                  Learn about Shopify connector
                </a>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sell physical goods with a complete e-commerce solution, including inventory and shipping. Lovable helps you set up, connect, and manage everything from within your project.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-2.5 rounded-lg bg-zinc-200 hover:bg-white text-zinc-950 font-medium text-sm transition-colors shadow-sm">
          Explore payments
        </button>
      </div>
    </div>
  );
}
