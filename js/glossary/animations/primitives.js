// Shared SVG primitives for glossary animations.
// All primitives return SVG string fragments. Coordinates assume a 320×200 viewBox by default.

export const VIEWBOX = { w: 320, h: 200 };

export function scene({ width = VIEWBOX.w, height = VIEWBOX.h, title = "", desc = "", children = [] } = {}) {
  return `
    <svg class="gl-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeAttr(title)}">
      <title>${escapeHtml(title)}</title>
      <desc>${escapeHtml(desc)}</desc>
      <defs>
        <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="currentColor"/>
        </marker>
      </defs>
      ${children.join("")}
    </svg>
  `;
}

// Rounded rectangle node with label + optional sublabel + optional icon.
export function node({ id, x, y, w = 88, h = 40, label, sub = "", color = "ink", icon = "" } = {}) {
  const fill = color === "teal" ? "var(--teal-tint)" : color === "amber" ? "var(--amber-tint)" : "var(--surface)";
  const stroke = color === "teal" ? "var(--teal)" : color === "amber" ? "var(--amber-line)" : "var(--line)";
  const textColor = color === "teal" ? "var(--teal)" : color === "amber" ? "#78350f" : "var(--ink)";
  return `
    <g class="gl-node" data-id="${id || ""}" transform="translate(${x}, ${y})">
      <rect width="${w}" height="${h}" rx="8" ry="8" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
      ${icon ? `<text x="8" y="${h/2 + 4}" font-size="14">${icon}</text>` : ""}
      <text x="${icon ? 26 : w/2}" y="${sub ? h/2 - 2 : h/2 + 4}"
            text-anchor="${icon ? "start" : "middle"}"
            font-family="var(--ff-sans)" font-size="11" font-weight="600" fill="${textColor}">${escapeHtml(label)}</text>
      ${sub ? `<text x="${icon ? 26 : w/2}" y="${h/2 + 11}" text-anchor="${icon ? "start" : "middle"}"
                    font-family="var(--ff-sans)" font-size="9" fill="var(--ink-3)">${escapeHtml(sub)}</text>` : ""}
    </g>
  `;
}

// Directed edge between two points. Supports dashed, animated pulse, label.
export function arrow({ from, to, label = "", dashed = false, animated = false, color = "var(--ink-2)", id = "" } = {}) {
  const dash = dashed ? `stroke-dasharray="4 3"` : "";
  const animId = id || `edge-${Math.floor(Math.random() * 1e6)}`;
  const pulse = animated ? `
    <circle r="3" fill="var(--teal)">
      <animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto">
        <mpath href="#${animId}"/>
      </animateMotion>
    </circle>` : "";
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return `
    <g class="gl-edge" style="color: ${color};">
      <path id="${animId}" d="M ${from.x} ${from.y} L ${to.x} ${to.y}"
            fill="none" stroke="${color}" stroke-width="1.5" ${dash}
            marker-end="url(#arrowhead)"/>
      ${label ? `<text x="${mid.x}" y="${mid.y - 6}" text-anchor="middle"
                      font-family="var(--ff-sans)" font-size="9" fill="var(--ink-3)">${escapeHtml(label)}</text>` : ""}
      ${pulse}
    </g>
  `;
}

// Small amber fee badge that detaches mid-arrow. `detachAt` 0..1 is the position along from→to.
export function feeBadge({ from, to, detachAt = 0.5, amount, settleY = null } = {}) {
  const detachX = from.x + (to.x - from.x) * detachAt;
  const detachY = from.y + (to.y - from.y) * detachAt;
  const dropY = settleY != null ? settleY : detachY + 30;
  return `
    <g class="gl-fee">
      <rect x="${detachX - 18}" y="${detachY - 9}" width="36" height="18" rx="6" ry="6"
            fill="var(--amber-tint)" stroke="var(--amber-line)">
        <animate attributeName="y" values="${detachY - 9};${dropY - 9};${dropY - 9}"
                 keyTimes="0;0.6;1" dur="2.4s" repeatCount="indefinite"/>
      </rect>
      <text x="${detachX}" y="${detachY + 3}" text-anchor="middle"
            font-family="var(--ff-mono)" font-size="9" font-weight="600" fill="#78350f">
        ${escapeHtml(amount)}
        <animate attributeName="y" values="${detachY + 3};${dropY + 3};${dropY + 3}"
                 keyTimes="0;0.6;1" dur="2.4s" repeatCount="indefinite"/>
      </text>
    </g>
  `;
}

// Vertical stack (for batches, journal entries). items = [{label, color}].
export function stack({ x, y, items = [], w = 110 } = {}) {
  return `
    <g class="gl-stack" transform="translate(${x}, ${y})">
      ${items.map((it, i) => `
        <rect x="0" y="${i * 14}" width="${w}" height="12" rx="3" ry="3"
              fill="${it.color || "var(--paper-warm)"}" stroke="var(--line)" stroke-width="1"/>
        <text x="6" y="${i * 14 + 9}" font-family="var(--ff-sans)" font-size="9" fill="var(--ink-2)">${escapeHtml(it.label)}</text>
      `).join("")}
    </g>
  `;
}

// Two-column debit/credit mini-ledger. rows = [{dr, cr, account}].
export function ledger({ x, y, rows = [], w = 200 } = {}) {
  const rowH = 14;
  return `
    <g class="gl-ledger" transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="${w}" height="${14 + rows.length * rowH}" rx="4" ry="4"
            fill="var(--surface)" stroke="var(--line)"/>
      <text x="6" y="10" font-family="var(--ff-sans)" font-size="8" fill="var(--ink-3)"
            font-weight="700" letter-spacing="1">DR</text>
      <text x="${w - 6}" y="10" font-family="var(--ff-sans)" font-size="8" fill="var(--ink-3)"
            font-weight="700" letter-spacing="1" text-anchor="end">CR</text>
      ${rows.map((r, i) => `
        <text x="6" y="${14 + i * rowH + 10}" font-family="var(--ff-mono)" font-size="9" fill="var(--ink)">${escapeHtml(r.dr || "")}</text>
        <text x="${w/2}" y="${14 + i * rowH + 10}" text-anchor="middle"
              font-family="var(--ff-sans)" font-size="9" fill="var(--ink-3)">${escapeHtml(r.account || "")}</text>
        <text x="${w - 6}" y="${14 + i * rowH + 10}" text-anchor="end"
              font-family="var(--ff-mono)" font-size="9" fill="var(--ink)">${escapeHtml(r.cr || "")}</text>
      `).join("")}
    </g>
  `;
}

// Small circled check/x outcome marker.
export function mark({ x, y, type = "check", r = 10 } = {}) {
  const color = type === "check" ? "var(--green)" : "var(--red)";
  const glyph = type === "check" ? "✓" : "✗";
  return `
    <g class="gl-mark">
      <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.15"/>
      <text x="${x}" y="${y + 3}" text-anchor="middle" font-size="11" font-weight="700" fill="${color}">${glyph}</text>
    </g>
  `;
}

// Simple clock face for timers / cut-offs.
export function timer({ x, y, label = "", r = 14 } = {}) {
  return `
    <g class="gl-timer" transform="translate(${x}, ${y})">
      <circle r="${r}" fill="var(--surface)" stroke="var(--ink-3)"/>
      <line x1="0" y1="0" x2="0" y2="-${r - 4}" stroke="var(--ink-2)" stroke-width="1.5" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite"/>
      </line>
      <line x1="0" y1="0" x2="${r - 6}" y2="0" stroke="var(--ink-2)" stroke-width="1.5" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite"/>
      </line>
      ${label ? `<text x="0" y="${r + 12}" text-anchor="middle" font-size="9" fill="var(--ink-3)">${escapeHtml(label)}</text>` : ""}
    </g>
  `;
}

// Simple globe with two highlighted regions.
export function globe({ x, y, r = 30, regions = [] } = {}) {
  const meridians = [0, 30, 60, 90, 120, 150].map(deg => {
    const rx = r * Math.abs(Math.cos((deg * Math.PI) / 180));
    return `<ellipse cx="0" cy="0" rx="${rx}" ry="${r}" fill="none" stroke="var(--line)" stroke-width="0.75"/>`;
  }).join("");
  return `
    <g class="gl-globe" transform="translate(${x}, ${y})">
      <circle r="${r}" fill="var(--paper)" stroke="var(--ink-3)"/>
      <line x1="-${r}" y1="0" x2="${r}" y2="0" stroke="var(--line)"/>
      ${meridians}
      ${regions.map(rg => `<circle cx="${rg.dx}" cy="${rg.dy}" r="3" fill="var(--teal)"/>`).join("")}
    </g>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function escapeAttr(s) {
  return String(s).replace(/["']/g, c => ({ "\"": "&quot;", "'": "&#39;" }[c]));
}
