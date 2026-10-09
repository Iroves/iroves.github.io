from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import random,math
root=Path(__file__).parent
art=Image.open('/mnt/data/gritty_tropical_graffiti_artist_poster.png').convert('RGB')
art.save(root/'assets'/'art-by-gussi.webp','WEBP',quality=91,method=6)
# Inky grunge with spray-paint flecks for the clickable navigation, no baked-in buttons.
random.seed(26491)
w,h=1100,390
im=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(im)
for cx,cy,colors in [(-40,320,[(8,203,203,180),(2,139,149,170)]),(w+10,120,[(236,42,125,200),(255,73,145,155)]),(w*.58,h+20,[(255,102,67,105)]),(-30,-70,[(0,183,185,140)])]:
 for i in range(1000):
  a=random.random()*math.tau
  r=(random.random()**.7)*random.choice([130,220,370,460])
  x=cx+math.cos(a)*r*random.uniform(.48,1.4)
  y=cy+math.sin(a)*r*.6
  size=random.choices([1,2,3,4,8,14,22],[25,25,20,15,10,4,1])[0]
  c=random.choice(colors)
  d.ellipse((x-size/2,y-size/2,x+size/2,y+size/2),fill=c)
for k in range(45):
 x=random.randint(0,w)
 y=random.choice([random.randint(0,38),random.randint(h-55,h)])
 length=random.randint(25,190)
 d.line((x,y,x+length,y+random.randint(-15,15)),fill=random.choice([(244,79,136,68),(17,209,208,73),(250,133,86,70),(244,237,200,58)]),width=random.randint(1,4))
im.save(root/'assets'/'spray-overlay.webp','WEBP',quality=89,method=6)
print('poster', (root/'assets'/'art-by-gussi.webp').stat().st_size,'texture',(root/'assets'/'spray-overlay.webp').stat().st_size)
