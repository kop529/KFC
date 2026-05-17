import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const candidates = [
  {
    number: "01",
    role: "หัวหน้าพรรคประชาชน",
    name: "ณัฐพงษ์\nเรืองปัญญาวุฒิ",
    quote: "“ ไทยไม่เทา ไทยเท่ากัน ไทยทันโลก คือ อนาคตที่พรรคประชาชนอยากเห็น ”",
    nickname: "เท้ง",
    birthdate: "18 พฤษภาคม พ.ศ. 2530 (38 ปี)",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80&auto=format&fit=crop&crop=face",
    education: [
      "วิศวกรรมศาสตรบัณฑิต (สาขาวิชาวิศวกรรมคอมพิวเตอร์)",
      "จุฬาลงกรณ์มหาวิทยาลัย"
    ],
    experience: [
      {
        year: "2567",
        title: "หัวหน้าพรรคประชาชน และผู้นำฝ่ายค้านในสภาผู้แทนราษฎร",
        bullets: [
          "กรรมาธิการศึกษาการจัดทำและติดตามการบริหารงบประมาณ",
          "ประธานคณะกรรมาธิการวิสามัญพิจารณาร่าง พรบ. งบประมาณ",
          "ตัวแทนประเทศไทย ใน IPU"
        ]
      },
      {
        year: "2563",
        title: "สส. บัญชีรายชื่อ และรองเลขาธิการพรรคก้าวไกล",
        bullets: ["ร่วมก่อตั้งกลุ่ม 'ก้าว Geek' คณะทำงานด้านดิจิทัล"]
      }
    ]
  }
];

function CandidateSequence({ candidate, lang }) {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Smoother, fluid transforms
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.3], [40, 0]);

  return (
    <section 
      ref={targetRef} 
      className="relative min-h-screen w-full flex items-center justify-center py-40 overflow-hidden"
    >
      <motion.div 
        style={{ opacity, scale, y }}
        className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 lg:gap-24 items-center"
      >
        {/* Visual Column */}
        <div className="lg:col-span-5 relative group">
           <div className="absolute -inset-4 bg-orange-500/05 border border-orange-500/10 -z-10 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
           <div className="relative aspect-[3/4] overflow-hidden grayscale contrast-125 brightness-90 border border-white/05 shadow-2xl">
              <img src={candidate.img} alt={candidate.name} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-60" />
           </div>
           
           <div className="absolute -bottom-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <span className="text-[12vw] font-black text-white/05 leading-none">{candidate.number}</span>
           </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-7">
           <div className="mb-12">
              <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black tracking-[0.4em] uppercase mb-6 rounded-sm border border-orange-500/20">
                Candidate Profile
              </span>
              <h2 className={`text-5xl lg:text-[7rem] font-black text-white leading-[0.85] tracking-tighter mb-10 ${lang === 'th' ? 'font-anakotmai' : 'font-inter uppercase'}`}>
                {candidate.name}
              </h2>
              <blockquote className="text-white/40 text-xl lg:text-3xl font-light italic leading-relaxed font-anakotmai max-w-2xl border-l-2 border-orange-500/30 pl-8 py-2">
                {candidate.quote}
              </blockquote>
           </div>

           {/* Detail Grid */}
           <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/05">
              <div className="space-y-10">
                 <div>
                    <span className="text-white/20 text-[10px] font-black tracking-[0.3em] uppercase block mb-4 font-anakotmai">Biography</span>
                    <div className="space-y-4">
                       <div>
                          <span className="text-white/10 text-[9px] uppercase font-bold block mb-1">Nickname</span>
                          <span className="text-white text-xl font-bold font-anakotmai">{candidate.nickname}</span>
                       </div>
                       <div>
                          <span className="text-white/10 text-[9px] uppercase font-bold block mb-1">Birthdate</span>
                          <span className="text-white text-xl font-bold font-anakotmai">{candidate.birthdate}</span>
                       </div>
                    </div>
                 </div>
                 <div>
                    <span className="text-white/20 text-[10px] font-black tracking-[0.3em] uppercase block mb-4 font-anakotmai">Education</span>
                    <ul className="space-y-3">
                       {candidate.education.map((edu, i) => (
                         <li key={i} className="text-white/60 text-sm font-medium leading-tight font-anakotmai">
                           {edu}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>

              <div>
                 <span className="text-white/20 text-[10px] font-black tracking-[0.3em] uppercase block mb-6 font-anakotmai">Track Record</span>
                 <div className="space-y-8">
                    {candidate.experience.map((exp, i) => (
                      <div key={i} className="relative">
                         <div className="flex items-center gap-4 mb-3">
                            <span className="text-orange-500 font-inter text-xs font-black">{exp.year}</span>
                            <h5 className="text-white font-bold text-base font-anakotmai">{exp.title}</h5>
                         </div>
                         <ul className="space-y-1.5 pl-4 border-l border-white/05">
                            {exp.bullets.map((b, bi) => (
                              <li key={bi} className="text-white/30 text-xs leading-relaxed font-anakotmai font-light">
                                {b}
                              </li>
                            ))}
                         </ul>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function LeadershipSection({ lang }) {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="relative w-full bg-[#0B0F17]">
      {/* Intro Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center bg-[#0B0F17] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6"
        >
          <div className="inline-block px-4 py-1.5 border border-orange-500/20 mb-10 rounded-sm">
            <span className="text-orange-500 text-[10px] font-black tracking-[0.5em] uppercase font-inter">
              Core Candidates
            </span>
          </div>
          <h1 className="text-white text-6xl lg:text-[10rem] font-black tracking-tighter leading-none font-anakotmai mb-10 uppercase">
             {lang === 'th' ? 'ผู้สมัครรับเลือกตั้ง' : 'The Candidates'}
          </h1>
          <div className="flex items-center justify-center gap-8">
             <div className="h-px w-16 bg-white/10" />
             <p className="text-white/40 text-sm lg:text-xl font-medium tracking-[0.4em] font-anakotmai uppercase">
                {lang === 'th' ? 'เพื่อประชาชน — โดยประชาชน' : 'For the people — By the people'}
             </p>
             <div className="h-px w-16 bg-white/10" />
          </div>
        </motion.div>

        {/* Cinematic Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
           <span className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em]">Scroll Down</span>
           <div className="w-px h-24 bg-gradient-to-b from-orange-500 to-transparent opacity-40" />
        </div>
      </section>

      {/* Candidate Sequential Flow */}
      <div className="relative">
        {candidates.map((candidate, idx) => (
          <CandidateSequence key={idx} candidate={candidate} lang={lang} />
        ))}
      </div>
    </div>
  );
}
