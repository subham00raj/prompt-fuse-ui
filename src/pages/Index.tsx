import FileUpload from '@/components/FileUpload';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent mb-4 animate-gradient-shift bg-300%">
            Prompt File Uploader
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload multiple files and create beautiful prompts with Langfuse integration. 
            Drag and drop your files, configure settings, and let us handle the rest.
          </p>
        </div>

        {/* Main Upload Interface */}
        <div className="max-w-4xl mx-auto">
          <FileUpload />
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold">⚡</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Fast Processing</h3>
            <p className="text-sm text-muted-foreground">Async processing ensures quick uploads even with multiple files</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold">🎯</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Smart Configuration</h3>
            <p className="text-sm text-muted-foreground">Customize model settings, temperature, and prompt types</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold">🔗</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Langfuse Integration</h3>
            <p className="text-sm text-muted-foreground">Direct integration with Langfuse for seamless prompt management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;