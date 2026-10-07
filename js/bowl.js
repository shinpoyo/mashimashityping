/* コール内容に応じて丼をSVGで描画する
 * lv: { yasai, ninniku, abura, karame } 各 0(なし)〜4(マシマシ)
 */
const Bowl = (() => {
  // 再現性のある乱数（同じコールなら同じ見た目）
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  const SOUP = ['#c98a4b', '#b4733a', '#9a5a2a', '#7a421d', '#5a2e12'];

  function render(lv, seed = 1) {
    const r = rng(seed);
    const cx = 120, top = 118;
    const H = [0, 22, 42, 62, 90][lv.yasai];
    const W = [0, 34, 50, 60, 70][lv.yasai];
    const peak = top - H;
    let g = '';

    // 丼
    g += `<path d="M18 ${top} Q20 205 120 208 Q220 205 222 ${top} Z" fill="#f4efe6" stroke="#2a1a10" stroke-width="3"/>`;
    g += `<path d="M30 160 Q120 175 210 160" fill="none" stroke="#c0282d" stroke-width="5" stroke-dasharray="14 6"/>`;
    g += `<ellipse cx="${cx}" cy="${top}" rx="102" ry="22" fill="#f4efe6" stroke="#2a1a10" stroke-width="3"/>`;
    g += `<ellipse cx="${cx}" cy="${top + 2}" rx="94" ry="17" fill="${SOUP[lv.karame]}"/>`;
    // 麺ちら見え
    for (let i = 0; i < 7; i++) {
      const x = 40 + r() * 160;
      g += `<path d="M${x} ${top + 6} q8 -6 16 0 t16 0" fill="none" stroke="#f1d27a" stroke-width="3" stroke-linecap="round"/>`;
    }
    // ブタ
    g += `<g stroke="#3b1d0c" stroke-width="2">
      <rect x="30" y="${top - 14}" width="46" height="26" rx="10" fill="#a8622f" transform="rotate(-12 53 ${top})"/>
      <rect x="164" y="${top - 14}" width="46" height="26" rx="10" fill="#a8622f" transform="rotate(14 187 ${top})"/>
    </g>`;
    g += `<path d="M38 ${top - 6} q14 -4 28 -6 M172 ${top - 8} q14 2 28 8" stroke="#e8c39b" stroke-width="3" fill="none"/>`;

    // ヤサイ
    if (H > 0) {
      g += `<path d="M${cx - W} ${top + 4} Q${cx - W * 0.7} ${peak + H * 0.15} ${cx} ${peak} Q${cx + W * 0.7} ${peak + H * 0.15} ${cx + W} ${top + 4} Z" fill="#eef3d6" stroke="#8aa04a" stroke-width="2"/>`;
      // キャベツ
      const cab = 3 + lv.yasai * 2;
      for (let i = 0; i < cab; i++) {
        const t = r();
        const y = peak + 8 + r() * (H - 10);
        const half = W * ((y - peak) / H) * 0.85;
        const x = cx - half + t * half * 2;
        g += `<path d="M${x} ${y} q6 -6 12 0 q-6 5 -12 0" fill="#9cc64b" opacity=".9"/>`;
      }
      // モヤシ
      const moy = 10 + lv.yasai * 10;
      for (let i = 0; i < moy; i++) {
        const y = peak + 4 + r() * (H - 4);
        const half = W * ((y - peak) / H) * 0.9;
        const x = cx - half + r() * half * 2;
        const a = (r() - 0.5) * 70;
        g += `<line x1="${x}" y1="${y}" x2="${x + 10}" y2="${y}" stroke="#fbf6e1" stroke-width="2.4" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`;
      }
    }

    // アブラ
    const ab = [0, 1, 3, 6, 10][lv.abura];
    for (let i = 0; i < ab; i++) {
      const spread = Math.max(W * 0.55, 30);
      const x = cx - spread / 2 + r() * spread;
      const y = (H > 0 ? peak + 6 : top - 2) + r() * Math.max(H * 0.35, 6);
      g += `<ellipse cx="${x}" cy="${y}" rx="${5 + r() * 5}" ry="${3 + r() * 2}" fill="#fff4d6" stroke="#d9b983" stroke-width="1" opacity=".95"/>`;
    }
    // カラメ（アブラにタレがかかる）
    if (lv.karame >= 3 && ab > 0) {
      g += `<path d="M${cx - 14} ${(H > 0 ? peak : top) + 6} q14 10 28 0" stroke="#5a2e12" stroke-width="3" fill="none" opacity=".7"/>`;
    }

    // ニンニク
    const nn = [0, 4, 9, 16, 26][lv.ninniku];
    for (let i = 0; i < nn; i++) {
      const ring = Math.sqrt(i) * 3.2;
      const ang = i * 2.4;
      const x = 186 + Math.cos(ang) * ring * 1.6;
      const y = top - 18 - Math.sin(ang) * ring * 0.6 - (nn - i) * 0.25;
      g += `<rect x="${x}" y="${y}" width="5" height="4" rx="1" fill="#f3e2a2" stroke="#c9b061" stroke-width=".6"/>`;
    }

    return `<svg viewBox="0 10 240 205" xmlns="http://www.w3.org/2000/svg" class="bowl">${g}</svg>`;
  }

  return { render };
})();
