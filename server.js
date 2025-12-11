// api/generate-card.js
const path = require("path");
const { registerFont, createCanvas, loadImage } = require('canvas');
const express = require('express');

const app = express();
app.use(express.json());

registerFont(path.join(__dirname, "public/fonts/arial.ttf"), {
  family: "Arial",
});

registerFont(path.join(__dirname, "public/fonts/Georgia.ttf"), {
  family: "Georgia",
});
const CARD_WIDTH = 1920;
const CARD_HEIGHT = 1080;

// Helper to load image from URL with redirect handling
async function loadImageFromUrl(url) {
  const response = await fetch(url, { 
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  
  const buffer = await response.arrayBuffer();
  return loadImage(Buffer.from(buffer));
}

// Default images (using placeholder services)
const DEFAULT_BACKGROUND = 'https://files.catbox.moe/mu1liu.jpeg';
const DEFAULT_ICON = 'https://files.catbox.moe/ujk28g.png';

function renderType1(ctx, bg, pfp, icon, data) {
  const P = 70, PFP = 280;
  ctx.drawImage(bg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  
  ctx.strokeStyle = "#8b0000";
  ctx.lineWidth = 4;
  ctx.strokeRect(P-4, P-4, PFP+8, PFP+8);
  ctx.drawImage(pfp, P, P, PFP, PFP);
  
  ctx.drawImage(icon, CARD_WIDTH-150, 50, 100, 100);
  
  let x = P+PFP+50, y = P+50;
  ctx.fillStyle = "#dc143c";
  ctx.font = "bold 56px Arial";
  ctx.fillText(data.userName, x, y);
  y += 60;
  ctx.fillStyle = "#9d4edd";
  ctx.font = "32px Arial";
  ctx.fillText(data.username, x, y);
  y += 55;
  ctx.fillStyle = "rgba(139,0,0,0.2)";
  ctx.fillRect(x-10, y-30, 200, 45);
  ctx.fillStyle = "#9d4edd";
  ctx.font = "bold 28px Arial";
  ctx.fillText(data.status, x, y);
  
  const drawBox = (lbl, val, unit, bx, by, col) => {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(bx, by, 360, 100);
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, 360, 100);
    ctx.fillStyle = "#a8a8a8";
    ctx.font = "24px Arial";
    ctx.fillText(lbl, bx+20, by+35);
    ctx.fillStyle = col;
    ctx.font = "bold 36px Arial";
    const txt = val.toLocaleString() + unit;
    ctx.fillText(txt, bx+20, by+75);
  };
  
  let sy = P+PFP+70;
  drawBox("TOTAL POINTS", data.totalPoints, "xp", P, sy, "#dc143c");
  drawBox("REFERRALS", data.referralPoints, "xp", P+390, sy, "#9d4edd");
  drawBox("REPUTATION", data.reputation, "reps", P+780, sy, "#00d4ff");
  drawBox("THIS WEEK", data.pointsThisWeek, "xp", P, sy+130, "#fff");
  drawBox("EVENT", data.pointsCurrentEvent, "xp", P+390, sy+130, "#9d4edd");
  
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(P+780, sy+130, 360, 100);
  ctx.strokeStyle = "#9d4edd";
  ctx.lineWidth = 2;
  ctx.strokeRect(P+780, sy+130, 360, 100);
  ctx.fillStyle = "#a8a8a8";
  ctx.font = "24px Arial";
  ctx.fillText("RANK", P+800, sy+165);
  ctx.fillStyle = "#9d4edd";
  ctx.font = "bold 32px Arial";
  ctx.fillText(data.rank, P+800, sy+205);
  
  let rx = P+1200, ry = P+PFP+70;
  ctx.fillStyle = "#a8a8a8";
  ctx.font = "24px Arial";
  ctx.fillText("MEMBER SINCE", rx, ry);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Arial";
  ctx.fillText(data.joinDate, rx, ry+35);
  ry += 95;
  ctx.fillStyle = "#a8a8a8";
  ctx.font = "24px Arial";
  ctx.fillText("USER ID", rx, ry);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Arial";
  ctx.fillText(`#${data.userId}`, rx, ry+35);
  ry += 95;
  ctx.fillStyle = "#a8a8a8";
  ctx.font = "24px Arial";
  ctx.fillText("CODE", rx, ry);
  ctx.fillStyle = "#dc143c";
  ctx.font = "bold 28px Arial";
  ctx.fillText(data.referralCode, rx, ry+35);
  
  ctx.font = "26px Arial";
  ctx.fillStyle = "#9d4edd";
  ctx.fillText(data.certifiedTag, P, CARD_HEIGHT-100);
  ctx.fillStyle = "#dc143c";
  const grp = `${data.groupName} • ${data.groupUsername}`;
  ctx.fillText(grp, CARD_WIDTH-ctx.measureText(grp).width-P, CARD_HEIGHT-100);
}

function renderType2(ctx, bg, pfp, icon, data) {
  const P = 80, PFP = 320;
  ctx.drawImage(bg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
  const g = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  g.addColorStop(0, 'rgba(0,0,0,0.8)');
  g.addColorStop(1, 'rgba(20,0,0,0.85)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  
  ctx.strokeStyle = "#8b0000";
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, CARD_WIDTH-60, CARD_HEIGHT-60);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#4a0000";
  ctx.strokeRect(40, 40, CARD_WIDTH-80, CARD_HEIGHT-80);
  
  ctx.shadowColor = "#8b0000";
  ctx.shadowBlur = 30;
  ctx.strokeStyle = "#8b0000";
  ctx.lineWidth = 6;
  ctx.strokeRect(P-10, P+30-10, PFP+20, PFP+20);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#dc143c";
  ctx.lineWidth = 2;
  ctx.strokeRect(P-4, P+30-4, PFP+8, PFP+8);
  ctx.drawImage(pfp, P, P+30, PFP, PFP);
  
  ctx.fillStyle = "rgba(139,0,0,0.9)";
  ctx.fillRect(P, P+30+PFP-50, PFP, 50);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PREMIUM MEMBER", P+PFP/2, P+30+PFP-20);
  ctx.textAlign = "left";
  
  ctx.shadowColor = "#8b0000";
  ctx.shadowBlur = 25;
  ctx.drawImage(icon, CARD_WIDTH-220, 80, 140, 140);
  ctx.shadowBlur = 0;
  
  let x = P+PFP+70, y = P+110;
  ctx.fillStyle = "#dc143c";
  ctx.font = "bold 64px Arial";
  ctx.fillText(data.userName, x, y);
  ctx.fillRect(x, y+10, ctx.measureText(data.userName).width, 3);
  y += 70;
  ctx.fillStyle = "#9d4edd";
  ctx.font = "36px Arial";
  ctx.fillText(data.username, x, y);
  y += 60;
  ctx.strokeStyle = "#9d4edd";
  ctx.lineWidth = 3;
  const sw = ctx.measureText(data.status).width;
  ctx.strokeRect(x-15, y-38, sw+40, 55);
  ctx.fillStyle = "rgba(157,78,221,0.15)";
  ctx.fillRect(x-15, y-38, sw+40, 55);
  ctx.fillStyle = "#9d4edd";
  ctx.font = "bold 32px Arial";
  ctx.fillText(data.status, x, y);
  
  const drawPBox = (lbl, val, unit, bx, by, pri) => {
    const bg2 = ctx.createLinearGradient(bx, by, bx, by+120);
    bg2.addColorStop(0, pri ? 'rgba(139,0,0,0.3)' : 'rgba(60,60,60,0.2)');
    bg2.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = bg2;
    ctx.fillRect(bx, by, 340, 120);
    ctx.strokeStyle = pri ? "#8b0000" : "#9d4edd";
    ctx.lineWidth = pri ? 4 : 2;
    ctx.strokeRect(bx, by, 340, 120);
    ctx.fillStyle = "#999";
    ctx.font = "22px Arial";
    ctx.fillText(lbl, bx+25, by+35);
    ctx.fillStyle = pri ? "#dc143c" : "#9d4edd";
    ctx.font = "bold 38px Arial";
    const txt = val.toLocaleString() + unit;
    ctx.fillText(txt, bx+25, by+80);
  };
  
  let sy = P+PFP+120;
  drawPBox("TOTAL POINTS", data.totalPoints, "xp", P, sy, true);
  drawPBox("REFERRALS", data.referralPoints, "xp", P+370, sy, false);
  drawPBox("REPUTATION", data.reputation, "reps", P+740, sy, false);
  drawPBox("THIS WEEK", data.pointsThisWeek, "xp", P, sy+150, false);
  drawPBox("EVENT", data.pointsCurrentEvent, "xp", P+370, sy+150, false);
  
  const rg = ctx.createLinearGradient(P+740, sy+150, P+740, sy+270);
  rg.addColorStop(0, 'rgba(139,0,0,0.3)');
  rg.addColorStop(1, 'rgba(74,0,0,0.3)');
  ctx.fillStyle = rg;
  ctx.fillRect(P+740, sy+150, 340, 120);
  ctx.strokeStyle = "#9d4edd";
  ctx.lineWidth = 5;
  ctx.strokeRect(P+740, sy+150, 340, 120);
  ctx.fillStyle = "#999";
  ctx.font = "22px Arial";
  ctx.fillText("RANK", P+765, sy+185);
  ctx.fillStyle = "#9d4edd";
  ctx.font = "bold 36px Arial";
  ctx.fillText(data.rank, P+765, sy+230);
  
  let rx = P+1170, ry = P+PFP+120;
  const drawInfo = (lbl, val, col="#fff") => {
    ctx.fillStyle = "#999";
    ctx.font = "24px Arial";
    ctx.fillText(lbl, rx, ry);
    ry += 38;
    ctx.fillStyle = col;
    ctx.font = "bold 30px Arial";
    ctx.fillText(val, rx, ry);
    ry += 70;
  };
  drawInfo("MEMBER SINCE", data.joinDate);
  drawInfo("USER ID", `#${data.userId}`);
  drawInfo("CODE", data.referralCode, "#9d4edd");
  
  ctx.fillStyle = "#8b0000";
  ctx.fillRect(P, CARD_HEIGHT-100, CARD_WIDTH-P*2, 3);
  ctx.font = "28px Arial";
  ctx.fillStyle = "#9d4edd";
  ctx.fillText(data.certifiedTag, P, CARD_HEIGHT-55);
  ctx.fillStyle = "#dc143c";
  const grp = `${data.groupName} • ${data.groupUsername}`;
  ctx.fillText(grp, CARD_WIDTH-ctx.measureText(grp).width-P, CARD_HEIGHT-55);
}

function renderType3(ctx, bg, pfp, icon, data) {
  const P = 80, PFP = 360;
  ctx.drawImage(bg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
  
  const g = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  g.addColorStop(0, 'rgba(15,0,10,0.90)');
  g.addColorStop(0.5, 'rgba(5,0,5,0.92)');
  g.addColorStop(1, 'rgba(20,0,15,0.90)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  
  const borderGrad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  borderGrad.addColorStop(0, "#8b0000");
  borderGrad.addColorStop(0.3, "#dc143c");
  borderGrad.addColorStop(0.6, "#9d4edd");
  borderGrad.addColorStop(1, "#8b0000");
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, CARD_WIDTH-60, CARD_HEIGHT-60);
  
  ctx.strokeStyle = "#dc143c";
  ctx.lineWidth = 8;
  ctx.strokeRect(P-8, P+30-8, PFP+16, PFP+16);
  ctx.strokeStyle = "#9d4edd";
  ctx.lineWidth = 3;
  ctx.strokeRect(P-4, P+30-4, PFP+8, PFP+8);
  ctx.drawImage(pfp, P, P+30, PFP, PFP);
  
  const badgeGrad = ctx.createLinearGradient(P, P+30+PFP-70, P+PFP, P+30+PFP);
  badgeGrad.addColorStop(0, "#4a0000");
  badgeGrad.addColorStop(0.3, "#8b0000");
  badgeGrad.addColorStop(0.7, "#5a1a6b");
  badgeGrad.addColorStop(1, "#4a0000");
  ctx.fillStyle = badgeGrad;
  ctx.fillRect(P, P+30+PFP-70, PFP, 70);
  ctx.strokeStyle = "#9d4edd";
  ctx.lineWidth = 2;
  ctx.strokeRect(P, P+30+PFP-70, PFP, 70);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("ELITE PREMIUM", P+PFP/2, P+30+PFP-30);
  ctx.textAlign = "left";
  
  ctx.drawImage(icon, CARD_WIDTH-240, 70, 170, 170);
  
  let x = P+PFP+90, y = P+140;
  const nameGrad = ctx.createLinearGradient(x, y-60, x+700, y);
  nameGrad.addColorStop(0, "#dc143c");
  nameGrad.addColorStop(0.5, "#9d4edd");
  nameGrad.addColorStop(1, "#dc143c");
  ctx.fillStyle = nameGrad;
  ctx.font = "bold 72px Georgia";
  ctx.fillText(data.userName, x, y);
  
  const nameWidth = ctx.measureText(data.userName).width;
  ctx.fillStyle = "#dc143c";
  ctx.fillRect(x, y+14, nameWidth, 3);
  ctx.fillStyle = "#9d4edd";
  ctx.fillRect(x, y+22, nameWidth, 2);
  
  y += 80;
  ctx.fillStyle = "#b57edc";
  ctx.font = "40px Arial";
  ctx.fillText(data.username, x, y);
  
  y += 70;
  const statusW = ctx.measureText(data.status).width + 70;
  const statusGrad = ctx.createLinearGradient(x-25, y-45, x+statusW, y);
  statusGrad.addColorStop(0, 'rgba(139,0,0,0.15)');
  statusGrad.addColorStop(0.5, 'rgba(157,78,221,0.15)');
  statusGrad.addColorStop(1, 'rgba(139,0,0,0.15)');
  ctx.fillStyle = statusGrad;
  ctx.fillRect(x-25, y-45, statusW, 65);
  
  const statusBorderGrad = ctx.createLinearGradient(x-25, y-45, x+statusW, y+20);
  statusBorderGrad.addColorStop(0, "#dc143c");
  statusBorderGrad.addColorStop(1, "#9d4edd");
  ctx.strokeStyle = statusBorderGrad;
  ctx.lineWidth = 3;
  ctx.strokeRect(x-25, y-45, statusW, 65);
  ctx.fillStyle = "#b57edc";
  ctx.font = "bold 36px Arial";
  ctx.fillText(data.status, x, y);
  
  const drawEliteBox = (lbl, val, unit, bx, by, pri) => {
    const boxGrad = ctx.createLinearGradient(bx, by, bx, by+140);
    if (pri) {
      boxGrad.addColorStop(0, 'rgba(74,0,0,0.35)');
      boxGrad.addColorStop(1, 'rgba(139,0,0,0.25)');
    } else {
      boxGrad.addColorStop(0, 'rgba(40,0,40,0.2)');
      boxGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
    }
    ctx.fillStyle = boxGrad;
    ctx.fillRect(bx, by, 350, 140);
    
    ctx.strokeStyle = pri ? "#dc143c" : "#9d4edd";
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, 350, 140);
    
    ctx.fillStyle = pri ? "rgba(220,20,60,0.3)" : "rgba(157,78,221,0.3)";
    ctx.fillRect(bx, by, 35, 2);
    ctx.fillRect(bx, by, 2, 35);
    ctx.fillRect(bx+350-35, by, 35, 2);
    ctx.fillRect(bx+350-2, by, 2, 35);
    
    ctx.fillStyle = "#aaa";
    ctx.font = "bold 24px Arial";
    ctx.fillText(lbl, bx+25, by+42);
    
    ctx.fillStyle = pri ? "#dc143c" : "#b57edc";
    ctx.font = "bold 42px Georgia";
    const txt = val.toLocaleString() + unit;
    ctx.fillText(txt, bx+25, by+95);
  };
  
  let sy = P+PFP+140;
  drawEliteBox("TOTAL POINTS", data.totalPoints, "xp", P, sy, true);
  drawEliteBox("REFERRALS", data.referralPoints, "xp", P+380, sy, false);
  drawEliteBox("REPUTATION", data.reputation, "reps", P+760, sy, false);
  drawEliteBox("THIS WEEK", data.pointsThisWeek, "xp", P, sy+170, false);
  drawEliteBox("EVENT", data.pointsCurrentEvent, "xp", P+380, sy+170, false);
  
  const rankGrad = ctx.createLinearGradient(P+760, sy+170, P+1110, sy+310);
  rankGrad.addColorStop(0, 'rgba(74,0,0,0.35)');
  rankGrad.addColorStop(0.5, 'rgba(93,37,133,0.25)');
  rankGrad.addColorStop(1, 'rgba(74,0,0,0.35)');
  ctx.fillStyle = rankGrad;
  ctx.fillRect(P+760, sy+170, 350, 140);
  
  const rankBorderGrad = ctx.createLinearGradient(P+760, sy+170, P+1110, sy+310);
  rankBorderGrad.addColorStop(0, "#dc143c");
  rankBorderGrad.addColorStop(1, "#9d4edd");
  ctx.strokeStyle = rankBorderGrad;
  ctx.lineWidth = 4;
  ctx.strokeRect(P+760, sy+170, 350, 140);
  
  ctx.fillStyle = "rgba(220,20,60,0.3)";
  ctx.fillRect(P+760, sy+170, 40, 2);
  ctx.fillRect(P+760, sy+170, 2, 40);
  ctx.fillStyle = "rgba(157,78,221,0.3)";
  ctx.fillRect(P+1110-40, sy+170, 40, 2);
  ctx.fillRect(P+1110-2, sy+170, 2, 40);
  
  ctx.fillStyle = "#aaa";
  ctx.font = "bold 24px Arial";
  ctx.fillText("RANK", P+785, sy+212);
  ctx.fillStyle = "#b57edc";
  ctx.font = "bold 42px Arial";
  ctx.fillText(data.rank, P+785, sy+265);
  
  let rx = P+1190, ry = P+PFP+140;
  const drawInfo = (lbl, val, col) => {
    ctx.fillStyle = "#aaa";
    ctx.font = "28px Arial";
    ctx.fillText(lbl, rx, ry);
    ry += 45;
    ctx.fillStyle = col;
    ctx.font = "bold 34px Arial";
    ctx.fillText(val, rx, ry);
    ry += 80;
  };
  drawInfo("MEMBER SINCE", data.joinDate, "#dc143c");
  drawInfo("USER ID", `#${data.userId}`, "#b57edc");
  drawInfo("CODE", data.referralCode, "#b57edc");
  
  const footerGrad = ctx.createLinearGradient(P, CARD_HEIGHT-100, CARD_WIDTH-P, CARD_HEIGHT-100);
  footerGrad.addColorStop(0, "#8b0000");
  footerGrad.addColorStop(0.5, "#9d4edd");
  footerGrad.addColorStop(1, "#8b0000");
  ctx.fillStyle = footerGrad;
  ctx.fillRect(P, CARD_HEIGHT-100, CARD_WIDTH-P*2, 3);
  
  ctx.font = "32px Arial";
  ctx.fillStyle = "#b57edc";
  ctx.fillText(data.certifiedTag, P, CARD_HEIGHT-55);
  
  const grp = `${data.groupName} • ${data.groupUsername}`;
  const grpGrad = ctx.createLinearGradient(CARD_WIDTH-500, CARD_HEIGHT-55, CARD_WIDTH-P, CARD_HEIGHT-55);
  grpGrad.addColorStop(0, "#dc143c");
  grpGrad.addColorStop(1, "#9d4edd");
  ctx.fillStyle = grpGrad;
  ctx.fillText(grp, CARD_WIDTH-ctx.measureText(grp).width-P, CARD_HEIGHT-55);
}

app.post('/api/generate-card', async (req, res) => {
  try {
    const {
      type = 1,
      userName = "User",
      joinDate = "January 1, 2024",
      username = "@user",
      status = "Member",
      totalPoints = 0,
      referralPoints = 0,
      reputation = 0,
      pointsThisWeek = 0,
      pointsCurrentEvent = 0,
      rank = "#0",
      referralCode = "CODE",
      userId = 0,
      certifiedTag = "#certified",
      groupName = "Group",
      groupUsername = "@group",
      profilePictureUrl,
      backgroundUrl,
      iconUrl
    } = req.body;

    // Validate type
    if (![1, 2, 3].includes(type)) {
      return res.status(400).json({ error: 'Type must be 1, 2, or 3' });
    }

    // Load images
    const bg = await loadImageFromUrl(backgroundUrl || DEFAULT_BACKGROUND);
    const icon = await loadImageFromUrl(iconUrl || DEFAULT_ICON);
    
    // Handle profile picture - could be redirect
    if (!profilePictureUrl) {
      return res.status(400).json({ error: 'profilePictureUrl is required' });
    }
    const pfp = await loadImageFromUrl(profilePictureUrl);

    // Create canvas and render
    const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
    const ctx = canvas.getContext('2d');

    const data = {
      userName, joinDate, username, status,
      totalPoints, referralPoints, reputation,
      pointsThisWeek, pointsCurrentEvent, rank,
      referralCode, userId, certifiedTag,
      groupName, groupUsername
    };

    if (type === 1) renderType1(ctx, bg, pfp, icon, data);
    else if (type === 2) renderType2(ctx, bg, pfp, icon, data);
    else if (type === 3) renderType3(ctx, bg, pfp, icon, data);

    // Send image
    const buffer = canvas.toBuffer('image/png');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);

  } catch (error) {
    console.error('Error generating card:', error);
    res.status(500).json({ 
      error: 'Failed to generate card', 
      message: error.message 
    });
  }
});

// For Vercel serverless
module.exports = app;
