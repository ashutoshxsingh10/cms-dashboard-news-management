import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Info, Code2, Coffee } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Info className="h-5 w-5 text-primary" />
            </div>
            Prototype Disclaimer
          </DialogTitle>
          <DialogDescription>
            Important information about this application
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Code2 className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Built with ❤️ and Cursor + Figma</h4>
                <p className="text-sm text-gray-600">
                  Created by <strong>Ashutosh Singh</strong> using <strong>AI-powered development</strong> with <strong>Cursor</strong> and <strong>Figma</strong>. This prototype showcases modern AI-assisted coding capabilities, built from ground up with hardcoded content to represent the ideal product vision.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">For Viewing Purpose Only</h4>
                <p className="text-sm text-gray-600">
                  This prototype is designed for demonstration and viewing purposes to showcase the real working functionality of an actual CMS system.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onClose} className="w-full sm:w-auto">
              Got it, Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}