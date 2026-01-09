/*
  script.js - Kindergarten (2017) art style pixel journey game
  - All characters: large heads (50%), thick outlines, bold colors
  - All backgrounds: textured ground, isometric perspective, thick outlines
  - Scenes 1-7: emotional journey from birth to today
*/

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const textbox = document.getElementById('textbox');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const sceneScreen = document.getElementById('scene-screen');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');

let sceneIndex = 0;
let isPlaying = false;
let lastTime = 0;
let sceneStartTime = 0;
let sceneProgress = 0;
let transition = null;

const SCENE_DURATION = 5200;
const TRANSITION_MS = 700;

function clear(){ ctx.clearRect(0,0,canvas.width,canvas.height); }
function lerp(a,b,t){ return a + (b-a)*t }
function px(x,y,w=1,h=1,color){ ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

// Outline helpers
function outlineRect(ctx, x, y, w, h, fillColor, outlineColor='#000000', outlineSize=2) {
  ctx.fillStyle = outlineColor;
  ctx.fillRect(x - outlineSize, y - outlineSize, w + outlineSize*2, h + outlineSize*2);
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, w, h);
}

function outlineCircle(ctx, x, y, radius, fillColor, outlineColor='#000000', outlineSize=2) {
  ctx.fillStyle = outlineColor;
  ctx.beginPath();
  ctx.arc(x, y, radius + outlineSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// AGE COUNTER DISPLAY - Shows character's age progression across all scenes
// Renders in top-right corner with fade effect
function drawAgeCounter(ctx, age, progress){
  const boxX = ctx.canvas.width - 50;
  const boxY = 8;
  const boxW = 42;
  const boxH = 18;
  
  // Fade in at start, fade out during transition
  let alpha = Math.min(1, progress * 4); // fade in
  if(progress > 0.85) alpha = Math.max(0, (1 - progress) / 0.15); // fade out at end
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Dark background box with thick outline
  ctx.fillStyle = '#000000';
  ctx.fillRect(boxX - 2, boxY - 2, boxW + 4, boxH + 4);
  
  // Main box (dark brown/black)
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  
  // White border accent
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);
  
  // Age text (bold, centered)
  ctx.fillStyle = '#FFFF00';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AGE', boxX + boxW/2, boxY + 7);
  ctx.font = 'bold 14px monospace';
  ctx.fillText(age.toString(), boxX + boxW/2, boxY + 14);
  
  ctx.restore();
}

<<<<<<< HEAD
const scenes = [
  // Scene 1: Toddler at home
  {
    id:'birth',
    text: "I don't even remember this so we can skip forward lol.\nThanks for taking care of me though mom. I love you!",
    draw(ctx,t,progress){
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      
      // Background: warm living room wall
      ctx.fillStyle = '#E8C4A0';
      ctx.fillRect(0, 0, W, H);
      
      // Floor: textured carpet/wood
      ctx.fillStyle = '#C9B396';
      ctx.fillRect(0, H*0.65, W, H*0.35);
      // Texture lines
      ctx.strokeStyle = '#B89A7C';
      ctx.lineWidth = 1;
      for(let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, H*0.65 + i*8);
        ctx.lineTo(W, H*0.65 + i*8);
        ctx.stroke();
      }
      
      // Furniture: toy box with thick outline
      outlineRect(ctx, 30, H*0.45, 32, 18, '#8B5A2B', '#000000', 2);
      // Toy poking out
      outlineRect(ctx, 40, H*0.35, 8, 10, '#FF4444', '#000000', 1);
      
      // Window with thick frame
      outlineRect(ctx, W-50, 20, 40, 30, '#87CEEB', '#000000', 2);
      
      // CHARACTER HEIGHT PROGRESSION SYSTEM
      // Scene 1 (Age 3): 24px total (head 12px, body 12px) - smallest/toddler proportions
      const bobY = Math.sin(t * 2) * 2;
      const charX = 80;
      const charY = H*0.58 + bobY;
      
      // Head (12px height for toddler)
      outlineRect(ctx, charX-6, charY-20, 12, 12, '#9D6B4A', '#000000', 2);
      
      // Hair (toddler - rounded afro/baby hair, PROMINENT and FULL COVERAGE)
      // Rounded top covering entire head
      outlineCircle(ctx, charX, charY - 22, 8, '#1a1a1a', '#000000', 2);
      // Hair texture/highlights
      px(ctx, charX - 3, charY - 24, 2, 1, '#2a2a2a');
      px(ctx, charX + 2, charY - 24, 2, 1, '#2a2a2a');
      
      // Large eyes
      outlineRect(ctx, charX-5, charY-18, 6, 5, '#FFFFFF', '#000000', 1);
      px(ctx, charX-3, charY-15, 2, 2, '#000000');
      
      outlineRect(ctx, charX+1, charY-18, 6, 5, '#FFFFFF', '#000000', 1);
      px(ctx, charX+3, charY-15, 2, 2, '#000000');
      
      // Mouth: happy smile
      px(ctx, charX-2, charY-10, 4, 1, '#8B5544');
      px(ctx, charX-1, charY-8, 2, 1, '#FF6B9D');
      
      // Body
      outlineRect(ctx, charX-6, charY-8, 12, 12, '#FFB6D9', '#000000', 2);
      
      // Arms
      outlineRect(ctx, charX-10, charY-4, 3, 6, '#9D6B4A', '#000000', 1);
      outlineRect(ctx, charX+7, charY-4, 3, 6, '#9D6B4A', '#000000', 1);
      
      // Legs
      outlineRect(ctx, charX-4, charY+6, 3, 6, '#9D6B4A', '#000000', 1);
      outlineRect(ctx, charX+1, charY+6, 3, 6, '#9D6B4A', '#000000', 1);
      
      // MOM - SCENE 1 (Toddler/Home)
      // Role: Caring adult with toddler, shows parent-child bonding
      // Mom is standing beside toddler, hand on shoulder (protective, loving presence)
      // This scene shows "WE" not just "I" — mom was there from day 1
      const momX = charX - 20; // positioned to left of toddler
      const momY = charY - 8; // standing, slightly taller
      
      // Draw mom (adult height, 28px total)
      drawMom(ctx, momX, momY, 0, 'stand');
      
      // Mom's hand on toddler's shoulder (showing connection/care)
      px(ctx, momX + 6, charY - 12, 2, 2, '#9D6B4A');
      
      // Balloon with thick outline
      const balloonScale = 1 + Math.sin(t * 2.5) * 0.15;
      const balloonSway = Math.sin(t * 1.8) * 3;
      const balloonX = charX + 15 + balloonSway;
      const balloonY = charY - 30;
      
      outlineCircle(ctx, balloonX, balloonY, 6*balloonScale, '#FF4444', '#000000', 2);
      
      // String
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(balloonX, balloonY + 6);
      ctx.quadraticCurveTo(balloonX-2, charY-8, charX+8, charY+4);
      ctx.stroke();
      
      // AGE COUNTER - Shows progression through life stages
      drawAgeCounter(ctx, 3, progress);
    }
  },
=======
function addEntry(dateStr, entry){
  const all = loadAll();
  all[dateStr] = all[dateStr] || [];
  all[dateStr].push(entry);
  saveAll(all);
}
>>>>>>> 5731997 (good features added)

  // Scene 2: American Football - Me as player with football, Mom cheering in bleachers
  // STATE MACHINE: school (0-0.4) → transition (0.4-0.75) → field (0.75-1.0)
  {
    id:'elementary',
    text:`"You came to every event and was always the loudest in the stands.\nEveryone could tell who's mom you were and who's son I was. lol""`,
    draw(ctx,t,progress){
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      
      // STATE MACHINE for Scene 2 phases
      // Phase 1 (0-0.4): Character walks across school, school background visible
      // Phase 2 (0.4-0.75): Background transition, character continues walking
      // Phase 3 (0.75-1.0): Football field visible, character stops, text appears
      
      const SCHOOL_END = 0.4;    // When walking phase ends
      const TRANSITION_START = 0.4;
      const TRANSITION_END = 0.75;
      const FIELD_START = 0.75;
      
      // Determine current phase
      let phase = 'school';
      let phaseProgress = 0;
      
      if(progress < SCHOOL_END){
        phase = 'school';
        phaseProgress = progress / SCHOOL_END;
        if(progress === 0) console.log('Scene 2 started - school phase');
      } else if(progress < TRANSITION_END){
        phase = 'transition';
        phaseProgress = (progress - TRANSITION_START) / (TRANSITION_END - TRANSITION_START);
        if(progress >= TRANSITION_START && progress < TRANSITION_START + 0.01) console.log('Transition triggered');
      } else {
        phase = 'field';
        phaseProgress = (progress - FIELD_START) / (1 - FIELD_START);
        if(progress >= FIELD_START && progress < FIELD_START + 0.01) console.log('Football field reached');
      }
      
      // BACKGROUND LAYERS - overlaid with smooth transition
      
      // SCHOOL BACKGROUND (visible 0-0.75, fades out during transition)
      const schoolAlpha = phase === 'school' ? 1 : 
                          phase === 'transition' ? Math.max(0, 1 - phaseProgress) : 0;
      
      if(schoolAlpha > 0){
        ctx.save();
        ctx.globalAlpha = schoolAlpha;
        
        // Sky
        ctx.fillStyle = '#A8E6FF';
        ctx.fillRect(0, 0, W, H);
        
        // School building with thick outline
        outlineRect(ctx, 20, H*0.25, W-40, H*0.45, '#D4A574', '#000000', 3);
        
        // Windows
        for(let row = 0; row < 2; row++){
          for(let col = 0; col < 5; col++){
            const wx = 35 + col * 20;
            const wy = H*0.30 + row * 15;
            outlineRect(ctx, wx, wy, 12, 10, '#87CEEB', '#000000', 1);
          }
        }
        
        // Door
        outlineRect(ctx, W/2-10, H*0.55, 20, 18, '#6B4423', '#000000', 2);
        
        // Ground: grass texture
        ctx.fillStyle = '#7FBF4F';
        ctx.fillRect(0, H*0.70, W, H*0.30);
        for(let i = 0; i < W; i += 6) {
          px(ctx, i, H*0.71, 2, 1, '#5FA335');
        }
        
        ctx.restore();
      }
      
      // FOOTBALL FIELD BACKGROUND (visible 0.4-1.0, fades in during transition)
      const fieldAlpha = phase === 'field' ? 1 : 
                         phase === 'transition' ? phaseProgress : 0;
      
      if(fieldAlpha > 0){
        ctx.save();
        ctx.globalAlpha = fieldAlpha;
        
        // BRIGHT BLUE SKY
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, W, H);
        
        // SUN (bright yellow with rays)
        outlineCircle(ctx, W-18, 18, 8, '#FFD700', '#000000', 2);
        // Sun rays
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        for(let i = 0; i < 8; i++){
          const angle = (i / 8) * Math.PI * 2;
          const x1 = W - 18 + Math.cos(angle) * 10;
          const y1 = 18 + Math.sin(angle) * 10;
          const x2 = W - 18 + Math.cos(angle) * 15;
          const y2 = 18 + Math.sin(angle) * 15;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        
        // CLOUDS (small white clouds)
        outlineCircle(ctx, 30, 25, 5, '#FFFFFF', '#000000', 1);
        outlineCircle(ctx, 120, 35, 4, '#FFFFFF', '#000000', 1);
        
        // GOAL POSTS (yellow H-shaped structure in background)
        // Left goal post
        outlineRect(ctx, 8, H*0.38, 3, 18, '#FFD700', '#000000', 1);
        outlineRect(ctx, 3, H*0.40, 13, 2, '#FFD700', '#000000', 1);
        // Right goal post
        outlineRect(ctx, 149, H*0.38, 3, 18, '#FFD700', '#000000', 1);
        
        // FOOTBALL FIELD (bright green grass)
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, H*0.52, W, H*0.48);
        
        // FIELD TEXTURE (grass detail lines)
        ctx.strokeStyle = '#1a6b1a';
        ctx.lineWidth = 1;
        for(let i = 0; i < H*0.48; i += 6) {
          ctx.beginPath();
          ctx.moveTo(0, H*0.52 + i);
          ctx.lineTo(W, H*0.52 + i);
          ctx.stroke();
        }
        
        // YARD LINES (thick white horizontal lines marking field)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        for(let i = 0; i < 6; i++){
          const y = H*0.58 + i * 10;
          ctx.beginPath();
          ctx.moveTo(10, y);
          ctx.lineTo(W-10, y);
          ctx.stroke();
        }
        
        // BLEACHERS (clearly stepped/tiered structure)
        // Multiple visible rows creating isometric perspective
        for(let step = 0; step < 5; step++){
          const by = H*0.20 + step * 9;
          const width = W - 40 - step*4;
          const x = 20 + step*2;
          // Bench seat
          outlineRect(ctx, x, by, width, 7, '#999999', '#000000', 2);
          // Shadow underneath for depth
          ctx.fillStyle = '#666666';
          ctx.fillRect(x, by+7, width, 2);
        }
        
        // BACKGROUND CROWD SILHOUETTES (other parents/fans)
        // Person silhouette 1 (back row left)
        px(ctx, 40, H*0.24, 5, 8, '#333333');
        // Person silhouette 2 (back row right)
        px(ctx, 110, H*0.22, 4, 7, '#444444');
        
        // MOM IN BLEACHERS (PROMINENT, CHEERING LOUDLY)
        const momCheer = Math.sin(t * 6) * 4; // Exaggerated bounce for cheering
        const momX = 80;
        const momY = H*0.35;
        
        // Mom dimensions (LARGER - very prominent)
        const momHeadW = 18;
        const momHeadH = 18;
        const momBodyW = 15;
        const momBodyH = 18;
        
        const momHeadX = momX - momHeadW/2;
        const momHeadY = momY - 42 + momCheer;
        const momBodyX = momX - momBodyW/2;
        const momBodyY = momHeadY + momHeadH;
        
        const momSkin = '#9D6B4A';
        const momOutline = '#000000';
        
        // VERY VISIBLE LARGE CURLY HAIR (distinctive silhouette)
        // Multiple rounded clusters creating distinctive hair style
        outlineCircle(ctx, momHeadX - 5, momHeadY - 7, 5, '#1a1a1a', momOutline, 1);
        outlineCircle(ctx, momHeadX + 9, momHeadY - 7, 5, '#1a1a1a', momOutline, 1);
        outlineCircle(ctx, momHeadX - 1, momHeadY - 11, 5, '#1a1a1a', momOutline, 1);
        outlineCircle(ctx, momHeadX + 6, momHeadY - 11, 5, '#1a1a1a', momOutline, 1);
        outlineCircle(ctx, momHeadX + 2, momHeadY - 14, 4, '#2a1a1a', momOutline, 1);
        
        // HEAD (warm brown, thick outline)
        outlineRect(ctx, momHeadX, momHeadY, momHeadW, momHeadH, momSkin, momOutline, 2);
        
        // EYES (large, visible, expressive)
        outlineRect(ctx, momHeadX + 3, momHeadY + 5, 8, 7, '#FFFFFF', momOutline, 1);
        px(ctx, momHeadX + 7, momHeadY + 8, 2, 2, '#000000');
        
        outlineRect(ctx, momHeadX + momHeadW - 11, momHeadY + 5, 8, 7, '#FFFFFF', momOutline, 1);
        px(ctx, momHeadX + momHeadW - 7, momHeadY + 8, 2, 2, '#000000');
        
        // BIG SMILE (very visible, happy expression)
        px(ctx, momX - 4, momHeadY + 14, 8, 2, '#000000');
        px(ctx, momX - 3, momHeadY + 15, 6, 1, '#FF6B9D');
        
        // BODY (warm brown casual outfit, not uniform)
        outlineRect(ctx, momBodyX, momBodyY, momBodyW, momBodyH, '#E8A080', momOutline, 2);
        
        // BOTH ARMS UP WAVING (exaggerated cheering motion)
        const wavePhase = (t * 0.5) % 1;
        const armWave = Math.sin(wavePhase * Math.PI * 2) * 8; // Large exaggerated wave
        
        // LEFT ARM (reaching way up with foam finger)
        px(ctx, momBodyX - 4, momBodyY + 4 - armWave, 3, 10, momOutline);
        px(ctx, momBodyX - 3, momBodyY + 4 - armWave, 1, 10, momSkin);
        
        // FOAM FINGER (yellow foam finger on left raised hand)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(momBodyX - 4, momBodyY - 6 - armWave);
        ctx.lineTo(momBodyX - 8, momBodyY - 12 - armWave);
        ctx.lineTo(momBodyX - 5, momBodyY - 6 - armWave);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = momOutline;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // RIGHT ARM (also reaching up, waving opposite)
        const rightWave = Math.sin((wavePhase + 0.5) * Math.PI * 2) * 8;
        px(ctx, momBodyX + momBodyW + 3, momBodyY + 4 - rightWave, 3, 10, momOutline);
        px(ctx, momBodyX + momBodyW + 4, momBodyY + 4 - rightWave, 1, 10, momSkin);
        
        // LEGS (visible sitting in bleachers)
        px(ctx, momBodyX + 2, momBodyY + momBodyH, 3, 6, momOutline);
        px(ctx, momBodyX + 2.5, momBodyY + momBodyH, 1, 6, momSkin);
        px(ctx, momBodyX + momBodyW - 5, momBodyY + momBodyH, 3, 6, momOutline);
        px(ctx, momBodyX + momBodyW - 4.5, momBodyY + momBodyH, 1, 6, momSkin);
        
        ctx.restore();
      }
      
      // CHARACTER (ME) - FOOTBALL PLAYER (always visible, walks across entire scene)
      // Phase 1 (0-0.4): walk from left (30) to middle-right (110) - 80 pixels in 2.1 seconds
      // Phase 2 (0.4-0.75): continue walking to right (140) while background transitions
      // Phase 3 (0.75-1.0): stop at right position, show field behind
      
      let walkX;
      if(progress < SCHOOL_END){
        // Phase 1: walking 30 → 110 (80 pixel range)
        walkX = Math.round(lerp(30, 110, progress / SCHOOL_END));
      } else if(progress < TRANSITION_END){
        // Phase 2: continue walking 110 → 140 (30 pixel range)
        walkX = Math.round(lerp(110, 140, (progress - SCHOOL_END) / (TRANSITION_END - SCHOOL_END)));
      } else {
        // Phase 3: stop at 140
        walkX = 140;
      }
      
      const charY = H*0.70;
      
      // Draw player with football
      const charHeadW = 14;
      const charHeadH = 14;
      const charBodyW = 12;
      const charBodyH = 14;
      const totalH = 28;
      
      const charHeadX = walkX - charHeadW/2;
      const charHeadY = charY - totalH;
      const charBodyX = walkX - charBodyW/2;
      const charBodyY = charHeadY + charHeadH;
      
      const charSkin = '#9D6B4A';
      const charOutline = '#000000';
      
      // Elementary school stage (stage 2): short high-top fade hair - PROMINENT
      // High-top fade: flat rectangular top, slightly tapered sides
      outlineRect(ctx, charHeadX - 3, charHeadY - 8, charHeadW + 6, 8, '#1a1a1a', charOutline, 2);
      // Hair highlight/texture on top
      px(ctx, charHeadX + 1, charHeadY - 9, 3, 1, '#2a2a2a');
      px(ctx, charHeadX + 4, charHeadY - 9, 3, 1, '#2a2a2a');
      // Side fades
      px(ctx, charHeadX - 4, charHeadY - 6, 1, 3, charOutline);
      px(ctx, charHeadX + 15, charHeadY - 6, 1, 3, charOutline);
      
      // HEAD
      outlineRect(ctx, charHeadX, charHeadY, charHeadW, charHeadH, charSkin, charOutline, 2);
      
      // EYES (looking proud)
      outlineRect(ctx, charHeadX + 2, charHeadY + 5, 6, 5, '#FFFFFF', charOutline, 1);
      px(ctx, charHeadX + 4, charHeadY + 7, 2, 2, '#000000');
      
      outlineRect(ctx, charHeadX + charHeadW - 8, charHeadY + 5, 6, 5, '#FFFFFF', charOutline, 1);
      px(ctx, charHeadX + charHeadW - 6, charHeadY + 7, 2, 2, '#000000');
      
      // MOUTH (proud smile)
      px(ctx, walkX - 2, charHeadY + 12, 4, 1, '#8B5544');
      px(ctx, walkX - 1, charHeadY + 13, 2, 1, '#C88060');
      
      // BODY (football jersey - bright team color)
      outlineRect(ctx, charBodyX, charBodyY, charBodyW, charBodyH, '#FF6B42', charOutline, 2); // bright orange jersey
      
      // ARMS
      px(ctx, charBodyX - 2, charBodyY + 4, 2, 6, charOutline);
      px(ctx, charBodyX - 1, charBodyY + 4, 1, 6, charSkin);
      px(ctx, charBodyX + charBodyW, charBodyY + 4, 2, 6, charOutline);
      px(ctx, charBodyX + charBodyW + 1, charBodyY + 4, 1, 6, charSkin);
      
      // LEGS (running stance, only animate during walking phases)
      let legPhase = 0;
      if(progress < TRANSITION_END){
        legPhase = progress / TRANSITION_END;
      }
      const legOff = Math.sin(legPhase * Math.PI * 2) * 2;
      px(ctx, charBodyX + 2, charBodyY + charBodyH + legOff, 2, 4, charOutline);
      px(ctx, charBodyX + 2.5, charBodyY + charBodyH + legOff, 1, 4, charSkin);
      px(ctx, charBodyX + charBodyW - 4, charBodyY + charBodyH - legOff, 2, 4, charOutline);
      px(ctx, charBodyX + charBodyW - 3.5, charBodyY + charBodyH - legOff, 1, 4, charSkin);
      
      // AMERICAN FOOTBALL (brown oval, held in RIGHT hand against body)
      // Football positioning: right hand area, held against torso
      const footballX = charBodyX + charBodyW + 3;
      const footballY = charBodyY + 6;
      const footballW = 10;
      const footballH = 6;
      
      // Football body (brown oval shape with pointed ends)
      ctx.fillStyle = '#000000'; // outline
      ctx.beginPath();
      ctx.ellipse(footballX, footballY, footballW/2 + 1, footballH/2 + 1, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#8B4513'; // brown leather
      ctx.beginPath();
      ctx.ellipse(footballX, footballY, footballW/2, footballH/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // WHITE LACES (3-4 short horizontal lines on top of football)
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      for(let i = -1; i <= 1; i++){
        ctx.beginPath();
        ctx.moveTo(footballX - 3, footballY + i * 1.5);
        ctx.lineTo(footballX + 3, footballY + i * 1.5);
        ctx.stroke();
      }
      
      // Control Next button visibility based on phase
      if(phase === 'field' && phaseProgress > 0.5){
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
      } else {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
      }
    }
  },

<<<<<<< HEAD
  // Scene 3: Theme Park with castle and rollercoaster
  {
    id:'disney',
    text:`"We stayed tearing up those lines.\nI'll never forget running through lines to get on rides two minutes before the park closed."`,
    draw(ctx,t,progress){
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      
      // Bright blue sky background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, W, H);
      
      // Sun
      outlineCircle(ctx, W-20, 15, 6, '#FFD700', '#000000', 1);
      
      // ============================================
      // ROLLERCOASTER (CRITICAL PARK ELEMENT)
      // ============================================
      // STATE MACHINE: curved track forming a hill/loop shape
      // Track rises from left → curves over the top → drops down right
      // Support beams: vertical lines underneath track
      // Coaster cart: small colored box at the peak
      
      const rollerCoasterX = 105;
      const rollerCoasterY = H * 0.20;
      const trackColor = '#FF0000'; // bright red track
      const supportColor = '#8B4513'; // brown support beams
      
      // SUPPORT BEAMS (vertical structures under track)
      // Left support cluster
      px(ctx, rollerCoasterX - 25, rollerCoasterY + 18, 2, 24, supportColor);
      px(ctx, rollerCoasterX - 20, rollerCoasterY + 15, 2, 27, supportColor);
      px(ctx, rollerCoasterX - 15, rollerCoasterY + 10, 2, 32, supportColor);
      // Right support cluster
      px(ctx, rollerCoasterX + 10, rollerCoasterY + 10, 2, 32, supportColor);
      px(ctx, rollerCoasterX + 15, rollerCoasterY + 15, 2, 27, supportColor);
      px(ctx, rollerCoasterX + 20, rollerCoasterY + 18, 2, 24, supportColor);
      
      // COASTER TRACK (curved path: goes up, peaks, comes down)
      // Thick red lines forming a smooth hill shape
      ctx.strokeStyle = trackColor;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      
      // Upward slope (left side of hill, 40 pixels up)
      ctx.beginPath();
      ctx.moveTo(rollerCoasterX - 30, rollerCoasterY + 40);
      ctx.quadraticCurveTo(rollerCoasterX - 10, rollerCoasterY, rollerCoasterX, rollerCoasterY - 8);
      ctx.stroke();
      
      // Downward slope (right side of hill)
      ctx.beginPath();
      ctx.moveTo(rollerCoasterX, rollerCoasterY - 8);
      ctx.quadraticCurveTo(rollerCoasterX + 10, rollerCoasterY, rollerCoasterX + 30, rollerCoasterY + 40);
      ctx.stroke();
      
      // COASTER CART at the peak (small colored box, animated bobbing)
      const cartBob = Math.sin(t * 2) * 1.5;
      outlineRect(ctx, rollerCoasterX - 3, rollerCoasterY - 10 + cartBob, 6, 4, '#FFD700', '#000000', 1);
      // Cart window
      px(ctx, rollerCoasterX - 1, rollerCoasterY - 8 + cartBob, 2, 2, '#4488FF');
      
      // CASTLE STRUCTURE (kept from original)
      const castleBaseY = H * 0.42;
      const castleColor = '#D4D4D4';
      const roofColor = '#2563EB'; // bright blue
      const windowColor = '#1a1a1a';
      
      // LEFT TOWER
      outlineRect(ctx, 20, castleBaseY - 18, 14, 18, castleColor, '#000000', 2);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(20-2, castleBaseY-18);
      ctx.lineTo(27, castleBaseY-26);
      ctx.lineTo(34+2, castleBaseY-18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = roofColor;
      ctx.beginPath();
      ctx.moveTo(20, castleBaseY-18);
      ctx.lineTo(27, castleBaseY-24);
      ctx.lineTo(34, castleBaseY-18);
      ctx.closePath();
      ctx.fill();
      px(ctx, 24, castleBaseY - 14, 3, 3, windowColor);
      px(ctx, 24, castleBaseY - 7, 3, 3, windowColor);
      
      // CENTRAL TOWER (tallest)
      outlineRect(ctx, 48, castleBaseY - 30, 14, 30, castleColor, '#000000', 2);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(48-2, castleBaseY-30);
      ctx.lineTo(55, castleBaseY-42);
      ctx.lineTo(62+2, castleBaseY-30);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FF4444'; // red roof for contrast
      ctx.beginPath();
      ctx.moveTo(48, castleBaseY-30);
      ctx.lineTo(55, castleBaseY-40);
      ctx.lineTo(62, castleBaseY-30);
      ctx.closePath();
      ctx.fill();
      px(ctx, 52, castleBaseY - 25, 3, 3, windowColor);
      px(ctx, 58, castleBaseY - 25, 3, 3, windowColor);
      px(ctx, 52, castleBaseY - 16, 3, 3, windowColor);
      px(ctx, 58, castleBaseY - 16, 3, 3, windowColor);
      
      // RIGHT TOWER
      outlineRect(ctx, 76, castleBaseY - 18, 14, 18, castleColor, '#000000', 2);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(76-2, castleBaseY-18);
      ctx.lineTo(83, castleBaseY-26);
      ctx.lineTo(90+2, castleBaseY-18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = roofColor;
      ctx.beginPath();
      ctx.moveTo(76, castleBaseY-18);
      ctx.lineTo(83, castleBaseY-24);
      ctx.lineTo(90, castleBaseY-18);
      ctx.closePath();
      ctx.fill();
      px(ctx, 80, castleBaseY - 14, 3, 3, windowColor);
      px(ctx, 80, castleBaseY - 7, 3, 3, windowColor);
      
      // Castle connecting wall
      outlineRect(ctx, 34, castleBaseY, 22, 5, castleColor, '#000000', 2);
      
      // ============================================
      // THEME PARK ELEMENTS
      // ============================================
      
      // ENTRANCE GATES (left side - colorful archway)
      const gateX = 8;
      const gateY = castleBaseY + 5;
      // Left gate pillar
      outlineRect(ctx, gateX, gateY, 4, 8, '#FFB366', '#000000', 1);
      // Right gate pillar
      outlineRect(ctx, gateX + 12, gateY, 4, 8, '#FFB366', '#000000', 1);
      // Gate arch connector
      ctx.strokeStyle = '#FF6B42';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gateX + 8, gateY - 2, 10, 0.3 * Math.PI, 0.7 * Math.PI);
      ctx.stroke();
      
      // COLORFUL FLAGS/BANNERS (hanging from poles)
      // Flag pole 1 (left)
      px(ctx, 35, castleBaseY - 35, 1, 12, '#000000');
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(35, castleBaseY - 28);
      ctx.lineTo(42, castleBaseY - 26);
      ctx.lineTo(35, castleBaseY - 24);
      ctx.closePath();
      ctx.fill();
      
      // Flag pole 2 (center-right)
      px(ctx, 75, castleBaseY - 40, 1, 17, '#000000');
      ctx.fillStyle = '#4488FF';
      ctx.beginPath();
      ctx.moveTo(75, castleBaseY - 32);
      ctx.lineTo(82, castleBaseY - 30);
      ctx.lineTo(75, castleBaseY - 28);
      ctx.closePath();
      ctx.fill();
      
      // STRING LIGHTS between poles (animated, twinkling)
      const lightTwinkle = Math.abs(Math.sin(t * 3)) * 0.5 + 0.5;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1;
      ctx.globalAlpha = lightTwinkle;
      ctx.beginPath();
      ctx.moveTo(35, castleBaseY - 35);
      ctx.quadraticCurveTo(55, castleBaseY - 45, 75, castleBaseY - 40);
      ctx.stroke();
      // Light bulbs on string
      ctx.globalAlpha = 1;
      for(let i = 0; i <= 4; i++){
        const lightX = 35 + (75-35) * (i/4);
        const lightY = castleBaseY - 38 - Math.sin((i/4)*Math.PI)*10;
        outlineCircle(ctx, lightX, lightY, 2, '#FFD700', '#000000', 1);
      }
      
      // QUEUE LINE ROPES (posts with chain/rope barriers)
      const queueStartX = 60;
      const queueY = castleBaseY + 10;
      // Queue posts
      for(let i = 0; i < 3; i++){
        const postX = queueStartX + i * 20;
        px(ctx, postX, queueY, 2, 5, '#8B4513');
        // Rope connecting posts
        if(i < 2){
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(postX + 2, queueY + 2);
          ctx.quadraticCurveTo(postX + 10, queueY - 2, postX + 20, queueY + 2);
          ctx.stroke();
        }
      }
      
      // BACKGROUND PARK GUESTS (silhouettes of people waiting)
      px(ctx, 40, castleBaseY + 5, 3, 8, '#444444');
      px(ctx, 90, castleBaseY + 6, 3, 7, '#333333');
      px(ctx, 72, castleBaseY + 8, 2, 6, '#555555');
      
      // THEME PARK SIGN (generic, no trademarked text)
      outlineRect(ctx, 115, castleBaseY - 8, 24, 8, '#8B4513', '#000000', 2);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 6px monospace';
      ctx.fillText('PARK', 120, castleBaseY - 2);
      
      // Paved pathway ground (brick pattern)
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(0, H*0.70, W, H*0.30);
      // Brick/tile pattern
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      for(let row = 0; row < 4; row++){
        for(let col = 0; col < 11; col++){
          const brickX = col * 15;
          const brickY = H*0.70 + row * 8;
          ctx.strokeRect(brickX + (row%2)*7.5, brickY, 15, 8);
        }
      }
      
      // Main character walking - EXCITED AND ENERGETIC
      // Faster walk, maybe jumping slightly
      const energyBounce = Math.sin(progress * Math.PI * 2.5) * 3;
      const excitedWalkSpeed = Math.min(1, progress * 1.8); // faster walk
      const charX = Math.round(lerp(20, 130, excitedWalkSpeed));
      const charY = H*0.72 - energyBounce;
      
      // Draw excited version with arms up
      const charHeadW = 12;
      const charHeadH = 12;
      const charBodyW = 10;
      const charBodyH = 12;
      const totalH = 24;
      
      const charHeadX = charX - charHeadW/2;
      const charHeadY = charY - totalH;
      const charBodyX = charX - charBodyW/2;
      const charBodyY = charHeadY + charHeadH;
      
      const charSkin = '#9D6B4A';
      const charOutline = '#000000';
      
      // Hair (elementary age - high-top fade style, prominent)
      // Rectangular flat-top hair (8px height, full width)
      outlineRect(ctx, charHeadX - 3, charHeadY - 8, charHeadW + 6, 8, '#1a1a1a', charOutline, 1);
      // Hair detail: texture lines on sides
      px(ctx, charHeadX - 4, charHeadY - 5, 1, 3, '#2a2a2a');
      px(ctx, charHeadX + charHeadW + 3, charHeadY - 5, 1, 3, '#2a2a2a');
      
      // Head
      outlineRect(ctx, charHeadX, charHeadY, charHeadW, charHeadH, charSkin, charOutline, 2);
      
      // Eyes (excited, wide)
      outlineRect(ctx, charHeadX + 2, charHeadY + 3, 6, 5, '#FFFFFF', charOutline, 1);
      px(ctx, charHeadX + 4, charHeadY + 5, 2, 2, '#000000');
      
      outlineRect(ctx, charHeadX + charHeadW - 8, charHeadY + 3, 6, 5, '#FFFFFF', charOutline, 1);
      px(ctx, charHeadX + charHeadW - 6, charHeadY + 5, 2, 2, '#000000');
      
      // Big excited smile
      px(ctx, charX - 2, charHeadY + 10, 4, 1, '#000000');
      px(ctx, charX - 1, charHeadY + 11, 2, 1, '#FFB6D9');
      
      // Body (bright pink shirt for excitement)
      outlineRect(ctx, charBodyX, charBodyY, charBodyW, charBodyH, '#FF99CC', charOutline, 2);
      
      // ARMS UP (excited, celebrating) with faster waving
      const armWave = Math.sin(t * 8) * 5;
      px(ctx, charBodyX - 3, charBodyY + 2 - armWave, 2, 8, charOutline);
      px(ctx, charBodyX - 2, charBodyY + 2 - armWave, 1, 8, charSkin);
      px(ctx, charBodyX + charBodyW + 1, charBodyY + 2 - armWave, 2, 8, charOutline);
      px(ctx, charBodyX + charBodyW + 2, charBodyY + 2 - armWave, 1, 8, charSkin);
      
      // Legs (running fast)
      const legRunPhase = (excitedWalkSpeed * 4) % 1;
      const legRunOff = Math.sin(legRunPhase * Math.PI * 2) * 2;
      px(ctx, charBodyX + 2, charBodyY + charBodyH + legRunOff, 2, 4, charOutline);
      px(ctx, charBodyX + 2.5, charBodyY + charBodyH + legRunOff, 1, 4, charSkin);
      px(ctx, charBodyX + charBodyW - 4, charBodyY + charBodyH - legRunOff, 2, 4, charOutline);
      px(ctx, charBodyX + charBodyW - 3.5, charBodyY + charBodyH - legRunOff, 1, 4, charSkin);
      
      // MOM - SCENE 3 (Disney Park Theme Park)
      // Role: Running through park WITH character, shared adventure
      // Mom is positioned to the right, also moving/excited
      // This scene shows "WE tore up those lines" - experiencing the park together
      // Mom slightly ahead or alongside (leading the way or running together)
      const momX = charX + 28; // positioned ahead/to right of character
      const momY = charY - 4; // slightly higher (running/moving)
      
      // Both moving together - mom also animated with walking/running motion
      const momLegPhase = (excitedWalkSpeed * 4.5) % 1; // slightly faster leg animation
      const momLegOff = Math.sin(momLegPhase * Math.PI * 2) * 2;
      
      // Draw mom (adult height, 28px total) in excited/running pose
      // Customize mom's drawing for this scene (running with arms up for excitement)
      const momHeadW = 14;
      const momHeadH = 14;
      const momBodyW = 12;
      const momBodyH = 14;
      const momTotalH = 28;
      
      const momHeadX = momX - momHeadW/2;
      const momHeadY = momY - momTotalH;
      const momBodyX = momX - momBodyW/2;
      const momBodyY = momHeadY + momHeadH;
      
      const momSkin = '#9D6B4A';
      const momOutline = '#000000';
      const momHairColor = '#2a1a1a';
      
      // Curly hair
      px(ctx, momHeadX - 5, momHeadY - 6, 16, 8, momOutline);
      px(ctx, momHeadX - 4, momHeadY - 5, 14, 7, momHairColor);
      px(ctx, momHeadX - 3, momHeadY - 7, 2, 2, momHairColor);
      px(ctx, momHeadX + 3, momHeadY - 7, 2, 2, momHairColor);
      px(ctx, momHeadX, momHeadY - 8, 2, 2, momHairColor);
      
      // Head
      outlineRect(ctx, momHeadX, momHeadY, momHeadW, momHeadH, momSkin, momOutline, 2);
      
      // Eyes (happy, excited)
      outlineRect(ctx, momHeadX + 2, momHeadY + 5, 6, 5, '#FFFFFF', momOutline, 1);
      px(ctx, momHeadX + 4, momHeadY + 7, 2, 2, '#000000');
      
      outlineRect(ctx, momHeadX + momHeadW - 8, momHeadY + 5, 6, 5, '#FFFFFF', momOutline, 1);
      px(ctx, momHeadX + momHeadW - 6, momHeadY + 7, 2, 2, '#000000');
      
      // Mouth (happy, smiling)
      px(ctx, momX - 2, momHeadY + 12, 4, 1, '#8B5544');
      px(ctx, momX - 1, momHeadY + 13, 2, 1, '#C88060');
      
      // Body (casual mom clothes - purple/casual outfit)
      outlineRect(ctx, momBodyX, momBodyY, momBodyW, momBodyH, '#9966CC', momOutline, 2);
      
      // Arms UP (running/excited) with waving motion
      const momArmWave = Math.sin(t * 7.5) * 4; // slightly different timing than character
      px(ctx, momBodyX - 2, momBodyY + 4 - momArmWave, 2, 6, momOutline);
      px(ctx, momBodyX - 1, momBodyY + 4 - momArmWave, 1, 6, momSkin);
      px(ctx, momBodyX + momBodyW, momBodyY + 4 - momArmWave, 2, 6, momOutline);
      px(ctx, momBodyX + momBodyW + 1, momBodyY + 4 - momArmWave, 1, 6, momSkin);
      
      // Legs (running fast, synchronized with character for togetherness)
      px(ctx, momBodyX + 2, momBodyY + momBodyH + momLegOff, 2, 4, momOutline);
      px(ctx, momBodyX + 2.5, momBodyY + momBodyH + momLegOff, 1, 4, momSkin);
      px(ctx, momBodyX + momBodyW - 4, momBodyY + momBodyH - momLegOff, 2, 4, momOutline);
      px(ctx, momBodyX + momBodyW - 3.5, momBodyY + momBodyH - momLegOff, 1, 4, momSkin);
    }
  },

  // Scene 4: Gaming bedroom - focused on PC addiction
  {
    id:'middle',
    text:`"This was my antisocial teenager phase.\nI was glued to the PC you got me for Christmas.\nI know you probably had fun dressing me for middle school events though."`,
    draw(ctx,t,progress){
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      
      // Wall: bedroom (muted purple-gray)
      ctx.fillStyle = '#A8A8C8';
      ctx.fillRect(0, 0, W, H);
      
      // POSTER ON WALL (game/band poster - more recognizable)
      outlineRect(ctx, 18, 16, 32, 28, '#1a1a1a', '#000000', 2);
      // Poster background (red/orange gradient effect)
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(20, 18, 28, 24);
      // Poster graphics (geometric game-like shapes)
      ctx.fillStyle = '#FFD700';
      outlineCircle(ctx, 28, 26, 4, '#FFD700', '#000000', 1);
      outlineRect(ctx, 32, 24, 8, 8, '#4488FF', '#000000', 1);
      ctx.fillStyle = '#FFFFFF';
      px(ctx, 26, 34, 8, 2, '#FFFFFF');
      px(ctx, 36, 34, 8, 2, '#FFFFFF');
      
      // Window (night outside)
      outlineRect(ctx, W-36, 12, 30, 22, '#1a2a4a', '#000000', 2);
      ctx.fillStyle = '#0a1a2a';
      ctx.fillRect(W-34, 14, 26, 18);
      // Stars in window
      px(ctx, W-30, 18, 2, 2, '#FFFF99');
      px(ctx, W-18, 22, 2, 2, '#FFFF99');
      px(ctx, W-12, 20, 2, 2, '#FFFF99');
      
      // Floor: wood texture
      ctx.fillStyle = '#8B6F47';
      ctx.fillRect(0, H*0.65, W, H*0.35);
      for(let i = 0; i < 5; i++){
        ctx.strokeStyle = '#6B5537';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, H*0.65 + i*10);
        ctx.lineTo(W, H*0.65 + i*10);
        ctx.stroke();
      }
      
      // Small rug under gaming chair (dark blue)
      outlineCircle(ctx, 70, H*0.72, 20, '#4A6FA5', '#000000', 1);
      // Rug texture
      ctx.strokeStyle = '#3A5F95';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(70, H*0.72, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      // DESK (more defined, darker)
      outlineRect(ctx, 38, H*0.54, 64, 14, '#5A4A37', '#000000', 3);
      // Desk top surface (lighter wood)
      ctx.fillStyle = '#7A6A57';
      ctx.fillRect(39, H*0.55, 62, 5);
      
      // KEYBOARD (small rectangle with dots representing keys)
      outlineRect(ctx, 48, H*0.60, 20, 6, '#2a2a2a', '#000000', 1);
      // Key pattern
      for(let row = 0; row < 2; row++){
        for(let col = 0; col < 5; col++){
          px(ctx, 50 + col*4, H*0.62 + row*2, 1, 1, '#444444');
        }
      }
      
      // MOUSE (small controller-like shape to right of keyboard)
      outlineRect(ctx, 72, H*0.60, 8, 6, '#333333', '#000000', 1);
      px(ctx, 75, H*0.63, 2, 2, '#666666');
      
      // PC MONITOR (large, prominent)
      outlineRect(ctx, 48, H*0.25, 32, 26, '#1a1a1a', '#000000', 3);
      
      // Monitor stand/base (visible support)
      outlineRect(ctx, 60, H*0.51, 8, 3, '#1a1a1a', '#000000', 1);
      outlineRect(ctx, 56, H*0.54, 16, 4, '#3a3a3a', '#000000', 1);
      
      // Monitor screen (bright blue glow)
      ctx.fillStyle = '#1E90FF';
      ctx.fillRect(51, H*0.28, 26, 20);
      
      // Game visuals on screen (geometric shapes)
      ctx.fillStyle = '#00FF00';
      outlineRect(ctx, 55, H*0.32, 6, 6, '#00FF00', '#000000', 1);
      ctx.fillStyle = '#FFFF00';
      outlineCircle(ctx, 68, H*0.36, 3, '#FFFF00', '#000000', 1);
      ctx.fillStyle = '#FF00FF';
      outlineRect(ctx, 60, H*0.42, 4, 4, '#FF00FF', '#000000', 1);
      
      // Screen glow effect (bright halo)
      ctx.fillStyle = '#1E90FF';
      ctx.globalAlpha = 0.4;
      ctx.fillRect(48, H*0.22, 36, 32);
      ctx.globalAlpha = 1;
      
      // CHARACTER (sitting, hunched forward at desk)
      const sitBlend = Math.min(1, Math.max(0, (progress - 0.3) / 0.5));
      const charX = sitBlend < 0.6 ? Math.round(lerp(30, 65, progress)) : 65;
      const charY = sitBlend < 0.6 ? H*0.65 : H*0.67;
      
      // When sitting, character is hunched
      if(sitBlend >= 0.6){
        // HUNCHED SITTING POSE (focused on screen)
        const headX = charX - 7;
        const headY = charY - 26;
        
        // Tall hair (stage 4 - middle school teen, VERY VISIBLE)
        // Rectangular flat-top style
        outlineRect(ctx, headX - 3, headY - 10, 18, 9, '#000000', '#000000', 2);
        // Hair texture/highlights
        px(ctx, headX - 1, headY - 11, 3, 1, '#2a2a2a');
        px(ctx, headX + 5, headY - 11, 3, 1, '#2a2a2a');
        // Side fades
        px(ctx, headX - 4, headY - 7, 1, 3, '#000000');
        px(ctx, headX + 15, headY - 7, 1, 3, '#000000');
        
        // Head (tilted forward slightly)
        outlineRect(ctx, headX, headY - 4, 14, 14, '#9D6B4A', '#000000', 2);
        
        // Eyes (looking down at screen, intense)
        outlineRect(ctx, headX+2, headY, 6, 5, '#FFFFFF', '#000000', 1);
        px(ctx, headX+4, headY+2, 2, 2, '#000000');
        
        outlineRect(ctx, headX+headX, headY, 6, 5, '#FFFFFF', '#000000', 1);
        px(ctx, headX+10, headY+2, 2, 2, '#000000');
        
        // Mouth (concentrated expression)
        px(ctx, charX-2, headY+10, 4, 1, '#8B5544');
        
        // HEADPHONES (visible on head)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(charX - 1, headY - 2, 10, 0.3, 2.8);
        ctx.stroke();
        // Headphone cups
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.arc(headX - 2, headY - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + 16, headY - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Hunched body (leaning forward)
        outlineRect(ctx, charX - 6, headY + 12, 12, 14, '#556B2F', '#000000', 2);
        
        // Arms (bent, reaching to keyboard/mouse)
        px(ctx, charX - 8, headY + 16, 2, 6, '#000000');
        px(ctx, charX - 7, headY + 16, 1, 6, '#9D6B4A');
        px(ctx, charX + 6, headY + 16, 2, 6, '#000000');
        px(ctx, charX + 7, headY + 16, 1, 6, '#9D6B4A');
      } else {
        // Walking to desk
        drawMainCharacter(ctx, charX, charY, 4, (t * 0.6) % 1, 'walk');
      }
    }
  },

  // Scene 5: High school with friends - each friend distinct
  {
    id:'highschool',
    text:`"Started hanging with friends and had you taking me everywhere.\nI always used you to get me out of dumb stuff lol.\nBlamed it on you being a nurse and instantly knowing."`,
    draw(ctx,t,progress){
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      
      // Outdoor school area
      ctx.fillStyle = '#D8E4B8';
      ctx.fillRect(0, 0, W, H);
      
      // Building wall (background)
      outlineRect(ctx, W-40, 0, 40, H*0.60, '#B8956F', '#000000', 2);
      
      // Lockers
      for(let i = 0; i < 3; i++){
        outlineRect(ctx, W-35, 10 + i*14, 8, 10, '#888888', '#000000', 1);
        outlineRect(ctx, W-22, 10 + i*14, 8, 10, '#888888', '#000000', 1);
      }
      
      // Tree
      outlineRect(ctx, 20, 30, 6, 16, '#5D4E37', '#000000', 1);
      outlineCircle(ctx, 23, 22, 8, '#4CBB5F', '#000000', 2);
      
      // Ground: concrete
      ctx.fillStyle = '#A8A8A8';
      ctx.fillRect(0, H*0.70, W, H*0.30);
      // Cracks
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      for(let i = 0; i < 5; i++){
        ctx.beginPath();
        ctx.moveTo(0, H*0.70 + i*9);
        ctx.lineTo(W, H*0.70 + i*9);
        ctx.stroke();
      }
      
      // DISTINCT FRIENDS (different heights, hair styles, colors)
      const bounce1 = Math.sin(t*3) * 2;
      const bounce2 = Math.sin((t+0.5)*3) * 2;
      const bounce3 = Math.sin((t+1)*3) * 2;
      
      // Friend 1: Shorter, blue shirt, flat-top hair
      drawDistinctFriend(ctx, 30, H*0.70 - bounce1, (t*0.8)%1, '#4A7FD9', 'flattop');
      
      // Friend 2: Medium height, orange/tan shirt, curly hair
      drawDistinctFriend(ctx, 60, H*0.66 - bounce2, (t*0.9)%1, '#FFB366', 'curly');
      
      // Friend 3: Taller, green shirt, spiky hair
      drawDistinctFriend(ctx, 92, H*0.64 - bounce3, (t*0.7)%1, '#66DD66', 'spiky');
      
      // Main character (me in middle, sitting casually)
      drawMainCharacter(ctx, 60, H*0.68, 5, (t*0.3)%1, 'sit');
      
      // HAHAHAHA laugh text (animated, bouncing)
      if(progress > 0.3 && progress < 0.6){
        const laughBounce = Math.abs(Math.sin(t*8)) * 3;
        const laughShake = Math.sin(t*12) * 1;
        ctx.save();
        ctx.globalAlpha = 0.8 + Math.abs(Math.sin(t*8))*0.2;
        ctx.fillStyle = '#FFD700'; // bright yellow
        ctx.font = 'bold 10px monospace';
        ctx.fillText('HAHAHA', 35 + laughShake, 40 - laughBounce);
        ctx.restore();
      }
    }
  },

  // Scene 6: Sleeping in car
  {
    id:'car',
    text:`"Do I even need to explain this?\nWe held it down, playa.\nIt really wasn't that bad relaxing in the park being one with nature was a pretty cool change of pace."`,
    draw(ctx,t,progress){
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      
      // NIGHT SKY (dark blue/purple background)
      ctx.fillStyle = '#0F1B3A';
      ctx.fillRect(0, 0, W, H);
      
      // Moon (large, bright yellow)
      outlineCircle(ctx, W-18, 22, 12, '#FFFF44', '#000000', 2);
      
      // Stars (bright white dots scattered in sky)
      ctx.fillStyle = '#FFFFFF';
      const starPositions = [
        [25, 15], [40, 25], [65, 12], [95, 20], [120, 18],
        [135, 28], [155, 8], [30, 40]
      ];
      for(let pos of starPositions){
        px(ctx, pos[0], pos[1], 2, 2, '#FFFFFF');
      }
      
      // GROUND at bottom (dark gray)
      ctx.fillStyle = '#2A2A2A';
      ctx.fillRect(0, H*0.85, W, H*0.15);
      
      // CAR BODY (side view - dark blue)
      // Roof outline
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(20, H*0.48);
      ctx.lineTo(35, H*0.35);
      ctx.lineTo(125, H*0.35);
      ctx.lineTo(140, H*0.48);
      ctx.closePath();
      ctx.fill();
      
      // Roof (dark blue)
      ctx.fillStyle = '#1a4d7f';
      ctx.beginPath();
      ctx.moveTo(22, H*0.48);
      ctx.lineTo(35, H*0.36);
      ctx.lineTo(125, H*0.36);
      ctx.lineTo(138, H*0.48);
      ctx.closePath();
      ctx.fill();
      
      // Main car body (wide rectangle - dark blue/gray)
      outlineRect(ctx, 20, H*0.48, 120, 28, '#3a5f8f', '#000000', 2);
      
      // Hood (front)
      outlineRect(ctx, 140, H*0.50, 18, 14, '#2a4f7f', '#000000', 2);
      
      // Trunk (back)
      outlineRect(ctx, 2, H*0.50, 14, 14, '#2a4f7f', '#000000', 2);
      
      // WINDOWS (light blue, showing interior)
      // Front windshield
      outlineRect(ctx, 35, H*0.36, 30, 14, '#87CEEB', '#000000', 1);
      // Side window (driver side)
      outlineRect(ctx, 75, H*0.42, 22, 16, '#87CEEB', '#000000', 1);
      // Side window (passenger side)
      outlineRect(ctx, 105, H*0.42, 22, 16, '#87CEEB', '#000000', 1);
      
      // DASHBOARD (inside, visible through windshield)
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(35, H*0.60, 30, 6);
      px(ctx, 42, H*0.61, 5, 2, '#888888');
      px(ctx, 52, H*0.61, 5, 2, '#888888');
      
      // CAR SEATS (gray fabric seats visible through side windows)
      // Driver side seat
      outlineRect(ctx, 50, H*0.55, 16, 16, '#696969', '#000000', 1);
      // Passenger side seat
      outlineRect(ctx, 90, H*0.55, 16, 16, '#696969', '#000000', 1);
      
      // WHEELS (two dark circles at bottom)
      // Front wheel
      outlineCircle(ctx, 65, H*0.78, 7, '#1a1a1a', '#000000', 2);
      // Rear wheel
      outlineCircle(ctx, 115, H*0.78, 7, '#1a1a1a', '#000000', 2);
      
      // CHARACTER POSITIONS AND SLEEPING POSES
      // Mom sleeping in driver seat (head tilted right)
      const momX = 58;
      const momY = H*0.63;
      
      // Draw mom sleeping (tilted head pose)
      const momHeadTilt = -15; // head tilted
      ctx.save();
      ctx.translate(momX, momY);
      ctx.rotate(momHeadTilt * Math.PI / 180);
      
      // Head (tilted)
      outlineRect(ctx, -7, -28, 14, 14, '#9D6B4A', '#000000', 2);
      
      // CURLY HAIR (visible even while sleeping/tilted)
      // Multiple curl clusters for distinctive silhouette
      outlineCircle(ctx, -5, -32, 3, '#2a1a1a', '#000000', 1); // left curl
      outlineCircle(ctx, -1, -34, 3, '#2a1a1a', '#000000', 1); // center curl
      outlineCircle(ctx, 4, -32, 3, '#2a1a1a', '#000000', 1); // right curl
      outlineCircle(ctx, -3, -35, 2, '#1a1a1a', '#000000', 1); // top accent
      outlineCircle(ctx, 2, -35, 2, '#1a1a1a', '#000000', 1); // top accent
      
      // Closed eyes (sleeping)
      px(ctx, -4, -20, 3, 2, '#000000');
      px(ctx, 2, -20, 3, 2, '#000000');
      // Mouth (peaceful smile)
      px(ctx, -2, -14, 4, 1, '#8B5544');
      
      ctx.restore();
      
      // Z Z Z above mom (sleeping animation)
      const zBob1 = Math.sin(t*4) * 2;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 6px monospace';
      ctx.fillText('Z', momX - 12, momY - 35 + zBob1);
      
      // Me sleeping in passenger seat (head tilted left)
      const meX = 98;
      const meY = H*0.65;
      
      // Draw main character sleeping (tilted head pose)
      const meHeadTilt = 15; // head tilted opposite direction
      ctx.save();
      ctx.translate(meX, meY);
      ctx.rotate(meHeadTilt * Math.PI / 180);
      
      // Head (tilted)
      outlineRect(ctx, -7, -28, 14, 14, '#9D6B4A', '#000000', 2);
      
      // HAIR - SHOULDER-LENGTH DREADS (Stage 6 - Young Adult)
      // 6-7 individual dreadlocks hanging naturally down from head
      // Left side dreads (3)
      outlineRect(ctx, -9, -26, 2, 12, '#1a1a1a', '#000000', 1); // dread 1
      outlineRect(ctx, -6, -26, 2, 14, '#1a1a1a', '#000000', 1); // dread 2
      outlineRect(ctx, -3, -28, 2, 16, '#1a1a1a', '#000000', 1); // dread 3 (center-left)
      
      // Right side dreads (3)
      outlineRect(ctx, 3, -28, 2, 16, '#1a1a1a', '#000000', 1); // dread 4 (center-right)
      outlineRect(ctx, 6, -26, 2, 14, '#1a1a1a', '#000000', 1); // dread 5
      outlineRect(ctx, 9, -26, 2, 12, '#1a1a1a', '#000000', 1); // dread 6
      
      // Dread texture/highlights
      px(ctx, -8, -20, 1, 3, '#2a2a2a');
      px(ctx, 8, -20, 1, 3, '#2a2a2a');
      
      // Closed eyes (sleeping)
      px(ctx, -4, -20, 3, 2, '#000000');
      px(ctx, 2, -20, 3, 2, '#000000');
      // Mouth (peaceful)
      px(ctx, -2, -14, 4, 1, '#8B5544');
      
      ctx.restore();
      
      // Z Z Z above me (sleeping animation, offset)
      const zBob2 = Math.sin((t+0.3)*4) * 2;
      ctx.fillText('Z', meX + 10, meY - 35 + zBob2);
      
      // Body outlines visible in seats (sleeping posture)
      // Mom's body
      outlineRect(ctx, 52, H*0.67, 10, 10, '#FF8C69', '#000000', 1);
      // My body
      outlineRect(ctx, 93, H*0.69, 10, 10, '#556B2F', '#000000', 1);
    }
  },

  // Scene 7: Christmas today - Emotional climax with warm family moment
  {
    id:'today',
    text:`"I love you mom and Merry Christmas.\nDon't feel bad about anything of that stuff we went through or you feel like i missed out on because of it.\nHaving a mom like you is the greatest gift I could ask for.\n(And your cooking is amazing.)\nI love you mom."`,
    draw(ctx,t,progress){
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;
      
      // WARM LIVING ROOM WALLS (beige/cream)
      ctx.fillStyle = '#F5DEB3';
      ctx.fillRect(0, 0, W, H);
      
      // Window in background (showing night sky)
      outlineRect(ctx, W-35, 10, 30, 24, '#1a2a4a', '#000000', 2);
      ctx.fillStyle = '#0a1a2a';
      ctx.fillRect(W-33, 12, 26, 20);
      // Stars in window
      ctx.fillStyle = '#FFFF99';
      px(ctx, W-28, 15, 2, 2, '#FFFF99');
      px(ctx, W-20, 18, 2, 2, '#FFFF99');
      px(ctx, W-12, 16, 2, 2, '#FFFF99');
      
      // Couch in background (simple silhouette)
      outlineRect(ctx, 5, H*0.35, 35, 12, '#8B5A2B', '#000000', 1);
      px(ctx, 8, H*0.38, 3, 2, '#A0724A');
      px(ctx, 15, H*0.38, 3, 2, '#A0724A');
      px(ctx, 22, H*0.38, 3, 2, '#A0724A');
      
      // Rug under tree and characters
      outlineCircle(ctx, W/2 - 15, H*0.65, 35, '#8B4444', '#000000', 1);
      // Rug pattern (simple radial)
      ctx.strokeStyle = '#A0555A';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(W/2 - 15, H*0.65, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W/2 - 15, H*0.65, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // FLOOR (lighter wood)
      ctx.fillStyle = '#D2B48C';
      ctx.fillRect(0, H*0.70, W, H*0.30);
      
      // CHRISTMAS TREE (large, full, bushy - 65% of screen height)
      const treeX = 35;
      const treeBaseY = H*0.72;
      const treeHeight = 45;
      
      // Tree trunk (thick brown)
      outlineRect(ctx, treeX - 4, treeBaseY - 8, 8, 8, '#6B4423', '#000000', 1);
      
      // TREE BODY (three overlapping circles for full bushy effect)
      // Bottom tier (widest)
      outlineCircle(ctx, treeX, treeBaseY - 8, 18, '#1a5a1a', '#000000', 2);
      // Add lighter green highlight on right side
      ctx.fillStyle = '#2d7a2d';
      ctx.beginPath();
      ctx.arc(treeX + 6, treeBaseY - 12, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Middle tier
      outlineCircle(ctx, treeX, treeBaseY - 25, 14, '#1a5a1a', '#000000', 2);
      ctx.fillStyle = '#2d7a2d';
      ctx.beginPath();
      ctx.arc(treeX + 4, treeBaseY - 28, 9, 0, Math.PI * 2);
      ctx.fill();
      
      // Top tier (narrowest)
      outlineCircle(ctx, treeX, treeBaseY - 38, 10, '#1a5a1a', '#000000', 2);
      ctx.fillStyle = '#2d7a2d';
      ctx.beginPath();
      ctx.arc(treeX + 3, treeBaseY - 40, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // TREE DECORATIONS
      
      // Garland/Tinsel (wavy white lines)
      ctx.strokeStyle = '#E8E8E8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(treeX - 15, treeBaseY - 15);
      for(let i = 0; i < 8; i++){
        const x = treeX - 15 + i * 8;
        const y = treeBaseY - 15 + (i % 2) * 4;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // String lights (warm-colored glowing dots)
      const lightColors = ['#FFD700', '#FF6B6B', '#FF8C42', '#4488FF', '#FFB6D9'];
      const lightPositions = [
        [treeX - 10, treeBaseY - 20], [treeX + 8, treeBaseY - 22],
        [treeX - 6, treeBaseY - 32], [treeX + 10, treeBaseY - 30],
        [treeX - 8, treeBaseY - 42], [treeX + 6, treeBaseY - 40],
        [treeX + 2, treeBaseY - 16], [treeX - 12, treeBaseY - 35]
      ];
      for(let i = 0; i < lightPositions.length; i++){
        const pos = lightPositions[i];
        const color = lightColors[i % lightColors.length];
        outlineCircle(ctx, pos[0], pos[1], 2.5, color, '#000000', 1);
        // Glow effect (lighter halo)
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      // ORNAMENTS (colorful circles on tree)
      const ornaments = [
        [treeX - 8, treeBaseY - 10, '#FF4444'], [treeX + 10, treeBaseY - 12, '#4488FF'],
        [treeX - 4, treeBaseY - 28, '#FFD700'], [treeX + 8, treeBaseY - 26, '#FF8C69'],
        [treeX - 10, treeBaseY - 18, '#FF69B4'], [treeX + 6, treeBaseY - 20, '#4CBB5F'],
        [treeX, treeBaseY - 35, '#FFB6D9'], [treeX - 6, treeBaseY - 38, '#FFD700'],
        [treeX + 4, treeBaseY - 22, '#FF4444'], [treeX - 12, treeBaseY - 26, '#4488FF'],
      ];
      for(let ornament of ornaments){
        outlineCircle(ctx, ornament[0], ornament[1], 3, ornament[2], '#000000', 1);
      }
      
      // STAR OR ANGEL ON TOP (bright yellow)
      outlineCircle(ctx, treeX, treeBaseY - 50, 3, '#FFFF44', '#000000', 1);
      px(ctx, treeX - 1, treeBaseY - 52, 3, 2, '#FFD700');
      
      // TREE SKIRT (red circular base)
      outlineCircle(ctx, treeX, treeBaseY, 16, '#CC0000', '#000000', 2);
      // Tree skirt pattern
      ctx.strokeStyle = '#FF3333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(treeX, treeBaseY, 12, 0, Math.PI * 2);
      ctx.stroke();
      
      // PRESENTS UNDER TREE (2-4 wrapped boxes with bows)
      // Present 1 (left)
      outlineRect(ctx, treeX - 22, treeBaseY - 2, 10, 8, '#FF4444', '#000000', 1);
      outlineRect(ctx, treeX - 19, treeBaseY - 4, 4, 2, '#FFD700', '#000000', 1);
      // Bow
      outlineCircle(ctx, treeX - 17, treeBaseY - 5, 2, '#FFD700', '#000000', 1);
      
      // Present 2 (right)
      outlineRect(ctx, treeX + 12, treeBaseY - 2, 10, 8, '#4488FF', '#000000', 1);
      outlineRect(ctx, treeX + 15, treeBaseY - 4, 4, 2, '#FFD700', '#000000', 1);
      // Bow
      outlineCircle(ctx, treeX + 17, treeBaseY - 5, 2, '#FFD700', '#000000', 1);
      
      // CHARACTERS (positioned RIGHT of tree, close together, holding)
      // Gentle sway dance animation
      const sway = Math.sin(t * 2.8) * 3;
      const swayOpp = Math.sin((t + Math.PI) * 2.8) * 3;
      
      const charBaseX = 105;
      const charBaseY = H * 0.68;
      
      // Mom (with explicit curly hair)
      const momHeadW = 14;
      const momHeadH = 14;
      const momBodyW = 12;
      const momBodyH = 14;
      const momTotalH = 28;
      
      const momHeadX = charBaseX - 8 + sway - momHeadW/2;
      const momHeadY = charBaseY - momTotalH;
      const momBodyX = charBaseX - 8 + sway - momBodyW/2;
      const momBodyY = momHeadY + momHeadH;
      
      const momSkin = '#9D6B4A';
      const momOutline = '#000000';
      const momHairColor = '#2a1a1a';
      
      // Curly hair (5 visible clusters)
      px(ctx, momHeadX - 5, momHeadY - 6, 3, 3, momOutline);
      px(ctx, momHeadX + 5, momHeadY - 6, 3, 3, momOutline);
      px(ctx, momHeadX - 2, momHeadY - 7, 2, 2, momOutline);
      px(ctx, momHeadX + 4, momHeadY - 7, 2, 2, momOutline);
      px(ctx, momHeadX + 1, momHeadY - 8, 2, 2, momOutline);
      
      px(ctx, momHeadX - 4, momHeadY - 5, 2, 2, momHairColor);
      px(ctx, momHeadX + 6, momHeadY - 5, 2, 2, momHairColor);
      px(ctx, momHeadX - 1, momHeadY - 6, 2, 2, momHairColor);
      px(ctx, momHeadX + 5, momHeadY - 6, 2, 2, momHairColor);
      px(ctx, momHeadX + 2, momHeadY - 7, 2, 1, momHairColor);
      
      // Head
      outlineRect(ctx, momHeadX, momHeadY, momHeadW, momHeadH, momSkin, momOutline, 2);
      
      // Eyes
      outlineRect(ctx, momHeadX + 2, momHeadY + 5, 6, 5, '#FFFFFF', momOutline, 1);
      px(ctx, momHeadX + 4, momHeadY + 7, 2, 2, '#000000');
      
      outlineRect(ctx, momHeadX + momHeadW - 8, momHeadY + 5, 6, 5, '#FFFFFF', momOutline, 1);
      px(ctx, momHeadX + momHeadW - 6, momHeadY + 7, 2, 2, '#000000');
      
      // Mouth
      px(ctx, charBaseX - 10, momHeadY + 12, 4, 1, '#8B5544');
      px(ctx, charBaseX - 10, momHeadY + 13, 2, 1, '#C88060');
      
      // Body
      outlineRect(ctx, momBodyX, momBodyY, momBodyW, momBodyH, '#E8A080', momOutline, 2);
      
      // Arms
      px(ctx, momBodyX - 2, momBodyY + 4, 2, 6, momOutline);
      px(ctx, momBodyX - 1, momBodyY + 4, 1, 6, momSkin);
      px(ctx, momBodyX + momBodyW, momBodyY + 4, 2, 6, momOutline);
      px(ctx, momBodyX + momBodyW + 1, momBodyY + 4, 1, 6, momSkin);
      
      // Me (taller, with dreads - stage 6)
      drawMainCharacter(ctx, charBaseX + 12 + swayOpp, charBaseY - 2, 6, (t * 0.6) % 1, 'dance');
      
      // Connection line (holding hands/arms around)
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(charBaseX, charBaseY - 10);
      ctx.lineTo(charBaseX + 4, charBaseY - 10);
      ctx.stroke();
      
      // WARM GLOW EFFECT (overlay soft warm light from tree)
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.globalAlpha = 0.08;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      
      // HEART ANIMATION (emotional climax at end)
      // Heart grows from center and fills screen, then breaks apart
      if(progress > 0.6){
        const heartT = (progress - 0.6) / 0.4; // 0 to 1 over last 40% of scene
        
        if(heartT < 0.85){
          // Heart grows
          const heartScale = heartT * 1.5;
          const heartSize = heartScale * 24;
          const heartX = W / 2;
          const heartY = H / 2;
          
          ctx.fillStyle = '#FF4444';
          // Draw heart shape
          ctx.save();
          ctx.translate(heartX, heartY);
          ctx.scale(heartScale, heartScale);
          
          ctx.beginPath();
          ctx.moveTo(0, 8);
          ctx.bezierCurveTo(-8, -8, -16, -8, -12, -2);
          ctx.bezierCurveTo(-16, -8, -24, -8, -24, 0);
          ctx.bezierCurveTo(-24, 12, 0, 20, 0, 20);
          ctx.bezierCurveTo(0, 20, 24, 12, 24, 0);
          ctx.bezierCurveTo(24, -8, 16, -8, 12, -2);
          ctx.bezierCurveTo(16, -8, 8, -8, 0, 8);
          ctx.closePath();
          ctx.fill();
          
          // Heart outline
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.restore();
        } else {
          // Heart breaks into pieces (pop animation)
          const popT = (heartT - 0.85) / 0.15; // transition over last 15%
          const pieces = [
            {x: W/2 - 15, y: H/2 - 20},
            {x: W/2 + 15, y: H/2 - 20},
            {x: W/2 - 12, y: H/2 + 15},
            {x: W/2 + 12, y: H/2 + 15}
          ];
          
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - popT);
          
          for(let piece of pieces){
            const velocity = popT * 20;
            const dx = (piece.x - W/2) / 20;
            const dy = (piece.y - H/2) / 20;
            
            ctx.fillStyle = '#FF4444';
            ctx.beginPath();
            ctx.arc(piece.x + dx * velocity, piece.y + dy * velocity, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        }
      }
=======
function updateDynamicInputs(){
  const sets = parseInt(setsInput.value, 10) || 0;
  repsContainer.innerHTML = '';
  weightContainer.innerHTML = '';
  if(sets > 0){
    for(let i=1; i<=sets; i++){
      const repInput = document.createElement('input');
      repInput.type = 'text';
      repInput.inputMode = 'numeric';
      repInput.placeholder = `Reps set ${i}`;
      repInput.className = 'dynamic-input';
      repsContainer.appendChild(repInput);

      const weightInput = document.createElement('input');
      weightInput.type = 'text';
      weightInput.inputMode = 'decimal';
      weightInput.placeholder = `Weight set ${i} (optional)`;
      weightInput.className = 'dynamic-input';
      weightContainer.appendChild(weightInput);
>>>>>>> 5731997 (good features added)
    }
  }
];

function drawDistinctFriend(ctx, x, y, phase, shirtColor, hairStyle){
  // Friend character with distinct features: height, hair style, shirt color
  const totalH = 26;
  const headH = 13;
  const bodyH = 13;
  const headW = 13;
  const bodyW = 11;
  
  const headX = x - headW/2;
  const headY = y - totalH;
  const bodyX = x - bodyW/2;
  const bodyY = y - bodyH;
  
  const skin = '#9D6B4A';
  const outline = '#000000';
  
  // Different hair styles (distinguishing feature)
  if(hairStyle === 'flattop'){
    // Flat-top hair (friend 1)
    outlineRect(ctx, headX-2, headY-6, headW+4, 5, '#1a1a1a', outline, 1);
    px(ctx, headX+1, headY-7, 3, 1, '#2a2a2a');
  } else if(hairStyle === 'curly'){
    // Curly hair (friend 2)
    px(ctx, headX-3, headY-5, 2, 2, '#1a1a1a');
    px(ctx, headX+4, headY-5, 2, 2, '#1a1a1a');
    px(ctx, headX-1, headY-6, 2, 2, '#1a1a1a');
    px(ctx, headX+3, headY-4, 2, 2, '#1a1a1a');
  } else if(hairStyle === 'spiky'){
    // Spiky hair (friend 3)
    px(ctx, headX-3, headY-7, 2, 2, '#1a1a1a');
    px(ctx, headX, headY-8, 2, 2, '#1a1a1a');
    px(ctx, headX+4, headY-7, 2, 2, '#1a1a1a');
  }
<<<<<<< HEAD
  
  // Head with thick outline
  outlineRect(ctx, headX, headY, headW, headH, skin, outline, 2);
  
  // Eyes (expressive, visible)
  const eyeW = 5, eyeH = 4;
  const eyeY = headY + 4;
  
  outlineRect(ctx, headX+1.5, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  px(ctx, headX+3.5, eyeY+1, 2, 1, '#000000');
  
  outlineRect(ctx, headX+headW-eyeW-1.5, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  px(ctx, headX+headW-3.5, eyeY+1, 2, 1, '#000000');
  
  // Mouth (casual smile)
  px(ctx, x-2, y-totalH+10, 4, 1, '#8B5544');
  px(ctx, x-1, y-totalH+11, 2, 1, '#C88060');
  
  // Body (different shirt color for each friend)
  outlineRect(ctx, bodyX, bodyY, bodyW, bodyH, shirtColor, outline, 2);
  
  // Arms (relaxed pose)
  px(ctx, bodyX-2, bodyY+4, 2, 5, outline);
  px(ctx, bodyX-1, bodyY+4, 1, 5, skin);
  px(ctx, bodyX+bodyW, bodyY+4, 2, 5, outline);
  px(ctx, bodyX+bodyW+1, bodyY+4, 1, 5, skin);
  
  // Legs (casual stance with subtle movement)
  const legOffset = Math.sin(phase * Math.PI * 2) * 1;
  px(ctx, bodyX+2, bodyY+bodyH + legOffset, 2, 4, outline);
  px(ctx, bodyX+2.5, bodyY+bodyH + legOffset, 1, 4, skin);
  px(ctx, bodyX+bodyW-4, bodyY+bodyH - legOffset, 2, 4, outline);
  px(ctx, bodyX+bodyW-3.5, bodyY+bodyH - legOffset, 1, 4, skin);
}

function drawMainCharacter(ctx,x,y,stage,stepPhase,state='walk'){
  // Kindergarten style: Large head proportions
  const totalH = 28;
  const headH = 14;
  const bodyH = 14;
  const headW = 14;
  const bodyW = 12;
  
  const headX = x - headW/2;
  const headY = y - totalH;
  const bodyX = x - bodyW/2;
  const bodyY = y - bodyH;
  
  const skin = '#9D6B4A';
  const outline = '#000000';
  const hairColor = '#1a1a1a';
  
  // HAIR (stage-dependent, ALWAYS VISIBLE)
  // Stage 0: Toddler (1-3) - Rounded afro/baby hair, small but full coverage
  if(stage === 0) {
    // Rounded afro top
    outlineCircle(ctx, x, headY - 5, 8, hairColor, outline, 1);
  }
  // Stage 1: Early Toddler (2-4) - Short rounded hair, slightly taller
  else if(stage === 1) {
    // Slightly taller rounded hair
    outlineCircle(ctx, x, headY - 6, 8, hairColor, outline, 1);
    px(ctx, headX - 3, headY - 4, 2, 1, hairColor);
    px(ctx, headX + 5, headY - 4, 2, 1, hairColor);
  }
  // Stage 2: Elementary (5-8) - Short rounded top
  else if(stage === 2) {
    outlineRect(ctx, headX - 3, headY - 7, headW + 6, 7, hairColor, outline, 1);
    px(ctx, headX + 2, headY - 8, 2, 1, hairColor);
  }
  // Stage 3: Elementary (8-10) - Medium length rounded
  else if(stage === 3) {
    outlineRect(ctx, headX - 3, headY - 8, headW + 6, 8, hairColor, outline, 1);
    px(ctx, headX - 1, headY - 9, 3, 1, hairColor);
    px(ctx, headX + 3, headY - 9, 3, 1, hairColor);
  }
  // Stage 4: Middle School (11-13) - Taller hair, more defined
  else if(stage === 4) {
    // Flat-top style hair, rectangular shape
    outlineRect(ctx, headX - 3, headY - 9, headW + 6, 9, hairColor, outline, 1);
    // Hair detail: side accents
    px(ctx, headX - 4, headY - 6, 1, 3, hairColor);
    px(ctx, headX + 15, headY - 6, 1, 3, hairColor);
  }
  // Stage 5: High School/Teen (14-17) - Distinct teen hair
  else if(stage === 5) {
    // Medium-length styled hair
    outlineRect(ctx, headX - 3, headY - 9, headW + 6, 9, hairColor, outline, 2);
    // Side accents for definition
    px(ctx, headX - 4, headY - 7, 1, 4, outline);
    px(ctx, headX + 15, headY - 7, 1, 4, outline);
  }
  // Stage 6: Young Adult/College (18+) - Shoulder-length dreads
  else {
    // Dreads hanging down naturally from head
    // Left side dreads (3)
    outlineRect(ctx, headX - 6, headY + 2, 2, 12, hairColor, outline, 1);  // dread 1
    outlineRect(ctx, headX - 3, headY + 1, 2, 13, hairColor, outline, 1);  // dread 2
    outlineRect(ctx, headX + 0, headY, 2, 14, hairColor, outline, 1);     // dread 3 (center-left)
    
    // Right side dreads (3)
    outlineRect(ctx, headX + 12, headY, 2, 14, hairColor, outline, 1);    // dread 4 (center-right)
    outlineRect(ctx, headX + 15, headY + 1, 2, 13, hairColor, outline, 1); // dread 5
    outlineRect(ctx, headX + 18, headY + 2, 2, 12, hairColor, outline, 1); // dread 6
    
    // Dread texture highlights
    px(ctx, headX - 5, headY + 8, 1, 2, outline);
    px(ctx, headX + 19, headY + 8, 1, 2, outline);
  }
  
  // Head with thick outline
  outlineRect(ctx, headX, headY, headW, headH, skin, outline, 2);
  
  // Large expressive eyes
  const eyeW = 6, eyeH = 5;
  const eyeY = headY + 5;
  
  outlineRect(ctx, headX+2, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  const pupilOff = Math.sin(stepPhase * Math.PI * 2) * 1;
  px(ctx, headX+4+pupilOff, eyeY+2, 2, 2, '#000000');
  
  outlineRect(ctx, headX+headW-eyeW-2, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  px(ctx, headX+headW-4+pupilOff, eyeY+2, 2, 2, '#000000');
  
  // Mouth
  if(state === 'sleep') px(ctx, x-2, y-totalH+12, 4, 1, '#000000');
  else if(state === 'idle' || state === 'sit') px(ctx, x-2, y-totalH+12, 4, 1, '#8B4545');
  else {
    px(ctx, x-2, y-totalH+11, 4, 1, '#000000');
    px(ctx, x-1, y-totalH+13, 2, 1, '#8B4545');
  }
  
  // Body with thick outline
  let shirtColor = '#6B8E23';
  if(stage === 0) shirtColor = '#FFB6D9';
  if(stage === 1) shirtColor = '#6FA3FF';
  if(stage === 2) shirtColor = '#7FB77E';
  if(stage === 3) shirtColor = '#9B7FFF';
  if(stage >= 4) shirtColor = '#556B2F';
  
  outlineRect(ctx, bodyX, bodyY, bodyW, bodyH, shirtColor, outline, 2);
  
  // Arms
  px(ctx, bodyX-2, bodyY+4, 2, 4, outline);
  px(ctx, bodyX-1, bodyY+4, 1, 4, skin);
  px(ctx, bodyX+bodyW, bodyY+4, 2, 4, outline);
  px(ctx, bodyX+bodyW+1, bodyY+4, 1, 4, skin);
  
  // Legs (alternating with walk)
  const legOff = Math.sin(stepPhase * Math.PI * 2) * 2;
  px(ctx, bodyX+2, bodyY+bodyH, 2, 4, outline);
  px(ctx, bodyX+2.5, bodyY+bodyH, 1, 4, skin);
  px(ctx, bodyX+bodyW-4, bodyY+bodyH+legOff, 2, 4, outline);
  px(ctx, bodyX+bodyW-3.5, bodyY+bodyH+legOff, 1, 4, skin);
=======
  entries.forEach((e, i) => {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = e.exercise + (e.weight && e.weight.length ? ` — ${e.weight.join(', ')}` : '');
    const p = document.createElement('p');
    const setsText = e.sets ? e.sets + ' sets' : '';
    const repsText = e.reps && e.reps.length ? '• ' + e.reps.join(', ') : '';
    const notesText = e.notes ? '• ' + e.notes : '';
    p.textContent = `${setsText} ${repsText} ${notesText}`.trim();
    li.appendChild(h);
    li.appendChild(p);
    entriesList.appendChild(li);
  });
  renderWeeklyComparison();
  renderDayComparison();
}

function getWeekStart(dateStr){
  const d = new Date(dateStr + 'T00:00:00');
  // make Monday the first day
  const day = (d.getDay() + 6) % 7; // 0=Mon,6=Sun
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0,0,0,0);
  return start;
>>>>>>> 5731997 (good features added)
}

function drawMom(ctx,x,y,stepPhase,state='stand'){
  const totalH = 28;
  const headH = 14;
  const bodyH = 14;
  const headW = 14;
  const bodyW = 12;
  
  const headX = x - headW/2;
  const headY = y - totalH;
  const bodyX = x - bodyW/2;
  const bodyY = y - bodyH;
  
  const skin = '#9D6B4A';
  const outline = '#000000';
  const hairColor = '#2a1a1a';
  
  // Curly hair
  px(ctx, headX-5, headY-6, 16, 8, outline);
  px(ctx, headX-4, headY-5, 14, 7, hairColor);
  px(ctx, headX-3, headY-7, 2, 2, hairColor);
  px(ctx, headX+3, headY-7, 2, 2, hairColor);
  px(ctx, headX, headY-8, 2, 2, hairColor);
  
  // Head with thick outline
  outlineRect(ctx, headX, headY, headW, headH, skin, outline, 2);
  
  // Eyes
  const eyeW = 6, eyeH = 5;
  const eyeY = headY + 5;
  
  outlineRect(ctx, headX+2, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  px(ctx, headX+4, eyeY+2, 2, 2, '#000000');
  
  outlineRect(ctx, headX+headW-eyeW-2, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  px(ctx, headX+headW-4, eyeY+2, 2, 2, '#000000');
  
  // Mouth
  px(ctx, x-2, y-totalH+12, 4, 1, '#8B5544');
  px(ctx, x-1, y-totalH+13, 2, 1, '#C88060');
  
  // Body
  outlineRect(ctx, bodyX, bodyY, bodyW, bodyH, '#E8A080', outline, 2);
  
  // Arms
  px(ctx, bodyX-2, bodyY+4, 2, 6, outline);
  px(ctx, bodyX-1, bodyY+4, 1, 6, skin);
  px(ctx, bodyX+bodyW, bodyY+4, 2, 6, outline);
  px(ctx, bodyX+bodyW+1, bodyY+4, 1, 6, skin);
}

<<<<<<< HEAD
function drawFriend(ctx,x,y,phase,color){
  const totalH = 26;
  const headH = 13;
  const bodyH = 13;
  const headW = 13;
  const bodyW = 11;
  
  const headX = x - headW/2;
  const headY = y - totalH;
  const bodyX = x - bodyW/2;
  const bodyY = y - bodyH;
  
  const skin = '#9D6B4A';
  const outline = '#000000';
  const hairColor = '#1a1a1a';
  
  // Hair
  outlineRect(ctx, headX-2, headY-5, headW+4, 6, hairColor, outline, 1);
  
  // Head
  outlineRect(ctx, headX, headY, headW, headH, skin, outline, 2);
  
  // Eyes
  const eyeW = 5, eyeH = 4;
  const eyeY = headY + 4;
  
  outlineRect(ctx, headX+1.5, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  px(ctx, headX+3.5, eyeY+1.5, 2, 2, '#000000');
  
  outlineRect(ctx, headX+headW-eyeW-1.5, eyeY, eyeW, eyeH, '#FFFFFF', outline, 1);
  px(ctx, headX+headW-3.5, eyeY+1.5, 2, 2, '#000000');
  
  // Mouth
  px(ctx, x-2, y-totalH+10, 4, 1, '#8B5544');
  
  // Body
  outlineRect(ctx, bodyX, bodyY, bodyW, bodyH, color, outline, 2);
  
  // Arms
  px(ctx, bodyX-2, bodyY+3, 2, 5, outline);
  px(ctx, bodyX-1, bodyY+3, 1, 5, skin);
  px(ctx, bodyX+bodyW, bodyY+3, 2, 5, outline);
  px(ctx, bodyX+bodyW+1, bodyY+3, 1, 5, skin);
=======
function computeHeaviestByExercise(){
  const all = loadAll();
  const maxes = {};
  Object.values(all).forEach(list => {
    (list||[]).forEach(e => {
      const weights = Array.isArray(e.weight) ? e.weight : [];
      const entryMax = weights.reduce((m,w)=>{
        const n = parseFloat(w);
        return Number.isFinite(n) ? Math.max(m,n) : m;
      }, 0);
      if(entryMax > 0){
        if(!maxes[e.exercise] || entryMax > maxes[e.exercise]) maxes[e.exercise] = entryMax;
      }
    });
  });
  return maxes;
}

// Seed demo data only when there is nothing saved, to avoid overwriting user logs
function seedDemoData(){
  const existing = loadAll();
  if(Object.keys(existing).length) return;

  const today = new Date();
  const dates = [0, -1, -2, -3, -7].map(n => isoDate(datePlusDays(new Date(today), n)));

  const sample = {
    [dates[0]]: [
      {exercise:'Lat Pulldown', sets:'3', reps:['12','10','8'], weight:['120','130','140'], notes:'Wide grip', createdAt:new Date().toISOString()},
      {exercise:'Bench Press', sets:'4', reps:['10','8','6','6'], weight:['155','175','185','185'], notes:'Paused reps', createdAt:new Date().toISOString()},
    ],
    [dates[1]]: [
      {exercise:'Squat', sets:'5', reps:['5','5','5','5','5'], weight:['225','245','255','255','255'], notes:'Low bar', createdAt:new Date().toISOString()},
      {exercise:'Leg Curl', sets:'3', reps:['12','12','12'], weight:['70','80','80'], notes:'', createdAt:new Date().toISOString()},
    ],
    [dates[2]]: [
      {exercise:'Overhead Press', sets:'4', reps:['8','8','6','6'], weight:['95','105','115','115'], notes:'', createdAt:new Date().toISOString()},
      {exercise:'Lateral Raise', sets:'3', reps:['15','15','15'], weight:['20','20','20'], notes:'Strict', createdAt:new Date().toISOString()},
    ],
    [dates[3]]: [
      {exercise:'Deadlift', sets:'3', reps:['5','5','5'], weight:['275','295','315'], notes:'Double overhand warmups', createdAt:new Date().toISOString()},
      {exercise:'Pull Up', sets:'4', reps:['10','10','8','8'], weight:['0','0','0','0'], notes:'Bodyweight', createdAt:new Date().toISOString()},
    ],
    [dates[4]]: [
      {exercise:'Lat Pulldown', sets:'3', reps:['12','12','10'], weight:['115','120','125'], notes:'Prior week', createdAt:new Date().toISOString()},
      {exercise:'Bench Press', sets:'3', reps:['10','8','6'], weight:['145','165','175'], notes:'Prior week', createdAt:new Date().toISOString()},
    ]
  };

  saveAll(sample);
}

function weekdayName(index){
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index];
>>>>>>> 5731997 (good features added)
}

function showStart(){ startScreen.classList.remove('hidden'); sceneScreen.classList.add('hidden'); isPlaying=false; }

<<<<<<< HEAD
function startJourney(){ startScreen.classList.add('hidden'); sceneScreen.classList.remove('hidden'); sceneIndex=0; isPlaying=true; sceneStartTime=performance.now(); sceneProgress=0; lastTime=sceneStartTime; requestAnimationFrame(loop); renderTextbox(); }

function renderTextbox(){
  const s = scenes[sceneIndex];
  textbox.innerHTML = s.text.replace(/\n/g,'<br>');
  if(s.id === 'highschool'){
    const laugh = document.createElement('div'); laugh.className='laugh'; laugh.textContent='HAHAHAHA'; laugh.style.marginTop='6px'; textbox.appendChild(laugh);
  }
}

function advanceScene(nowImmediate=false){
  if(transition) return;
  const from = sceneIndex;
  const to = (sceneIndex + 1) % scenes.length;
  transition = {from,to,start:performance.now(),duration:TRANSITION_MS};
  setTimeout(()=>{
    sceneIndex = to; renderTextbox(); sceneStartTime = performance.now(); sceneProgress = 0; transition = null;
    if(to === 0 && from === scenes.length-1){
      playEndingHeart();
=======
    // Add details
    const details = document.createElement('div'); details.className='compare-details';
    const entries = getEntriesFor(dCurr);
    if(entries.length){
      const ul = document.createElement('ul');
      entries.forEach(e => {
        const li = document.createElement('li');
        const exerciseDiv = document.createElement('div'); exerciseDiv.className='exercise'; exerciseDiv.textContent = e.exercise;
        const detailsDiv = document.createElement('div'); detailsDiv.className='details';
        const setsText = e.sets ? e.sets + ' sets' : '';
        const repsText = e.reps && e.reps.length ? 'Reps: ' + e.reps.join(', ') : '';
        const weightText = e.weight && e.weight.length ? 'Weight: ' + e.weight.join(', ') : '';
        const notesText = e.notes ? 'Notes: ' + e.notes : '';
        detailsDiv.textContent = [setsText, repsText, weightText, notesText].filter(t => t).join(' • ');
        li.appendChild(exerciseDiv);
        li.appendChild(detailsDiv);
        ul.appendChild(li);
      });
      details.appendChild(ul);
    } else {
      details.textContent = 'No entries';
>>>>>>> 5731997 (good features added)
    }
  }, TRANSITION_MS);
}

function playEndingHeart(){
  const overlay = document.createElement('div'); overlay.id='heart-overlay'; document.body.appendChild(overlay);
  const ocan = document.createElement('canvas'); ocan.width=160; ocan.height=144; ocan.style.width = `calc(160px * var(--scale))`; ocan.style.height = `calc(144px * var(--scale))`; ocan.style.imageRendering='pixelated'; overlay.appendChild(ocan);
  const octx = ocan.getContext('2d');
  octx.imageSmoothingEnabled = false;
  const start = performance.now();
  const dur = 900;
  function frame(t){
    const dt = t-start; const p = Math.min(1, dt/dur);
    octx.clearRect(0,0,160,144);
    octx.save(); octx.translate(80,72); octx.scale(1+p*4,1+p*4);
    octx.fillStyle='#FF4444'; octx.beginPath(); octx.moveTo(0, -6); octx.bezierCurveTo(-10,-20,-36,-8,-12,12); octx.bezierCurveTo(0,26,12,20,12,20); octx.bezierCurveTo(28,-6,10,-20,0,-6); octx.fill();
    octx.restore();
    if(p < 1) requestAnimationFrame(frame); else {
      setTimeout(()=>{ document.body.removeChild(overlay); showStart(); }, 420);
    }
  }
  requestAnimationFrame(frame);
}

<<<<<<< HEAD
function loop(now){
  if(!isPlaying) return;
  const dt = now - lastTime; lastTime = now;
  const elapsed = now - sceneStartTime;
  sceneProgress = Math.min(1, elapsed / SCENE_DURATION);
  const sidx = sceneIndex;
  clear();
  if(transition){
    const p = Math.min(1, (now - transition.start)/transition.duration);
    ctx.save(); ctx.globalAlpha = 1-p; scenes[transition.from].draw(ctx, (now%1000)/1000, sceneProgress, transition.from); ctx.restore();
    ctx.save(); ctx.globalAlpha = p; scenes[transition.to].draw(ctx, (now%1000)/1000, sceneProgress, transition.to); ctx.restore();
  } else {
    scenes[sidx].draw(ctx, (now%1000)/1000, sceneProgress, sidx);
  }

  requestAnimationFrame(loop);
}

startBtn.addEventListener('click', () => { startJourney(); });
nextBtn.addEventListener('click', () => { advanceScene(true); });
skipBtn.addEventListener('click', () => {
  sceneIndex = scenes.length - 1;
  renderTextbox();
  sceneStartTime = performance.now() - SCENE_DURATION;
});

showStart();
=======
function renderDayComparison(){
  const container = document.getElementById('dayCompare');
  const dateStr = dateInput.value;
  const lastWeekDate = isoDate(datePlusDays(new Date(dateStr + 'T00:00:00'), -7));
  
  const todayEntries = getEntriesFor(dateStr);
  const lastWeekEntries = getEntriesFor(lastWeekDate);
  const heaviest = computeHeaviestByExercise();
  
  const currentDate = new Date(dateStr + 'T00:00:00');
  const dayName = currentDate.toLocaleDateString(undefined, {weekday: 'long'});
  
  container.innerHTML = `<h3>This ${dayName} vs Last ${dayName}</h3>`;
  
  const grid = document.createElement('div');
  grid.className = 'day-compare-grid';
  
  // Last week column
  const lastWeekCol = document.createElement('div');
  lastWeekCol.className = 'day-compare-col';
  const lastWeekHeader = document.createElement('div');
  lastWeekHeader.className = 'day-compare-header';
  lastWeekHeader.textContent = `Last ${dayName} (${lastWeekDate})`;
  lastWeekCol.appendChild(lastWeekHeader);
  
  if(lastWeekEntries.length){
    const ul = document.createElement('ul');
    ul.className = 'day-compare-list';
    lastWeekEntries.forEach(e => {
      const pr = heaviest[e.exercise];
      const li = document.createElement('li');
      const prText = pr ? ` • PR: ${pr} lb` : '';
      li.innerHTML = `<strong>${e.exercise}</strong><br>${e.sets || 0} sets • Reps: ${e.reps && e.reps.length ? e.reps.join(', ') : 'N/A'} • Weight: ${e.weight && e.weight.length ? e.weight.join(', ') : 'N/A'}${prText}`;
      ul.appendChild(li);
    });
    lastWeekCol.appendChild(ul);
  } else {
    const empty = document.createElement('p');
    empty.className = 'day-compare-empty';
    empty.textContent = 'No data';
    lastWeekCol.appendChild(empty);
  }
  
  // This week column
  const thisWeekCol = document.createElement('div');
  thisWeekCol.className = 'day-compare-col';
  const thisWeekHeader = document.createElement('div');
  thisWeekHeader.className = 'day-compare-header current';
  thisWeekHeader.textContent = `This ${dayName} (${dateStr})`;
  thisWeekCol.appendChild(thisWeekHeader);
  
  if(todayEntries.length){
    const ul = document.createElement('ul');
    ul.className = 'day-compare-list';
    todayEntries.forEach(e => {
      const pr = heaviest[e.exercise];
      const li = document.createElement('li');
      const prText = pr ? ` • PR: ${pr} lb` : '';
      li.innerHTML = `<strong>${e.exercise}</strong><br>${e.sets || 0} sets • Reps: ${e.reps && e.reps.length ? e.reps.join(', ') : 'N/A'} • Weight: ${e.weight && e.weight.length ? e.weight.join(', ') : 'N/A'}${prText}`;
      ul.appendChild(li);
    });
    thisWeekCol.appendChild(ul);
  } else {
    const empty = document.createElement('p');
    empty.className = 'day-compare-empty';
    empty.textContent = 'No data yet';
    thisWeekCol.appendChild(empty);
  }
  
  grid.appendChild(lastWeekCol);
  grid.appendChild(thisWeekCol);
  container.appendChild(grid);
}

function changeDay(offset){
  const cur = new Date(dateInput.value);
  cur.setDate(cur.getDate() + offset);
  dateInput.value = isoDate(cur);
  render();
}

prevBtn.addEventListener('click', (e)=> { e.preventDefault(); changeDay(-1); });
nextBtn.addEventListener('click', (e)=> { e.preventDefault(); changeDay(1); });
todayBtn.addEventListener('click', (e)=> { e.preventDefault(); dateInput.value = isoDate(); render(); });
dateInput.addEventListener('change', render);

entryForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const dateStr = dateInput.value;
  const exercise = document.getElementById('exercise').value.trim();
  const sets = document.getElementById('sets').value.trim();
  const reps = Array.from(repsContainer.querySelectorAll('input')).map(inp => inp.value.trim()).filter(v => v);
  const weight = Array.from(weightContainer.querySelectorAll('input')).map(inp => inp.value.trim()).filter(v => v);
  const notes = document.getElementById('notes').value.trim();
  if(!exercise) return;
  addEntry(dateStr, {exercise, sets, reps, weight, notes, createdAt: new Date().toISOString()});
  entryForm.reset();
  updateDynamicInputs();
  render();
});

setsInput.addEventListener('input', updateDynamicInputs);

clearDayBtn.addEventListener('click', ()=>{
  if(!confirm('Clear all entries for this date?')) return;
  clearDay(dateInput.value);
  render();
});

// init
(function(){
  dateInput.value = isoDate();
  seedDemoData();
  updateDynamicInputs();
  render();
})();
>>>>>>> 5731997 (good features added)
