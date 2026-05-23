import { useRef } from 'react';
import { motion } from 'framer-motion';
import { candidateData } from '../../data/candidateData';
import { useIsMobile } from '../../hooks/use-mobile';

// --- Reusable Sub-components ---

function BioLabel({ children }) {
  return (
    <span className="text-[#FF6B00] text-[13px] xl:text-[15px] font-anakotmai font-bold tracking-wider block mb-1.5">
      {children}
    </span>
  );
}

function CandidateBio({ data, lang }) {
  return (
    <div className="space-y-6 lg:space-y-6">
      {data.nickname && (
        <div>
          <BioLabel>{lang === 'th' ? 'ชื่อเล่น' : 'Nickname'}</BioLabel>
          <span className="text-white font-anakotmai text-[16px] xl:text-[18px] font-bold">
            {data.nickname}
          </span>
        </div>
      )}
      {data.birthdate && (
        <div>
          <BioLabel>{lang === 'th' ? 'วันเกิด' : 'Birthdate'}</BioLabel>
          <span className="text-white/75 font-anakotmai text-[16px] xl:text-[18px]">
            {data.birthdate}
          </span>
        </div>
      )}
      {data.education?.length > 0 && (
        <div>
          <BioLabel>{lang === 'th' ? 'การศึกษา' : 'Education'}</BioLabel>
          <ul className="list-disc list-outside pl-5 space-y-1.5 lg:space-y-2 text-white/75 font-anakotmai text-[15px] xl:text-[17px]">
            {data.education.map((edu) => (
              <li key={edu} className="pl-1">{edu}</li>
            ))}
          </ul>
        </div>
      )}
      {data.workExperience?.length > 0 && (
        <div>
          <BioLabel>{lang === 'th' ? 'ประสบการณ์ทำงาน' : 'Work Experience'}</BioLabel>
          <ul className="list-disc list-outside pl-5 space-y-1.5 lg:space-y-2 text-white/75 font-anakotmai text-[15px] xl:text-[17px]">
            {data.workExperience.map((exp) => (
              <li key={exp} className="pl-1">{exp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CandidateTimeline({ timeline, isMobile }) {
  return (
    <div className={`relative ${isMobile ? 'flex flex-col ml-6 pl-6 py-2 pr-2' : 'ml-6 pl-8 mt-4 xl:mt-0'} space-y-10 h-fit`}>
      {timeline.map((entry, index) => (
        <div key={`${entry.year}-${entry.title}`} className="relative flex items-start justify-start group">
          {/* Vertical Line Segment connecting to next dot */}
          {index < timeline.length - 1 && (
            <div
              className="absolute w-[2px] bg-[#FF6B00]/20"
              style={{
                left: isMobile ? '-19px' : '-27px',
                top: isMobile ? '10px' : '12px',
                bottom: isMobile ? '-50px' : '-52px',
              }}
            />
          )}

          {/* Glowing Dot */}
          <div className={`absolute z-10 w-[12px] h-[12px] rounded-full bg-[#FF6B00] ring-4 ring-[#FF6B00]/30 shadow-[0_0_15px_rgba(255,107,0,0.6)] ${isMobile ? 'top-[4px] left-[-24px]' : 'top-[6px] left-[-32px] group-hover:ring-[#FF6B00]/50 transition-all duration-300'}`} />

          <div>
            <div className={`font-black text-[#FF6B00] font-anakotmai mb-3 ${isMobile ? 'text-xl leading-none' : 'text-xl xl:text-2xl'}`}>
              {entry.title} {entry.year}
            </div>
            {entry.bullets?.length > 0 && (
              <ul className="space-y-1.5">
                {entry.bullets.map((b) => (
                  <li key={b} className="text-white/40 text-[13px] xl:text-[14px] font-anakotmai leading-relaxed">
                    — {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main Component ---

export default function LeadershipSection({ lang = 'th' }) {
  const isMobile = useIsMobile();
  // Safe fallback to 'th' if language is missing or unsupported
  const data = candidateData[lang] || candidateData['th'];

  // Ultimate safety check
  if (!data) return null;

  if (isMobile) {
    return (
      <div className="relative w-full overflow-x-hidden bg-[#0B0F17] font-sans selection:bg-[#FF6B00] selection:text-white pb-32">
        {/* ─── MOBILE LAYOUT (Stacked Sticky Sections) ─── */}
        {/* Sticky Title Bar */}
        <div className="p-4 bg-[#0B0F17]/95 border-b border-white/5 py-5 w-full text-center sticky top-[80px] z-30 shadow-2xl backdrop-blur-md">
          <div className="text-[13px] text-[#FF6B00] font-anakotmai font-bold mb-1.5">
            {data.role}
          </div>
          <div className={`text-[28px] leading-[1.2] text-white font-black tracking-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
            {data.name}
          </div>
        </div>

        {/* Sticky Image Underlay */}
        <div className="sticky top-[150px] z-10 min-h-[65dvh] w-full bg-[#0B0F17] flex justify-center items-end overflow-hidden pt-8">
          <div className="absolute top-[-5%] left-[5%] text-[#FF6B00] z-0 font-inter font-black text-[35vh] opacity-60 leading-none pointer-events-none select-none">
            {candidateData.number}
          </div>
          {/* Giant Text Watermark */}
          <div className="absolute top-1/2 right-[-20%] opacity-[0.03] pointer-events-none select-none mix-blend-overlay rotate-90">
            <span className="font-anakotmai font-black text-[22vh] tracking-tighter uppercase whitespace-nowrap text-white">
              #TEAMCHEYHARN
            </span>
          </div>
          <img
            src={candidateData.img}
            alt={data.name}
            fetchpriority="high"
            className="h-[75vh] object-contain relative z-10 object-bottom"
          />
        </div>

        {/* Quote Block (Scrolling over image) */}
        <div className="relative z-20 bg-[#0B0F17] shadow-[0_-24px_40px_rgba(11,15,23,0.98)] pt-6 rounded-t-3xl">
          <div className="px-6 pb-8 text-center text-[14px] text-white/60 font-anakotmai border-b border-white/5">
            {data.quote}
          </div>
        </div>

        {/* Content Block (Scrolling over image) */}
        <div className="relative z-20 bg-[#0B0F17] pb-16">
          <div className="px-6 space-y-6">
            <div className="space-y-5 pt-6">
              <CandidateBio data={data} lang={lang} />
            </div>
            <div className="pt-10">
              <CandidateTimeline timeline={data.timeline} isMobile={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#0B0F17] font-sans selection:bg-[#FF6B00] selection:text-white pb-32">
      {/* ─── DESKTOP LAYOUT (Sticky left column) ─── */}
      <div className="flex w-full relative z-10 max-w-[1560px] mx-auto min-h-[100dvh]">
        {/* Left Column (Sticky image & number) */}
        <div className="w-[45%] xl:w-[40%] sticky top-0 h-[100dvh] max-h-[100dvh] flex items-end justify-center z-10 overflow-visible pl-4 xl:pl-8">
          <div className="relative h-[85%] w-full flex justify-center items-end">
            <img
              src={candidateData.img}
              alt={data.name}
              fetchpriority="high"
              className="z-10 relative h-full w-auto object-contain object-bottom"
            />
            <div className="absolute z-0 text-[35vh] xl:text-[40vh] bottom-[30%] left-[0%] text-[#FF6B00] opacity-80 font-inter font-black select-none pointer-events-none leading-none">
              {candidateData.number}
            </div>
          </div>
        </div>

        {/* Right Column (Scrolling Text) */}
        <div className="w-[55%] xl:w-[60%] flex flex-col justify-center py-32 pl-8 pr-12 xl:pl-16 xl:pr-24 z-20">
          
          {/* Header Info */}
          <div className="flex w-full flex-col items-start pb-10 border-b border-white/5">
            <h2 className="text-[20px] xl:text-[24px] text-[#FF6B00] font-anakotmai font-bold w-full mb-2">
              {data.role}
            </h2>
            <h1 className={`text-[52px] xl:text-[72px] text-white leading-[1.1] pb-6 font-black w-full tracking-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
              {data.name}
            </h1>
            <p className="text-[14px] xl:text-[16px] text-white/60 font-anakotmai w-full whitespace-pre-line leading-relaxed max-w-2xl">
              {data.quote}
            </p>
          </div>

          {/* Grid for Bio & Timeline */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 mt-12">
            <CandidateBio data={data} lang={lang} />
            <CandidateTimeline timeline={data.timeline} isMobile={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
