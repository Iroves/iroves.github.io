"""Generate an original seamless loop of stylised moving sunset surf for a website video background."""
from pathlib import Path
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
W,H,FPS,DURATION = 480,854,18,6
FRAMES=FPS*DURATION
out=Path(__file__).parent/'assets'
out.mkdir(exist_ok=True)
xx,yy=np.meshgrid(np.arange(W,dtype=np.float32),np.arange(H,dtype=np.float32))
x=xx/W
y=yy/H
# Sunset sky and water palettes. Original artwork adapted to tropical graffiti poster tones.
stops=np.array([[0.00,12,25,51],[0.17,29,88,103],[0.31,184,68,122],[0.405,246,111,99],[0.458,255,180,108],[0.47,7,74,91],[0.63,2,121,137],[0.82,7,79,120],[1.00,3,27,61]],np.float32)
base=np.zeros((H,W,3),np.float32)
for i in range(3): base[:,:,i]=np.interp(y,stops[:,0],stops[:,i+1])
# Landscape silhouette on horizon, always the same across video frames.
overlay=Image.new('RGBA',(W,H),(0,0,0,0)); dr=ImageDraw.Draw(overlay)
# distant cliffs and palms
cliff=[(0,int(.47*H)),(0,int(.409*H)),(30,int(.417*H)),(48,int(.44*H)),(73,int(.432*H)),(92,int(.462*H)),(144,int(.47*H))]
dr.polygon(cliff,fill=(3,32,48,255))
# low island on far right
dr.polygon([(350,398),(370,390),(399,393),(414,406),(480,403),(480,411),(350,411)],fill=(2,45,58,220))
import math
# Little palms on the cliffs
for cx,cy,height in [(39,367,34),(64,377,27),(88,382,19)]:
 dr.line((cx,cy,cx+3,cy-height),fill=(3,24,31,255),width=3)
 for a in np.linspace(-np.pi*.85,np.pi*.22,6):
  endx=cx+3+int(math.cos(a)*height*.65)
  endy=cy-height+int(math.sin(a)*height*.42)
  dr.line((cx+3,cy-height,endx,endy),fill=(3,25,33,255),width=2)
# horiz reflection sun and glow computed in numpy
overlay_arr=np.asarray(overlay).astype(np.float32)
# Texture grain - deterministic so it doesn't flicker
rng=np.random.default_rng(734)
noise=rng.normal(0,1,(H,W)).astype(np.float32)
# Start encoder
command=['ffmpeg','-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'beach-flow.mp4')]
proc=subprocess.Popen(command,stdin=subprocess.PIPE)
for fi in range(FRAMES):
 t=2*np.pi*fi/FRAMES
 frame=base.copy()
 # subtle soft cloudy streaks moving, periodic for a perfect loop
 sky=(y<.467).astype(np.float32)
 for ypos,width,r,g,b,phase in [(.15,.025,30,166,184,.8),(.256,.016,248,87,133,1.4),(.341,.012,255,182,119,2.1),(.39,.021,252,113,136,3.6)]:
  center=ypos+.007*np.sin(t+phase)+.008*np.sin(x*12+t+phase)
  cloud=np.exp(-((y-center)/width)**2)*(.55+.45*np.cos((x*8)+(t if phase<2 else -t)+phase)**2)
  frame += cloud[:,:,None]*np.array([r,g,b],np.float32)[None,None,:]*.14*sky[:,:,None]
 # sun at upper right with thick bloom and light-core
 cx,cy=.70,.376
 r2=((x-cx)/.14)**2+((y-cy)/.08)**2
 glow=np.exp(-r2*1.0)*.68 + np.exp(-r2*7.0)*1.00
 sunlight=np.stack([95*glow,68*glow,26*glow],axis=-1)*sky[:,:,None]
 frame+=sunlight
 disk=(((x-cx)/.043)**2+((y-cy)/.024)**2)<1
 frame[disk]=frame[disk]*.16+np.array([255,239,172])*.84
 # ocean surface subtle moving light interference, cyclic wave shift
 water=(y>=.467).astype(np.float32)
 v=(y-.467)/.533
 w1=np.sin(x*23+y*71+t*2 + .7*np.sin(y*24-t))
 w2=np.cos(x*52-y*160-t*2.0)
 w3=np.sin(x*124+y*145+t*3.0)
 ripple=(w1*.55+w2*.27+w3*.18)
 fac=(.22+.78*v)*water
 frame[:,:,0] += ripple*15*fac
 frame[:,:,1] += ripple*35*fac
 frame[:,:,2] += ripple*38*fac
 # shimmer: wavy gold reflected trail from sun near horizon, thin highlights
 reflected_center=cx+.052*np.sin(y*26-t*1.0)
 reflection=np.exp(-((x-reflected_center)/(.025+.21*v))**2)*(water)*(.9-v*.55)
 striping=(np.maximum(0,np.sin(y*475+17*np.sin(x*16+t)+t*2))**5)
 highlights=reflection*striping*105
 frame[:,:,0]+=highlights*1.6
 frame[:,:,1]+=highlights*1.15
 frame[:,:,2]+=highlights*.42
 # Long diagonal breakers; white foamy crest subtly advancing/retreating
 for ypos,amp,period,size,offset in [(.655,.017,1.6,.0035,1.4),(.769,.021,1.7,.0050,3.1),(.898,.024,1.8,.0060,5.2)]:
  crest=ypos+amp*np.sin((x*2*np.pi*period)+t+offset)+.012*np.sin(x*27-t*2+offset)
  wave_dist=y-crest
  foam=np.exp(-((wave_dist)/size)**2)*(.58+.42*np.sin(x*90+t*3+offset)**2)
  bubbly=np.exp(-((wave_dist-.010)/(.009+size))**2)*(np.sin(x*180+t*2+offset)**10)*.38
  ink=(foam+bubbly)*water
  frame += ink[:,:,None]*np.array([75,91,83],np.float32)[None,None,:]
 # Broad translucent cyan moving surf tongue at bottom edge
 tail=np.sin(y*20 + x*10 + t)*.5+.5
 frame[:,:,1]+=tail*water*(v**2)*17
 frame[:,:,2]+=tail*water*(v**2)*17
 # fine sand sparkle texture
 frame+=(noise[:,:,None]*1.75)
 # composite island in front of sea and sun
 alpha=overlay_arr[:,:,3:]/255
 frame=frame*(1-alpha)+overlay_arr[:,:,:3]*alpha
 frame=np.clip(frame,0,255).astype(np.uint8)
 if fi==0: Image.fromarray(frame).save(out/'beach-still.jpg',quality=86,optimize=True)
 proc.stdin.write(frame.tobytes())
proc.stdin.close()
ret=proc.wait()
assert ret==0, f'ffmpeg exit {ret}'
print('Generated:',out/'beach-flow.mp4',(out/'beach-flow.mp4').stat().st_size,'bytes')
