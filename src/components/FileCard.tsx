import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit3, Save, X } from 'lucide-react';
import { UploadedFile } from './FileUpload';

interface FileCardProps {
  uploadedFile: UploadedFile;
  content: string;
  onContentUpdate: (id: string, newContent: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ uploadedFile, content, onContentUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  // Extract variables from content (anything between {{ }})
  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    return [...new Set(matches)]; // Remove duplicates
  };

  const variables = extractVariables(content);

  const handleSave = () => {
    onContentUpdate(uploadedFile.id, editContent);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <>
      <Card 
        className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-card to-secondary/10 border-border/50"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">
              {uploadedFile.file.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {(uploadedFile.file.size / 1024).toFixed(1)} KB
            </p>
            
            {variables.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {variables.map((variable, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{uploadedFile.file.name}</span>
              </DialogTitle>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {isEditing ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="h-full resize-none"
                placeholder="Enter your prompt content..."
              />
            ) : (
              <div className="h-full overflow-auto bg-secondary/20 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground">
                  {content}
                </pre>
              </div>
            )}
          </div>
          
          {variables.length > 0 && (
            <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Variables found:</h4>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileCard;