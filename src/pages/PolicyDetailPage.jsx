import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/party/Navbar';
import Footer from '../components/party/Footer';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ArrowLeft,
  ThumbsUp,
  Heart
} from 'lucide-react';
import { unifiedPoliciesData } from '../data/unifiedPoliciesData';
import { supabase } from '../lib/supabase';

export default function PolicyDetailPage({ lang, setLang }) {
  const { policyId } = useParams();
  const navigate = useNavigate();

  // A-02 Fix: Invalid policyId → redirect to 404 instead of silently showing policy_0
  const data = unifiedPoliciesData.policies[policyId];
  if (!data) return <Navigate to="/404" replace />;

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [hasReachedQuota, setHasReachedQuota] = useState(false);

  // Generate background stickers visually equal to the number of likes
  useEffect(() => {
    const numStickers = Math.min(likes, 80); // Cap visual stickers so it doesn't lag the browser
    const newStickers = [];
    for (let i = 0; i < numStickers; i++) {
      newStickers.push({
        id: i,
        x: Math.random() * 90 + 5, // 5% to 95%
        y: Math.random() * 80 + 10,
        rotation: Math.random() * 60 - 30, // -30 to +30 degrees
        scale: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      });
    }
    setStickers(newStickers);
  }, [likes]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [policyId]);

  useEffect(() => {
    async function fetchLikes() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('policy_likes')
        .select('likes_count')
        .eq('policy_id', policyId)
        .single();
      
      if (data) {
        setLikes(data.likes_count);
      }
    }
    fetchLikes();

    const likedPolicies = JSON.parse(localStorage.getItem('liked_policies') || '[]');
    if (likedPolicies.includes(policyId)) {
      setHasLiked(true);
    }
    if (likedPolicies.length >= 10) {
      setHasReachedQuota(true);
    }
  }, [policyId]);

  const handleLike = async () => {
    if (hasLiked || isLoadingLike || hasReachedQuota || !supabase) return;
    setIsLoadingLike(true);

    // Optimistic update
    setLikes(prev => prev + 1);
    setHasLiked(true);
    
    const likedPolicies = JSON.parse(localStorage.getItem('liked_policies') || '[]');
    const updatedPolicies = [...likedPolicies, policyId];
    localStorage.setItem('liked_policies', JSON.stringify(updatedPolicies));
    
    if (updatedPolicies.length >= 10) {
      setHasReachedQuota(true);
    }

    try {
      await supabase.rpc('increment_policy_likes', { p_id: policyId });
    } catch (error) {
      console.error('Error liking policy:', error);
    } finally {
      setIsLoadingLike(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="min-h-screen bg-[#0B0F17] flex flex-col font-sans"
    >
      {/* Set theme="dark" since the top/navbar area is dark */}
      <Navbar lang={lang} setLang={setLang} theme="dark" />

      {/* Main Container */}
      <main className="pt-[100px] lg:pt-[120px] flex-grow w-full relative z-10 bg-[#0B0F17]">
        
        {/* Breadcrumb / Top Bar */}
        <div className="max-w-[1540px] mx-auto px-4 lg:px-8 xl:px-12 pb-4 xl:pb-8 flex overflow-x-auto whitespace-nowrap text-white/50 text-sm lg:text-base font-inter items-center gap-2">
          <button onClick={() => navigate('/policies')} className="hover:text-white transition-colors uppercase font-bold flex items-center gap-2">
            <ArrowLeft size={16} /> {lang === 'th' ? 'นโยบายพรรค' : 'Policies'}
          </button>
          <ChevronRight size={16} className="opacity-50" />
          <span className="text-white uppercase font-bold font-anakotmai">
            {data.title[0]}
          </span>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-[1540px] mx-auto w-full min-h-screen flex flex-col xl:flex-row px-4 lg:px-8 xl:px-12 xl:gap-16">
          
          {/* LEFT COLUMN: Sticky Sidebar (Dark) */}
          <div className="w-full xl:w-[480px] xl:flex-shrink-0 bg-[#0B0F17] mb-8 xl:mb-0 xl:sticky xl:top-[120px] xl:self-start z-10 px-4 sm:px-8 xl:px-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:flex-col xl:items-start xl:gap-4">
              
              <div className="flex-1 lg:w-1/2 xl:w-full">
                <h1 className={`text-3xl lg:text-4xl text-white font-bold pb-4 leading-tight font-anakotmai`}>
                  {data.title[0]}
                </h1>
                {data.title[1] && (
                  <p className={`text-lg xl:text-xl mt-4 lg:mt-6 mb-6 lg:mb-0 xl:mb-8 leading-relaxed text-[#FF6B00] font-anakotmai font-bold`}>
                    {data.title[1]}
                  </p>
                )}
              </div>

              <div className="flex-1 lg:w-1/2 lg:flex lg:justify-end xl:w-full xl:justify-start">
                <div className="relative rounded-3xl overflow-hidden max-w-full inline-block shadow-2xl">
                  <img 
                    alt={data.title[0]} 
                    className="max-h-[300px] w-full h-auto object-cover block" 
                    src={'https://images.unsplash.com/photo-1555848962-6e79363ec18f?w=800&q=80'} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 my-8"></div>
          </div>

          {/* RIGHT COLUMN: Editorial Content (Light) */}
          <div className="flex-1 bg-white xl:max-w-[1050px] rounded-t-[40px] xl:rounded-tr-none lg:rounded-bl-[40px] 2xl:rounded-[40px] overflow-hidden shadow-2xl relative z-20">
            <div className="w-full p-6 sm:p-10 lg:p-16 py-12 lg:py-16">
              
              {/* WHY Section */}
              {data.why && data.why.length > 0 && (
                <section className="mb-12 lg:mb-16">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 font-anakotmai">
                    ทำไมต้องนโยบายนี้ (WHY)
                  </h2>
                  <div className="flex flex-col gap-4 text-lg lg:text-xl leading-relaxed text-gray-700 font-anakotmai">
                    <div className="space-y-4">
                      {data.why.map((item, i) => {
                        const parts = item.split('**');
                        return (
                          <p key={i} className="flex items-start">
                            <span className="text-[#FF6B00] mr-3 mt-1.5 opacity-80">✦</span>
                            <span>
                              {parts.map((part, pIdx) => (
                                pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-900">{part}</strong> : part
                              ))}
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* HOW Section */}
              {data.how && data.how.length > 0 && (
                <section className="mb-12 lg:mb-16">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 font-anakotmai">
                    ดำเนินการอย่างไร (HOW)
                  </h2>
                  <div className="flex flex-col gap-4 text-lg lg:text-xl leading-relaxed text-gray-700 font-anakotmai">
                    <div className="space-y-4">
                      {data.how.map((item, i) => {
                        const parts = item.split('**');
                        return (
                          <p key={i} className="flex items-start">
                            <span className="text-[#FF6B00] mr-3 mt-1.5 opacity-80">✦</span>
                            <span>
                              {parts.map((part, pIdx) => (
                                pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-900">{part}</strong> : part
                              ))}
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* OUTCOME Section */}
              {data.outcome && data.outcome.length > 0 && (
                <section className="mb-12 lg:mb-16">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 font-anakotmai">
                    ทำแล้วได้อะไร (OUTCOME)
                  </h2>
                  <div className="flex flex-col gap-4 text-lg lg:text-xl leading-relaxed text-gray-700 font-anakotmai">
                    <div className="space-y-4">
                      {data.outcome.map((item, i) => {
                        const parts = item.split('**');
                        return (
                          <p key={i} className="flex items-start">
                            <span className="text-[#FF6B00] mr-3 mt-1.5 opacity-80">✦</span>
                            <span>
                              {parts.map((part, pIdx) => (
                                pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-900">{part}</strong> : part
                              ))}
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* FEASIBILITY Section */}
              {data.feasibility && data.feasibility.length > 0 && (
                <section className="mb-12 lg:mb-16">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 font-anakotmai">
                    ความเป็นไปได้ (FEASIBILITY)
                  </h2>
                  <div className="flex flex-col gap-4 text-lg lg:text-xl leading-relaxed text-gray-700 font-anakotmai">
                    <div className="space-y-4">
                      {data.feasibility.map((item, i) => {
                        const parts = item.split('**');
                        return (
                          <p key={i} className="flex items-start">
                            <span className="text-[#FF6B00] mr-3 mt-1.5 opacity-80">✦</span>
                            <span>
                              {parts.map((part, pIdx) => (
                                pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-900">{part}</strong> : part
                              ))}
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}



              {/* Interactive Vote/Like Widget */}
              <section className="mt-20 lg:mt-24">
                <div className="relative w-full bg-pink-50/30 border border-pink-100 rounded-3xl p-8 lg:p-12 text-center overflow-hidden min-h-[320px] flex flex-col items-center justify-center">
                  
                  {/* Background Heart Stickers */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {stickers.map((st) => (
                      <div 
                        key={st.id}
                        className="absolute transition-all duration-700 ease-out"
                        style={{
                          left: `${st.x}%`,
                          top: `${st.y}%`,
                          transform: `translate(-50%, -50%) rotate(${st.rotation}deg) scale(${st.scale})`
                        }}
                      >
                        <Heart size={36} className="fill-[#FF6B00]/15 text-[#FF6B00]/20" />
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <button 
                      onClick={handleLike}
                      disabled={hasLiked || isLoadingLike || (!hasLiked && hasReachedQuota)}
                      className="relative group cursor-pointer disabled:cursor-default"
                    >
                      {!hasLiked && !hasReachedQuota && <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-pink-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>}
                      <div className={`relative flex items-center justify-center gap-3 border-2 rounded-full px-8 py-4 font-black text-3xl transition-all duration-300 shadow-xl ${
                        hasLiked 
                          ? 'bg-[#FF6B00] border-[#FF6B00] text-white scale-110' 
                          : (!hasLiked && hasReachedQuota)
                            ? 'bg-gray-100 border-gray-200 text-gray-400'
                            : 'bg-white border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white hover:scale-110'
                      }`}>
                        <Heart size={32} className={`${hasLiked ? 'fill-white' : 'fill-transparent'} ${(!hasLiked && !hasReachedQuota) ? 'group-hover:scale-110 transition-transform' : ''}`} />
                        <span className="font-inter tracking-widest">{likes}</span>
                      </div>
                    </button>

                    {/* Quota Reached Message */}
                    {hasReachedQuota && !hasLiked && (
                      <p className="mt-6 text-sm text-gray-500 font-anakotmai">
                        คุณโหวตครบ 10 นโยบายแล้ว (Reached maximum 10 likes quota)
                      </p>
                    )}
                  </div>
                </div>
              </section>

            </div>
          </div>
          
        </div>
      </main>

      <Footer lang={lang} />
    </motion.div>
  );
}
