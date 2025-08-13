import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export interface PromptConfig {
  name: string;
  type: 'text' | 'chat';
  model: string;
  temperature: number;
  labels: string[];
  supportedLanguages: string[];
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [config, setConfig] = useState<PromptConfig>({
    name: '',
    type: 'text',
    model: 'gpt-4o',
    temperature: 0.7,
    labels: ['production'],
    supportedLanguages: ['en']
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const uploadFile = async (uploadedFile: UploadedFile): Promise<void> => {
    const { file } = uploadedFile;
    
    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      // Read file content
      const content = await file.text();
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, progress }
            : f
        ));
      }

      // Here you would integrate with Langfuse API
      // For now, we'll simulate the API call
      const promptData = {
        name: `${config.name}-${file.name.split('.')[0]}`,
        type: config.type,
        prompt: config.type === 'text' ? content : [
          { role: "system", content: "You are a helpful assistant" },
          { role: "user", content: content }
        ],
        labels: config.labels,
        config: {
          model: config.model,
          temperature: config.temperature,
          supported_languages: config.supportedLanguages,
        }
      };

      console.log('Creating prompt:', promptData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status to success
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ));

    } catch (error) {
      console.error('Upload failed:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : f
      ));
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    if (!config.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your prompts",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Process all files concurrently
      await Promise.all(
        files.filter(f => f.status === 'pending').map(uploadFile)
      );
      
      toast({
        title: "Upload complete",
        description: `Successfully processed ${files.length} file(s)`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Some files failed to upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'uploading':
        return <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/10 border-border/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Prompt Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-name">Prompt Name</Label>
            <Input
              id="prompt-name"
              placeholder="Enter prompt name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Prompt Type</Label>
            <Select value={config.type} onValueChange={(value: 'text' | 'chat') => 
              setConfig(prev => ({ ...prev, type: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={config.model} onValueChange={(value) => 
              setConfig(prev => ({ ...prev, model: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4O</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Temperature</Label>
            <Select value={config.temperature.toString()} onValueChange={(value) => 
              setConfig(prev => ({ ...prev, temperature: parseFloat(value) }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Deterministic</SelectItem>
                <SelectItem value="0.3">0.3 - Focused</SelectItem>
                <SelectItem value="0.7">0.7 - Balanced</SelectItem>
                <SelectItem value="1">1 - Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Upload Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer",
          "bg-upload-zone hover:bg-upload-zone-hover",
          isDragOver && "border-upload-zone-active bg-upload-zone-active/10 animate-pulse-glow",
          !isDragOver && "border-border hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,.json,.csv,.xml"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10 animate-float">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Drop files here or click to browse</h3>
            <p className="text-muted-foreground">Support for .txt, .md, .json, .csv, .xml files</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/10 border-border/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Selected Files</h3>
          <div className="space-y-3">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-3 bg-upload-zone rounded-lg border border-border/50"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getStatusIcon(uploadedFile.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                {uploadedFile.status === 'uploading' && (
                  <div className="w-24 mr-3">
                    <Progress value={uploadedFile.progress} className="h-2" />
                  </div>
                )}
                
                {uploadedFile.status === 'error' && (
                  <p className="text-xs text-destructive mr-3">
                    {uploadedFile.error}
                  </p>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadedFile.id)}
                  disabled={uploadedFile.status === 'uploading'}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={files.length === 0 || isUploading || !config.name.trim()}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2" />
              Processing Files...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Create Prompts ({files.length})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;