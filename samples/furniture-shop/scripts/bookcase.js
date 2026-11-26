// Made-to-measure bookcase drawing and price estimate. Used on the server (first render, so the page is complete
// without JS) and in the browser (furniture.js redraws it as the sliders move). The estimate is a demo formula.

export const woods = {
  dab: { name: 'dąb', factor: 1 },
  orzech: { name: 'orzech', factor: 1.25 },
  grafit: { name: 'dąb barwiony na grafit', factor: 1.1 },
};

const FLOOR = 296;
const MAX_WIDTH_CM = 320;
const MAX_HEIGHT_CM = 260;

export function bookcaseLayout(widthCm, heightCm) {
  const width = Math.round((widthCm / MAX_WIDTH_CM) * 340);
  const height = Math.round((heightCm / MAX_HEIGHT_CM) * 256);
  const columns = Math.max(1, Math.round(widthCm / 60));
  const rows = Math.max(1, Math.round(heightCm / 42));
  return { width, height, columns, rows, left: Math.round((400 - width) / 2), top: FLOOR - height };
}

export function bookcaseSvg(widthCm, heightCm) {
  const { width, height, columns, rows, left, top } = bookcaseLayout(widthCm, heightCm);
  const parts = [];
  parts.push(`<rect class="ds-custom__wood" x="${left}" y="${top}" width="${width}" height="${height}" rx="3"/>`);
  parts.push(`<rect class="ds-custom__back" x="${left + 6}" y="${top + 6}" width="${width - 12}" height="${height - 12}" rx="1"/>`);
  const cellWidth = (width - 12) / columns;
  const cellHeight = (height - 12) / rows;
  for (let column = 1; column < columns; column += 1) {
    parts.push(`<rect class="ds-custom__wood-shade" x="${(left + 6 + column * cellWidth - 2.5).toFixed(1)}" y="${top + 6}" width="5" height="${height - 12}"/>`);
  }
  for (let row = 1; row < rows; row += 1) {
    parts.push(`<rect class="ds-custom__wood-shade" x="${left + 6}" y="${(top + 6 + row * cellHeight - 2.5).toFixed(1)}" width="${width - 12}" height="5"/>`);
  }
  // A few books and a vase in a fixed pattern, so the drawing reads as a bookcase at any size.
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const pattern = (row * 3 + column * 2) % 4;
      const cellLeft = left + 6 + column * cellWidth;
      const cellBottom = top + 6 + (row + 1) * cellHeight - 2.5;
      const bookHeight = Math.min(cellHeight - 8, 30);
      if (pattern === 0 && cellWidth > 22) {
        [0, 1, 2].forEach((index) => {
          const bookWidth = Math.min(7, cellWidth / 6);
          parts.push(`<rect class="ds-custom__book ds-custom__book--${index}" x="${(cellLeft + 5 + index * (bookWidth + 1.5)).toFixed(1)}" y="${(cellBottom - bookHeight + index * 3).toFixed(1)}" width="${bookWidth.toFixed(1)}" height="${(bookHeight - index * 3).toFixed(1)}" rx="1"/>`);
        });
      } else if (pattern === 2 && cellWidth > 26 && cellHeight > 26) {
        const centre = cellLeft + cellWidth / 2;
        parts.push(`<path class="ds-custom__vase" d="M${(centre - 5).toFixed(1)} ${cellBottom.toFixed(1)}c-4-6-2-12 2-14v-5h6v5c4 2 6 8 2 14z"/>`);
      }
    }
  }
  const arrowY = FLOOR + 14;
  parts.push(`<path class="ds-custom__dim" d="M${left} ${arrowY}h${width}M${left} ${arrowY - 5}v10M${left + width} ${arrowY - 5}v10"/>`);
  parts.push(`<path class="ds-custom__dim" d="M${left - 14} ${top}v${height}M${left - 19} ${top}h10M${left - 19} ${FLOOR}h10"/>`);
  return { svg: parts.join(''), labelX: left + width / 2, labelY: arrowY + 20, sideX: left - 22, sideY: top + height / 2 };
}

export function estimate(widthCm, heightCm, wood) {
  const { columns, rows } = bookcaseLayout(widthCm, heightCm);
  const base = (widthCm * heightCm) / 10000 * 1450 + columns * rows * 35 + 600;
  return Math.round((base * (woods[wood]?.factor ?? 1)) / 10) * 10;
}
