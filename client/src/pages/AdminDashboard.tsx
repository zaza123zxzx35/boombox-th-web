import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Save, Sparkles, UploadCloud } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";

type PackageDraft = {
  code: string;
  name: string;
  oldPrice: string;
  price: string;
  deviceLabel: string;
  extrasLabel: string;
  scentLabel: string;
  imageUrl?: string | null;
};

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error ?? new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.readAsDataURL(file);
  });
}

const fallbackPackages: PackageDraft[] = [
  { code: "A", name: "ลองเล่น", oldPrice: "599", price: "299", deviceLabel: "เครื่อง", extrasLabel: "+100 เม็ด", scentLabel: "สุ่มกลิ่น" },
  { code: "B", name: "คุ้มค่า", oldPrice: "699", price: "389", deviceLabel: "เครื่อง", extrasLabel: "+200 เม็ด", scentLabel: "เลือกกลิ่น" },
  { code: "C", name: "จัดเต็ม", oldPrice: "899", price: "499", deviceLabel: "เครื่อง", extrasLabel: "+400 เม็ด", scentLabel: "เลือกกลิ่น 4 กล่อง" },
  { code: "D", name: "VIP", oldPrice: "1099", price: "649", deviceLabel: "เครื่องพร้อมไฟแช็ก 3 เครื่อง", extrasLabel: "+600 เม็ด", scentLabel: "เลือกกลิ่น 6 กล่อง" },
];

const deviceColorOptions = ["สีดำ", "สีขาว", "สีเงิน", "สีฟ้า"];

const mediaSlots = [
  ["heroVideoOne", "Hero วิดีโอที่ 1", "video"],
  ["heroVideoTwo", "Hero วิดีโอที่ 2", "video"],
  ["heroVideoThree", "Hero วิดีโอที่ 3", "video"],
  ["heroPoster", "ภาพปกวิดีโอ Hero", "image"],
  ["boomboxStory", "ภาพส่วนเบื้องหลัง", "image"],
  ["resultReviewOne", "ภาพจุดเด่นที่ 1", "image"],
  ["resultReviewTwo", "ภาพจุดเด่นที่ 2", "image"],
  ["resultReviewThree", "ภาพจุดเด่นที่ 3", "image"],
  ["scent_strawberry", "กลิ่นฮิต: สตรอว์เบอร์รี", "image"],
  ["scent_grape", "กลิ่นฮิต: องุ่น", "image"],
  ["scent_watermelon", "กลิ่นฮิต: แตงโม", "image"],
  ["scent_lemon", "กลิ่นฮิต: เลมอน", "image"],
  ["scent_jasmine", "กลิ่นฮิต: มะลิ", "image"],
  ["scent_orange", "กลิ่นฮิต: ส้ม", "image"],
  ["scent_cherry", "กลิ่นฮิต: เชอร์รี", "image"],
  ["scent_cola", "กลิ่นฮิต: โคล่า", "image"],
] as const;

export default function AdminDashboard() {
  const catalogQuery = trpc.boombox.adminList.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const updatePackage = trpc.boombox.updatePackage.useMutation();
  const uploadPackageImage = trpc.boombox.uploadPackageImage.useMutation();
  const uploadDeviceImage = trpc.boombox.uploadDeviceImage.useMutation();
  const uploadMedia = trpc.boombox.uploadMedia.useMutation();
  const updateSetting = trpc.boombox.updateSetting.useMutation();
  const updateScent = trpc.boombox.updateScent.useMutation();
  const analyticsQuery = trpc.boombox.analyticsSummary.useQuery(undefined, { retry: false });
  const [drafts, setDrafts] = useState<PackageDraft[]>(fallbackPackages);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [uploadingCode, setUploadingCode] = useState<string | null>(null);
  const [uploadingDeviceColor, setUploadingDeviceColor] = useState<string | null>(null);
  const [uploadingAssetKey, setUploadingAssetKey] = useState<string | null>(null);
  const [metaPixelId, setMetaPixelId] = useState("");
  const [savingMetaPixel, setSavingMetaPixel] = useState(false);
  const [editingScents, setEditingScents] = useState<Record<number, { name: string; category: string }>>({});
  const imageInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const deviceImageInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const mediaInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (catalogQuery.data?.packages?.length) {
      setDrafts(catalogQuery.data.packages.map((pkg) => ({
        code: pkg.code,
        name: pkg.name,
        oldPrice: String(pkg.oldPrice),
        price: String(pkg.price),
        deviceLabel: pkg.deviceLabel,
        extrasLabel: pkg.extrasLabel,
        scentLabel: pkg.scentLabel,
        imageUrl: pkg.imageUrl,
      })));
    }
  }, [catalogQuery.data?.packages]);

  useEffect(() => {
    const configured = catalogQuery.data?.settings?.find((setting) => setting.settingKey === "metaPixelId")?.settingValue ?? "";
    setMetaPixelId(configured);
  }, [catalogQuery.data?.settings]);

  const scents = catalogQuery.data?.scents ?? [];
  const deviceImages = catalogQuery.data?.deviceImages ?? [];
  const groupedScents = useMemo(() => scents.reduce<Record<string, typeof scents>>((groups, scent) => {
    (groups[scent.category] ??= []).push(scent);
    return groups;
  }, {}), [scents]);

  const updateDraft = (code: string, key: keyof PackageDraft, value: string) => {
    setDrafts((current) => current.map((draft) => draft.code === code ? { ...draft, [key]: value } : draft));
  };

  const savePackage = async (draft: PackageDraft) => {
    setNotice(null);
    setSavingCode(draft.code);
    try {
      await updatePackage.mutateAsync({
        code: draft.code,
        name: draft.name,
        oldPrice: Number(draft.oldPrice) || 0,
        price: Number(draft.price) || 0,
        deviceLabel: draft.deviceLabel,
        extrasLabel: draft.extrasLabel,
        scentLabel: draft.scentLabel,
      });
      await utils.boombox.catalog.invalidate();
      setNotice({ type: "success", text: `บันทึกแพ็กเกจ ${draft.code} เรียบร้อยแล้ว` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "บันทึกแพ็กเกจไม่สำเร็จ" });
    } finally {
      setSavingCode(null);
    }
  };

  const uploadImage = async (code: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice({ type: "error", text: "กรุณาเลือกไฟล์รูปภาพเท่านั้น" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice({ type: "error", text: "รูปภาพต้องมีขนาดไม่เกิน 10 MB" });
      return;
    }
    setUploadingCode(code);
    setNotice(null);
    try {
      const data = await fileToBase64(file);
      const uploaded = await uploadPackageImage.mutateAsync({ code, filename: file.name, mimeType: file.type, size: file.size, data });
      setDrafts((current) => current.map((draft) => draft.code === code ? { ...draft, imageUrl: uploaded.url } : draft));
      await utils.boombox.catalog.invalidate();
      setNotice({ type: "success", text: `เปลี่ยนรูปแพ็กเกจ ${code} เรียบร้อยแล้ว` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ" });
    } finally {
      setUploadingCode(null);
      const input = imageInputs.current[code];
      if (input) input.value = "";
    }
  };

  const uploadDevicePhoto = async (color: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice({ type: "error", text: "กรุณาเลือกไฟล์รูปภาพเท่านั้น" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice({ type: "error", text: "รูปภาพต้องมีขนาดไม่เกิน 10 MB" });
      return;
    }
    setUploadingDeviceColor(color);
    setNotice(null);
    try {
      const data = await fileToBase64(file);
      await uploadDeviceImage.mutateAsync({ color, filename: file.name, mimeType: file.type, size: file.size, data });
      await utils.boombox.catalog.invalidate();
      await utils.boombox.adminList.invalidate();
      setNotice({ type: "success", text: `อัปโหลดรูปเครื่อง${color} แล้ว Modal จะเปลี่ยนภาพตามสีที่เลือก` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "อัปโหลดรูปเครื่องไม่สำเร็จ" });
    } finally {
      setUploadingDeviceColor(null);
      const input = deviceImageInputs.current[color];
      if (input) input.value = "";
    }
  };

  const uploadMediaAsset = async (assetKey: string, label: string, fileKind: "image" | "video", file?: File) => {
    if (!file) return;
    if (!file.type.startsWith(`${fileKind}/`)) {
      setNotice({ type: "error", text: fileKind === "video" ? "ช่องนี้รับไฟล์วิดีโอเท่านั้น" : "ช่องนี้รับไฟล์รูปภาพเท่านั้น" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setNotice({ type: "error", text: "ไฟล์สื่อต้องมีขนาดไม่เกิน 50 MB" });
      return;
    }
    setUploadingAssetKey(assetKey);
    setNotice(null);
    try {
      const data = await fileToBase64(file);
      await uploadMedia.mutateAsync({ assetKey, label, filename: file.name, mimeType: file.type, size: file.size, data });
      await utils.boombox.catalog.invalidate();
      await utils.boombox.adminList.invalidate();
      setNotice({ type: "success", text: `อัปเดต ${label} แล้ว หน้าเว็บจะใช้ไฟล์ใหม่นี้ทันที` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "อัปโหลดสื่อไม่สำเร็จ" });
    } finally {
      setUploadingAssetKey(null);
      const input = mediaInputs.current[assetKey];
      if (input) input.value = "";
    }
  };

  const saveMetaPixelId = async () => {
    setSavingMetaPixel(true);
    setNotice(null);
    try {
      await updateSetting.mutateAsync({ settingKey: "metaPixelId", settingValue: metaPixelId.trim() });
      await utils.boombox.catalog.invalidate();
      await utils.boombox.adminList.invalidate();
      setNotice({ type: "success", text: metaPixelId.trim() ? "บันทึก Meta Pixel ID แล้ว หน้าเว็บจะเริ่มเก็บ PageView และ event ใหม่" : "ล้าง Meta Pixel ID แล้ว ระบบจะหยุดโหลด Pixel" });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "บันทึก Meta Pixel ID ไม่สำเร็จ" });
    } finally {
      setSavingMetaPixel(false);
    }
  };

  const saveScent = async (scent: (typeof scents)[number]) => {
    const draft = editingScents[scent.id] ?? { name: scent.name, category: scent.category };
    try {
      await updateScent.mutateAsync({ id: scent.id, ...draft });
      await utils.boombox.catalog.invalidate();
      setNotice({ type: "success", text: `บันทึกกลิ่น ${draft.name} แล้ว` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "บันทึกกลิ่นไม่สำเร็จ" });
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <p className="admin-kicker">BOOMBOX TH / ADMIN CONTROL</p>
            <h1>จัดการเว็บไซต์และการตลาด</h1>
            <p>เปลี่ยนแพ็กเกจ กลิ่น รูป วิดีโอ และ Meta Pixel ได้เองจากหน้านี้ โดยข้อมูลจะอัปเดตไปยังหน้าเว็บไซต์ทันที</p>
          </div>
          <Link href="/" className="secondary-button admin-home-link">ดูหน้าโปรโมชั่น</Link>
        </header>

        {notice && <div className={`admin-notice ${notice.type}`}><Check size={17} /> {notice.text}</div>}
        {catalogQuery.error && <div className="admin-notice error">บัญชีนี้ยังไม่มีสิทธิ์แอดมิน หรือระบบยังเชื่อมต่อฐานข้อมูลไม่ได้</div>}
        {catalogQuery.isLoading ? (
          <div className="admin-loading"><Loader2 className="spin" size={28} /> กำลังโหลดข้อมูล...</div>
        ) : (
          <>
            <section className="admin-section">
              <div className="admin-section-heading"><div><p className="admin-kicker">PACKAGE MANAGER</p><h2>แพ็กเกจ A–D</h2><p>แก้ราคา รายละเอียด และรูปโปรโมชั่นแยกตามแพ็กเกจ</p></div><span className="admin-count"><Sparkles size={15} /> 4 แพ็กเกจ</span></div>
              <div className="admin-package-grid">
                {drafts.map((draft) => (
                  <article className={`admin-package-card ${draft.code === "B" ? "is-featured" : ""}`} key={draft.code}>
                    <div className="admin-package-card-top"><span className="admin-package-code">แพ็กเกจ {draft.code}</span>{draft.code === "B" && <span className="admin-featured-label">คุ้มค่า</span>}</div>
                    <div className="admin-image-upload">
                      {draft.imageUrl ? <img src={draft.imageUrl} alt={`รูปแพ็กเกจ ${draft.code}`} /> : <div className="admin-image-empty"><ImagePlus size={28} /><span>ยังไม่มีรูปโปรโมชั่น</span></div>}
                      <label className="admin-upload-overlay">
                        {uploadingCode === draft.code ? <Loader2 className="spin" size={16} /> : <UploadCloud size={16} />}
                        {uploadingCode === draft.code ? "กำลังอัปโหลด" : "เปลี่ยนรูป"}
                        <input ref={(element) => { imageInputs.current[draft.code] = element; }} type="file" accept="image/*" onChange={(event) => void uploadImage(draft.code, event.target.files?.[0])} disabled={uploadingCode === draft.code} />
                      </label>
                    </div>
                    <label>ชื่อแพ็กเกจ<input value={draft.name} onChange={(event) => updateDraft(draft.code, "name", event.target.value)} /></label>
                    <div className="admin-two-columns"><label>ราคาเดิม<input inputMode="numeric" value={draft.oldPrice} onChange={(event) => updateDraft(draft.code, "oldPrice", event.target.value)} /></label><label>ราคาโปร<input inputMode="numeric" value={draft.price} onChange={(event) => updateDraft(draft.code, "price", event.target.value)} /></label></div>
                    <label>รายละเอียดเครื่อง<input value={draft.deviceLabel} onChange={(event) => updateDraft(draft.code, "deviceLabel", event.target.value)} /></label>
                    <label>จำนวนเม็ด<input value={draft.extrasLabel} onChange={(event) => updateDraft(draft.code, "extrasLabel", event.target.value)} /></label>
                    <label>สิทธิ์เรื่องกลิ่น<input value={draft.scentLabel} onChange={(event) => updateDraft(draft.code, "scentLabel", event.target.value)} /></label>
                    <button type="button" className="primary-button admin-save-button" onClick={() => void savePackage(draft)} disabled={savingCode === draft.code}>{savingCode === draft.code ? <Loader2 className="spin" size={16} /> : <Save size={16} />} บันทึกแพ็กเกจ {draft.code}</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-section">
              <div className="admin-section-heading"><div><p className="admin-kicker">DEVICE COLOR PHOTOS</p><h2>รูปตัวเครื่องใน Modal</h2><p>อัปโหลดรูปเครื่องจริงแยกสี แล้วภาพใน Modal จะเปลี่ยนตามสีที่ลูกค้ากดเลือก</p></div><span className="admin-count">4 สี</span></div>
              <div className="admin-device-grid">
                {deviceColorOptions.map((color) => {
                  const device = deviceImages.find((item) => item.color === color);
                  return <article className="admin-device-card" key={color}>
                    <div className="admin-device-preview">{device?.imageUrl ? <img src={device.imageUrl} alt={`ตัวเครื่อง${color}`} /> : <div><ImagePlus size={26} /><span>ยังไม่มีรูป</span></div>}</div>
                    <strong>{color}</strong>
                    <label className="admin-device-upload-button">{uploadingDeviceColor === color ? <Loader2 className="spin" size={15} /> : <UploadCloud size={15} />}{uploadingDeviceColor === color ? "กำลังอัปโหลด" : device?.imageUrl ? "เปลี่ยนรูป" : "อัปโหลดรูป"}<input ref={(element) => { deviceImageInputs.current[color] = element; }} type="file" accept="image/*" onChange={(event) => void uploadDevicePhoto(color, event.target.files?.[0])} disabled={uploadingDeviceColor === color} /></label>
                  </article>;
                })}
              </div>
            </section>

            <section className="admin-section">
              <div className="admin-section-heading"><div><p className="admin-kicker">MEDIA LIBRARY</p><h2>จัดการรูปและวิดีโอทุกส่วน</h2><p>เปลี่ยนไฟล์ Hero, เบื้องหลัง, จุดเด่น และรูปกลิ่นฮิตได้จากที่เดียว โดยไม่ต้องแก้โค้ด</p></div><span className="admin-count">{mediaSlots.length} ช่อง</span></div>
              <div className="admin-media-grid">
                {mediaSlots.map(([assetKey, label, kind]) => {
                  const asset = catalogQuery.data?.media?.find((item) => item.assetKey === assetKey);
                  const isVideo = asset?.mimeType.startsWith("video/") || kind === "video";
                  return <article className="admin-media-card" key={assetKey}>
                    <div className="admin-media-preview">
                      {asset?.url ? (isVideo ? <video src={asset.url} muted controls preload="metadata" /> : <img src={asset.url} alt={label} />) : <div><ImagePlus size={25} /><span>ใช้ไฟล์สำรองของเว็บ</span></div>}
                    </div>
                    <div className="admin-media-card-copy"><strong>{label}</strong><small>{kind === "video" ? "วิดีโอ MP4/WebM ไม่เกิน 50 MB" : "รูปภาพ JPG/PNG/WebP ไม่เกิน 50 MB"}</small></div>
                    <label className="admin-device-upload-button">{uploadingAssetKey === assetKey ? <Loader2 className="spin" size={15} /> : <UploadCloud size={15} />}{uploadingAssetKey === assetKey ? "กำลังอัปโหลด" : asset?.url ? "เปลี่ยนไฟล์" : "อัปโหลดไฟล์"}<input ref={(element) => { mediaInputs.current[assetKey] = element; }} type="file" accept={kind === "video" ? "video/*" : "image/*"} onChange={(event) => void uploadMediaAsset(assetKey, label, kind, event.target.files?.[0])} disabled={uploadingAssetKey === assetKey} /></label>
                  </article>;
                })}
              </div>
            </section>

            <section className="admin-section admin-pixel-section">
              <div className="admin-section-heading"><div><p className="admin-kicker">META ADS TRACKING</p><h2>ตั้งค่า Meta Pixel</h2><p>ใส่ Pixel ID จาก Meta Events Manager เพื่อวัด PageView, เปิดดูแพ็กเกจ และคลิกไป LINE</p></div><span className="admin-count">{metaPixelId ? "เปิดใช้งาน" : "ยังไม่ตั้งค่า"}</span></div>
              <div className="admin-pixel-form">
                <label>Meta Pixel ID<input inputMode="numeric" placeholder="เช่น 123456789012345" value={metaPixelId} onChange={(event) => setMetaPixelId(event.target.value.replace(/\D/g, "").slice(0, 30))} /></label>
                <button type="button" className="primary-button admin-save-button" onClick={() => void saveMetaPixelId()} disabled={savingMetaPixel}>{savingMetaPixel ? <Loader2 className="spin" size={16} /> : <Save size={16} />} บันทึก Pixel ID</button>
              </div>
              <p className="admin-pixel-help">ระบบจะไม่โหลดสคริปต์ Meta หากช่องนี้ว่าง และจะไม่เก็บข้อมูลส่วนบุคคลผ่าน event ของเว็บนี้</p>
            </section>

            <section className="admin-section admin-analytics-section">
              <div className="admin-section-heading"><div><p className="admin-kicker">CLICK ANALYTICS</p><h2>สถิติความสนใจ</h2><p>นับจากการเปิดดูแพ็กเกจ การยืนยันตัวเลือก และการกดไปต่อใน LINE</p></div><span className="admin-count">อัปเดตอัตโนมัติ</span></div>
              <div className="admin-analytics-total-grid">
                {[{ key: "package_view", label: "เปิดดูแพ็กเกจ" }, { key: "package_select", label: "ยืนยันตัวเลือก" }, { key: "line_click", label: "คลิก LINE" }].map((item) => <div className="admin-analytics-total" key={item.key}><span>{item.label}</span><strong>{Number(analyticsQuery.data?.totals.find((total) => total.eventName === item.key)?.count ?? 0)}</strong></div>)}
              </div>
              <div className="admin-analytics-table-wrap"><table className="admin-analytics-table"><thead><tr><th>แพ็กเกจ</th><th>เปิดดู</th><th>เลือก</th><th>ไป LINE</th></tr></thead><tbody>{["A", "B", "C", "D"].map((code) => { const row = analyticsQuery.data?.packages.find((item) => item.packageCode === code); return <tr key={code}><th>Set {code}</th><td>{Number(row?.packageViews ?? 0)}</td><td>{Number(row?.packageSelections ?? 0)}</td><td className="is-strong">{Number(row?.lineClicks ?? 0)}</td></tr>; })}</tbody></table></div>
            </section>

            <section className="admin-section">
              <div className="admin-section-heading"><div><p className="admin-kicker">SCENT CATALOG</p><h2>กลิ่นตัวอย่าง 40 กลิ่น</h2><p>แก้ชื่อกลิ่นและหมวดหมู่ได้เอง รายการนี้จะแสดงใต้โปรโมชั่น 4 แพ็กเกจ</p></div><span className="admin-count">{scents.length} กลิ่น</span></div>
              <div className="admin-scent-groups">
                {Object.entries(groupedScents).map(([category, items]) => (
                  <div className="admin-scent-group" key={category}>
                    <h3>{category} <span>{items.length}</span></h3>
                    <div className="admin-scent-list">
                      {items.map((scent) => {
                        const current = editingScents[scent.id] ?? { name: scent.name, category: scent.category };
                        return <div className="admin-scent-row" key={scent.id}><span className="scent-number">{scent.sortOrder}</span><input value={current.name} onChange={(event) => setEditingScents((all) => ({ ...all, [scent.id]: { ...current, name: event.target.value } }))} /><input value={current.category} onChange={(event) => setEditingScents((all) => ({ ...all, [scent.id]: { ...current, category: event.target.value } }))} /><button type="button" className="secondary-button" onClick={() => void saveScent(scent)}>บันทึก</button></div>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
