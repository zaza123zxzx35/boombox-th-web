export const LINE_ACCOUNT_ID = "@425syacj";
export const LINE_ADD_FRIEND_URL = `https://line.me/R/ti/p/${LINE_ACCOUNT_ID}`;

export type LinePackageSelection = {
  deviceColors?: string[];
  scents?: string[];
  note?: string;
};

export function createLineOrderMessage(
  pkg: { code: string; name: string; price: string },
  selection?: LinePackageSelection,
) {
  const lines = [`สวัสดีครับ สนใจแพ็กเกจ ${pkg.code} ${pkg.name} ราคา ${pkg.price} บาท จากเว็บไซต์ BoomBox TH`, `Set ${pkg.code}`, "", "รายละเอียด:"];
  if (selection?.deviceColors?.length) lines.push(`• สีเครื่อง: ${selection.deviceColors.join(" + ")}`);
  if (selection?.scents?.length) {
    selection.scents.forEach((scent, index) => lines.push(`• กล่องที่ ${index + 1}: ${scent}`));
  }
  if (selection?.note) lines.push(`• ${selection.note}`);
  lines.push("", "รบกวนแจ้งรายละเอียดการจัดส่งและวิธีชำระเงินให้ด้วยครับ");
  return lines.join("\n");
}

export function createLineOrderUrl(pkg: { code: string; name: string; price: string }, selection?: LinePackageSelection) {
  return `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ACCOUNT_ID)}/?${encodeURIComponent(createLineOrderMessage(pkg, selection))}`;
}
