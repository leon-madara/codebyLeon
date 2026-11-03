import sharp from "sharp";

// Rasterize the supplied navigation logo; no replacement artwork or remote service.
const logo = "public/original-logo.svg";
const background = "#f5f2ea";
await sharp({ create: { width: 1200, height: 630, channels: 3, background } })
  .composite([{ input: await sharp(logo).resize({ width: 720, height: 400, fit: "inside" }).png().toBuffer(), gravity: "centre" }])
  .png().toFile("public/images/codebyleon-share.png");
await sharp({ create: { width: 512, height: 512, channels: 3, background } })
  .composite([{ input: await sharp(logo).resize({ width: 432, height: 432, fit: "inside" }).png().toBuffer(), gravity: "centre" }])
  .png().toFile("public/images/codebyleon-logo.png");
await sharp("public/images/codebyleon-logo.png").resize(180, 180).png().toFile("src/app/apple-icon.png");
