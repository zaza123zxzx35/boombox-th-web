import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { createLineOrderMessage, createLineOrderUrl, LINE_ADD_FRIEND_URL } from "@shared/line";

const ASSET = {
  heroVideoOne: "/assets/videos/811862701.667680_4d02ec38.mp4",
  heroVideoTwo: "/assets/videos/811859488.297621_e15f7021.mp4",
  heroVideoThree: "/assets/videos/811854541.494061_facc51e4.mp4",
  boomboxStory: "/assets/images/section-02-2_904d7755.png",
  resultReviewOne: "/assets/images/review-results-1_a6ca9f21.jpg",
  resultReviewTwo: "/assets/images/review-results-2_0ba43d4a.jpg",
  resultReviewThree: "/assets/images/review-results-3_b67858b3.jpg",
};
const HERO_POSTERS = [
  "/assets/images/hero-one_3d02f3af.jpg",
  "/assets/images/hero-two_bd881a71.jpg",
  "/assets/images/hero-three_6af86c61.jpg",
];

function HeroVideoCard({ src, index, poster }: { src: string; index: number; poster?: string }) {
  const [shouldLoad, setShouldLoad] = useState(index === 0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad || index === 0 || !cardRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "240px" });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index, shouldLoad]);

  return (
    <div className="hero-video-card" ref={cardRef}>
      <video autoPlay={shouldLoad} loop muted playsInline preload={shouldLoad ? "metadata" : "none"} poster={poster} aria-label={`วิดีโอ BOOMBOX TH ${index + 1}`}>
        {shouldLoad && <source src={src} type="video/mp4" />}
      </video>
      {!shouldLoad && <span className="hero-video-lazy-label">เลื่อนเพื่อดูคลิป</span>}
    </div>
  );
}

const results = [
  {
    amount: "40 กลิ่น",
    period: "ให้เลือก",
    channel: "ผลไม้ มิ้นท์ ขนม ดอกไม้ และเครื่องดื่ม",
    mediaKey: "resultReviewOne",
    image: ASSET.resultReviewOne,
  },
  {
    amount: "3 วินาที",
    period: "พร้อมใช้งาน",
    channel: "ใส่ กด และใช้งานตามวิธีที่แนะนำ",
    mediaKey: "resultReviewTwo",
    image: ASSET.resultReviewTwo,
  },
  {
    amount: "จ่ายปลายทาง",
    period: "ไม่ต้องโอนก่อน",
    channel: "สอบถามรายละเอียดและให้ทีมงานช่วยเลือกแพ็กเกจได้ทาง LINE",
    mediaKey: "resultReviewThree",
    image: ASSET.resultReviewThree,
  },
];

const customerReviews = [
  ["Phongsakorn", "จัดส่งไวมากครับ ได้รับของแล้ว ของตรงปก งานสวย ใช้งานง่าย ประทับใจครับ"],
  ["Nattapong", "แพ็กของมาดีมาก ไม่มีเสียหาย ทดลองใช้แล้วโอเคเลยครับ คุ้มราคามาก"],
  ["Mintticha", "สีสวยกว่าที่คิดไว้ค่ะ ขนาดพกง่าย ใช้สะดวก ร้านตอบแชตเร็วมาก"],
  ["Kritsada", "สั่งเมื่อวาน วันนี้ได้รับแล้วครับ ส่งเร็วจริง สินค้าดูแข็งแรงและตรงตามรูป"],
  ["Ploypailin", "ชอบมากค่ะ ดีไซน์สวย พกใส่กระเป๋าได้ไม่เกะกะ ใช้งานง่ายกว่าที่คิด"],
  ["Thanawat", "ได้ของครบตามที่สั่งครับ แพ็กเกจเรียบร้อย ตัวเครื่องดูดี ใช้งานไม่มีปัญหา"],
  ["Aomam", "ร้านบริการดีมากค่ะ มีแนะนำวิธีใช้ให้ด้วย ได้รับของเร็วและสินค้าสวยตรงปก"],
  ["Worawut", "ลองแล้วใช้งานง่ายครับ วัสดุดูดี ไม่ก๊องแก๊ง ราคาโอเคเมื่อเทียบกับคุณภาพ"],
  ["Fahsai", "สีจริงสวยมากค่ะ ถ่ายรูปขึ้นสุดๆ ทางร้านจัดส่งไว แพ็กมาน่ารักมาก"],
  ["Sittichai", "สั่งเป็นของขวัญให้เพื่อน เพื่อนชอบมากครับ ทางร้านส่งตรงเวลาและแพ็กดีมาก"],
  ["Benz", "ได้รับสินค้าแล้วครับ ตรงตามรายละเอียดทุกอย่าง ใช้เวลาไม่นานก็เข้าใจวิธีใช้"],
  ["Rungnapa", "ประทับใจการบริการค่ะ ตอบคำถามละเอียด ส่งของเร็ว และสินค้าดูพรีเมียมมาก"],
  ["Chayut", "งานจริงสวยกว่าในรูปครับ ขนาดกำลังดี พกไปไหนก็สะดวก น่าจะได้ใช้อีกยาวๆ"],
  ["Namwan", "ได้รับของเรียบร้อยค่ะ ไม่มีรอยหรือความเสียหาย ลองใช้แล้วรู้สึกว่าคุ้มมาก"],
  ["Peerapat", "โดยรวมดีมากครับ ส่งไว ของตรงปก งานเรียบร้อย ร้านดูแลดี ไว้จะกลับมาอุดหนุนอีก"],
].map(([name, text]) => ({ name, text }));
const customerProofImages = Array.from({ length: 8 }, (_, index) => `/assets/images/customer-proof-${String(index + 1).padStart(2, "0")}.jpg`);

const painPoints = [
  { icon: "◌", title: "เบื่อกลิ่นเดิม ๆ", text: "อยากมีตัวเลือกใหม่ โดยไม่ต้องซื้อหลายแบบมาลอง" },
  { icon: "✦", title: "อยากเลือกกลิ่นเอง", text: "ชอบผลไม้ มิ้นท์ ขนม หรือดอกไม้ ก็เลือกได้ตามสไตล์" },
  { icon: "↗", title: "ไม่อยากเสี่ยงโอนก่อน", text: "คุยกับทีมงานก่อน และเลือกเก็บเงินปลายทางได้" },
];

const modelSteps = [
  ["B", "Better Taste", "40 กลิ่นให้เลือก ทั้งผลไม้ มิ้นท์ ขนม และดอกไม้"],
  ["O", "One Press", "ใช้แค่ 3 วินาที ใส่เม็ด กด แล้วเสร็จ"],
  ["O", "On-the-go", "ขนาดกะทัดรัด พกง่าย และเปลี่ยนกลิ่นได้ตามสไตล์"],
];

const faqItems = [
  ["แพ็กเกจไหนเหมาะกับฉัน?", "ถ้าอยากลองก่อน เริ่มจากแพ็กเกจ A ได้เลย ส่วนแพ็กเกจ B เป็นตัวเลือกคุ้มค่าที่มีเม็ดมากขึ้น และแพ็กเกจ C-D เหมาะกับคนที่อยากมีเม็ดสำรองและเลือกกลิ่นได้หลากหลาย"],
  ["ใช้งานยากไหม?", "ใช้งานง่าย แค่ใส่เม็ดกลิ่นลงในเครื่อง กด และรอประมาณ 3 วินาที ก็พร้อมใช้งาน"],
  ["เลือกกลิ่นได้อย่างไร?", "เลือกจากกลิ่นฮิตบนหน้าเว็บ หรือทัก LINE เพื่อให้ทีมงานช่วยแนะนำกลิ่นตามสไตล์ที่ชอบได้ฟรี"],
  ["สั่งซื้อและชำระเงินอย่างไร?", "กดปุ่มสั่งแพ็กเกจที่ต้องการ ระบบจะพาไป LINE @425syacj พร้อมคัดลอกข้อความแพ็กเกจไว้ให้วางส่งกับทีมงานได้ทันที"],
  ["Set A ส่งอย่างไรและจ่ายเงินแบบไหน?", "Set A ส่งฟรี และเก็บเงินปลายทางได้ ไม่ต้องโอนก่อน หากต้องการทราบเงื่อนไขของ Set อื่น ทักทีมงานทาง LINE ได้เลย"],
];

const sampleScents = [
  ["สตรอว์เบอร์รี", "ผลไม้"], ["องุ่น", "ผลไม้"], ["แอปเปิล", "ผลไม้"], ["แตงโม", "ผลไม้"], ["พีช", "ผลไม้"],
  ["มะม่วง", "ผลไม้"], ["ลิ้นจี่", "ผลไม้"], ["บลูเบอร์รี", "ผลไม้"], ["เชอร์รี", "ผลไม้"], ["สับปะรด", "ผลไม้"],
  ["เลมอน", "ผลไม้"], ["ส้ม", "ผลไม้"], ["มะพร้าว", "ผลไม้"], ["กล้วย", "ผลไม้"], ["กีวี", "ผลไม้"],
  ["มิ้นท์เย็น", "มิ้นท์"], ["สเปียร์มิ้นท์", "มิ้นท์"], ["เปปเปอร์มิ้นท์", "มิ้นท์"], ["เมนทอล", "มิ้นท์"], ["มิ้นท์เลมอน", "มิ้นท์"],
  ["มิ้นท์องุ่น", "มิ้นท์"], ["มิ้นท์แตงโม", "มิ้นท์"], ["มิ้นท์สตรอว์เบอร์รี", "มิ้นท์"], ["ลูกอมเม็ดกลม", "ขนม"], ["หมากฝรั่ง", "ขนม"],
  ["โคล่า", "ขนม"], ["คาราเมล", "ขนม"], ["วานิลลา", "ขนม"], ["ช็อกโกแลต", "ขนม"], ["คอตตอนแคนดี้", "ขนม"],
  ["กุหลาบ", "ดอกไม้"], ["ลาเวนเดอร์", "ดอกไม้"], ["มะลิ", "ดอกไม้"], ["ซากุระ", "ดอกไม้"], ["ดอกไม้รวม", "ดอกไม้"],
  ["กาแฟ", "เครื่องดื่ม"], ["ชาเขียว", "เครื่องดื่ม"], ["ชาไทย", "เครื่องดื่ม"], ["โซดา", "เครื่องดื่ม"], ["เบอร์รีรวม", "ผลไม้"],
].map(([name, category], index) => ({ id: index, name, category, sortOrder: index + 1 }));

const popularScentImages: Record<string, string> = {
  "สตรอว์เบอร์รี": "/assets/images/strawberry_9cd0b7b9.jpg",
  "องุ่น": "/assets/images/grape_f4df2683.jpg",
  "แตงโม": "/assets/images/watermelon_10283877.jpg",
  "เลมอน": "/assets/images/lemon_9c09f5a2.jpg",
  "มะลิ": "/assets/images/jasmine_df2c2bbb.jpg",
  "ส้ม": "/assets/images/orange_dec90763.jpg",
  "เชอร์รี": "/assets/images/cherry_39551912.jpg",
  "โคล่า": "/assets/images/cola_f1da6976.jpg",
};

function localAssetUrl(url: string | null | undefined) {
  if (!url) return url ?? null;
  const name = url.split("/").pop() ?? "";
  if (!name || !url.startsWith("/")) return url;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const folder = ["mp4", "webm", "mov"].includes(ext) ? "videos" : "images";
  return `assets/${folder}/${name}`;
}

const popularScentMediaKeys: Record<string, string> = {
  "สตรอว์เบอร์รี": "scent_strawberry",
  "องุ่น": "scent_grape",
  "แตงโม": "scent_watermelon",
  "เลมอน": "scent_lemon",
  "มะลิ": "scent_jasmine",
  "ส้ม": "scent_orange",
  "เชอร์รี": "scent_cherry",
  "โคล่า": "scent_cola",
};

const localPackageImages: Record<string, string> = {
  A: "/assets/images/set-a.jpg",
  B: "/assets/images/set-b.jpg",
  C: "/assets/images/set-c.jpg",
  D: "/assets/images/set-d.jpg",
};

const packages = [
  { code: "A", name: "เริ่มต้น", oldPrice: "599", price: "299", device: "เครื่อง 1 เครื่อง · เลือกสีดำ/ขาว", extras: "เม็ดรวม 100 เม็ด · 40 กลิ่น", scent: "สุ่มกลิ่นรวม", featured: true },
  { code: "B", name: "คุ้มค่า", oldPrice: "699", price: "389", device: "เครื่อง", extras: "+200 เม็ด", scent: "เลือกกลิ่น", featured: true },
  { code: "C", name: "จัดเต็ม", oldPrice: "899", price: "499", device: "เครื่อง", extras: "+400 เม็ด", scent: "เลือกกลิ่น" },
  { code: "D", name: "VIP", oldPrice: "1,099", price: "649", device: "เครื่องพร้อมไฟแช็ก 3 เครื่อง", extras: "+600 เม็ด", scent: "เลือกได้ 6 กล่อง" },
];

const packageDetails = {
  A: { boxes: 1, beads: 100, colors: ["สีดำ", "สีขาว"], selectableColor: true, selectableScent: false, note: "เม็ดรวม 40 กลิ่น สุ่มกลิ่น เลือกกลิ่นไม่ได้" },
  B: { boxes: 2, beads: 200, colors: ["สีดำ", "สีขาว"], selectableColor: true, selectableScent: true, note: "เลือกกลิ่นได้ 2 กล่อง และเลือกกลิ่นซ้ำได้" },
  C: { boxes: 4, beads: 400, colors: ["สีดำ", "สีขาว"], selectableColor: true, selectableScent: true, note: "เลือกกลิ่นได้ 4 กล่อง และเลือกกลิ่นซ้ำได้" },
  D: { boxes: 6, beads: 600, colors: ["สีเงิน", "สีฟ้า", "สีดำ"], selectableColor: false, selectableScent: true, note: "เครื่องพร้อมไฟแช็กในตัว 3 เครื่อง: สีเงิน + สีฟ้า + สีดำ" },
} as const;

const deviceImageFallbacks: Record<string, string | null> = {
  "สีดำ": "/assets/images/device-black.jpg",
  "สีขาว": "/assets/images/device-white.jpg",
  "สีเงิน": "/assets/images/device-vip-silver.jpg",
  "สีฟ้า": "/assets/images/device-vip-blue.jpg",
};

const scentCategoryMeta: Record<string, { icon: string; tone: string }> = {
  "ผลไม้": { icon: "🍓", tone: "fruit" },
  "มิ้นท์": { icon: "❄", tone: "mint" },
  "ขนม": { icon: "🍬", tone: "candy" },
  "ดอกไม้": { icon: "🌸", tone: "flower" },
  "เครื่องดื่ม": { icon: "☕", tone: "drink" },
};

function trackMetaEvent(eventName: "ViewContent" | "Contact" | "Lead", params: Record<string, string>) {
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) fbq("track", eventName, params);
}

async function copyOrderText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // iOS Safari and some Android WebViews can reject Clipboard API access;
      // continue to the user-gesture-friendly textarea fallback below.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("ไม่สามารถคัดลอกข้อความได้");
}

function SectionHeading({ children, accent }: { children: string; accent: string }) {
  return (
    <div className="section-heading">
      <h2>
        {children} <span>{accent}</span>
      </h2>
      <div className="heading-glow" />
    </div>
  );
}

function AppHeader({ onMenu, onLineClick }: { onMenu: () => void; onLineClick: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="BoomBox TH home">
        <div className="brand-mark">BB</div>
        <div>
          <strong>BOOMBOX TH</strong>
          <span>อุปกรณ์อัดเม็ดบีทพกพา</span>
        </div>
      </a>
      <nav className="desktop-nav" aria-label="หลัก">
        <a href="#how-it-works">วิธีใช้งาน</a>
        <a href="#reviews">รีวิวลูกค้า</a>
        <a href="#offers">แพ็กเกจ</a>
        <a href="#faq">คำถามที่พบบ่อย</a>
      </nav>
      <a className="header-cta" href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" onClick={onLineClick}>คุยกับทีมงานใน LINE</a>
      <button className="mobile-menu" type="button" onClick={onMenu} aria-label="เปิดเมนู"><Menu size={21} /></button>
    </header>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [orderNotice, setOrderNotice] = useState("");
  const [lineHandoffNotice, setLineHandoffNotice] = useState<"loading" | "success" | "error" | null>(null);
  const [lineCtaLoading, setLineCtaLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ code: string; name: string; price: string; imageUrl?: string | null } | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const reviewViewportRef = useRef<HTMLDivElement>(null);
  const catalogQuery = trpc.boombox.catalog.useQuery(undefined, { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false });
  const trackEventMutation = trpc.analytics.track.useMutation();
  const displayPackages = catalogQuery.data?.packages?.length
    ? catalogQuery.data.packages.map((pkg) => ({
        code: pkg.code,
        name: pkg.name,
        oldPrice: String(pkg.oldPrice),
        price: String(pkg.price),
        device: pkg.deviceLabel,
        extras: pkg.extrasLabel,
        scent: pkg.scentLabel,
        featured: pkg.code === "B",
        imageUrl: localAssetUrl(pkg.imageUrl) || localPackageImages[pkg.code] || null,
      }))
    : packages.map((pkg) => ({ ...pkg, imageUrl: localPackageImages[pkg.code] || null }));
  const displayScents = catalogQuery.data?.scents?.length ? catalogQuery.data.scents : sampleScents;
  const mediaByKey = Object.fromEntries((catalogQuery.data?.media ?? []).map((asset) => [asset.assetKey, localAssetUrl(asset.url)]));
  const mediaUrl = (key: string, fallback: string) => mediaByKey[key] || fallback;
  const metaPixelId = catalogQuery.data?.settings?.metaPixelId?.trim() || "2112837926041585";
  const deviceImageUrls = catalogQuery.data?.deviceImages?.length
    ? catalogQuery.data.deviceImages.reduce<Record<string, string | null>>((images, item) => { images[item.color] = localAssetUrl(item.imageUrl); return images; }, { ...deviceImageFallbacks })
    : deviceImageFallbacks;
  const popularScentNames = ["สตรอว์เบอร์รี", "องุ่น", "แตงโม", "เลมอน", "มะลิ", "ส้ม", "เชอร์รี", "โคล่า"];
  const popularScents = displayScents.filter((scent) => popularScentNames.includes(scent.name));
  const otherScents = displayScents.filter((scent) => !popularScentNames.includes(scent.name));

  const trackEngagement = (eventName: "package_view" | "line_click" | "package_select", packageCode?: string, deviceColor?: string, scents?: string[]) => {
    const source = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") ?? "direct" : "direct";
    trackEventMutation.mutate({ eventName, packageCode, deviceColor, scentSummary: scents?.join(" | "), source }, { onError: () => undefined });
    if (eventName === "package_view" && packageCode) trackMetaEvent("ViewContent", { content_name: `BoomBox Set ${packageCode}`, content_type: "product" });
    if (eventName === "line_click") trackMetaEvent("Contact", { content_name: packageCode ? `BoomBox Set ${packageCode}` : "BoomBox LINE" });
  };

  const handleLineCtaClick = (event: MouseEvent<HTMLAnchorElement>, packageCode?: string) => {
    event.preventDefault();
    if (lineCtaLoading) return;
    setLineCtaLoading(true);
    setLineHandoffNotice("loading");
    trackEngagement("line_click", packageCode);
    window.location.assign(LINE_ADD_FRIEND_URL);
  };

  const openPackageModal = (pkg: { code: string; name: string; price: string; imageUrl?: string | null }) => {
    const detail = packageDetails[pkg.code as keyof typeof packageDetails];
    trackEngagement("package_view", pkg.code);
    setSelectedPackage(pkg);
    setSelectedColor(pkg.code === "D" ? detail.colors.join(" + ") : detail.colors[0]);
    setSelectedScents(detail.selectableScent ? Array.from({ length: detail.boxes }, () => displayScents[0]?.name ?? "เลือกกลิ่น") : []);
  };

  const closePackageModal = () => setSelectedPackage(null);

  const handlePackageOrder = async (pkg: { code: string; name: string; price: string }) => {
    if (lineCtaLoading) return;
    setLineCtaLoading(true);
    const detail = packageDetails[pkg.code as keyof typeof packageDetails];
    const selection = {
      deviceColors: [selectedColor],
      scents: detail.selectableScent ? selectedScents : [],
      note: detail.note,
    };
    trackEngagement("package_select", pkg.code, selectedColor, selectedScents);
    trackEngagement("line_click", pkg.code, selectedColor, selectedScents);
    const lineUrl = createLineOrderUrl(pkg, selection);
    setLineHandoffNotice("loading");
    try {
      const message = createLineOrderMessage(pkg, selection);
      await copyOrderText(message);
      setLineHandoffNotice("success");
      setOrderNotice(`คัดลอกข้อมูล Set ${pkg.code} แล้ว และกำลังเปิด LINE ให้ส่งข้อความได้เลย`);
      closePackageModal();
      window.setTimeout(() => {
        window.location.assign(lineUrl);
      }, 900);
    } catch {
      setLineHandoffNotice("error");
      closePackageModal();
      setOrderNotice("คัดลอกอัตโนมัติไม่สำเร็จ กำลังเปิด LINE ให้พิมพ์ชื่อแพ็กเกจได้เลย");
      window.setTimeout(() => {
        window.location.assign(lineUrl);
      }, 900);
    }
  };

  const selectedDetail = selectedPackage ? packageDetails[selectedPackage.code as keyof typeof packageDetails] : null;
  const selectedLineUrl = selectedPackage && selectedDetail
    ? createLineOrderUrl(selectedPackage, {
        deviceColors: [selectedColor],
        scents: selectedDetail.selectableScent ? selectedScents : [],
        note: selectedDetail.note,
      })
    : LINE_ADD_FRIEND_URL;

  useEffect(() => {
    if (!metaPixelId || document.querySelector('script[data-boombox-meta-pixel="true"]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.boomboxMetaPixel = "true";
    document.head.appendChild(script);
    const pixelWindow = window as Window & { fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] } };
    const fbq = ((...args: unknown[]) => { fbq.queue?.push(args); }) as ((...args: unknown[]) => void) & { queue?: unknown[] };
    fbq.queue = [];
    pixelWindow.fbq = fbq;
    fbq("init", metaPixelId);
    fbq("track", "PageView");
  }, [metaPixelId]);

  useEffect(() => {
    if (!selectedPackage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePackageModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedPackage]);

  useEffect(() => {
    const viewport = reviewViewportRef.current;
    if (!viewport) return;

    let frame = 0;
    let paused = false;
    let lastTime = performance.now();
    const speed = 0.035;

    const tick = (now: number) => {
      const elapsed = now - lastTime;
      lastTime = now;
      if (!paused) {
        viewport.scrollLeft += elapsed * speed;
        const loopWidth = viewport.scrollWidth / 2;
        if (loopWidth > 0 && viewport.scrollLeft >= loopWidth) viewport.scrollLeft -= loopWidth;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const pause = () => { paused = true; };
    const resume = () => { paused = false; lastTime = performance.now(); };
    viewport.addEventListener("touchstart", pause, { passive: true });
    viewport.addEventListener("touchend", resume, { passive: true });
    viewport.addEventListener("pointerdown", pause, { passive: true });
    viewport.addEventListener("pointerup", resume, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener("touchstart", pause);
      viewport.removeEventListener("touchend", resume);
      viewport.removeEventListener("pointerdown", pause);
      viewport.removeEventListener("pointerup", resume);
    };
  }, []);

  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="page-shell" id="top">
      <AppHeader onMenu={() => setIsMenuOpen(true)} onLineClick={handleLineCtaClick} />
      {isMenuOpen && (
        <div className="mobile-nav-panel">
          <button type="button" className="close-menu" onClick={() => setIsMenuOpen(false)} aria-label="ปิดเมนู"><X /></button>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>วิธีใช้งาน</a>
          <a href="#reviews" onClick={() => setIsMenuOpen(false)}>รีวิวลูกค้า</a>
          <a href="#offers" onClick={() => setIsMenuOpen(false)}>แพ็กเกจ</a>
          <a href="#faq" onClick={() => setIsMenuOpen(false)}>คำถามที่พบบ่อย</a>
          <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className={`mobile-nav-line-cta ${lineCtaLoading ? "is-loading" : ""}`} onClick={(event) => { setIsMenuOpen(false); handleLineCtaClick(event); }}>ขอคำแนะนำฟรีใน LINE</a>
        </div>
      )}

      <main>
        <section className="hero-section">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="hero-content reveal">
            <p className="eyebrow"><span /> อุปกรณ์อัดเม็ดบีทแบบพกพา <span /></p>
            <p className="boombox-label">BOOMBOX TH</p>
            <h1>อุปกรณ์เปลี่ยนกลิ่นจากเม็ดบีท<br /><em>พกง่าย ใช้ได้ใน 3 วินาที</em></h1>
            <p className="hero-subtitle">เลือกกลิ่นจากเม็ดรวม 40 กลิ่น ใส่เม็ด แล้วกดใช้งานได้ทันที — เริ่มต้น 299 บาท ส่งฟรี เก็บเงินปลายทาง</p>
            <p className="hero-step-line"><strong>เลือกสีเครื่อง</strong><span>→</span><strong>ใส่เม็ดรวม</strong><span>→</span><strong>กดใช้งาน</strong></p>
            <div className="hero-offer-card">
              <div><strong>ยังไม่เคยลอง? เริ่มจาก Set A ฿299</strong><span>ได้เครื่อง 1 เครื่อง เลือกสีดำ/ขาว + เม็ดรวม 100 เม็ด (สุ่ม 40 กลิ่น)</span></div>
              <span className="hero-offer-price">ส่งฟรี</span>
            </div>
            <div className="hero-actions offer-actions">
              <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className={`primary-button line-button ${lineCtaLoading ? "is-loading" : ""}`} onClick={handleLineCtaClick}>ให้ทีมงานช่วยเริ่มที่ Set A <ArrowRight size={17} /></a>
              <p className="hero-note">กดแล้วเปิด LINE ทันที · ไม่ต้องโอนก่อน · ทีมงานช่วยตอบให้ฟรี</p>
            </div>
            <div className="hero-video-gallery" aria-label="วิดีโอ BOOMBOX TH">
              {[mediaUrl("heroVideoOne", ASSET.heroVideoOne), mediaUrl("heroVideoTwo", ASSET.heroVideoTwo), mediaUrl("heroVideoThree", ASSET.heroVideoThree)].map((video, index) => <HeroVideoCard key={video} src={video} index={index} poster={mediaByKey[`heroPoster${index + 1}`] || HERO_POSTERS[index]} />)}
            </div>
            <p className="video-scroll-hint"><span>ปัดซ้ายเพื่อดูคลิปถัดไป</span> <ArrowRight size={14} /></p>
          </div>
        </section>

        <section className="trust-strip" aria-label="ความมั่นใจในการสั่งซื้อ">
          <div className="container trust-strip-grid">
            <div><Check size={18} /><span><strong>เก็บเงินปลายทาง</strong><small>ไม่ต้องโอนก่อน</small></span></div>
            <div><Check size={18} /><span><strong>Set A ส่งฟรี</strong><small>ทั่วไทย</small></span></div>
            <div><ShieldCheck size={18} /><span><strong>เปลี่ยนคืนได้ 7 วัน</strong><small>ตามเงื่อนไขร้าน</small></span></div>
            <div><Check size={18} /><span><strong>ปรึกษาฟรีทาง LINE</strong><small>ช่วยเลือกกลิ่นได้</small></span></div>
          </div>
        </section>

        <section className="product-clarity-section section-dark" aria-labelledby="product-clarity-title">
          <div className="container product-clarity-grid">
            <div className="product-clarity-copy">
              <p className="eyebrow">สิ่งที่คุณจะได้รับ</p>
              <h2 id="product-clarity-title">อุปกรณ์พกพา สำหรับเพิ่มตัวเลือกกลิ่นในชีวิตประจำวัน</h2>
              <p>เลือกกลิ่นที่ชอบ ใส่เม็ด กด และใช้งานตามขั้นตอนที่แนะนำ ไม่ต้องตั้งค่าซับซ้อน พร้อมให้ทีมงานช่วยเลือก Set ที่เหมาะกับคุณ</p>
              <div className="product-clarity-points"><span><Check size={16} /> 40 กลิ่นให้เลือก</span><span><Check size={16} /> ใช้งานง่ายใน 3 ขั้นตอน</span><span><Check size={16} /> เริ่มต้น 299 บาท</span></div>
            </div>
            <figure className="product-clarity-media"><img src={ASSET.boomboxStory} alt="อุปกรณ์ BoomBox TH และเม็ดกลิ่น" loading="lazy" decoding="async" /></figure>
          </div>
        </section>

        <section className="how-it-works-section section-dark" id="how-it-works">
          <div className="container">
            <SectionHeading accent="ใช้งานง่าย">ทำงานอย่างไร?</SectionHeading>
            <p className="center-intro">เห็นภาพใน 3 ขั้นตอน แล้วเลือกชุดที่เหมาะกับคุณ</p>
            <div className="how-it-works-grid">
              <article className="how-it-works-card"><span>01</span><div><h3>ใส่เม็ดบีท</h3><p>เลือกกลิ่นที่ชอบ แล้วใส่เม็ดลงในเครื่อง</p></div></article>
              <article className="how-it-works-card"><span>02</span><div><h3>กดใช้งาน</h3><p>กดเพียงครั้งเดียว ใช้งานง่าย ไม่ต้องตั้งค่า</p></div></article>
              <article className="how-it-works-card"><span>03</span><div><h3>พร้อมใช้ใน 3 วินาที</h3><p>พกง่าย เปลี่ยนกลิ่นได้ตามอารมณ์ในแต่ละวัน</p></div></article>
            </div>
          </div>
        </section>

        <section className="student-strip review-strip" id="reviews" aria-label="รีวิวจากลูกค้า">
          <div className="container">
            <p className="strip-label">รีวิวและภาพจากลูกค้าที่เลือก BOOMBOX TH</p>
            <div className="proof-gallery" aria-label="ภาพรีวิวจากลูกค้า">
              {customerProofImages.map((image, index) => <a className="proof-card" href={image} target="_blank" rel="noreferrer" key={image}>
                <img src={image} alt={`รีวิวจากลูกค้า BoomBox TH ${index + 1}`} loading="lazy" decoding="async" />
              </a>)}
            </div>
            <p className="review-caption">ดูภาพรีวิวเพิ่มเติมได้ · สอบถามรายละเอียดและเช็กสต็อกกับทีมงานทาง LINE</p>
          </div>
          <div className="marquee-wrap" ref={reviewViewportRef}>
            <div className="marquee-track">
              {[...customerReviews, ...customerReviews].map((review, index) => (
                <article className="review-card" key={`${review.name}-${index}`}>
                  <div className="review-head">
                    <div className="review-avatar">{review.name.slice(0, 1)}</div>
                    <div><strong>{review.name}</strong><span>ลูกค้า BOOMBOX TH</span></div>
                    <span className="verified-badge" aria-label="รีวิวจากลูกค้า"><Check size={12} /> ลูกค้ารีวิว</span>
                  </div>
                  <div className="review-stars" aria-label="5 ดาว">★★★★★</div>
                  <p>{review.text}</p>
                  <small>ขอบคุณที่ไว้วางใจเรา</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="offer-section" id="offers">
          <div className="container">
            <div className="offer-intro">
              <p className="eyebrow">เริ่มต้น 299 บาท · เลือก Set ได้ตามการใช้งาน</p>
              <h2>เลือกแพ็กเกจที่เหมาะกับคุณ</h2>
              <p className="offer-deadline">Set A ส่งฟรี · เก็บเงินปลายทาง · ไม่ต้องโอนก่อน</p>
            </div>
            <p className="order-helper"><strong>วิธีไปต่อ:</strong> เลือกแพ็กเกจ → ดูของที่ได้รับ → ส่งข้อมูลให้ทีมงานใน LINE</p>
            <div className="pricing-grid package-grid">
              {displayPackages.map((pkg) => (
                <article className={`price-card package-card ${pkg.featured ? "featured-package" : ""}`} key={pkg.code}>
                  {pkg.featured && <div className="recommended"><Sparkles size={13} /> คุ้มค่า</div>}
                  <div className="package-topline"><span>แพ็กเกจ {pkg.code}</span>{pkg.featured && <span>แนะนำ</span>}</div>
                  <div className="package-image-slot">{pkg.imageUrl ? <img src={pkg.imageUrl} alt={`รูปสินค้าจริงแพ็กเกจ ${pkg.code}`} loading="lazy" decoding="async" /> : <div className="package-image-fallback"><Zap size={24} /><span>ภาพแพ็กเกจ {pkg.code}</span></div>}</div>
                  <h3>{pkg.name}</h3>
                  <div className="old-price">฿{pkg.oldPrice}</div>
                  <div className="price"><small>฿</small>{pkg.price}</div>
                  <ul className="package-features">
                    <li><Check size={15} /> {pkg.device}</li>
                    <li><Check size={15} /> {pkg.extras}</li>
                    <li><Check size={15} /> {pkg.scent}</li>
                  </ul>
                  <button type="button" onClick={() => openPackageModal(pkg)} className={`price-button ${pkg.featured ? "primary-button" : "secondary-button"}`}>เลือก Set {pkg.code} <ArrowRight size={16} /></button>
                </article>
              ))}
            </div>
            <div className="package-comparison-wrap">
              <div className="package-comparison-heading"><div><p className="eyebrow">COMPARE SETS</p><h3>เทียบให้ชัด ก่อนเลือกแพ็กเกจ</h3></div><span>เลือก Set แล้วค่อยปรับสีและกลิ่นในขั้นตอนถัดไป</span></div>
              <div className="package-comparison-scroll">
                <table className="package-comparison-table">
                  <thead><tr><th>รายละเอียด</th>{displayPackages.map((pkg) => <th key={`compare-head-${pkg.code}`}>Set {pkg.code}<small>{pkg.name}</small></th>)}</tr></thead>
                  <tbody>
                    <tr><th>ราคาโปร</th>{displayPackages.map((pkg) => <td key={`compare-price-${pkg.code}`} className={pkg.featured ? "is-highlight" : ""}>฿{pkg.price}</td>)}</tr>
                    <tr><th>เครื่อง</th><td>1 เครื่อง</td><td>1 เครื่อง</td><td>1 เครื่อง</td><td>3 เครื่อง พร้อมไฟแช็ก</td></tr>
                    <tr><th>สีเครื่อง</th><td>ดำ / ขาว</td><td>ดำ / ขาว</td><td>ดำ / ขาว</td><td>เงิน / ฟ้า / ดำ</td></tr>
                    <tr><th>เม็ดบีท</th><td>100 เม็ด<br /><small>1 กล่อง</small></td><td>200 เม็ด<br /><small>2 กล่อง</small></td><td>400 เม็ด<br /><small>4 กล่อง</small></td><td>600 เม็ด<br /><small>6 กล่อง</small></td></tr>
                    <tr><th>เลือกกลิ่น</th><td>สุ่มกลิ่นรวม</td><td>เลือกได้ 2 กล่อง<br /><small>ซ้ำได้</small></td><td>เลือกได้ 4 กล่อง<br /><small>ซ้ำได้</small></td><td>เลือกได้ 6 กล่อง<br /><small>ซ้ำได้</small></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="all-package-features">
              <h3>สิ่งที่คุณจะได้รับในทุกแพ็กเกจ</h3>
              <div className="benefit-grid">
                <span><Check size={16} /> เครื่องอัดเม็ดบีท ใช้ 3 วิ จบ</span>
                <span><Check size={16} /> 40 กลิ่นให้เลือก ทั้งผลไม้ มิ้นท์ ขนม และดอกไม้</span>
                <span><Check size={16} /> ปรึกษาฟรีทาง LINE ทีมงานตอบ 24 ชม.</span>
                <span><Check size={16} /> Set A ส่งฟรีทั่วไทย · เก็บเงินปลายทางได้</span>
                <span><Check size={16} /> เปลี่ยนคืนได้ 7 วัน ไม่พอใจคืนได้</span>
              </div>
            </div>
            <div className="offer-final-cta">
              <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className={`primary-button line-button ${lineCtaLoading ? "is-loading" : ""}`} onClick={handleLineCtaClick}>ให้ทีมงานช่วยเลือก Set ฟรี <ArrowRight size={17} /></a>
              <p>ยังเลือกไม่ได้? ทัก LINE ให้ทีมงานช่วยแนะนำฟรี</p>
            </div>
            {orderNotice && <p className="order-notice"><Check size={15} /> {orderNotice}</p>}
          </div>
        </section>



        <section className="problems-section" id="problems">
          <div className="container">
            <SectionHeading accent="กำลังเจอ">ปัญหาที่คุณ</SectionHeading>
            <p className="center-intro">อาจกำลังเจออยู่ตอนนี้</p>
            <div className="problem-grid">
              {painPoints.map((point) => (
                <article className="problem-card" key={point.title}>
                  <div className="problem-icon">{point.icon}</div>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
            <div className="bridge-line"><span>แล้วถ้ามีวิธีที่ไม่ต้องเจอปัญหาเหล่านี้เลยล่ะ?</span><ArrowRight size={21} /></div>
          </div>
        </section>

        <section className="scent-section" id="scents">
          <div className="container">
            <SectionHeading accent="40 กลิ่น">เลือกความหอมในแบบของคุณ</SectionHeading>
            <p className="center-intro">ตัวอย่างกลิ่นที่มีให้เลือก เปลี่ยนได้ตามอารมณ์และสไตล์ของคุณ</p>
            <p className="scent-subheading">กลิ่นฮิตที่ลูกค้าเลือกบ่อย</p>
            <div className="popular-scent-grid">
              {popularScents.map((scent) => <span className="popular-scent-card" key={`popular-${scent.id}-${scent.name}`}>
                {(mediaByKey[popularScentMediaKeys[scent.name]] || popularScentImages[scent.name]) ? <img src={mediaByKey[popularScentMediaKeys[scent.name]] || popularScentImages[scent.name]} alt={`กลิ่น${scent.name}`} loading="lazy" decoding="async" /> : <i />}
                <span className="scent-card-copy"><strong>{scent.name}</strong><small>{scent.category}</small></span>
              </span>)}
            </div>
            <p className="scent-subheading other-scent-heading">กลิ่นอื่น ๆ อีก {otherScents.length} แบบ</p>
            <div className="scent-cloud">
              {otherScents.map((scent) => <span className="scent-chip" key={`${scent.id}-${scent.name}`}><small>{scent.category}</small>{scent.name}</span>)}
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="container narrow">
            <SectionHeading accent="ก่อนสั่งซื้อ">คำถามที่พบบ่อย</SectionHeading>
            <p className="center-intro">ยังไม่แน่ใจเรื่องแพ็กเกจ กลิ่น หรือวิธีใช้? ดูคำตอบได้ที่นี่ หรือคุยกับทีมงานโดยตรง</p>
            <div className="faq-list">
              {faqItems.map(([question, answer]) => <details className="faq-item" key={question}>
                <summary>{question}<ChevronDown size={18} /></summary>
                <p>{answer}</p>
              </details>)}
            </div>
            <div className="faq-cta">
              <p>ยังเลือกไม่ได้? ทีมงานช่วยแนะนำให้ฟรี</p>
            <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className={`primary-button line-button ${lineCtaLoading ? "is-loading" : ""}`} onClick={handleLineCtaClick}>ให้ทีมงานช่วยเลือก Set ฟรี <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <section className="trust-section" id="contact">
          <div className="container narrow">
            <ShieldCheck size={30} className="trust-icon" />
            <h2>มีคำถาม? คุยกับทีม BoomBox TH ได้เลย</h2>
            <p>ทีมงานพร้อมให้คำแนะนำเรื่องกลิ่น แพ็กเกจ และวิธีใช้งาน<br />ทัก LINE มาได้ตลอด เรายินดีช่วยเลือกแพ็กเกจที่เหมาะกับคุณ</p>
            <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className={`primary-button line-button ${lineCtaLoading ? "is-loading" : ""}`} onClick={handleLineCtaClick}>ขอคำแนะนำฟรีใน LINE</a>
          </div>
        </section>
      </main>

      {selectedPackage && selectedDetail && (
        <div className="package-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePackageModal(); }}>
          <section className="package-modal" role="dialog" aria-modal="true" aria-labelledby="package-modal-title">
            <button type="button" className="package-modal-close" onClick={closePackageModal} aria-label="ปิดรายละเอียดแพ็กเกจ"><X size={20} /></button>
            <div className="package-modal-visual">
              {(() => {
                const dedicatedImage = deviceImageUrls[selectedColor];
                const previewTone = selectedPackage.code === "D" ? "set" : selectedColor === "สีดำ" ? "black" : selectedColor === "สีขาว" ? "white" : selectedColor === "สีเงิน" ? "silver" : "blue";
                return dedicatedImage ? <img className={`device-photo device-tone-${previewTone}`} src={dedicatedImage} alt={`ตัวเครื่อง${selectedColor}`} /> : <div className={`device-preview-fallback device-tone-${previewTone}`}>{selectedPackage.imageUrl && <img className="device-photo package-artwork-fallback" src={selectedPackage.imageUrl} alt={`ภาพอ้างอิง Set ${selectedPackage.code}`} />}<div className="device-preview-badge"><div className="device-silhouette"><Zap size={25} /></div><strong>{selectedPackage.code === "D" ? "เครื่อง 3 สี" : selectedColor}</strong><small>ภาพอ้างอิงของแพ็กเกจ · สอบถามรายละเอียดกับทีมงานได้ทาง LINE</small></div></div>;
              })()}
            </div>
            <div className="package-modal-content">
              <p className="package-modal-kicker">SET {selectedPackage.code}</p>
              <h2 id="package-modal-title">{selectedPackage.name}</h2>
              <div className="package-modal-price">฿{selectedPackage.price}</div>
              <p className="package-modal-summary">{selectedDetail.beads} เม็ด · {selectedDetail.boxes} กล่อง · {selectedDetail.note}</p>

              <div className="package-option-group">
                <h3>{selectedPackage.code === "D" ? "เครื่องใน Set D" : "ขั้นตอนที่ 1 · เลือกสีเครื่อง"}</h3>
                {selectedPackage.code === "D" ? (
                  <div className="package-fixed-colors">
                    {selectedDetail.colors.map((color) => <span className="package-color-chip is-fixed" key={color}><Check size={14} /> {color}</span>)}
                    <small>ได้รับครบทั้ง 3 เครื่อง พร้อมไฟแช็กในตัว</small>
                  </div>
                ) : (
                  <div className="package-color-options">
                    {selectedDetail.colors.map((color) => <button type="button" key={color} className={`package-color-choice ${selectedColor === color ? "is-selected" : ""}`} onClick={() => setSelectedColor(color)}><span className={`color-swatch ${color === "สีดำ" ? "black" : "white"}`} />{color}<span className="choice-check">{selectedColor === color ? "✓" : ""}</span></button>)}
                  </div>
                )}
              </div>

              {selectedDetail.selectableScent ? (
                <div className="package-option-group">
                  <h3>ขั้นตอนที่ 2 · เลือกกลิ่น {selectedDetail.boxes} กล่อง</h3>
                  <p className="package-option-help">เลือกกลิ่นซ้ำได้ เช่น มิ้นท์ {selectedDetail.boxes} กล่อง หรือเลือกหลายกลิ่นก็ได้</p>
                  <div className="package-scent-selects">
                    {selectedScents.map((scent, index) => {
                      const scentItem = displayScents.find((item) => item.name === scent);
                      const meta = scentCategoryMeta[scentItem?.category ?? ""] ?? { icon: "✦", tone: "default" };
                      return <label key={`${selectedPackage.code}-scent-${index}`}><span className={`scent-row-meta scent-tone-${meta.tone}`}><i>{meta.icon}</i> กล่องที่ {index + 1} · {scentItem?.category ?? "เลือกกลิ่น"}</span><select className={`scent-select-tone-${meta.tone}`} value={scent} onChange={(event) => setSelectedScents((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}><option value="เลือกกลิ่น" disabled>เลือกกลิ่น</option>{displayScents.map((item) => <option value={item.name} key={`${selectedPackage.code}-${index}-${item.id}`}>{scentCategoryMeta[item.category]?.icon ?? "✦"} {item.name} · {item.category}</option>)}</select></label>;
                    })}
                  </div>
                </div>
              ) : (
                <div className="package-fixed-note"><Check size={15} /> {selectedDetail.note}</div>
              )}

              <div className="package-selection-summary">
                <strong>สรุปตัวเลือก</strong>
                <span>Set {selectedPackage.code} {selectedPackage.name} · ฿{selectedPackage.price}</span>
                <span>เครื่อง: {selectedColor}</span>
                {selectedDetail.selectableScent && <span>กลิ่น: {selectedScents.join(" / ")}</span>}
              </div>
              <a href={selectedLineUrl} target="_blank" rel="noreferrer" className={`primary-button line-button package-modal-line ${lineCtaLoading ? "is-loading" : ""}`} onClick={(event) => { event.preventDefault(); void handlePackageOrder(selectedPackage); }}>คัดลอกข้อมูลแล้วเปิด LINE <ArrowRight size={17} /></a>
              <p className="package-modal-footnote">กดครั้งเดียว ระบบจะคัดลอกรายละเอียด Set นี้ แล้วพาไป LINE ของ BoomBox TH ให้วางข้อความส่งกับทีมงานได้ทันที</p>
            </div>
          </section>
        </div>
      )}

      <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className={`floating-line-cta ${lineCtaLoading ? "is-loading" : ""}`} aria-label="ขอคำแนะนำฟรีใน LINE" onClick={handleLineCtaClick}>
        <strong>LINE</strong><span>ขอคำแนะนำฟรี</span>
      </a>

      {lineHandoffNotice && <div className={`line-handoff-popup ${lineHandoffNotice === "success" ? "is-success" : lineHandoffNotice === "loading" ? "is-loading" : "is-error"}`} role="status" aria-live="assertive">
        <div className="line-handoff-icon">{lineHandoffNotice === "loading" ? <Loader2 size={21} className="cta-spinner" /> : lineHandoffNotice === "success" ? <Check size={21} /> : <X size={21} />}</div>
        <div><strong>{lineHandoffNotice === "loading" ? "กำลังเตรียมข้อมูลให้คุณ" : lineHandoffNotice === "success" ? "คัดลอกข้อความเรียบร้อยแล้ว" : "คัดลอกข้อความไม่สำเร็จ"}</strong><span>{lineHandoffNotice === "loading" ? "อีกสักครู่ระบบจะเปิด LINE ให้โดยอัตโนมัติ..." : lineHandoffNotice === "success" ? "กำลังเปิด LINE ให้ส่งข้อความกับทีมงาน..." : "กำลังเปิด LINE ให้พิมพ์รายละเอียดเอง..."}</span></div>
      </div>}

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="brand"><div className="brand-mark">BB</div><div><strong>BOOMBOX TH</strong><span>อุปกรณ์อัดเม็ดบีทพกพา</span></div></div>
          <div className="footer-business-contact"><strong>ติดต่อทีมงาน</strong><a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className={lineCtaLoading ? "is-loading" : ""} onClick={handleLineCtaClick}>LINE Official Account: @425syacj</a></div>
          <div className="footer-links"><a href="/privacy-policy">นโยบายความเป็นส่วนตัว</a><p>© 2026 BoomBox TH</p></div>
          <a href="#top" aria-label="กลับด้านบน"><ChevronDown size={20} className="to-top" /></a>
        </div>
      </footer>
    </div>
  );
}
