import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { videoService } from '../services/videoService';
import { generateHashtags, generateCaption } from '../services/geminiService';
import { Download, Search, Sparkles, CheckCircle2, History, Languages, Moon, Sun, Monitor, Shield, Github, Twitter, Youtube, Facebook, Instagram, Copy, Check, Ghost } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export default function LandingPage() {
  const [url, setUrl] = React.useState('');
  const [isFetching, setIsFetching] = React.useState(false);
  const [videoData, setVideoData] = React.useState<any>(null);
  const [aiResult, setAiResult] = React.useState<{ type: 'hashtags' | 'caption', content: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleFetch = async () => {
    if (!url) return;
    setIsFetching(true);
    setAiResult(null);
    try {
      const data = await videoService.fetchMetadata(url);
      setVideoData(data);
    } catch (error) {
      alert('Error fetching video. Please make sure the URL is correct.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAiAction = async (type: 'hashtags' | 'caption') => {
    if (!videoData) return;
    setIsAiLoading(true);
    try {
      const result = type === 'hashtags' 
        ? await generateHashtags(videoData.title)
        : await generateCaption(videoData.title);
      setAiResult({ type, content: result });
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Animated BG Blobs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      </div>

      <Navbar />

      <main className="pt-20 sm:pt-32 md:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        {/* Hero Section - 2 Column Grid */}
        <section className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center mb-16 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <div className="inline-flex items-center w-fit px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-wider uppercase">
              ✨ Powered by AI v2.4
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white text-left">
              Download Reels & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 font-black">Shorts Instantly.</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-md text-left">
              High-performance video retrieval for creators. Paste any link and get HD quality without watermarks in seconds. Powered by ReelRush AI.
            </p>

            <div className="relative mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl focus-within:border-indigo-500/50 transition-all group shadow-2xl">
                <input 
                  type="text" 
                  placeholder="Paste link..."
                  className="bg-transparent border-none focus:ring-0 text-white flex-grow px-3 sm:px-4 py-2 sm:py-3 outline-none placeholder:text-slate-500 text-xs sm:text-sm rounded-lg sm:rounded-none"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  onClick={handleFetch}
                  disabled={isFetching || !url}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 text-xs sm:text-sm"
                >
                  {isFetching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <><span className="hidden sm:inline">Analyze</span><span className="sm:hidden">Go</span> <Sparkles size={14} className="sm:w-[16px] sm:h-[16px]" /></>
                  )}
                </button>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium"><span className="w-2 h-2 rounded-full bg-red-500"></span> <span className="hidden sm:inline">YouTube</span><span className="sm:hidden">YT</span></div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium"><span className="w-2 h-2 rounded-full bg-pink-500"></span> <span className="hidden sm:inline">Instagram</span><span className="sm:hidden">IG</span></div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium"><span className="w-2 h-2 rounded-full bg-blue-400"></span> <span className="hidden sm:inline">Twitter</span><span className="sm:hidden">X</span></div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium"><span className="w-2 h-2 rounded-full bg-teal-400"></span> <span className="hidden sm:inline">TikTok</span><span className="sm:hidden">TK</span></div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual / Preview Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-center relative"
          >
            {videoData ? (
              <div className="w-full max-w-[400px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative">
                <div className="aspect-video relative group overflow-hidden">
                  <img 
                    src={videoData.thumbnail} 
                    alt="Preview" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white/20" />
                    <span className="text-xs font-bold text-white tracking-wide">Ready for download</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{videoData.title}</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Metadata Fetched • {videoData.qualities[0]?.size || '--'}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded uppercase tracking-tighter">HD Quality</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      <span>Preparing Download</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 w-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => videoService.downloadVideo(url, videoData.qualities[0]?.formatId, videoData.title, videoData.qualities[0]?.ext)} 
                      className="py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg col-span-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[400px] h-[500px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] flex items-center justify-center relative overflow-hidden group">
                 <div className="text-center p-8">
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <Download className="text-indigo-400" size={32} />
                   </div>
                   <h3 className="text-xl font-bold mb-2">Video Preview</h3>
                   <p className="text-sm text-slate-500">Paste a link to see the magic happen.</p>
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute -top-6 -right-6 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center shadow-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">Active Users</span>
                    <span className="text-xl font-bold text-white">12.4K</span>
                 </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* Preview Card - Mobile only (if data exists) */}
        <AnimatePresence>
          {videoData && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="lg:hidden max-w-4xl mx-auto mb-12 sm:mb-20"
            >
              <div className="glass rounded-2xl sm:rounded-[2rem] overflow-hidden grid md:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8">
                <div className="relative group overflow-hidden rounded-xl">
                  <img 
                    src={videoData.thumbnail} 
                    alt="Preview" 
                    className="w-full aspect-[9/16] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                    <span className="bg-brand-primary text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase">
                      {videoData.platform}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 tracking-tight line-clamp-2">{videoData.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Duration: {videoData.duration}</p>
                    
                    <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-8 max-h-[200px] overflow-y-auto">
                      {videoData.qualities.slice(0, 3).map((q: any) => (
                        <div 
                          key={q.label} 
                          onClick={() => videoService.downloadVideo(url, q.formatId, videoData.title, q.ext)}
                          className="flex items-center justify-between p-2 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/50 transition-colors cursor-pointer group"
                        >
                          <div>
                            <span className="font-bold block text-xs sm:text-base">{q.label}</span>
                            <span className="text-[9px] sm:text-xs text-gray-500">{q.size}</span>
                          </div>
                          <Download size={16} className="sm:w-[20px] sm:h-[20px] text-gray-500 group-hover:text-brand-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <button 
                      onClick={() => handleAiAction('hashtags')}
                      disabled={isAiLoading}
                      className="flex-1 bg-white/10 hover:bg-white/20 transition-colors py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 text-xs sm:text-base"
                    >
                      {isAiLoading && aiResult?.type === 'hashtags' ? '...' : '#Tags'}
                    </button>
                    <button 
                      onClick={() => handleAiAction('caption')}
                      disabled={isAiLoading}
                      className="flex-1 bg-white/10 hover:bg-white/20 transition-colors py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 text-xs sm:text-base"
                    >
                      {isAiLoading && aiResult?.type === 'caption' ? '...' : 'Caption'}
                    </button>
                  </div>

                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-brand-primary/10 border border-brand-primary/20 relative"
                    >
                      <p className="text-xs sm:text-sm text-gray-300 pr-8 break-words">{aiResult.content}</p>
                      <button 
                        onClick={() => copyToClipboard(aiResult.content)}
                        className="absolute top-4 right-4 text-brand-primary hover:scale-110 transition-transform"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* How It Works */}
        <section id="how-it-works" className="mb-16 sm:mb-32">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">How it works</h2>
            <p className="text-gray-400 text-sm sm:text-base">Download your favorite videos in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { step: "01", title: "Copy URL", desc: "Copy the link of the Reel, Short, or Clip you want to download." },
              { step: "02", title: "Paste & Preview", desc: "Paste the link in ReelRush and wait for the AI to fetch metadata." },
              { step: "03", title: "Download HD", desc: "Choose your quality and enjoy your video instantly." }
            ].map((s) => (
              <div key={s.step} className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 bg-white/5 relative overflow-hidden group">
                <span className="text-4xl sm:text-6xl font-black text-white/5 absolute -top-2 -right-2 sm:-top-4 sm:-right-4 transition-colors group-hover:text-brand-primary/10">{s.step}</span>
                <h4 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">{s.title}</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AdSense Top Banner */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
          <div className="w-full h-20 sm:h-24 bg-white/5 border border-dashed border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center px-4">
            <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-wider sm:tracking-[0.3em] font-medium italic text-center">AD SPACE</span>
          </div>
        </div>

        {/* User Reviews */}
        <section id="reviews" className="mb-16 sm:mb-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16">Trusted by Creators</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[
              { name: "Alex Rivers", role: "Digital Artist", text: "ReelRush is literally the fastest HD downloader I've found. No ads, just clean files." },
              { name: "Sarah Chen", role: "Content Manager", text: "The AI hashtag generator saves me at least 10 minutes per post. Essential tool for social media." },
              { name: "Marcus Wright", role: "Vlogger", text: "4K support is a game changer for my YouTube Shorts workflow. Highly recommended." }
            ].map((r, i) => (
              <div key={i} className="glass p-8 rounded-3xl group hover:border-brand-primary/40 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Sparkles key={s} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">"{r.text}"</p>
                <div>
                  <h4 className="font-bold">{r.name}</h4>
                  <p className="text-xs text-slate-500">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Platforms */}
        <section id="supported" className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Instagram, name: "Instagram", color: "from-pink-500 to-purple-500" },
              { icon: Youtube, name: "YouTube", color: "from-red-500 to-red-600" },
              { icon: Ghost, name: "TikTok", color: "from-cyan-400 to-pink-500" },
              { icon: Facebook, name: "Facebook", color: "from-blue-600 to-blue-700" },
              { icon: Twitter, name: "Twitter/X", color: "from-gray-800 to-black" }
            ].map((p) => (
              <div key={p.name} className="glass p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-brand-primary transition-all cursor-default group">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${p.color} transition-transform group-hover:scale-110`}>
                  <p.icon size={32} />
                </div>
                <span className="font-bold text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features BENTO GRID */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="md:col-span-2 glass p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <Sparkles className="text-brand-primary mb-6" size={40} />
              <h3 className="text-3xl font-bold mb-4">AI Magic Features</h3>
              <p className="text-gray-400 leading-relaxed max-w-lg">
                ReelRush doesn't just download. Our AI engine generates viral captions, suggests trending hashtags, and even scripts your next video.
              </p>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-brand-primary/10 rounded-full blur-[100px] group-hover:bg-brand-primary/20 transition-colors" />
          </div>

          <div className="glass p-10 rounded-[2.5rem] flex flex-col justify-end group">
            <History className="text-accent-purple mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Download History</h3>
            <p className="text-gray-400 text-sm">
              Keep track of all your favorite downloads. Sync across devices with a free Cloud account.
            </p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] group">
             <CheckCircle2 className="text-green-400 mb-6" size={40} />
             <h3 className="text-2xl font-bold mb-4">HD & 4K Support</h3>
             <p className="text-gray-400 text-sm">
               Get the highest resolution available. We support up to 4K content for YouTube and HD for Instagram.
             </p>
          </div>

          <div className="md:col-span-2 glass p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <Languages className="text-brand-secondary mb-6" size={40} />
              <h3 className="text-3xl font-bold mb-4">Global Access</h3>
              <p className="text-gray-400">
                Support for 25+ languages. Download from any country with our optimized global API nodes.
              </p>
            </div>
            <div className="w-full md:w-48 aspect-video glass rounded-xl flex items-center justify-center font-mono text-xs text-gray-500">
              [API_STATUS: ACTIVE]
            </div>
          </div>
        </section>

        {/* Blog / Guides Section */}
        <section id="blog" className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Creator Guides</h2>
              <p className="text-gray-400">Master the art of viral content creation.</p>
            </div>
            <button className="text-brand-primary text-sm font-bold flex items-center gap-2 hover:underline">
              View all articles <Search size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400", cat: "Growth", title: "How to go viral on Instagram Reels in 2026" },
              { image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400", cat: "AI", title: "Using AI to script your YouTube Shorts" },
              { image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=400", cat: "Tips", title: "Maximum quality settings for TikTok uploads" }
            ].map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-white/5">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest block mb-2">{post.cat}</span>
                <h4 className="text-xl font-bold group-hover:text-brand-primary transition-colors">{post.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="max-w-3xl mx-auto mb-32">
          <h2 className="text-4xl font-bold text-center mb-16">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is it free to use?", a: "Yes, ReelRush is 100% free for individual use. We support our service through minor affiliate links and optional premium plans." },
              { q: "Which platforms are supported?", a: "We currently support Instagram, YouTube, TikTok, Facebook, and Twitter/X." },
              { q: "Is it legal to download videos?", a: "Downloading content for personal offline use is generally permitted, but please respect copyright and the original creators' terms of service." }
            ].map((f, i) => (
              <div key={i} className="glass p-6 rounded-2xl">
                <h4 className="font-bold mb-3 flex items-center justify-between">
                  {f.q}
                  <span className="text-gray-500">+</span>
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 px-6 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded flex items-center justify-center font-bold text-white italic">R</div>
                <span className="font-bold text-xl tracking-tight">ReelRush AI</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
                The world's first AI-powered social media media downloader with smart content generation.
              </p>
            </div>
            
            <div className="flex gap-12">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 text-center md:text-left">System Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-white">All Servers Operational</span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 text-center md:text-left">Total Downloads</span>
                <span className="text-xs text-white">48,192,204</span>
              </div>
            </div>

            <div className="flex-grow max-w-[400px] hidden lg:flex h-14 bg-white/5 border border-dashed border-white/20 rounded-xl items-center justify-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-medium">AD_SLOT_FOOTER_728x90</span>
            </div>

            <div className="flex gap-4">
              <Twitter size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Github size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 gap-4">
            <div className="flex gap-8 text-xs text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">DMCA</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-slate-600">© 2026 ReelRush AI Labs. Built for creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
