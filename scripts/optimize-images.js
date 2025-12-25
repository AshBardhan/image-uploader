import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  inputDir: join(__dirname, "../screenshots"),
  outputDir: join(__dirname, "../screenshots"), // Replace original files
  quality: 80, // JPEG/WebP quality (0-100)
  formats: ["jpeg"], // Keep original format
  maxWidth: 1920, // Maximum width (maintains aspect ratio)
  maxHeight: 1080, // Maximum height (maintains aspect ratio)
  replaceOriginal: true, // Replace original files instead of creating new ones
};

const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".gif"];

/**
 * Get all image files from directory recursively
 */
async function getImageFiles(dir, fileList = []) {
  try {
    const files = await readdir(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        await getImageFiles(filePath, fileList);
      } else {
        const ext = extname(file).toLowerCase();
        if (SUPPORTED_FORMATS.includes(ext)) {
          fileList.push(filePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return fileList;
}

/**
 * Optimize a single image and replace the original
 */
async function optimizeImage(inputPath) {
  try {
    const fileName = basename(inputPath, extname(inputPath));
    const originalExt = extname(inputPath).toLowerCase().substring(1);
    const relativeDir = dirname(inputPath).replace(CONFIG.inputDir, "");
    const outputSubDir = join(CONFIG.outputDir, relativeDir);

    // Create output directory
    await mkdir(outputSubDir, { recursive: true });

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalSize = (await stat(inputPath)).size;

    console.log(`\nProcessing: ${basename(inputPath)}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB (${metadata.width}x${metadata.height})`);

    // Resize options
    const resizeOptions = {
      width: CONFIG.maxWidth,
      height: CONFIG.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    };

    // Determine output format (use original format if not specified)
    const format = CONFIG.formats.length > 0 ? CONFIG.formats[0] : originalExt;
    const outputExt = format === "jpg" ? "jpeg" : format;
    const outputPath = CONFIG.replaceOriginal ? inputPath : join(outputSubDir, `${fileName}.${outputExt}`);

    // Create temp file for in-place replacement
    const tempPath = `${inputPath}.tmp`;

    let pipeline = sharp(inputPath).resize(resizeOptions);

    // Apply format-specific optimizations
    switch (outputExt) {
      case "jpeg":
      case "jpg":
        pipeline = pipeline.jpeg({
          quality: CONFIG.quality,
          progressive: true,
          mozjpeg: true,
        });
        break;
      case "webp":
        pipeline = pipeline.webp({
          quality: CONFIG.quality,
          effort: 6,
        });
        break;
      case "png":
        pipeline = pipeline.png({
          quality: CONFIG.quality,
          compressionLevel: 9,
          adaptiveFiltering: true,
        });
        break;
      case "avif":
        pipeline = pipeline.avif({
          quality: CONFIG.quality,
          effort: 6,
        });
        break;
    }

    // Save to temp file first (to avoid corruption)
    await pipeline.toFile(tempPath);

    const optimizedSize = (await stat(tempPath)).size;
    const saved = originalSize - optimizedSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(2);

    // Replace original file if in-place replacement is enabled
    if (CONFIG.replaceOriginal) {
      const { rename, unlink } = await import("fs/promises");
      await unlink(inputPath);
      await rename(tempPath, inputPath);
      console.log(`  [OK] Optimized: ${(optimizedSize / 1024).toFixed(2)} KB (${savedPercent}% smaller)`);
      console.log(`  Saved: ${(saved / 1024).toFixed(2)} KB`);
      console.log(`  Original file replaced`);
    } else {
      await rename(tempPath, outputPath);
      console.log(`  [OK] ${outputExt.toUpperCase()}: ${(optimizedSize / 1024).toFixed(2)} KB (${savedPercent}% smaller)`);
      console.log(`  Saved: ${(saved / 1024).toFixed(2)} KB`);
    }
  } catch (error) {
    console.error(`  [ERROR] Error optimizing ${basename(inputPath)}:`, error.message);
    // Clean up temp file if exists
    try {
      const { unlink } = await import("fs/promises");
      await unlink(`${inputPath}.tmp`);
    } catch {}
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("Image Optimization Tool\n");
  console.log("Configuration:");
  console.log(`  Input: ${CONFIG.inputDir}`);
  console.log(`  Output: ${CONFIG.replaceOriginal ? "Replace originals" : CONFIG.outputDir}`);
  console.log(`  Quality: ${CONFIG.quality}`);
  console.log(`  Max dimensions: ${CONFIG.maxWidth}x${CONFIG.maxHeight}`);
  console.log(`  Mode: ${CONFIG.replaceOriginal ? "In-place replacement" : "Create new files"}`);

  if (CONFIG.replaceOriginal) {
    console.log("\nWARNING: Original files will be replaced!");
  }
  try {
    const imageFiles = await getImageFiles(CONFIG.inputDir);

    if (imageFiles.length === 0) {
      console.log("\nNo images found in screenshots directory");
      return;
    }

    console.log(`\nFound ${imageFiles.length} image(s) to optimize\n`);
    console.log("─".repeat(60));

    for (const imagePath of imageFiles) {
      await optimizeImage(imagePath);
    }

    console.log("\n" + "─".repeat(60));
    console.log("Optimization complete!\n");
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

main();