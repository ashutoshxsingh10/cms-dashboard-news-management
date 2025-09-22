import { useState, useRef } from 'react';
import { Button } from "./ui/button";
import { PreviewWidget } from './PreviewWidget';
import { toast } from "sonner@2.0.3";

interface ImageCropSectionProps {
  imageUrl: string;
  title?: string;
  source?: string;
  disabled?: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropSection({ imageUrl, title = "Article Image", source = "Source", disabled = false }: ImageCropSectionProps) {
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 20, // 20% from left
    y: 25, // 25% from top
    width: 60, // 60% width
    height: 45 // 45% height (60% * 3/4 = 45% for 4:3 ratio)
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [originalCrop, setOriginalCrop] = useState<CropArea>(cropArea);
  const [startMouseX, setStartMouseX] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Early return if no imageUrl is provided
  if (!imageUrl) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm text-muted-foreground">
            <span className="text-red-500">*</span> Crop image for publishing
          </h3>
          <p className="text-xs text-gray-400 italic">*No image available</p>
        </div>
        <div className="flex justify-center items-center h-[330px] border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500">No image to crop</p>
        </div>
      </div>
    );
  }

  const handleCropSave = () => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // if loading from another domain
    img.src = imageUrl;

    img.onload = () => {
      // convert % to pixel values
      const sx = (cropArea.x / 100) * img.naturalWidth;
      const sy = (cropArea.y / 100) * img.naturalHeight;
      const sw = (cropArea.width / 100) * img.naturalWidth;
      const sh = (cropArea.height / 100) * img.naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      setCroppedImageUrl(canvas.toDataURL("image/jpeg", 0.9));
      
      toast.success("Image crop saved successfully!", {
        description: "Your image crop settings have been applied.",
        duration: 3000,
      });
    };

    img.onerror = () => {
      toast.error("Failed to crop image", {
        description: "Unable to load the image for cropping.",
        duration: 3000,
      });
    };
  };

  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize', handle?: string) => {
    if (disabled) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    } else if (action === 'resize' && handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setOriginalCrop({ ...cropArea });
      setStartMouseX(e.clientX);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (isDragging) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newX = Math.max(0, Math.min(100 - cropArea.width, x - dragStart.x));
      const newY = Math.max(0, Math.min(100 - cropArea.height, y - dragStart.y));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      // Calculate delta in percentage terms from start position
      const dxPercent = ((e.clientX - startMouseX) / rect.width) * 100;
      
      let newX = originalCrop.x;
      let newWidth = originalCrop.width;

      if (resizeHandle.includes('right')) {
        // Dragging right edge: width grows/shrinks by dx
        newWidth = originalCrop.width + dxPercent;
        // Clamp so it never goes below minimum (10%) or beyond right edge
        newWidth = Math.max(10, Math.min(100 - originalCrop.x, newWidth));
      } else if (resizeHandle.includes('left')) {
        // Dragging left edge: width = origWidth - dx, x shifts right by the width decrease
        newWidth = originalCrop.width - dxPercent;
        newX = originalCrop.x + (originalCrop.width - newWidth);

        // Clamp width to minimum
        const minWidth = 10;
        if (newWidth < minWidth) {
          newWidth = minWidth;
          newX = originalCrop.x + (originalCrop.width - minWidth);
        }
        
        // Clamp so it never runs off left edge
        newX = Math.max(0, newX);
      }

      // Enforce 4:3 aspect ratio
      const newHeight = newWidth * (3 / 4);
      
      // Ensure the crop area doesn't exceed container bounds vertically
      let finalY = originalCrop.y;
      if (finalY + newHeight > 100) {
        finalY = 100 - newHeight;
        // If even that's not enough, we need to shrink the crop area
        if (finalY < 0) {
          finalY = 0;
          const maxHeight = 100;
          const adjustedHeight = Math.min(newHeight, maxHeight);
          const adjustedWidth = adjustedHeight * (4 / 3);
          
          setCropArea({
            x: newX,
            y: finalY,
            width: adjustedWidth,
            height: adjustedHeight
          });
          return;
        }
      }

      setCropArea({
        x: newX,
        y: finalY,
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm text-muted-foreground">
          <span className="text-red-500">*</span> Crop image for publishing
        </h3>
        <p className="text-xs text-gray-400 italic">*This image is fetched from the article source</p>
      </div>
      
      {/* Two main columns layout */}
      <div className="flex" style={{ gap: '32px' }}>
        {/* Left Column - Crop Image Container */}
        <div className="flex-1">
          <div 
            ref={containerRef}
            className="relative rounded-lg overflow-hidden border border-gray-200"
            style={{ 
              height: '330px',
              cursor: isDragging ? 'grabbing' : 'default',
              backgroundColor: '#f8f9fa'
            }}
            onMouseMove={disabled ? undefined : handleMouseMove}
            onMouseUp={disabled ? undefined : handleMouseUp}
            onMouseLeave={disabled ? undefined : handleMouseUp}
          >
            {/* Main Image */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              style={{ 
                userSelect: 'none',
                display: 'block'
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', imageUrl);
                setImageLoaded(true);
              }}
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                console.log('Trying fallback...');
                // Try a fallback image
                const img = e.target as HTMLImageElement;
                if (!img.src.includes('placeholder')) {
                  img.src = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&crop=center';
                }
              }}
            />
            
            {/* Four-overlay approach with proper 50% opacity - only show if image is loaded */}
            {imageLoaded && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Top band - above crop area */}
                <div
                  className="absolute left-0 right-0 bg-black/50"
                  style={{ 
                    top: 0, 
                    height: `${cropArea.y}%` 
                  }}
                />
                
                {/* Bottom band - below crop area */}
                <div
                  className="absolute left-0 right-0 bg-black/50"
                  style={{ 
                    bottom: 0, 
                    height: `${100 - (cropArea.y + cropArea.height)}%` 
                  }}
                />
                
                {/* Left band - left of crop area */}
                <div
                  className="absolute bg-black/50"
                  style={{
                    left: 0,
                    width: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    height: `${cropArea.height}%`
                  }}
                />
                
                {/* Right band - right of crop area */}
                <div
                  className="absolute bg-black/50"
                  style={{
                    right: 0,
                    width: `${100 - (cropArea.x + cropArea.width)}%`,
                    top: `${cropArea.y}%`,
                    height: `${cropArea.height}%`
                  }}
                />

                {/* Crop area border and handles - JS-computed height for 4:3 ratio */}
                <div 
                  className={`absolute border-2 border-white border-dashed ${disabled ? 'pointer-events-none' : 'pointer-events-auto'}`}
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                    cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab')
                  }}
                  onMouseDown={disabled ? undefined : (e) => handleMouseDown(e, 'drag')}
                >
                  {/* Corner resize handles - only show when not disabled */}
                  {!disabled && (
                    <>
                      <div 
                        className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-nw-resize pointer-events-auto"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize', 'top-left');
                        }}
                      ></div>
                      <div 
                        className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-ne-resize pointer-events-auto"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize', 'top-right');
                        }}
                      ></div>
                      <div 
                        className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400 cursor-sw-resize pointer-events-auto"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize', 'bottom-left');
                        }}
                      ></div>
                      <div 
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-se-resize pointer-events-auto"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize', 'bottom-right');
                        }}
                      ></div>

                      {/* Edge resize handles - only left and right since height is computed from width */}
                      <div 
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-400 cursor-w-resize pointer-events-auto"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize', 'left');
                        }}
                      ></div>
                      <div 
                        className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-400 cursor-e-resize pointer-events-auto"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleMouseDown(e, 'resize', 'right');
                        }}
                      ></div>
                    </>
                  )}

                  {/* Crop info overlay */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs pointer-events-none">
                    4:3 Crop Area
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">Loading image...</div>
                  <div className="text-xs text-gray-400">URL: {imageUrl}</div>
                </div>
              </div>
            )}
          </div>

          {/* Crop Controls - Hidden when disabled */}
          {!disabled && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleCropSave}
                variant="secondary"
                className="h-8 px-4 text-xs"
              >
                Save Crop
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Preview Widget */}
        <div className="flex-shrink-0">
          <PreviewWidget 
            article={{
              title: title,
              imageUrl: croppedImageUrl ?? imageUrl,
              source: source
            }}
          />
        </div>
      </div>
    </div>
  );
}