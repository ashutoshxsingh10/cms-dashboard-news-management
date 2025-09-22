import { NewsRoundupCard } from "./NewsRoundupCard";

export function DemoGrid() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">News Round-up Cards Demo</h1>
        
        {/* Grid of 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          <NewsRoundupCard />
          <NewsRoundupCard />
          <NewsRoundupCard />
          <NewsRoundupCard />
          <NewsRoundupCard />
          <NewsRoundupCard />
        </div>

        {/* Loading state demo */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Loading State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <NewsRoundupCard loading={true} />
            <NewsRoundupCard loading={true} />
            <NewsRoundupCard loading={true} />
          </div>
        </div>
      </div>
    </div>
  );
}