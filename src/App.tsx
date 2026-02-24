import React, { useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProxy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setError(null);
    setLoading(true);
    
    // Construct the proxy URL
    const encodedUrl = encodeURIComponent(url);
    const newProxyUrl = `/api/proxy?url=${encodedUrl}`;
    
    setProxyUrl(newProxyUrl);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setError('Failed to load image through proxy. The URL might be invalid or the server blocked the request.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <ImageIcon className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Image Proxy</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-xl"
          >
            Bypass hotlinking protection by routing requests through our server with custom headers. 
            Optimized for <code className="text-emerald-400 font-mono text-sm">cdn.readdetectiveconan.com</code>.
          </motion.p>
        </header>

        <main className="space-y-8">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleProxy}
            className="relative group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <LinkIcon className="w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter image URL (e.g., https://cdn.readdetectiveconan.com/...)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proxy Image'}
            </button>
          </motion.form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {proxyUrl && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Result</h2>
                  <button 
                    onClick={() => navigator.clipboard.writeText(window.location.origin + proxyUrl)}
                    className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    Copy Proxy URL
                  </button>
                </div>
                
                <div className="relative aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-10">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                  )}
                  <img
                    src={proxyUrl}
                    alt="Proxied content"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                  />
                </div>
                
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-500 mb-1 font-mono">Proxy Endpoint:</p>
                  <p className="text-sm text-zinc-300 break-all font-mono">{proxyUrl}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-20 pt-8 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-600">
            This tool is for educational purposes. Please respect the terms of service of the content providers.
          </p>
        </footer>
      </div>
    </div>
  );
}
