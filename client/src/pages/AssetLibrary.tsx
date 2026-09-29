import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, FileUp, Image as ImageIcon, Loader2, LogOut, UploadCloud } from "lucide-react";
import { Link } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error ?? new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.readAsDataURL(file);
  });
}

export default function AssetLibrary() {
  const { user, loading, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const utils = trpc.useUtils();
  const filesQuery = trpc.files.list.useQuery(undefined, { enabled: Boolean(user), retry: false });
  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: async () => {
      await utils.files.list.invalidate();
      setNotice({ type: "success", text: "อัปโหลดไฟล์และบันทึกข้อมูลเรียบร้อยแล้ว" });
    },
    onError: (error) => setNotice({ type: "error", text: error.message || "อัปโหลดไฟล์ไม่สำเร็จ" }),
  });

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) return;
    setNotice(null);
    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`${file.name} มีขนาดเกิน 10 MB`);
        }
        const data = await fileToBase64(file);
        await uploadMutation.mutateAsync({
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          data,
        });
      }
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "อัปโหลดไฟล์ไม่สำเร็จ" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return <div className="asset-page asset-centered"><Loader2 className="spin" size={28} /></div>;
  }

  if (!user) {
    return (
      <div className="asset-page asset-centered">
        <div className="asset-login-card">
          <div className="asset-icon"><UploadCloud size={28} /></div>
          <p className="asset-kicker">BOOMBOX TH / PRIVATE STORAGE</p>
          <h1>เข้าสู่ระบบเพื่อจัดการไฟล์</h1>
          <p>คลังไฟล์นี้ใช้เก็บรูปภาพ วิดีโอ และเอกสารของคุณอย่างเป็นส่วนตัว</p>
          <button type="button" className="primary-button" onClick={() => startLogin()}>เข้าสู่ระบบ <ArrowLeft size={16} className="flip-x" /></button>
          <Link href="/" className="asset-back">กลับหน้าแรก</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-page">
      <header className="asset-header">
        <Link href="/" className="asset-brand"><span className="brand-mark">BB</span><span><strong>BOOMBOX TH</strong><small>ASSET LIBRARY</small></span></Link>
        <div className="asset-user"><span>{user.name || user.email || "บัญชีของฉัน"}</span><Link href="/admin" className="asset-admin-link">จัดการโปรโมชั่น</Link><button type="button" onClick={() => void logout()} aria-label="ออกจากระบบ"><LogOut size={16} /></button></div>
      </header>
      <main className="asset-main">
        <div className="asset-topline">
          <div>
            <Link href="/" className="asset-back"><ArrowLeft size={15} /> กลับหน้าโปรโมชั่น</Link>
            <p className="asset-kicker">FULL-STACK FILE STORAGE</p>
            <h1>คลังไฟล์ของคุณ</h1>
            <p className="asset-lead">อัปโหลดและเรียกใช้ไฟล์จาก Manus Storage ได้ทันที โดยระบบจะเก็บ metadata แยกไว้ในฐานข้อมูล</p>
          </div>
          <label className={`upload-button ${isUploading ? "disabled" : ""}`}>
            {isUploading ? <Loader2 size={18} className="spin" /> : <FileUp size={18} />}
            {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์"}
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,application/pdf" onChange={handleFiles} disabled={isUploading} />
          </label>
        </div>

        {notice && <div className={`asset-notice ${notice.type}`}><CheckCircle2 size={17} /> {notice.text}</div>}

        <section className="asset-panel">
          <div className="asset-panel-heading"><div><h2>ไฟล์ที่บันทึกไว้</h2><p>รองรับรูปภาพ วิดีโอ และ PDF ขนาดไม่เกิน 10 MB ต่อไฟล์</p></div><span>{filesQuery.data?.length ?? 0} ไฟล์</span></div>
          {filesQuery.isLoading ? (
            <div className="asset-empty"><Loader2 size={22} className="spin" /><p>กำลังโหลดรายการไฟล์...</p></div>
          ) : filesQuery.data?.length ? (
            <div className="asset-grid">
              {filesQuery.data.map((file) => (
                <article className="asset-card" key={file.id}>
                  <a href={file.url} target="_blank" rel="noreferrer" className="asset-preview">
                    {file.mimeType.startsWith("image/") ? <img src={file.url} alt={file.filename} /> : <div className="file-placeholder"><FileUp size={28} /></div>}
                  </a>
                  <div className="asset-card-copy"><strong title={file.filename}>{file.filename}</strong><span>{formatBytes(file.size)} · {file.mimeType}</span><a href={file.url} target="_blank" rel="noreferrer">เปิดไฟล์</a></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="asset-empty"><ImageIcon size={28} /><h3>ยังไม่มีไฟล์ในคลัง</h3><p>เริ่มจากอัปโหลดรูปภาพหรือไฟล์ที่ต้องการใช้กับเว็บไซต์</p><button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>เลือกไฟล์แรก</button></div>
          )}
        </section>
      </main>
    </div>
  );
}
