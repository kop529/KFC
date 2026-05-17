import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, BookOpen, PenTool, Megaphone, ShieldAlert, Award, 
  Smile, Landmark, Users, Home, Shield, BarChart3, Globe,
  Users2, ChevronRight
} from 'lucide-react';

const pillarsData = [
  {
    id: 'operations',
    th: { title: 'ปฏิบัติการและสถานที่' },
    en: { title: 'Operations & Logistics' },
    deptIds: ['av', 'facilities', 'environment', 'inspector']
  },
  {
    id: 'communications',
    th: { title: 'สื่อสารและเทคโนโลยี' },
    en: { title: 'Communications & Media' },
    deptIds: ['pr', 'graphics', 'web']
  },
  {
    id: 'policy',
    th: { title: 'นโยบายและวิชาการ' },
    en: { title: 'Policy & Research' },
    deptIds: ['policy', 'academic', 'evaluation']
  },
  {
    id: 'community',
    th: { title: 'กิจกรรมและสัมพันธ์ชุมชน' },
    en: { title: 'Community & Events' },
    deptIds: ['activities', 'reception', 'community']
  }
];

const departmentsData = [
  {
    id: 'av',
    th: { title: 'ฝ่ายโสต', desc: 'ผู้ดูแลระบบเสียง ช่างภาพ และงานวิดีโอมีเดียการประชุมของสภานักเรียน' },
    en: { title: 'Audio-Visual', desc: 'Managing sound systems, photography, event coverage, and school council media.' },
    icon: Volume2,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'ธนภัทร สมศรี', role: 'หัวหน้าฝ่ายโสต' },
        en: { name: 'Tanapat Somsri', role: 'Head of Audio-Visual' },
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ณัฐพล แก้วมา', role: 'ช่างภาพประจำสภา' },
        en: { name: 'Nattapon Kaewma', role: 'Lead Council Photographer' },
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ปิยบุตร ยอดเรือง', role: 'ผู้ควบคุมระบบเสียง' },
        en: { name: 'Piyabutr Yodruang', role: 'Technical Sound Controller' },
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'policy',
    th: { title: 'ฝ่ายนโยบาย', desc: 'วางแผน เสนอนโยบายสวัสดิการ และผลักดันโครงการพัฒนาคุณภาพชีวิตในโรงเรียน' },
    en: { title: 'Policy & Initiatives', desc: 'Planning and advocating policies for school welfare and quality of life.' },
    icon: BookOpen,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'ชญานิน วงศ์สุวรรณ', role: 'หัวหน้าฝ่ายนโยบาย' },
        en: { name: 'Chayanin Wongsuwan', role: 'Head of Policy Liaison' },
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'สิรวิชญ์ ประเสริฐ', role: 'ผู้ประสานงานสวัสดิการ' },
        en: { name: 'Sirawich Prasert', role: 'Student Welfare Liaison' },
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'พลอย ไพลิน', role: 'ผู้แทนวิชาการสภา' },
        en: { name: 'Ploy Pailin', role: 'Academic Policy Representative' },
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'graphics',
    th: { title: 'ฝ่ายกราฟิก', desc: 'ออกแบบสื่อประชาสัมพันธ์ โปสเตอร์ อัตลักษณ์ และวิชวลดีไซน์สตรีทอาร์ทของสภา' },
    en: { title: 'Graphics & Design', desc: 'Designing promotional materials, event posters, and visual brand identity.' },
    icon: PenTool,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'จิรายุ แสงแก้ว', role: 'หัวหน้าฝ่ายกราฟิก' },
        en: { name: 'Jirayu Sangkaew', role: 'Head of Graphic Design' },
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'นภัสสร ดีเลิศ', role: 'นักออกแบบสื่อสร้างสรรค์' },
        en: { name: 'Napatsorn Dee', role: 'Creative Visual Designer' },
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'กิตติศักดิ์ เรืองดี', role: 'ผู้ออกแบบอัตลักษณ์สื่อ' },
        en: { name: 'Kittisak Ruang', role: 'Visual Brand Creator' },
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'pr',
    th: { title: 'ฝ่ายประชาสัมพันธ์', desc: 'สื่อสารข้อมูล ข่าวสาร กิจกรรมต่าง ๆ ของสภานักเรียนส่งตรงถึงทุกคน' },
    en: { title: 'Public Relations', desc: 'Communicating updates, activities, and press releases to the student body.' },
    icon: Megaphone,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'อัญชลี ใจงาม', role: 'หัวหน้าฝ่ายประชาสัมพันธ์' },
        en: { name: 'Anchalee Jai', role: 'Head of Public Relations' },
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ธนากร มีสุข', role: 'โฆษกฝ่ายสื่อสารสภา' },
        en: { name: 'Thanakorn Mee', role: 'Council Press Spokesperson' },
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'วรัญญา สุขสม', role: 'ผู้สร้างสรรค์ดิจิทัลมีเดีย' },
        en: { name: 'Varanya Suk', role: 'Digital Content Specialist' },
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'inspector',
    th: { title: 'ฝ่ายสารวัตรนักเรียน', desc: 'ดูแลระเบียบวินัย ความปลอดภัย และอำนวยความสะดวกให้แก่นักเรียนทุกคน' },
    en: { title: 'Student Inspectors', desc: 'Ensuring discipline, student safety, and general order inside the school grounds.' },
    icon: ShieldAlert,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'ธีรภัทร์ อาจหาญ', role: 'หัวหน้าฝ่ายสารวัตร' },
        en: { name: 'Teerapat Bold', role: 'Head Student Inspector' },
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ภาณุวัฒน์ คุ้มครอง', role: 'ผู้ช่วยดูแลความปลอดภัย' },
        en: { name: 'Phanuwat Guard', role: 'Safety Coordinator' },
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ณัฐณิชา ปลอดภัย', role: 'ผู้ดูแลความเป็นระเบียบ' },
        en: { name: 'Natnicha Safe', role: 'Disciplinary Officer' },
        avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'activities',
    th: { title: 'ฝ่ายกิจกรรม', desc: 'สร้างสรรค์ ออกแบบ และควบคุมกิจกรรมรื่นเริง งานเทศกาล และนิทรรศการสภา' },
    en: { title: 'Activities & Events', desc: 'Designing and coordinating school activities, festivals, and exhibitions.' },
    icon: Award,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'สราวุฒิ มุ่งมั่น', role: 'หัวหน้าฝ่ายกิจกรรม' },
        en: { name: 'Sarawut Active', role: 'Head of Activities' },
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ชลิดา รื่นเริง', role: 'ผู้จัดการฝ่ายการจัดกิจกรรม' },
        en: { name: 'Chalida Event', role: 'Event Production Lead' },
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'โสภณ แสงทอง', role: 'ผู้ดูแลเวทีและโลจิสติกส์' },
        en: { name: 'Sopon Stage', role: 'Stage Operations Lead' },
        avatar: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'reception',
    th: { title: 'ฝ่ายปฏิคมและพิธีกร', desc: 'ต้อนรับผู้มาเยือน ดำเนินรายการ ดำเนินพิธีการอย่างเป็นทางการของสภา' },
    en: { title: 'Reception & MCs', desc: 'Welcoming guests, hosting operations, and lead masters of ceremonies.' },
    icon: Smile,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'พิมพ์รดา เจ้าบ้าน', role: 'หัวหน้าฝ่ายปฏิคม' },
        en: { name: 'Pimrada Host', role: 'Head of Reception' },
        avatar: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'พชร เสียงใส', role: 'พิธีกรดำเนินรายการประจำสภา' },
        en: { name: 'Pachara Voice', role: 'Lead Master of Ceremonies' },
        avatar: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'กรกนก ยิ้มแย้ม', role: 'ผู้ต้อนรับและประสานงานสภา' },
        en: { name: 'Kornkanok Smile', role: 'Event Host & Guest Liaison' },
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'academic',
    th: { title: 'ฝ่ายวิชาการ', desc: 'ส่งเสริมการเรียนรู้ จัดเตรียมเนื้อหา ข้อมูลสถิติ และการวิจัยวิเคราะห์ของสภา' },
    en: { title: 'Academic Research', desc: 'Promoting education, research planning, and statistical data management.' },
    icon: Landmark,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'วุฒิชัย อัจฉริยะ', role: 'หัวหน้าฝ่ายวิชาการ' },
        en: { name: 'Wuttichai Genius', role: 'Head of Academics' },
        avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'กรวีร์ ตั้งใจเรียน', role: 'ผู้ประสานการวิเคราะห์สถิติ' },
        en: { name: 'Kornrawee Study', role: 'Academic Program Liaison' },
        avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ธนกฤต แหล่งเรียนรู้', role: 'ผู้จัดเตรียมฐานข้อมูลสภา' },
        en: { name: 'Thanakrit Resource', role: 'Research & Data Coordinator' },
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6b7a09d6a1?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'community',
    th: { title: 'ฝ่ายสัมพันธ์ชุมชน', desc: 'เชื่อมความสัมพันธ์ระหว่างสภา เครือข่ายนักเรียนภายนอก และชุมชนรอบข้าง' },
    en: { title: 'Community Outreach', desc: 'Connecting the council with alumni networks, local community, and schools.' },
    icon: Users,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'รัฐภูมิ เชื่อมโยง', role: 'หัวหน้าฝ่ายสัมพันธ์ชุมชน' },
        en: { name: 'Rattapoom Bridge', role: 'Head of Outreach' },
        avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ปรีติ ใส่ใจ', role: 'ผู้ประสานสัมพันธ์ภายนอก' },
        en: { name: 'Preeti Care', role: 'Social & Network Liaison' },
        avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'เมธี ร่วมใจ', role: 'หัวหน้าฝ่ายอาสาสมัคร' },
        en: { name: 'Methee Volunteer', role: 'Volunteer Network Director' },
        avatar: 'https://images.unsplash.com/photo-1517702142487-027308e94efb?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'facilities',
    th: { title: 'ฝ่ายอาคารและสถานที่', desc: 'ดูแลจัดสถานที่ อำนวยความสะดวกการประชุม จัดอุปกรณ์ห้องสภาและของหลวง' },
    en: { title: 'Buildings & Grounds', desc: 'Managing council room facilities, grounds coordination, and logistics.' },
    icon: Home,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'ณพล จัดการ', role: 'หัวหน้าฝ่ายอาคารสถานที่' },
        en: { name: 'Napon Space', role: 'Head of Facilities' },
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'สมชาย รักดิน', role: 'ผู้ดูแลสถานที่สภาสโมสร' },
        en: { name: 'Somchai Ground', role: 'Facilities Coordinator' },
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'อารยา ขนส่ง', role: 'ผู้จัดเตรียมอุปกรณ์การประชุม' },
        en: { name: 'Araya Logistic', role: 'Logistics Operations Lead' },
        avatar: 'https://images.unsplash.com/photo-1498551172505-8ee7ad69f214?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'environment',
    th: { title: 'ฝ่ายสิ่งแวดล้อม', desc: 'รณรงค์แคมเปญสีเขียว จัดการขยะ และลดคาร์บอนฟุตพริ้นท์ในสโมสรโรงเรียน' },
    en: { title: 'Environment', desc: 'Driving green campus initiatives, recycling efforts, and reducing carbon waste.' },
    icon: Shield,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'พิมพ์ชนก รักษ์โลก', role: 'หัวหน้าฝ่ายสิ่งแวดล้อม' },
        en: { name: 'Pimchanok Eco', role: 'Head of Environment' },
        avatar: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'วีรชัย สีเขียว', role: 'ผู้ดูแลโครงการพัฒนาสีเขียว' },
        en: { name: 'Weerachai Green', role: 'Green Campus Coordinator' },
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ตรีเทพ คาร์บอน', role: 'ผู้ดูแลการคัดแยกขยะสภา' },
        en: { name: 'Treethep Waste', role: 'Waste Management Director' },
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'evaluation',
    th: { title: 'ฝ่ายวัดและประเมินผล', desc: 'วิเคราะห์ผลสำเร็จการทำงานของสภา ตรวจสอบประเมินประสิทธิผลโครงการสภา' },
    en: { title: 'Metrics & Evaluation', desc: 'Analyzing council workflow progress, feedback surveys, and performance.' },
    icon: BarChart3,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'กฤตเมธ ตรวจสอบ', role: 'หัวหน้าฝ่ายวัดประเมินผล' },
        en: { name: 'Krittamet Stat', role: 'Head of Metrics & Evaluation' },
        avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'นิภาดา ข้อมูล', role: 'ผู้ออกแบบการสำรวจประเมินผล' },
        en: { name: 'Nipada Survey', role: 'Survey Analyst & Data Designer' },
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ภาณุพงศ์ ตรวจการ', role: 'ผู้ตรวจสอบประสิทธิภาพการทำงาน' },
        en: { name: 'Panupong Audit', role: 'Council Auditor Representative' },
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&q=80&fit=crop'
      }
    ]
  },
  {
    id: 'web',
    th: { title: 'ผู้จัดทำเว็บไซต์', desc: 'กลุ่มสภานักเรียนฝ่ายเทคนิค ผู้ดูแลการออกแบบและพัฒนาเว็บไซต์สโมสรทั้งหมด' },
    en: { title: 'Website Developers', desc: 'Technical team designing and programming the official school council website.' },
    icon: Globe,
    color: '#FF6B00',
    members: [
      {
        th: { name: 'ศุภกร ค่าน้ำ', role: 'หัวหน้าผู้พัฒนาเว็บไซต์' },
        en: { name: 'Supakorn Code', role: 'Lead Full-Stack Web Developer' },
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'ภาณุวัฒน์ ดีไซน์', role: 'ผู้ออกแบบส่วนหน้าเชิงสร้างสรรค์' },
        en: { name: 'Phanuwat UI', role: 'Lead UI/UX Front-End Designer' },
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&q=80&fit=crop'
      },
      {
        th: { name: 'รดา เครือข่าย', role: 'วิศวกรระบบและโครงสร้างสโมสร' },
        en: { name: 'Rada System', role: 'Systems & Cloud Engineer' },
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&q=80&fit=crop'
      }
    ]
  }
];

export default function MembersSection({ lang }) {
  const [activePillar, setActivePillar] = useState('operations');
  const [activeDept, setActiveDept] = useState(null);
  const containerRef = useRef(null);

  const toggleDept = (deptId) => {
    if (activeDept === deptId) {
      setActiveDept(null);
    } else {
      setActiveDept(deptId);
      setTimeout(() => {
        const showcaseElement = document.getElementById('department-showcase');
        if (showcaseElement) {
          showcaseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const selectedPillar = pillarsData.find(p => p.id === activePillar);
  const filteredDepts = departmentsData.filter(d => selectedPillar.deptIds.includes(d.id));
  const selectedDept = departmentsData.find(d => d.id === activeDept);

  return (
    <section className="bg-[#F9FAFB] text-[#111827] py-24 lg:py-40 border-t border-[#111827]/05 relative overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px bg-[#FF6B00]" />
          <span className="text-[10px] tracking-[0.3em] text-[#111827]/40 font-inter uppercase font-bold">
            {lang === 'th' ? '005 / ฝ่ายปฏิบัติการและสมาชิกสภา' : '005 / Departments & Officers'}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-7">
            <h2 className={`font-inter font-black text-5xl lg:text-7xl text-[#111827] leading-none tracking-tighter ${lang === 'th' ? 'font-anakotmai' : ''}`}>
              {lang === 'th' ? 'คณะทำงานสภา' : 'The Council Body'}
            </h2>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p className={`text-[#111827]/50 text-xl leading-relaxed ${lang === 'th' ? 'font-anakotmai font-light' : 'font-inter font-light'}`}>
              {lang === 'th' 
                ? 'โครงสร้างการทำงานที่แบ่งแยกตามความเชี่ยวชาญ เพื่อการขับเคลื่อนโรงเรียนอย่างมีประสิทธิภาพ' 
                : 'A structured approach to school governance, divided into specialized operational pillars.'}
            </p>
          </div>
        </div>

        {/* Pillar Navigation - Swiss Modern Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 pb-4 border-b border-[#111827]/05">
          {pillarsData.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => {
                setActivePillar(pillar.id);
                setActiveDept(null);
              }}
              className={`px-6 py-3 text-xs tracking-[0.15em] uppercase font-bold transition-all duration-300 relative group ${
                activePillar === pillar.id 
                  ? 'text-[#FF6B00]' 
                  : 'text-[#111827]/40 hover:text-[#111827]'
              } ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
            >
              {lang === 'th' ? pillar.th.title : pillar.en.title}
              {activePillar === pillar.id && (
                <motion.div 
                  layoutId="activePillar"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Department Grid for Active Pillar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredDepts.map((dept) => {
              const Icon = dept.icon;
              const isActive = activeDept === dept.id;

              return (
                <motion.div
                  key={dept.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => toggleDept(dept.id)}
                  whileHover={{ y: -4 }}
                  className={`group relative p-6 cursor-pointer border transition-all duration-500 rounded-sm flex flex-col justify-between min-h-[160px]
                    ${isActive 
                      ? 'bg-white border-[#FF6B00] shadow-[0_20px_40px_rgba(0,0,0,0.04)]' 
                      : 'bg-white border-[#111827]/05 hover:border-[#111827]/20 hover:shadow-lg'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-sm transition-colors duration-300 ${isActive ? 'bg-[#FF6B00] text-white' : 'bg-[#111827]/05 text-[#111827]/40 group-hover:bg-[#111827]/10 group-hover:text-[#111827]'}`}>
                      <Icon size={20} />
                    </div>
                    <ChevronRight size={16} className={`transition-transform duration-500 ${isActive ? 'rotate-90 text-[#FF6B00]' : 'text-[#111827]/10 group-hover:text-[#111827]/30'}`} />
                  </div>

                  <div>
                    <h3 className={`font-bold text-lg leading-tight mb-1 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                      {lang === 'th' ? dept.th.title : dept.en.title}
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-[#111827]/30 font-mono font-bold">
                      {dept.id}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Dynamic Expanded Showcase Panel - Swiss Minimalist Style */}
        <AnimatePresence mode="wait">
          {activeDept && selectedDept && (
            <motion.div
              id="department-showcase"
              key={activeDept}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-[#111827]/05 rounded-sm p-8 lg:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.06)] relative overflow-hidden"
            >
              {/* Vertical accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00]" />

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Left: Dept Info */}
                <div className="lg:w-1/3">
                  <span className="inline-block px-3 py-1 bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] tracking-widest font-mono font-bold uppercase mb-6 rounded-sm">
                    {selectedDept.id}
                  </span>
                  <h3 className={`font-inter font-black text-4xl text-[#111827] mb-6 leading-none tracking-tight ${lang === 'th' ? 'font-anakotmai' : ''}`}>
                    {lang === 'th' ? selectedDept.th.title : selectedDept.en.title}
                  </h3>
                  <p className={`text-[#111827]/50 text-lg leading-relaxed mb-8 ${lang === 'th' ? 'font-anakotmai' : 'font-inter font-light'}`}>
                    {lang === 'th' ? selectedDept.th.desc : selectedDept.en.desc}
                  </p>
                  
                  <div className="flex items-center gap-3 py-4 border-t border-b border-[#111827]/05">
                    <Users2 size={18} className="text-[#FF6B00]" />
                    <span className="text-sm font-bold text-[#111827] tracking-wide font-inter">
                      {selectedDept.members.length} {lang === 'th' ? 'คนในคณะทำงาน' : 'Core Members'}
                    </span>
                  </div>
                </div>

                {/* Right: Members Stack */}
                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {selectedDept.members.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-6 group"
                    >
                      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img 
                          src={member.avatar} 
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className={`font-bold text-lg text-[#111827] mb-1 group-hover:text-[#FF6B00] transition-colors duration-300 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                          {lang === 'th' ? member.th.name : member.en.name}
                        </h4>
                        <p className={`text-[10px] text-[#111827]/40 font-black tracking-[0.2em] uppercase ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                          {lang === 'th' ? member.th.role : member.en.role}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
