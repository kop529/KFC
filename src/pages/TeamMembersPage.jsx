import { useParams, Link } from 'react-router-dom';
import { teamMembersData } from '../data/teamMembersData';
import { motion } from 'framer-motion';

export default function TeamMembersPage({ lang = 'th' }) {
  const { teamId } = useParams();
  const teamData = teamMembersData[teamId];

  if (!teamData) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0F17] text-white">
        <h1 className="text-3xl font-anakotmai">Team not found</h1>
        <Link to="/leadership" className="ml-4 text-[#FF6B00] underline">Go back</Link>
      </div>
    );
  }

  const teamName = lang === 'th' ? teamData.th : teamData.en;

  // Partition members into leader (first member) and regular members
  const headMember = teamData.members[0];
  const regularMembers = teamData.members.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="relative w-full min-h-[100dvh] bg-[#0B0F17] text-white font-sans overflow-x-hidden selection:bg-[#FF6B00] selection:text-white pb-32"
    >
      
      {/* CSS for Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .group:hover .group-hover\\:animate-shimmer {
          animation: shimmer 0.8s ease-in-out forwards;
        }
      `}</style>

      {/* Radial Gradient Background (Matches reference but with orange) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ 
          background: 'radial-gradient(900px at 50% 0%, rgba(255, 107, 0, 0.1), transparent 70%)',
          transition: 'background 0.15s ease-out' 
        }} 
      />

      {/* Fixed Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link to="/leadership" className="flex items-center gap-2 text-white/70 hover:text-[#FF6B00] transition-colors font-anakotmai text-sm font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {lang === 'th' ? 'กลับหน้าผู้นำ' : 'Back to Leadership'}
        </Link>
      </div>

      <main className="w-full relative z-10 pt-32 lg:pt-40">
        
        {/* Typographic Team Name Header (Scaled down) */}
        <div className="container mx-auto px-6 mb-16 text-center">
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
          >
            {teamName}
          </h1>
          <div 
            className="h-1.5 bg-[#FF6B00] mx-auto mt-4 w-[80px] rounded-full"
          />
        </div>

        {/* Head of Team Section */}
        {headMember && (
          <section className="py-8 lg:py-10">
            <div className="container mx-auto px-6 xl:px-12">
              
              {/* Decorative Section Separator */}
              <div className="flex flex-wrap gap-4 items-center mb-10 lg:mb-12">
                <div className="flex-1 bg-[#FF6B00] h-1.5 rounded-full opacity-60"></div>
                <h2 className={`text-2xl lg:text-3xl font-bold text-white/95 text-center ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                  {lang === 'th' ? 'หัวหน้าทีม' : 'Head of Team'}
                </h2>
                <div className="flex-1 bg-[#FF6B00] h-1.5 rounded-full opacity-60"></div>
              </div>

              {/* Centered Head Card */}
              <div className="flex justify-center w-full">
                <div className="group flex flex-col w-full max-w-[370px] cursor-pointer text-center items-center">
                  
                  {/* Image Container */}
                  <div className="w-full aspect-[2/3] group-hover:scale-105 transition-all duration-500 ease-out relative overflow-hidden rounded-3xl mb-5 shadow-[0_0_30px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_80px_rgba(255,107,0,0.25)] bg-white/5">
                    <img 
                      alt={lang === 'th' ? headMember.nameTh : headMember.nameEn} 
                      className="w-full h-full object-cover object-top" 
                      src={headMember.img} 
                    />
                    
                    {/* Glass gradient overlay */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                      style={{
                        background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.15) 40%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0.15) 60%, transparent 80%)',
                        transform: 'translateX(-100%)'
                      }}
                    />
                    
                    {/* Shimmer line */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:animate-shimmer pointer-events-none" 
                      style={{
                        background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 80%)'
                      }}
                    />
                  </div>
                  
                  {/* Text Container */}
                  <div className="space-y-1.5 px-2">
                    <p className="text-sm lg:text-base font-anakotmai text-[#FF6B00] font-bold transition-colors duration-300">
                      {lang === 'th' ? headMember.roleTh : headMember.roleEn}
                    </p>
                    <h3 className={`text-2xl lg:text-[28px] font-bold text-white transition-colors duration-300 leading-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter tracking-tight'}`}>
                      {lang === 'th' ? headMember.nameTh : headMember.nameEn}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-[#FF6B00]">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </h3>
                  </div>

                </div>
              </div>

            </div>
          </section>
        )}

        {/* Regular Members Section */}
        {regularMembers.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-6 xl:px-12">
              
              {/* Decorative Section Separator */}
              <div className="flex flex-wrap gap-4 items-center mb-10 lg:mb-12">
                <div className="flex-1 bg-[#FF6B00] h-1.5 rounded-full opacity-60"></div>
                <h2 className={`text-2xl lg:text-3xl font-bold text-white/95 text-center ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                  {lang === 'th' ? 'สมาชิกในทีม' : 'Team Members'}
                </h2>
                <div className="flex-1 bg-[#FF6B00] h-1.5 rounded-full opacity-60"></div>
              </div>

              {/* Members Grid matching reference exactly */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-12 xl:gap-20 xl:gap-y-15">
                {regularMembers.map((member) => (
                  <div key={member.id}>
                    <div className="group flex flex-col w-full cursor-pointer">
                      
                      {/* Image Container */}
                      <div className="max-w-[375px] group-hover:scale-105 transition-all duration-500 ease-out relative overflow-hidden rounded-3xl mb-5 shadow-[0_0_30px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_80px_rgba(255,107,0,0.2)] w-full aspect-[2/3] bg-white/5">
                        <img 
                          alt={lang === 'th' ? member.nameTh : member.nameEn} 
                          className="w-full h-full object-cover object-top" 
                          src={member.img} 
                        />
                        
                        {/* Glass gradient overlay */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                          style={{
                            background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.15) 40%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0.15) 60%, transparent 80%)',
                            transform: 'translateX(-100%)'
                          }}
                        />
                        
                        {/* Shimmer line */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:animate-shimmer pointer-events-none" 
                          style={{
                            background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 80%)'
                          }}
                        />
                      </div>
                      
                      {/* Text Container */}
                      <div className="space-y-1.5 pl-1">
                        <p className="text-sm lg:text-base font-anakotmai text-[#FF6B00]/90 font-bold transition-colors duration-300 group-hover:text-[#FF6B00]">
                          {lang === 'th' ? member.roleTh : member.roleEn}
                        </p>
                        <h3 className={`text-2xl lg:text-[28px] font-bold text-white/90 transition-colors duration-300 group-hover:text-white leading-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter tracking-tight'}`}>
                          {lang === 'th' ? member.nameTh : member.nameEn}
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-[#FF6B00]">
                            <path d="m9 18 6-6-6-6"></path>
                          </svg>
                        </h3>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

      </main>
    </motion.div>
  );
}
