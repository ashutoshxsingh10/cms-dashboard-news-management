import exampleImage from 'figma:asset/7f85da696c9b9c2bd4f61947a655e2ae3144a10d.png';

interface PreviewWidgetProps {
  article?: {
    title: string;
    imageUrl: string;
    source: string;
  };
}

export function PreviewWidget({ article }: PreviewWidgetProps) {
  // Default article data if none provided
  const defaultArticle = {
    title: '"Makes Analyst Look Like A Magician": Virat Kohli\'s Dismissal vs Bangladesh',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    source: 'CNN'
  };

  const displayArticle = article || defaultArticle;

  return (
    <div className="w-fit h-fit">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Previews</h3>
      
      <div className="space-y-6 h-fit">
        {/* Preview Mockup 1 - Side by side layout */}
        <div 
          className="
            rounded-xl
            w-[204px] h-[86px]
            bg-[#CFCFCF]
            p-1
            flex flex-col
            gap-1
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white text-xs font-medium">
            <span>glance</span>
            <div className="flex items-center text-xs">
              NEWS
              <svg className="w-2 h-2 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Content area */}
          <div className="flex gap-1 flex-1 overflow-hidden">
            {/* Left placeholder */}
            <div className="w-[64px] bg-gray-400 rounded-lg"></div>
            
            {/* Right image + gradient */}
            <div className="relative flex-1 overflow-hidden rounded-lg">
              <img 
                src={displayArticle.imageUrl} 
                alt={displayArticle.title}
                className="w-full h-full object-cover object-center"
              />
              
              {/* Source icon - positioned at top-left of image */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                {displayArticle.source.charAt(0)}
              </div>
              
              <div
                className="absolute bottom-0 left-0 right-0 h-[36px] rounded-b-lg"
                style={{
                  background: 'linear-gradient(0deg, #17181E 0%, rgba(23, 24, 30, 0) 100%)'
                }}
              >
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                    {displayArticle.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Mockup 2 - Full width layout */}
        <div 
          className="
            rounded-xl
            w-[204px] h-[86px]
            bg-[#CFCFCF]
            p-1
            flex flex-col
            gap-1
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white text-xs font-medium">
            <span>glance</span>
            <div className="flex items-center text-xs">
              NEWS
              <svg className="w-2 h-2 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Full width article card */}
          <div className="relative flex-1 overflow-hidden rounded-lg">
            <img 
              src={displayArticle.imageUrl} 
              alt={displayArticle.title}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Source icon - positioned at top-left of image */}
            <div className="absolute top-1 left-1 w-3 h-3 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
              {displayArticle.source.charAt(0)}
            </div>
            
            {/* Gradient overlay */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[36px] rounded-b-lg"
              style={{
                background: 'linear-gradient(0deg, #17181E 0%, rgba(23, 24, 30, 0) 100%)'
              }}
            >
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-white text-xs leading-tight font-medium line-clamp-2">
                  {displayArticle.title}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Mockup 3 - Compact card layout */}
        <div 
          className="
            rounded-xl
            w-[204px] h-[86px]
            bg-[#CFCFCF]
            p-1
            flex flex-col
            gap-1
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white text-xs font-medium">
            <span>glance</span>
            <div className="flex items-center text-xs">
              NEWS
              <svg className="w-2 h-2 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Compact card layout */}
          <div className="bg-gray-600 rounded-lg p-1 relative overflow-hidden flex-1 flex">
            {/* Left content area - constrained to avoid overlap */}
            <div className="flex-1 pr-12 min-w-0">
              {/* Source icon - positioned at top-left of card content area */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold z-10">
                {displayArticle.source.charAt(0)}
              </div>

              <h4 className="text-white text-xs font-medium leading-tight pt-4 line-clamp-3">
                {displayArticle.title}
              </h4>
            </div>
            
            {/* Right thumbnail area - fixed width */}
            <div
              className="w-10 h-full bg-gray-500 rounded-lg overflow-hidden flex-shrink-0"
            >
              <img 
                src={displayArticle.imageUrl} 
                alt={displayArticle.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}