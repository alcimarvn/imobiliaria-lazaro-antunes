import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const baseCleanName = file.name
      .replace(/[^a-zA-Z0-9.\-_]/g, "")
      .replace(/\.[^/.]+$/, ""); // remove extensão original

    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Nome padronizado em WebP de alta eficiência
    const filename = `${uniqueSuffix}-${baseCleanName}.webp`;
    const thumbFilename = `${uniqueSuffix}-${baseCleanName}-thumb.webp`;
    const filepath = join(uploadDir, filename);
    const thumbPath = join(uploadDir, thumbFilename);

    try {
      // 1. Otimizar imagem principal: máx 1600px, WebP qualidade 80
      await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toFile(filepath);

      // 2. Gerar miniatura ultraleve: 360x240, WebP qualidade 75 (~6KB)
      await sharp(buffer)
        .resize({ width: 360, height: 240, fit: "cover" })
        .webp({ quality: 75, effort: 4 })
        .toFile(thumbPath);
    } catch (sharpError) {
      // Fallback de segurança se o formato não for suportado pelo Sharp
      const fallbackFilename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
      await writeFile(join(uploadDir, fallbackFilename), buffer);
      return NextResponse.json({ ok: true, url: `/uploads/${fallbackFilename}` });
    }

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ ok: false, error: error.message || "Erro no upload" }, { status: 500 });
  }
}
