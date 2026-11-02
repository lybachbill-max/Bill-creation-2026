from PIL import Image, ImageDraw, ImageFont
W,H=740,1050  # A5 portrait, 5 px = 1 mm
B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; R="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
f=lambda p,s: ImageFont.truetype(p,s)
def grad(d,box,stops,horiz=True):
    x0,y0,x1,y1=box; n=(x1-x0) if horiz else (y1-y0)
    for i in range(n):
        t=i/max(n-1,1)
        for k in range(len(stops)-1):
            p0,c0=stops[k]; p1,c1=stops[k+1]
            if p0<=t<=p1:
                u=(t-p0)/(p1-p0) if p1>p0 else 0
                c=tuple(int(c0[j]+(c1[j]-c0[j])*u) for j in range(3)); break
        if horiz: d.line([(x0+i,y0),(x0+i,y1)],fill=c)
        else: d.line([(x0,y0+i),(x1,y0+i)],fill=c)
ORA=[(0,(255,204,0)),(.4,(247,148,29)),(.7,(255,204,0)),(1,(247,148,29))]
GY=[(0,(214,224,90)),(1,(255,249,196))]
GB=[(0,(16,60,20)),(.5,(77,184,72)),(1,(91,186,71))]
DG=(16,74,30); TYPE=(242,101,34); PINK=(230,0,126)
def logo(d,x,y,s):
    d.rounded_rectangle([x,y,x+3.6*s,y+s],radius=s//5,fill=DG,outline=(0,0,0),width=2)
    d.text((x+8,y+s*0.18),"LOGO*",font=f(B,int(s*.45)),fill="white")
    d.text((x,y-s*0.75),"Mr.",font=f(B,int(s*.6)),fill="black")
def note(d,x,y,t,s=15): d.text((x,y),t,font=f(R,s),fill=PINK)

# ---------- cover ----------
im=Image.new("RGB",(W,H),"white"); d=ImageDraw.Draw(im)
sq=60  # 1 square = logo rectangle height
top=150
grad(d,(0,top+sq*2//5,W,H-170),[(0,(205,232,240)),(1,(150,205,90))],horiz=False)
grad(d,(0,top+sq*2//5-3,W,top+sq*2//5+3),ORA)
logo(d,60,top,sq)
gy0=top+sq*3
grad(d,(0,gy0,W,gy0+2*sq),GB)
d.text((60,gy0+18),"PRODUCT NAME",font=f(B,34),fill="white")
d.text((60,gy0+66),"SUBLINE",font=f(B,22),fill="white")
d.rectangle([W-200,gy0+16,W-30,gy0+58],fill=TYPE); d.text((W-190,gy0+24),"TYPE / ART.",font=f(B,22),fill="white")
d.rectangle([180,gy0+2*sq+60,W-60,H-260],outline=(90,90,90),width=3)
d.text((300,(gy0+H)//2-40),"PRODUCT IMAGE",font=f(B,28),fill=(90,90,90))
grad(d,(0,H-170-4,W,H-170+2),GY)
d.text((60,H-160),"BEDIENUNGSANLEITUNG / ORIGINAL-BETRIEBSANLEITUNG",font=f(B,20),fill="black")
d.text((60,H-128),"hergestellt für: hagebau Handelsgesellschaft für Baustoffe mbH & Co. KG",font=f(R,15),fill="black")
d.text((60,H-106),"Celler Straße 47, D-29614 Soltau · www.hagebau.de · [e-mail ___]",font=f(R,15),fill="black")
d.text((60,H-78),"Art.-Nr./IAN [___]   Typ [___]   Version V[YYYYMM]   [MM/YY]",font=f(R,15),fill="black")
note(d,60,20,"WIREFRAME – COVER (A5 portrait, recommended)",18)
note(d,60,45,"White zone above orange line (DM p.22)",15)
note(d,60,top+sq+12,"Logo rectangle sits on orange line, 2:3 (DM p.18)",14)
note(d,60,gy0+2*sq+8,"Green bar 80/0/100/75 → 70/0/100/0 → 65/0/100/0 (DM p.19)",14)
note(d,60,gy0+2*sq+28,"Name: Impact, white, CAPS; type box CMYK 0/75/100/0 (DM p.30, 35)",14)
note(d,60,H-196,"Green-yellow line = end of layout; white below (DM p.17, 22)",14)
d.rectangle([0,0,W-1,H-1],outline="black",width=2)
im.save("../cover_wireframe.png")

# ---------- inner page ----------
im=Image.new("RGB",(W,H),"white"); d=ImageDraw.Draw(im)
s2=34
logo(d,W-170,70,s2)
grad(d,(0,70+s2*2//5-2,W-175,70+s2*2//5+2),ORA)
d.text((60,140),"3  SICHERHEITSHINWEISE",font=f(B,28),fill=DG)
d.rectangle([60,190,W-60,300],outline=(0,0,0),width=2)
d.polygon([(80,280),(110,210),(140,280)],fill=(255,204,0),outline="black")
d.text((112,240),"!",font=f(B,30),fill="black",anchor="mm")
d.text((160,200),"WARNUNG",font=f(B,22),fill="black")
d.text((160,232),"Type & source of hazard / consequence /",font=f(R,16),fill="black")
d.text((160,256),"how to avoid it  (EN IEC/IEEE 82079-1 safety notice)",font=f(R,16),fill="black")
for i,y in enumerate(range(330,640,34)):
    d.text((60,y),"•  Body text, Univers Regular, 100 % K",font=f(R,17),fill="black")
d.rectangle([60,660,W-60,900],outline=(90,90,90),width=2)
d.text((230,770),"LINE DRAWING (vector, b/w)",font=f(B,20),fill=(90,90,90))
grad(d,(0,H-80,W,H-76),GY)
d.text((60,H-62),"Mr. GARDENER · [Product] · Art.-Nr. [___]",font=f(R,14),fill="black")
d.text((W-160,H-62),"V[YYYYMM]   7",font=f(R,14),fill="black")
note(d,60,14,"WIREFRAME – INNER PAGE (no photo background)",18)
note(d,60,110,"Header: logo (normal) right + orange line",14)
note(d,60,H-110,"Footer: green-yellow line, brand/article, version, page no.",14)
d.rectangle([0,0,W-1,H-1],outline="black",width=2)
im.save("../inner_wireframe.png")
