import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { LINE_ADD_FRIEND_URL } from "@shared/line";

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link href="/" className="legal-back"><ArrowLeft size={16} /> กลับหน้า BoomBox TH</Link>
        <div className="legal-brand"><span className="brand-mark">BB</span><strong>BOOMBOX TH</strong></div>
        <div className="legal-heading"><ShieldCheck size={28} /><div><p className="eyebrow">PRIVACY POLICY</p><h1>นโยบายความเป็นส่วนตัว</h1></div></div>
        <p className="legal-updated">ปรับปรุงล่าสุด: 28 กันยายน 2569</p>

        <section className="legal-section">
          <h2>1. ข้อมูลที่เราอาจได้รับ</h2>
          <p>เว็บไซต์นี้เป็นหน้าแนะนำสินค้าและส่งต่อการพูดคุยไปยัง LINE Official Account ของ BoomBox TH เราอาจได้รับข้อมูลที่คุณเลือกส่งให้ทีมงานเอง เช่น ชื่อ ข้อมูลติดต่อ แพ็กเกจหรือกลิ่นที่สนใจ และรายละเอียดที่ใช้สำหรับตอบคำถามหรือประสานงานคำสั่งซื้อ</p>
        </section>
        <section className="legal-section">
          <h2>2. การใช้ข้อมูล</h2>
          <p>เราใช้ข้อมูลเพื่อให้คำแนะนำเกี่ยวกับสินค้า ตอบคำถาม ประสานงานการสั่งซื้อ และปรับปรุงประสบการณ์การใช้งานเว็บไซต์ เราจะไม่ขอข้อมูลที่ไม่จำเป็นผ่านหน้า Landing Page นี้</p>
        </section>
        <section className="legal-section">
          <h2>3. คุกกี้และข้อมูลการใช้งาน</h2>
          <p>เว็บไซต์อาจใช้เทคโนโลยีที่จำเป็นต่อการทำงานของหน้าเว็บและการวัดผลแคมเปญโฆษณา หากมีการเชื่อมต่อบริการวิเคราะห์หรือโฆษณาเพิ่มเติม เราจะดำเนินการตามข้อกำหนดของบริการนั้นและกฎหมายที่เกี่ยวข้อง</p>
        </section>
        <section className="legal-section">
          <h2>4. การส่งต่อไปยัง LINE</h2>
          <p>เมื่อคุณกดปุ่ม LINE คุณจะออกจากเว็บไซต์นี้และไปยังบริการของ LINE ซึ่งมีนโยบายความเป็นส่วนตัวและข้อกำหนดการใช้งานของ LINE แยกต่างหาก กรุณาตรวจสอบนโยบายของ LINE ก่อนส่งข้อมูลส่วนตัว</p>
        </section>
        <section className="legal-section">
          <h2>5. สิทธิของคุณ</h2>
          <p>หากต้องการสอบถาม ขอแก้ไข หรือขอให้ลบข้อมูลที่คุณส่งให้ทีมงาน สามารถติดต่อ BoomBox TH ผ่าน LINE Official Account ได้ เราจะพิจารณาดำเนินการตามกฎหมายและข้อจำกัดในการเก็บรักษาข้อมูลที่เกี่ยวข้องกับการให้บริการ</p>
        </section>
        <section className="legal-contact">
          <h2>ติดต่อเรื่องข้อมูลส่วนตัว</h2>
          <p>ทีมงาน BoomBox TH</p>
          <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer">LINE Official Account: BoomBox TH</a>
        </section>
      </div>
    </main>
  );
}
