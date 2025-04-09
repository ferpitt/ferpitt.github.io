// Dark mode toggle
const toggle = document.getElementById("darkModeToggle");
const htmlEl = document.documentElement;
const bodyEl = document.body;

toggle.addEventListener("click", () => {
  htmlEl.classList.toggle("dark");
  bodyEl.classList.toggle("dark");
  localStorage.setItem("theme", htmlEl.classList.contains("dark") ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    htmlEl.classList.add("dark");
    bodyEl.classList.add("dark");
  }
});

// Drag-to-scroll logic
const container = document.getElementById("dragScroll");
let isDown = false;
let startX;
let scrollLeft;

container.addEventListener("mousedown", (e) => {
  isDown = true;
  container.classList.add("scrolling");
  startX = e.pageX - container.offsetLeft;
  scrollLeft = container.scrollLeft;
});

container.addEventListener("mouseleave", () => {
  isDown = false;
  container.classList.remove("scrolling");
});

container.addEventListener("mouseup", () => {
  isDown = false;
  container.classList.remove("scrolling");
});

container.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - container.offsetLeft;
  const walk = (x - startX) * 2; // scroll-fast
  container.scrollLeft = scrollLeft - walk;
});

container.addEventListener("touchstart", (e) => {
  startX = e.touches[0].pageX;
  scrollLeft = container.scrollLeft;
});

container.addEventListener("touchmove", (e) => {
  const x = e.touches[0].pageX;
  const walk = (x - startX) * 2;
  container.scrollLeft = scrollLeft - walk;
});
