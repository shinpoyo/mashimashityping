/* コール内容に応じてリアルで食欲をそそる二郎系ラーメン丼をSVGで描画する
 * lv: { yasai, ninniku, abura, karame } 各 0(なし)〜9(チョモランマ)
 */
const Bowl = (() => {
  // 再現性のある疑似乱数
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  // スープ色：カラメ度合い（0〜8）に応じた乳化豚骨醤油のグラデーション
  const SOUP_GRADIENTS = [
    { start: '#e4b679', mid: '#be7e3c', end: '#8e511b' }, // 0: 薄め・非乳化ライト
    { start: '#d89e5a', mid: '#b26e2e', end: '#7c4013' }, // 1: そのまま標準
    { start: '#c88742', mid: '#9e5820', end: '#682e0b' }, // 2: カラメ少々
    { start: '#b4732f', mid: '#8a4413', end: '#552106' }, // 3: カラメ
    { start: '#9e5a1e', mid: '#73330b', end: '#451604' }, // 4: カラママシ
    { start: '#884411', mid: '#5e2406', end: '#360e02' }, // 5: カラメ×3
    { start: '#73340b', mid: '#4b1903', end: '#290801' }, // 6: カラメ×4
    { start: '#5e2506', mid: '#3b1102', end: '#200500' }, // 7: カラメ×5
    { start: '#4a1903', mid: '#2d0a01', end: '#150300' }, // 8: カラメ限界
  ];

  function render(lv, seed = 1) {
    const r = rng(seed);
    const cx = 120, top = 120;

    // ヤサイの高さ H と広がり W（チョモランマはlv9）
    const H_LIST = [0, 20, 36, 54, 72, 90, 108, 126, 144, 168];
    const W_LIST = [0, 34, 48, 58, 68, 76, 82, 88, 94, 100];
    const ylv = Math.min(lv.yasai, H_LIST.length - 1);
    const H = H_LIST[ylv];
    const W = W_LIST[ylv];
    const peak = top - H;

    const klv = Math.min(lv.karame, SOUP_GRADIENTS.length - 1);
    const soup = SOUP_GRADIENTS[klv];

    const uid = 'b' + Math.floor(r() * 100000);

    let defs = `
      <defs>
        <!-- 丼外側の立体グラデーション -->
        <linearGradient id="${uid}-bowlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2c1e18"/>
          <stop offset="15%" stop-color="#fdfbf7"/>
          <stop offset="50%" stop-color="#f1ebe1"/>
          <stop offset="85%" stop-color="#ded4c3"/>
          <stop offset="100%" stop-color="#22150e"/>
        </linearGradient>
        <!-- スープの乳化豚骨醤油グラデーション -->
        <radialGradient id="${uid}-soupGrad" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${soup.start}"/>
          <stop offset="45%" stop-color="${soup.mid}"/>
          <stop offset="90%" stop-color="${soup.end}"/>
          <stop offset="100%" stop-color="#220e05"/>
        </radialGradient>
        <!-- チャーシューの肉質グラデーション -->
        <linearGradient id="${uid}-chashuMeat" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="#934e29"/>
          <stop offset="40%" stop-color="#b66c3f"/>
          <stop offset="70%" stop-color="#843f1b"/>
          <stop offset="100%" stop-color="#5a270f"/>
        </linearGradient>
        <!-- 背脂のツヤグラデーション -->
        <radialGradient id="${uid}-aburaGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="40%" stop-color="#fff8e3"/>
          <stop offset="75%" stop-color="#f3dcab"/>
          <stop offset="100%" stop-color="#c99e5c"/>
        </radialGradient>
        <!-- ニンニクの粒グラデーション -->
        <radialGradient id="${uid}-ninnikuGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="60%" stop-color="#faecc1"/>
          <stop offset="100%" stop-color="#d9bb73"/>
        </radialGradient>
        <!-- 影用フィルター -->
        <filter id="${uid}-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <filter id="${uid}-softBlur">
          <feGaussianBlur stdDeviation="0.8"/>
        </filter>
      </defs>
    `;

    let g = defs;

    // 1. 丼本体（深鉢の陶器感・光沢・高台）
    g += `
      <!-- 丼の影 -->
      <ellipse cx="${cx}" cy="${top + 90}" rx="68" ry="14" fill="rgba(0,0,0,0.35)" filter="url(#${uid}-softBlur)"/>
      <!-- 丼外側 -->
      <path d="M 16 ${top} C 20 200 68 212 120 214 C 172 212 220 200 224 ${top} Z" fill="url(#${uid}-bowlGrad)" stroke="#1a120c" stroke-width="2.5" filter="url(#${uid}-shadow)"/>
      <!-- 高台（こうだい／底の足） -->
      <path d="M 72 210 L 76 220 Q 120 224 164 220 L 168 210 Z" fill="#d9cebc" stroke="#1a120c" stroke-width="2"/>
      <!-- 丼外側の二郎風・雷文＆赤帯ライン -->
      <path d="M 28 152 Q 120 174 212 152" fill="none" stroke="#ba2127" stroke-width="6"/>
      <path d="M 38 165 Q 120 183 202 165" fill="none" stroke="#ba2127" stroke-width="2.5" stroke-dasharray="12 6"/>
      <!-- 丼の縁（リム）立体感 -->
      <ellipse cx="${cx}" cy="${top}" rx="104" ry="24" fill="#f8f4ec" stroke="#221811" stroke-width="3"/>
      <ellipse cx="${cx}" cy="${top}" rx="98" ry="20" fill="#ebe2d2" stroke="#4a3b30" stroke-width="1.2"/>
      <!-- スープ面 -->
      <ellipse cx="${cx}" cy="${top + 3}" rx="94" ry="18" fill="url(#${uid}-soupGrad)"/>
    `;

    // 2. スープ表面の油膜・浮遊する豚脂・鶏油（チーユの光沢）
    const oilDrops = 18;
    for (let i = 0; i < oilDrops; i++) {
      const angle = r() * Math.PI * 2;
      const dist = 15 + r() * 70;
      const ox = cx + Math.cos(angle) * dist;
      const oy = (top + 4) + Math.sin(angle) * (dist * 0.18);
      const orx = 3 + r() * 6;
      const ory = 1.2 + r() * 2.5;
      g += `
        <ellipse cx="${ox}" cy="${oy}" rx="${orx}" ry="${ory}" fill="#ffd878" opacity="${0.45 + r() * 0.35}"/>
        <ellipse cx="${ox - orx * 0.25}" cy="${oy - ory * 0.25}" rx="${orx * 0.4}" ry="${ory * 0.4}" fill="#ffffff" opacity="0.6"/>
      `;
    }

    // 3. 極太ワシワシ麺（スープの隙間から見える自家製縮れ平打ち太麺）
    g += `<g stroke="#ebb958" stroke-width="3.6" stroke-linecap="round" fill="none">`;
    for (let i = 0; i < 9; i++) {
      const mx = 38 + r() * 155;
      const my = top + 3 + (r() - 0.5) * 12;
      g += `
        <path d="M ${mx} ${my} Q ${mx + 10} ${my - 7} ${mx + 20} ${my} T ${mx + 38} ${my + 2}" stroke="#d69b36" stroke-width="4.2"/>
        <path d="M ${mx} ${my} Q ${mx + 10} ${my - 7} ${mx + 20} ${my} T ${mx + 38} ${my + 2}" stroke="#fed979" stroke-width="2.6"/>
      `;
    }
    g += `</g>`;

    // 4. 極厚神豚（左右に鎮座するジューシーな厚切りロールチャーシュー）
    // 左ブタ
    g += `
      <g transform="rotate(-15 54 ${top})">
        <!-- 影 -->
        <rect x="25" y="${top - 12}" width="54" height="30" rx="14" fill="rgba(0,0,0,0.3)" filter="url(#${uid}-softBlur)"/>
        <!-- 赤身 -->
        <rect x="25" y="${top - 14}" width="52" height="28" rx="13" fill="url(#${uid}-chashuMeat)" stroke="#3e1a0a" stroke-width="2.2"/>
        <!-- 脂身の層（旨みたっぷりのジューシーな巻き脂） -->
        <path d="M 32 ${top - 6} Q 48 ${top - 14} 68 ${top - 4} Q 52 ${top} 32 ${top - 6} Z" fill="#faeed9" opacity="0.95"/>
        <path d="M 36 ${top + 4} Q 52 ${top - 2} 70 ${top + 6}" stroke="#faeed9" stroke-width="3.5" fill="none" opacity="0.9"/>
        <!-- 焼き目・カエシの染み -->
        <line x1="34" y1="${top - 10}" x2="48" y2="${top - 12}" stroke="#3b1104" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="52" y1="${top - 8}" x2="66" y2="${top - 6}" stroke="#3b1104" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="46" cy="${top - 4}" r="1.5" fill="#fff" opacity="0.8"/>
      </g>
    `;
    // 右ブタ
    g += `
      <g transform="rotate(16 186 ${top})">
        <!-- 影 -->
        <rect x="162" y="${top - 12}" width="54" height="30" rx="14" fill="rgba(0,0,0,0.3)" filter="url(#${uid}-softBlur)"/>
        <!-- 赤身 -->
        <rect x="162" y="${top - 14}" width="52" height="28" rx="13" fill="url(#${uid}-chashuMeat)" stroke="#3e1a0a" stroke-width="2.2"/>
        <!-- 脂身の層 -->
        <path d="M 168 ${top - 4} Q 186 ${top - 14} 206 ${top - 6} Q 188 ${top + 2} 168 ${top - 4} Z" fill="#faeed9" opacity="0.95"/>
        <path d="M 172 ${top + 5} Q 188 ${top - 1} 204 ${top + 5}" stroke="#faeed9" stroke-width="3.5" fill="none" opacity="0.9"/>
        <!-- 焼き目・カエシの染み -->
        <line x1="172" y1="${top - 8}" x2="188" y2="${top - 10}" stroke="#3b1104" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="192" y1="${top - 6}" x2="206" y2="${top - 8}" stroke="#3b1104" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="190" cy="${top - 5}" r="1.5" fill="#fff" opacity="0.8"/>
      </g>
    `;

    // 5. ヤサイ（茹でたてモヤシ＆キャベツの山盛りタワー）
    if (H > 0) {
      // 山の立体ベース（陰影）
      g += `
        <defs>
          <linearGradient id="${uid}-mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fdfef5"/>
            <stop offset="60%" stop-color="#f0f5db"/>
            <stop offset="100%" stop-color="#d4e2a8"/>
          </linearGradient>
        </defs>
        <!-- ヤサイの土台影 -->
        <path d="M ${cx - W} ${top + 5} Q ${cx - W * 0.7} ${peak + H * 0.15} ${cx} ${peak} Q ${cx + W * 0.7} ${peak + H * 0.15} ${cx + W} ${top + 5} Z" fill="rgba(0,0,0,0.18)" transform="translate(0, 3)"/>
        <!-- ヤサイの山稜線 -->
        <path d="M ${cx - W} ${top + 4} Q ${cx - W * 0.7} ${peak + H * 0.15} ${cx} ${peak} Q ${cx + W * 0.7} ${peak + H * 0.15} ${cx + W} ${top + 4} Z" fill="url(#${uid}-mountainGrad)" stroke="#8da048" stroke-width="1.8"/>
      `;

      // チョモランマ頂上の万年雪（山頂の白いモヤシ冠）
      if (ylv >= 9) {
        g += `
          <path d="M ${cx - 22} ${peak + 14} Q ${cx} ${peak - 6} ${cx + 22} ${peak + 14} Z" fill="#ffffff" opacity="0.95"/>
          <line x1="${cx - 14}" y1="${peak + 4}" x2="${cx + 14}" y2="${peak + 4}" stroke="#eedf9b" stroke-width="3" stroke-linecap="round"/>
        `;
      }

      // キャベツ（茹でたて鮮やかな甘みのある緑の葉）
      const cab = 4 + ylv * 3;
      for (let i = 0; i < cab; i++) {
        const t = r();
        const y = peak + 8 + r() * Math.max(H - 12, 6);
        const half = W * ((y - peak) / H) * 0.86;
        const x = cx - half + t * half * 2;
        const cRot = (r() - 0.5) * 60;
        const leafW = 10 + r() * 10;
        const leafH = 7 + r() * 7;
        g += `
          <g transform="translate(${x}, ${y}) rotate(${cRot})">
            <!-- キャベツ葉肉 -->
            <path d="M 0 0 C ${leafW * 0.3} ${-leafH * 0.8} ${leafW * 0.8} ${-leafH * 0.6} ${leafW} 0 C ${leafW * 0.7} ${leafH * 0.7} ${leafW * 0.3} ${leafH * 0.6} 0 0 Z" fill="#75b52c" stroke="#54861b" stroke-width="1.2" opacity="0.93"/>
            <!-- 葉脈 -->
            <path d="M 0 0 Q ${leafW * 0.5} 0 ${leafW} 0" stroke="#d5f08f" stroke-width="1.4" fill="none" opacity="0.85"/>
          </g>
        `;
      }

      // モヤシ（みずみずしい透明感のある白い茎＋黄色い豆）
      const moy = 12 + ylv * 12;
      for (let i = 0; i < moy; i++) {
        const y = peak + 4 + r() * Math.max(H - 4, 6);
        const half = W * ((y - peak) / H) * 0.92;
        const x = cx - half + r() * half * 2;
        const rot = (r() - 0.5) * 85;
        const len = 12 + r() * 7;
        g += `
          <g transform="translate(${x}, ${y}) rotate(${rot})">
            <!-- モヤシの茎（白・シャキシャキの水分感） -->
            <path d="M 0 0 Q ${len * 0.4} ${r() * 4 - 2} ${len} 0" stroke="#fbfbf2" stroke-width="3.2" stroke-linecap="round" fill="none"/>
            <path d="M 0 0 Q ${len * 0.4} ${r() * 4 - 2} ${len} 0" stroke="#ded8bd" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.6"/>
            <!-- モヤシの黄色い豆頭 -->
            <ellipse cx="${len + 1}" cy="0" rx="2.4" ry="1.8" fill="#e9d87d" stroke="#bba44b" stroke-width="0.8"/>
          </g>
        `;
      }
    }

    // 6. 味付け背脂（甘辛い醤油タレで煮込まれたプルプルの背脂塊）
    const AB_LIST = [0, 2, 4, 7, 11, 16, 22, 29, 38];
    const alv = Math.min(lv.abura, AB_LIST.length - 1);
    const ab = AB_LIST[alv];
    for (let i = 0; i < ab; i++) {
      const spread = Math.max(W * 0.6, 32);
      const x = cx - spread / 2 + r() * spread;
      const y = (H > 0 ? peak + 5 : top - 3) + r() * Math.max(H * 0.4, 8);
      const abSize = 5 + r() * 5;
      g += `
        <!-- 背脂の影 -->
        <circle cx="${x}" cy="${y + 1.5}" r="${abSize * 0.9}" fill="rgba(60,30,10,0.3)"/>
        <!-- 背脂の塊（黄金色の醤油味付け） -->
        <path d="M ${x - abSize * 0.8} ${y} Q ${x} ${y - abSize * 0.9} ${x + abSize * 0.8} ${y} Q ${x + abSize * 0.9} ${y + abSize * 0.7} ${x} ${y + abSize * 0.8} Q ${x - abSize * 0.9} ${y + abSize * 0.7} ${x - abSize * 0.8} ${y} Z" fill="url(#${uid}-aburaGrad)" stroke="#a87d3f" stroke-width="0.9"/>
        <!-- 脂のテカリ光沢 -->
        <ellipse cx="${x - abSize * 0.25}" cy="${y - abSize * 0.25}" rx="${abSize * 0.35}" ry="${abSize * 0.2}" fill="#ffffff" opacity="0.85"/>
      `;
    }

    // 7. カラメ（濃厚なカエシ・醤油ダレが野菜の山を伝って垂れる）
    const STREAKS_LIST = [0, 0, 1, 2, 3, 4, 5, 6, 8];
    const streaks = STREAKS_LIST[klv];
    for (let i = 0; i < streaks; i++) {
      const span = Math.min(W * 0.8, 62);
      const sx = cx - span / 2 + (streaks === 1 ? span / 2 : (span / (streaks - 1)) * i);
      const sy = (H > 0 ? peak + 3 : top - 8) + 3;
      const len = Math.max(H * 0.65, 14);
      const dir = sx < cx ? -1 : 1;
      g += `
        <!-- カエシのタレだれ -->
        <path d="M ${sx} ${sy} Q ${sx + dir * 8} ${sy + len * 0.5} ${sx + dir * 4} ${sy + len}" stroke="#391505" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0.92"/>
        <path d="M ${sx} ${sy} Q ${sx + dir * 8} ${sy + len * 0.5} ${sx + dir * 4} ${sy + len}" stroke="#ffcc88" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.5"/>
      `;
    }

    // 8. 刻み生ニンニク（右脇にこんもりと盛られたガツンとパンチの効いた生ニンニク）
    const NN_LIST = [0, 4, 9, 15, 22, 30, 40, 52, 66];
    const nlv = Math.min(lv.ninniku, NN_LIST.length - 1);
    const nn = NN_LIST[nlv];
    if (nn > 0) {
      const baseNx = 184;
      const baseNy = top - 12;
      g += `
        <!-- ニンニク山の下地影 -->
        <ellipse cx="${baseNx}" cy="${baseNy + 4}" rx="${Math.sqrt(nn) * 3 + 4}" ry="${Math.sqrt(nn) * 1.8 + 3}" fill="rgba(50,30,10,0.38)" filter="url(#${uid}-softBlur)"/>
      `;
      for (let i = 0; i < nn; i++) {
        const ring = Math.sqrt(i) * 2.8;
        const ang = i * 2.35;
        const nx = baseNx + Math.cos(ang) * ring * 1.45 + (r() - 0.5) * 2;
        const ny = baseNy - Math.sin(ang) * ring * 0.65 - (nn - i) * 0.2 + (r() - 0.5) * 2;
        const nw = 4 + r() * 2.5;
        const nh = 3 + r() * 2;
        const nRot = (r() - 0.5) * 50;
        g += `
          <g transform="translate(${nx}, ${ny}) rotate(${nRot})">
            <!-- ニンニクの粗刻み角粒 -->
            <polygon points="0,0 ${nw},1 ${nw * 0.9},${nh} 1,${nh * 0.9}" fill="url(#${uid}-ninnikuGrad)" stroke="#c29f4e" stroke-width="0.7"/>
            <circle cx="${nw * 0.3}" cy="${nh * 0.3}" r="0.8" fill="#ffffff" opacity="0.9"/>
          </g>
        `;
      }
    }

    // 9. 立ち上る湯気（熱々の臨場感）
    g += `
      <g class="bowl-steam" opacity="0.75">
        <path d="M ${cx - 30} ${top - 10} Q ${cx - 45} ${top - 50} ${cx - 25} ${top - 90} T ${cx - 35} ${top - 140}" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity="0.45" filter="url(#${uid}-softBlur)"/>
        <path d="M ${cx} ${peak - 5} Q ${cx + 15} ${peak - 45} ${cx - 10} ${peak - 85} T ${cx + 5} ${peak - 130}" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.55" filter="url(#${uid}-softBlur)"/>
        <path d="M ${cx + 35} ${top - 10} Q ${cx + 20} ${top - 50} ${cx + 40} ${top - 90} T ${cx + 25} ${top - 135}" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.4" filter="url(#${uid}-softBlur)"/>
      </g>
    `;

    return `<svg viewBox="0 -25 240 255" xmlns="http://www.w3.org/2000/svg" class="bowl">${g}</svg>`;
  }

  return { render };
})();
