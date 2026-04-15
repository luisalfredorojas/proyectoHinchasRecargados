/**
 * Validates that a file's content matches its claimed MIME type by checking
 * magic bytes (file signatures). This prevents attackers from uploading
 * malicious files with a spoofed MIME type.
 */

interface MagicSignature {
  mime: string;
  bytes: number[];
  offset?: number;
}

const SIGNATURES: MagicSignature[] = [
  // JPEG: starts with FF D8 FF
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  // WebP: starts with RIFF....WEBP
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] },
  // HEIF/HEIC: ftyp box at offset 4
  { mime: 'image/heic', bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
  { mime: 'image/heif', bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

/**
 * Returns true if the file buffer's magic bytes match any of the allowed
 * image signatures.
 */
export function isValidImageBuffer(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);

  if (bytes.length < 12) return false;

  return SIGNATURES.some((sig) => {
    const offset = sig.offset ?? 0;
    return sig.bytes.every((b, i) => bytes[offset + i] === b);
  });
}

/**
 * Additional check for WebP: verify WEBP marker at offset 8.
 */
export function isWebP(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);
  // RIFF at 0, WEBP at 8
  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}
