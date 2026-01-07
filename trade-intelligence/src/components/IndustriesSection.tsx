import {
  Factory,
  Beaker,
  Wheat,
  Fuel,
  FileBox,
  Shirt,
  UtensilsCrossed,
  Cpu
} from 'lucide-react';

const industries = [
  {
    icon: Factory,
    name: 'Metals & Mining',
    products: 'Steel, aluminum, copper, rare earths',
    useCase: 'Track commodity flows, identify industrial buyers',
    color: 'from-slate-500 to-slate-600',
  },
  {
    icon: Beaker,
    name: 'Chemicals',
    products: 'Industrial chemicals, solvents, polymers',
    useCase: 'Find manufacturers importing raw materials',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Wheat,
    name: 'Agricultural',
    products: 'Grains, coffee, sugar, cotton',
    useCase: 'Monitor harvest shipments, identify food processors',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Fuel,
    name: 'Energy',
    products: 'Oil, gas, biofuels, coal',
    useCase: 'Track refinery imports, discover distributors',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: FileBox,
    name: 'Paper & Packaging',
    products: 'Paper, pulp, packaging materials',
    useCase: 'Find printers, converters, packaging companies',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Shirt,
    name: 'Textiles',
    products: 'Fabrics, yarn, finished garments',
    useCase: 'Identify fashion brands, retailers, manufacturers',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: UtensilsCrossed,
    name: 'Food & Beverage',
    products: 'Ingredients, beverages, processed foods',
    useCase: 'Track food imports, find distributors',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Cpu,
    name: 'Electronics',
    products: 'Components, raw materials, devices',
    useCase: 'Discover manufacturers, assemblers, retailers',
    color: 'from-blue-500 to-blue-600',
  },
];

export function IndustriesSection() {
  return (
    <section id="industries" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Built for Every Trading Industry
          </h2>
          <p className="text-lg text-slate-600">
            Whether you're trading commodities worth millions or specialty products in
            niche markets, Trade Intelligence scales to your business. Our AI agents
            understand the unique requirements of each industry.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${industry.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <industry.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                {industry.name}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {industry.products}
              </p>
              <p className="text-sm text-slate-600">
                {industry.useCase}
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 max-w-2xl mx-auto">
            The same powerful platform. Customized intelligence for your specific market.
            Trade Intelligence adapts to your industry's terminology, products, and workflows.
          </p>
        </div>
      </div>
    </section>
  );
}
