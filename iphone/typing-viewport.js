const viewport = window.visualViewport;
const page = document.documentElement;
const editable = 'textarea:not([readonly]), input:is([type="text"], [type="search"], [type="number"], :not([type])):not([readonly])';
const touchInput = matchMedia("(any-pointer: coarse)");
let frame = 0;

function updateTypingSpace() {
  frame = 0;
  const field = document.activeElement;
  const editing = touchInput.matches && field?.matches(editable);
  if (!editing) {
    page.style.removeProperty("--typing-space");
    return;
  }

  const height = viewport?.height ?? window.innerHeight;
  const top = viewport?.offsetTop ?? 0;
  const covered = Math.max(0, page.clientHeight - height - top);
  page.style.setProperty("--typing-space", Math.ceil(covered + Math.min(height * 0.35, 160)) + "px");

  const bounds = field.getBoundingClientRect();
  const visibleBottom = top + height - 16;
  if (bounds.bottom > visibleBottom) {
    window.scrollBy(0, Math.min(bounds.bottom - visibleBottom, Math.max(0, bounds.top - top - 16)));
  } else if (bounds.top < top + 16) {
    window.scrollBy(0, bounds.top - top - 16);
  }
}

function scheduleTypingSpace() {
  if (!frame) frame = requestAnimationFrame(updateTypingSpace);
}

document.addEventListener("focusin", scheduleTypingSpace);
document.addEventListener("focusout", scheduleTypingSpace);
window.addEventListener("resize", scheduleTypingSpace);
viewport?.addEventListener("resize", scheduleTypingSpace);
