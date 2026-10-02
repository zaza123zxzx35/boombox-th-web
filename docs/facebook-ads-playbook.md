# BOOMBOX TH — Facebook Ads Playbook

## 1. เป้าหมายและ Measurement

อย่า optimize จาก PageView อย่างเดียว เป้าหมายหลักคือ **Qualified LINE conversation** และยอดสั่งซื้อที่ตรวจสอบได้จาก LINE OA

### Event funnel

```text
Ad impression
→ Landing page view
→ Engaged session (>10 sec)
→ package_view
→ line_click
→ LINE conversation
→ LINE add friend
→ order
```

### UTM มาตรฐาน

```text
utm_source=facebook
&utm_medium=paid_social
&utm_campaign=set-a-cold
&utm_content=video-demo-01
```

ใช้ชื่อ campaign แยกชัดเจน เช่น:

```text
BT_COLD_Prospecting_SetA
BT_WARM_VideoView25
BT_HOT_PackageView7D
BT_HOT_LineClickNoOrder7D
```

## 2. Campaign Structure

### Campaign A: Cold / Prospecting

**Objective:** Traffic หรือ Sales/Conversions ตาม event volume ที่มีจริง  
**Optimization ช่วงเริ่มต้น:** Landing Page View หรือ Engaged session  
**งบแนะนำ:** 60–70% ของงบทั้งหมด

กลุ่มเป้าหมาย:

- อายุ/พื้นที่ตามข้อกำหนดของธุรกิจและแพลตฟอร์ม
- คนสนใจ lifestyle, gadget, ของพกพา และพฤติกรรมซื้อออนไลน์
- Broad audience 1 ชุด เพื่อให้ Meta หา pattern เอง
- Lookalike จากคนที่มีคุณภาพ เช่น LINE conversation, package_view หรือ order — ไม่ใช้ PageView อย่างเดียว

อย่าใช้ interest จำนวนมากซ้อนกันใน Ad Set เดียว เพราะจะไม่รู้ว่า audience ใดทำงานจริง

#### Cold Ad 1: Product Demo

**Primary text**

> อยากมีตัวเลือกกลิ่นไว้เปลี่ยนระหว่างวันไหม?  
> BoomBox TH คืออุปกรณ์เปลี่ยนกลิ่นจากเม็ดบีท ใช้งาน 3 ขั้นตอน: เลือกสีเครื่อง → ใส่เม็ด → กดใช้  
> 
> Set A เริ่มต้น ฿299 ได้เครื่อง 1 เครื่อง เลือกสีดำ/ขาว + เม็ดรวม 100 เม็ด สุ่มจาก 40 กลิ่น  
> ส่งฟรี และเก็บเงินปลายทางได้

**Headline**

> Set A ฿299 · ส่งฟรี · เก็บเงินปลายทาง

**Description**

> ดูวิธีใช้และเลือก Set ที่เหมาะกับคุณ

**CTA:** Learn More หรือ Send Message ตาม objective ที่เลือก

#### Cold Ad 2: Beginner Offer

**Primary text**

> ยังไม่เคยลอง? เริ่มจาก Set A ได้เลย  
> เครื่อง 1 เครื่อง เลือกสีดำ/ขาว + เม็ดรวม 100 เม็ดจาก 40 กลิ่น  
> ราคา ฿299 ส่งฟรี ไม่ต้องโอนก่อน

**Headline**

> เริ่มต้นง่ายด้วย Set A

**CTA:** Learn More

#### Cold Ad 3: Education / Scent Guide

**Primary text**

> ไม่รู้จะเริ่มจากกลิ่นไหน?  
> ทัก LINE รับรายการ 40 กลิ่น และให้ทีมงานช่วยแนะนำ Set ที่เหมาะกับคุณฟรี  
> ไม่ต้องโอนก่อน และไม่จำเป็นต้องเลือกกลิ่นเองทันที

**Headline**

> รับรายการ 40 กลิ่นฟรี

**CTA:** Send Message หรือ Learn More

### Campaign B: Warm Retargeting

**กลุ่มเป้าหมาย:**

- คนดูวิดีโอ 25% หรือ 50% ใน 14 วัน
- Website visitors 14 วัน
- Engaged session มากกว่า 10 วินาที
- คนเลื่อนถึง Package หรือ Proof section

**งบแนะนำ:** 20–25%

#### Warm Ad 1: Reminder

**Primary text**

> แวะมาดู BoomBox TH แล้ว ยังเลือก Set ไม่ได้ใช่ไหม?  
> ทีมงานช่วยแนะนำสีเครื่อง กลิ่น และจำนวนตลับให้เหมาะกับการใช้งานได้ฟรี  
> เริ่มจาก Set A ฿299 ส่งฟรี เก็บเงินปลายทาง

**Headline**

> ให้ทีมงานช่วยเลือก Set ฟรี

**CTA:** Send Message

#### Warm Ad 2: Proof + Clarity

**Primary text**

> ก่อนเลือก ดูรายละเอียดให้ครบในหน้าเว็บได้เลย  
> Set A: 100 เม็ด / 1 ตลับ / สุ่ม 40 กลิ่น  
> Set B: 200 เม็ด / 2 ตลับ / เลือก 2 กลิ่น  
> Set C: 400 เม็ด / 4 ตลับ / เลือก 4 กลิ่น  
> Set D: 600 เม็ด / 6 ตลับ / เลือก 6 กลิ่น  
> ทุก Set ส่งฟรีและเก็บเงินปลายทาง

**Headline**

> เทียบ Set ให้ชัดก่อนสั่ง

**CTA:** Learn More

### Campaign C: Hot Retargeting

**กลุ่มเป้าหมาย:**

- เปิด Modal Package ใน 7 วัน
- `package_view` ใน 7 วัน
- `package_select` แต่ยังไม่มี LINE conversation/order
- คลิก LINE แล้วไม่มี order ใน 7 วัน — กลุ่มนี้ต้องใช้ข้อมูลจาก LINE OA หรือ CRM ร่วมด้วย

**งบแนะนำ:** 10–20%

#### Hot Ad 1: Help Before Purchase

**Primary text**

> ยังไม่แน่ใจเรื่องสีหรือกลิ่นใช่ไหม?  
> ส่งคำถามให้ทีมงานทาง LINE ได้เลย ทีมงานช่วยเลือกให้ก่อนสั่ง ไม่ต้องโอนก่อน

**Headline**

> ถามทีมงานก่อนสั่งได้เลย

**CTA:** Send Message

#### Hot Ad 2: Set A Decision

**Primary text**

> ถ้าอยากเริ่มแบบไม่ต้องคิดเยอะ ให้เริ่มจาก Set A ฿299  
> ได้เครื่อง 1 เครื่อง เลือกสีดำ/ขาว + เม็ดรวม 100 เม็ด สุ่มจาก 40 กลิ่น  
> ส่งฟรี เก็บเงินปลายทาง

**Headline**

> เริ่มที่ Set A ฿299

**CTA:** Send Message

## 3. Creative Direction

### Cold

- ใช้คลิปสั้น 6–15 วินาที
- เฟรมแรกต้องเห็น “เครื่อง + เม็ด + ผลลัพธ์”
- ใส่ text overlay ให้อ่านได้แม้ปิดเสียง:
  - `เลือกกลิ่น`
  - `ใส่เม็ด`
  - `กดใช้ใน 3 วินาที`
  - `Set A ฿299`
- อย่าเปิดด้วยโลโก้ยาวหรือภาพที่ยังไม่รู้ว่าสินค้าคืออะไร

### Warm

- ใช้ภาพ Set จริง, ตารางสรุป หรือรีวิวภาพจริง
- แสดงจำนวนเครื่อง/ตลับ/กลิ่นให้ครบ
- CTA ควรเป็น “ให้ทีมงานช่วยเลือก” มากกว่า “ซื้อเลย”

### Hot

- ใช้ภาพสินค้าที่ผู้ใช้เปิดดู
- แสดงสีและจำนวนตลับที่เลือกได้
- ลดความเสี่ยงด้วย “ไม่ต้องโอนก่อน / ส่งฟรี / คุยก่อนสั่งได้”

## 4. Exclusions และการคัดกรอง

Exclude หรือแยกกลุ่ม:

- ผู้ที่ดูหน้าเว็บต่ำกว่า 5 วินาที หากต้องการสร้าง lookalike คุณภาพ
- ลูกค้าที่สั่งแล้ว ออกจาก Cold/Hot acquisition
- คนที่อยู่นอกพื้นที่จัดส่งตามเงื่อนไขธุรกิจ
- กลุ่มอายุ/เนื้อหาที่ไม่สอดคล้องกับ policy ของ Meta และกฎหมายที่เกี่ยวข้อง
- Placements ที่ CTR สูงแต่ engaged session ต่ำมาก

อย่าใช้คำโฆษณาเกินจริง เช่น “รับรองผล”, “ดีที่สุด”, “เปลี่ยนชีวิต” หรือสร้าง urgency ปลอม

## 5. Testing Plan 14 วัน

### วัน 1–3: ตรวจ Tracking

- เช็ก UTM ถึง server
- ทดสอบ `line_click` จาก Hero, Header, Sticky และ Package
- ตรวจว่ามี event ในฐานข้อมูลหลังออกไป LINE
- ทดสอบ iOS Safari, Android Chrome และ in-app browser

### วัน 4–7: Creative test

ทดสอบทีละตัวแปร:

- Demo video vs product photo
- “รับรายการ 40 กลิ่นฟรี” vs “ช่วยเลือก Set ฟรี”
- Set A ฿299 vs 3-step education

### วัน 8–14: Funnel test

- Cold ส่งไป Hero
- Warm ส่งไป Proof/Package
- Hot ส่งเข้า LINE โดยตรง
- ตัด creative ที่มี click แต่ไม่มี engaged session หรือ package_view

## 6. KPI ที่ใช้ตัดสินใจ

| Metric | ใช้ตอบคำถาม |
|---|---|
| CTR | โฆษณาดึงดูดหรือไม่ |
| Landing Page View rate | คนคลิกแล้วหน้าโหลดสำเร็จหรือไม่ |
| Engaged session rate | Traffic ตรงกลุ่มหรือไม่ |
| Package view rate | Offer น่าสนใจหรือไม่ |
| LINE click rate | CTA/เหตุผลแอดทำงานหรือไม่ |
| Qualified LINE rate | คนที่ทักมี intent หรือไม่ |
| Add-friend rate | LINE OA เปลี่ยนคนเป็น contact ได้หรือไม่ |
| Cost per qualified conversation | ต้นทุนต่อ lead ที่ใช้งานได้จริง |
| Order rate | สุดท้ายขายได้หรือไม่ |

**เกณฑ์ตัดสินใจ:** ถ้า CTR ดีแต่ Engaged session ต่ำ ให้แก้ targeting/creative mismatch; ถ้า Engaged session ดีแต่ LINE click ต่ำ ให้แก้ Hero/Offer/Trust; ถ้า LINE click ดีแต่ add friend/order ต่ำ ให้แก้ LINE script, response time, ราคา หรือความน่าเชื่อถือ
