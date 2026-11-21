/* =====================================================
   猫暴力 · 交互脚本
   照片数据与文案修改请编辑本文件顶部的 PHOTOS 数组
   ===================================================== */
"use strict";

/* ---------- 照片数据（可修改：图片放 assets/cat/，改这里即可同步） ---------- */
const PHOTOS = [
  { src: "assets/cat/photo-1-box.jpg",     cap: "在纸箱里仰面休息",       alt: "猫暴力四脚朝天躺在纸箱里" },
  { src: "assets/cat/photo-2-walk.jpg",    cap: "戴牵引绳在户外遛弯",     alt: "猫暴力戴着牵引绳在草地边行走" },
  { src: "assets/cat/photo-3-laptop.jpg",  cap: "蹲在笔记本后面看屏幕",   alt: "猫暴力从笔记本电脑后面探头看" },
  { src: "assets/cat/photo-4-selfie.jpg",  cap: "从猫窝里伸爪够向镜头",   alt: "猫暴力从猫窝里伸爪子够向镜头" },
  { src: "assets/cat/photo-5-grumpy.jpg",  cap: "眯眼的不耐烦表情",       alt: "猫暴力眯着眼睛一脸不高兴" },
  { src: "assets/cat/photo-6-portrait.jpg", cap: "戴毛球项圈的坐姿",      alt: "猫暴力戴着彩色毛球项圈端坐看镜头" },
  { src: "assets/cat/photo-7-yawn.jpg",    cap: "打哈欠的瞬间",           alt: "猫暴力张大嘴巴打哈欠" },
  { src: "assets/cat/photo-8-lean.jpg",    cap: "前爪交叠搭在窝边",       alt: "猫暴力前爪交叠搭在猫窝边缘" }
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- 渲染照片墙 ---------- */
const galleryGrid = $("#galleryGrid");

function galleryItem(photo, i) {
  return `
  <figure class="gallery__wrap">
    <button class="gallery__item" type="button" data-index="${i}" aria-label="查看大图：${photo.cap}">
      <img src="${photo.src}" alt="${photo.alt}" loading="lazy" width="1280" height="1600">
      <span class="zoom-hint" aria-hidden="true">🔍</span>
      <figcaption>${photo.cap}</figcaption>
    </button>
  </figure>`;
}

galleryGrid.innerHTML = PHOTOS.map(galleryItem).join("");

/* ---------- 照片灯箱 ---------- */
const modal = $("#photoModal");
const lightboxImg = $("#lightboxImg");
const lightboxCaption = $("#lightboxCaption");
const lightboxCounter = $("#lightboxCounter");
let current = 0;

function showPhoto(i) {
  current = (i + PHOTOS.length) % PHOTOS.length;
  const p = PHOTOS[current];
  lightboxImg.src = p.src;
  lightboxImg.alt = p.alt;
  lightboxCaption.textContent = p.cap;
  lightboxCounter.textContent = `${current + 1} / ${PHOTOS.length}`;
}

function openLightbox(i) {
  showPhoto(i);
  modal.showModal();
  $("#lightboxClose").focus();
}

galleryGrid.addEventListener("click", (e) => {
  const item = e.target.closest("[data-index]");
  if (item) openLightbox(Number(item.dataset.index));
});

/* 我家猫版块的精选瞬间，也走同一个灯箱 */
$$(".moment").forEach((btn) => {
  btn.addEventListener("click", () => openLightbox(Number(btn.dataset.photo)));
});

/* ---------- FAQ 手风琴 ---------- */
$$(".faq__q").forEach((q) => {
  const panel = q.closest(".faq__item").querySelector(".faq__a");
  panel.hidden = false; // 移除初始 hidden，改用 CSS 高度动画
  q.addEventListener("click", () => {
    const open = q.getAttribute("aria-expanded") === "true";
    q.setAttribute("aria-expanded", String(!open));
    panel.classList.toggle("open", !open);
  });
});

/* ---------- 百科：分类 Tab ---------- */
$$("[data-tabs]").forEach((tabs) => {
  const btns = $$(".tabs__btn", tabs);
  const panels = $$(".tab-panel", tabs);
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => {
        const active = p.dataset.panel === btn.dataset.tab;
        p.classList.toggle("is-active", active);
        p.hidden = !active;
      });
    });
  });
});

/* ---------- 百科：猫语速查折叠 ---------- */
$$(".signal").forEach((btn) => {
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
  });
});

/* ---------- 百科：品种筛选 ---------- */
const breedBtns = $$(".filter--breed .filter__btn");
breedBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    breedBtns.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });
    $$("#breedGrid .breed-card").forEach((c) => {
      const tags = (c.dataset.tags || "").split(" ");
      c.classList.toggle("is-hidden", !(btn.dataset.breedFilter === "all" || tags.includes(btn.dataset.breedFilter)));
    });
  });
});

/* ---------- 百科：猫年龄换算器 ---------- */
const ageInput = $("#ageInput");
const ageResult = $("#ageResult");
function stageOf(catAge) {
  if (catAge < 1) return "幼猫期";
  if (catAge < 2) return "青少年期";
  if (catAge < 7) return "成年期";
  if (catAge < 10) return "壮年期";
  return "老年期";
}
function updateAge() {
  const a = parseFloat(ageInput.value);
  if (isNaN(a) || a < 0) {
    ageResult.textContent = "请输入有效年龄";
    return;
  }
  const clamped = Math.min(a, 30);
  let human;
  if (clamped <= 1) human = Math.round(clamped * 15);
  else if (clamped <= 2) human = Math.round(15 + (clamped - 1) * 9);
  else human = Math.round(24 + (clamped - 2) * 4);
  ageResult.textContent = `约等于人类 ${human} 岁 · ${stageOf(clamped)}`;
}
ageInput.addEventListener("input", updateAge);
updateAge();

/* ---------- 保护流浪动物：领养自测清单 ---------- */
const checkItems = $$("[data-checklist] input[type='checkbox']");
const checkCount = $("#checkCount");
const checkFill = $("#checkFill");
const checkMsg = $("#checkMsg");
function updateChecklist() {
  const n = checkItems.filter((c) => c.checked).length;
  checkCount.textContent = `${n} / ${checkItems.length}`;
  checkFill.style.width = `${(n / checkItems.length) * 100}%`;
  checkMsg.textContent = n === checkItems.length
    ? "全部满足的话，可以去正规救助组织或送养平台看看了。"
    : `已确认 ${n} 项，还有 ${checkItems.length - n} 项待考虑——想清楚再接它回家，对彼此都好。`;
}
checkItems.forEach((c) => c.addEventListener("change", updateChecklist));
updateChecklist();

/* ---------- 助力点赞 & 访问统计（Abacus 公开计数服务，仅记录次数） ---------- */
const ABACUS = "https://abacus.jasoncameron.dev";
const COUNTER_NS = "maobaoli-v1";

async function abacusHit(key) {
  const res = await fetch(`${ABACUS}/hit/${COUNTER_NS}/${key}`);
  if (!res.ok) throw new Error("counter service error");
  return (await res.json()).value;
}
async function abacusGet(key) {
  const res = await fetch(`${ABACUS}/get/${COUNTER_NS}/${key}`);
  if (!res.ok) throw new Error("counter service error");
  const data = await res.json();
  return typeof data.value === "number" ? data.value : 0; // 键不存在时按 0 处理
}

/* 助力点赞 */
const supportBtn = $("#supportBtn");
const supportCountEl = $("#supportCount");
const supportMsg = $("#supportMsg");
let supportBusy = false;

async function loadSupport() {
  try {
    const v = await abacusGet("support");
    supportCountEl.innerHTML = `累计助力：<strong>${v}</strong> 次`;
  } catch {
    supportCountEl.innerHTML = `累计助力：<strong>--</strong> 次`;
    supportMsg.textContent = "计数服务暂时无法连接。";
  }
}

supportBtn.addEventListener("click", async () => {
  if (supportBusy) return;
  supportBusy = true;
  supportBtn.classList.add("is-clicked");
  try {
    const v = await abacusHit("support");
    supportCountEl.innerHTML = `累计助力：<strong>${v}</strong> 次`;
    supportMsg.textContent = "助力成功，感谢支持。";
    localStorage.setItem("maobaoli-support", "1");
  } catch {
    supportMsg.textContent = "计数服务暂时无法连接，请稍后再试。";
  } finally {
    setTimeout(() => supportBtn.classList.remove("is-clicked"), 450);
    supportBusy = false;
  }
});
loadSupport();

/* 访问统计：PV 每次加载 +1，UV 按设备标记只 +1 一次 */
async function loadSiteStats() {
  const pvEl = $("#statPv");
  const uvEl = $("#statUv");
  try {
    let uv;
    if (!localStorage.getItem("maobaoli-visitor")) {
      uv = await abacusHit("uv");
      localStorage.setItem("maobaoli-visitor", "1");
    } else {
      uv = await abacusGet("uv");
    }
    const pv = await abacusHit("pv");
    pvEl.textContent = pv;
    uvEl.textContent = uv;
  } catch {
    pvEl.textContent = "--";
    uvEl.textContent = "--";
  }
}
loadSiteStats();

$("#lightboxClose").addEventListener("click", () => modal.close());
$("#lightboxPrev").addEventListener("click", () => showPhoto(current - 1));
$("#lightboxNext").addEventListener("click", () => showPhoto(current + 1));

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close(); // 点击遮罩关闭
});

/* 键盘左右键翻页 */
document.addEventListener("keydown", (e) => {
  if (!modal.open) return;
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});

/* ---------- 导航：移动端菜单 ---------- */
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- 导航：滚动高亮当前版块 ---------- */
const sections = ["home", "profile", "gallery", "wiki", "welfare", "tips", "faq"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navMap = new Map();
$$("#navLinks a").forEach((a) => {
  const id = (a.getAttribute("href") || "").replace("#", "");
  if (id) navMap.set(id, a);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navMap.forEach((a, id) => a.classList.toggle("is-active", id === entry.target.id));
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- 滚动渐显 ---------- */
const revealEls = $$(".reveal");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealEls.forEach((el) => el.classList.add("in"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ---------- 返回顶部 ---------- */
const toTop = $("#toTop");
window.addEventListener(
  "scroll",
  () => {
    toTop.hidden = window.scrollY < 600;
  },
  { passive: true }
);
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
