const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "public/uploads");
const backupDir = path.join(__dirname, "public/uploads_backup");

async function optimizeAll() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const files = fs.readdirSync(uploadsDir);
  const imageExtensions = [".jpg", ".jpeg", ".png"];

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;
    if (file.includes("-thumb")) continue; // Pula se já for thumb

    const filePath = path.join(uploadsDir, file);
    const backupPath = path.join(backupDir, file);

    // Faz backup se ainda não tiver
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    const statBefore = fs.statSync(filePath);
    totalBefore += statBefore.size;

    const baseName = path.basename(file, ext);
    const thumbName = `${baseName}-thumb.webp`;
    const thumbPath = path.join(uploadsDir, thumbName);
    const webpName = `${baseName}.webp`;
    const webpPath = path.join(uploadsDir, webpName);

    try {
      const image = sharp(backupPath);
      const metadata = await image.metadata();

      // 1. Gera Thumbnail WebP ultra leve (360x240 máx, para miniaturas e previews rápidos)
      await sharp(backupPath)
        .resize({ width: 360, height: 240, fit: "cover" })
        .webp({ quality: 75, effort: 5 })
        .toFile(thumbPath);

      // 2. Gera Versão WebP Full HD otimizada (máx 1440px)
      await sharp(backupPath)
        .resize({ width: 1440, height: 1440, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(webpPath);

      // 3. Recomprime o arquivo original mantendo a mesma extensão (para não quebrar nenhuma URL legada)
      if (ext === ".png") {
        const tempOut = filePath + ".tmp";
        await sharp(backupPath)
          .resize({ width: 1440, height: 1440, fit: "inside", withoutEnlargement: true })
          .png({ quality: 80, compressionLevel: 9, palette: true })
          .toFile(tempOut);
        fs.renameSync(tempOut, filePath);
      } else {
        const tempOut = filePath + ".tmp";
        await sharp(backupPath)
          .resize({ width: 1440, height: 1440, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 78, mozjpeg: true })
          .toFile(tempOut);
        fs.renameSync(tempOut, filePath);
      }

      const statAfter = fs.statSync(filePath);
      const statThumb = fs.statSync(thumbPath);
      const statWebp = fs.statSync(webpPath);
      totalAfter += statAfter.size;

      console.log(`[OK] ${file}:`);
      console.log(`     Original: ${(statBefore.size/1024).toFixed(1)} KB -> ${(statAfter.size/1024).toFixed(1)} KB (-${((1 - statAfter.size/statBefore.size)*100).toFixed(0)}%)`);
      console.log(`     WebP: ${(statWebp.size/1024).toFixed(1)} KB | Thumb: ${(statThumb.size/1024).toFixed(1)} KB`);
    } catch (err) {
      console.error(`[ERRO] Falha ao processar ${file}:`, err.message);
    }
  }

  console.log("=========================================");
  console.log(`Total antes: ${(totalBefore/1024/1024).toFixed(2)} MB`);
  console.log(`Total depois (arquivos originais): ${(totalAfter/1024/1024).toFixed(2)} MB (-${((1 - totalAfter/totalBefore)*100).toFixed(0)}%)`);
  console.log("=========================================");
}

optimizeAll();
