"""Original, periodic motion graphics. Requires Python, numpy, Pillow, ffmpeg."""
from pathlib import Path
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path.cwd()
OUT = ROOT / 'Matrix_Cards_Pack'
ASSETS = OUT / 'assets'
ASSETS.mkdir(parents=True, exist_ok=True)
W, H, FPS, SECONDS = 720, 1280, 30, 8
TAU = math.tau
FONT_PATH = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
FONT_BOLD_PATH = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
GLYPHS = '012345789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}:;=+|/\\λΩΣΨ∆'
rng = np.random.default_rng(117)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
background = np.zeros((H,W,3),np.float32)
background[:] = [1,6,5]
def haze(cx,cy,rx,ry,color):
    return np.exp(-((xx-cx)/rx)**2-((yy-cy)/ry)**2)[...,None]*np.array(color)
background += haze(375,400,300,510,[1,13,6])
background += haze(50,690,240,330,[0,7,4])
background += haze(660,520,210,420,[0,10,4])
background *= (1-.14*(yy/H))[...,None]
BASE = Image.fromarray(np.uint8(np.clip(background,0,255)),'RGB')
FONTS = {}
SPRITES = {}
def glyph(char,size,level=15,near=False,white=False):
    size = max(7,min(58,int(size)))
    level = max(0,min(15,int(level)))
    key=(char,size,level,near,white)
    if key in SPRITES:return SPRITES[key]
    fk=(size,near)
    if fk not in FONTS:FONTS[fk]=ImageFont.truetype(FONT_BOLD_PATH if near else FONT_PATH,size)
    im=Image.new('RGBA',(size+4,round(size*1.35)+4))
    color=(206,255,229) if white else ((104,239,167) if near else (38,211,112))
    ImageDraw.Draw(im).text((1,0),char,font=FONTS[fk],fill=(*color,round(level/15*255)),stroke_width=0)
    SPRITES[key]=im
    return im

def place(layer,sprite,x,y):
    x,y=int(round(x)),int(round(y))
    if x>=W or y>=H or x+sprite.width<=0 or y+sprite.height<=0:return
    layer.alpha_composite(sprite,(x,y))

columns=[]
for i in range(27):
    columns.append({
        'x':11+i*26+rng.uniform(-4,4),
        'offset':rng.uniform(0,1),
        'loops':int(rng.choice([1,1,2,2,3])),
        'tail':int(rng.integers(11,23)),
        'chars':rng.integers(0,len(GLYPHS),size=51),
        'swaps':rng.uniform(0,4,size=51),
        'depth':float(rng.uniform(.60,1)),
    })
near_columns=[{'x':x,'offset':off,'loops':loops,'chars':rng.integers(0,len(GLYPHS),size=38)}
              for x,off,loops in [(69,.21,2),(622,.72,2),(684,.12,1)]]

def code_rain(t):
    u=(t/SECONDS)%1
    layer=Image.new('RGBA',(W,H))
    for ci,c in enumerate(columns):
        head=((c['offset']+u*c['loops'])%1)*H
        for j in range(51):
            y=j*26-10
            distance=(head-y)%H
            trail=math.exp(-distance/(c['tail']*19))
            if distance>c['tail']*30:trail*=.17
            brightness=.07+trail*.90
            x=c['x']+2*math.sin(TAU*u+ci*.58)
            # A quieter central area keeps the live profile text legible.
            centre=math.exp(-((x-360)/225)**2-((y-650)/500)**2)
            strength=brightness*c['depth']*(1-.44*centre)
            level=round(strength*15)
            if level<1:continue
            ch=GLYPHS[(int(c['chars'][j])+int((u*4+c['swaps'][j])%4))%len(GLYPHS)]
            white=distance<29
            place(layer,glyph(ch,18,level,white=white),x,y)
    for ci,c in enumerate(near_columns):
        head=((c['offset']+u*c['loops'])%1)*H
        for j in range(38):
            y=j*35-20
            distance=(head-y)%H
            strength=math.exp(-distance/185)*.72
            if distance>480:continue
            level=round(strength*15)
            if level<1:continue
            ch=GLYPHS[int(c['chars'][j])]
            place(layer,glyph(ch,25,level,near=True,white=distance<32),c['x'],y)
    image=BASE.convert('RGBA')
    image=Image.alpha_composite(image,layer.filter(ImageFilter.GaussianBlur(5)))
    image=Image.alpha_composite(image,layer)
    scan=Image.new('RGBA',(W,H))
    draw=ImageDraw.Draw(scan)
    for y in range(0,H,4):draw.line((0,y,W,y),fill=(0,4,2,24))
    # A slow, low-intensity scan passes once each loop without a bright flash.
    y=int(u*H)
    draw.line((0,y,W,y),fill=(35,144,83,26),width=1)
    image=Image.alpha_composite(image,scan)
    return image.convert('RGB')

TUNNEL_RINGS=26
TUNNEL_SPOKES=30
tunnel_chars=rng.integers(0,len(GLYPHS),size=(TUNNEL_RINGS,TUNNEL_SPOKES))
tunnel_radii=rng.uniform(255,410,size=TUNNEL_SPOKES)
tunnel_offsets=rng.uniform(0,1,size=TUNNEL_SPOKES)

def code_tunnel(t):
    u=(t/SECONDS)%1
    phase=TAU*u
    layer=Image.new('RGBA',(W,H))
    draw=ImageDraw.Draw(layer)
    cx,cy=360+8*math.sin(phase),469+10*math.cos(phase)
    twist=.08*math.sin(phase)
    # Perspective rails give depth without filling the centre with bright code.
    for a in np.linspace(0,TAU,18,endpoint=False):
        ang=float(a)+twist
        ca,sa=math.cos(ang),math.sin(ang)
        inner=(cx+ca*82,cy+sa*102)
        outer=(cx+ca*980,cy+sa*1230)
        draw.line((*inner,*outer),fill=(31,130,81,25),width=1)
    points=[]
    for ring in range(TUNNEL_RINGS):
        for spoke in range(TUNNEL_SPOKES):
            z=((ring/TUNNEL_RINGS*1740+tunnel_offsets[spoke]*30-u*1740*2)%1740)+65
            angle=TAU*spoke/TUNNEL_SPOKES+twist+.025*math.sin(phase+ring*.45)
            radius=float(tunnel_radii[spoke])
            factor=610/z
            x=cx+math.cos(angle)*radius*factor
            y=cy+math.sin(angle)*radius*factor*1.21
            size=int(25*factor)
            if x<-60 or x>W+30 or y<-60 or y>H+30:continue
            # Fade characters as they enter from the far plane.
            farfade=min(1,max(0,(1805-z)/310))
            strength=(.24+.58*(1-z/1805))*farfade
            strength*=.91+.09*math.sin(phase+ring)
            level=int(strength*15)
            if level<1:continue
            white=(spoke+ring)%23==0 and z<480
            char=GLYPHS[int(tunnel_chars[ring,spoke])]
            points.append((z,char,size,level,x,y,white))
    # Far-to-near rendering makes the tunnel's moving glyphs feel layered.
    for z,char,size,level,x,y,white in sorted(points,reverse=True):
        sprite=glyph(char,size,level,near=z<480,white=white)
        place(layer,sprite,x-sprite.width/2,y-sprite.height/2)
    image=BASE.convert('RGBA')
    image=Image.alpha_composite(image,layer.filter(ImageFilter.GaussianBlur(4)))
    image=Image.alpha_composite(image,layer)
    # A subtle central reticle adds an interface motif, never a flashing strobe.
    reticle=Image.new('RGBA',(W,H))
    d=ImageDraw.Draw(reticle)
    r=53+3*math.sin(phase)
    for start in [15,105,195,285]:
        d.arc((cx-r,cy-r*1.21,cx+r,cy+r*1.21),start,start+20,fill=(75,175,118,68),width=1)
    d.line((cx-7,cy,cx+7,cy),fill=(126,195,151,80),width=1)
    d.line((cx,cy-7,cx,cy+7),fill=(126,195,151,80),width=1)
    image=Image.alpha_composite(image,reticle)
    # Fade the lower area to support contact details on a portrait card.
    shade=np.zeros((H,W,4),np.uint8)
    shade[:,:,0:3]=[1,6,5]
    shade[:,:,3]=(np.clip((yy-830)/450,0,1)*115).astype(np.uint8)
    image=Image.alpha_composite(image,Image.fromarray(shade,'RGBA'))
    return image.convert('RGB')

def encode(name,render):
    args=['ffmpeg','-y','-hide_banner','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}',
          '-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p',
          '-movflags','+faststart',str(ASSETS/f'{name}.mp4')]
    first=render(0)
    assert np.array_equal(np.asarray(first),np.asarray(render(SECONDS))),f'{name} loop endpoint mismatch'
    first.save(ASSETS/f'{name}-poster.jpg',quality=95)
    samples=[]
    proc=subprocess.Popen(args,stdin=subprocess.PIPE)
    for frame in range(FPS*SECONDS):
        im=first if frame==0 else render(frame/FPS)
        proc.stdin.write(im.tobytes())
        if frame%60==0:
            samples.append(im.resize((180,320),Image.Resampling.LANCZOS))
            print(f'{name}: frame {frame}/{FPS*SECONDS}',flush=True)
    proc.stdin.close()
    if proc.wait()!=0:raise RuntimeError('Encoding failed')
    sheet=Image.new('RGB',(720,320))
    for i,im in enumerate(samples):sheet.paste(im,(i*180,0))
    sheet.save(ROOT/f'{name}-contact-sheet.png')
    print(f'{name}: complete, exact loop endpoint verified',flush=True)

if __name__=='__main__':
    encode('digital-rain',code_rain)
    encode('code-tunnel',code_tunnel)
