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
const sections = ["home", "profile", "gallery", "tips", "faq"]
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
