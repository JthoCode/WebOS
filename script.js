let time = document.querySelector("#time");
let date = document.querySelector("#date");

function getClockFormat() {
  return localStorage.getItem("clockFormat") === "24" ? "24" : "12";
}

function setClockFormat(format) {
  localStorage.setItem("clockFormat", format);
}

function updateTime() {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();
  let day = currentTime.getDate();
  let month = currentTime.getMonth() + 1;
  let year = currentTime.getFullYear();

  const format = getClockFormat();
  let display = "";

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (format === "24") {
    hours = hours < 10 ? "0" + hours : hours;
    display = `${hours}:${minutes}:${seconds}`;
  } else {
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    hours = hours < 10 ? "0" + hours : hours;
    display = `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  time.textContent = display;
  date.textContent = `${month}/${day}/${year}`;
}

function initClockFormatToggle() {
  const toggle = document.getElementById("clockFormatToggle");
  if (!toggle) return;

  const currentFormat = getClockFormat();
  toggle.checked = currentFormat === "24";

  toggle.addEventListener("change", () => {
    const format = toggle.checked ? "24" : "12";
    setClockFormat(format);
    updateTime();
  });
}

setInterval(updateTime, 1000);
updateTime();

// Move active indicator and mark clicked taskbar icon as active
const initTaskbar = () => {
  const taskbarButtons = document.querySelectorAll(".taskbar-btn");
  if (!taskbarButtons || taskbarButtons.length === 0) return;

  const activateButton = (btn) => {
    document.querySelectorAll(".taskbar-btn.active").forEach((b) => {
      b.classList.remove("active");
      b.removeAttribute("aria-pressed");
    });

    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    let indicator = document.querySelector(".active-indicator");
    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className =
        "position-absolute bottom-0 start-50 translate-middle-x bg-info rounded active-indicator";
    }

    btn.appendChild(indicator);
  };

  taskbarButtons.forEach((btn) => {
    btn.addEventListener("click", () => activateButton(btn));
  });
};

// Initialize when DOM is ready (script is at end of body, but safe)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTaskbar();
    initStartMenu();
    initClockFormatToggle();
  });
} else {
  initTaskbar();
  initStartMenu();
  initClockFormatToggle();
}

// Start menu: toggle and app-launch handling
function initStartMenu() {
  const startBtn = document.getElementById("startMenuBtn");
  const menu = document.getElementById("startMenu");
  if (!startBtn || !menu) return;

  const isHidden = () => menu.classList.contains("hidden");
  const showMenu = () => {
    menu.classList.remove("hidden");
    menu.setAttribute("aria-hidden", "false");
  };
  const hideMenu = () => {
    menu.classList.add("hidden");
    menu.setAttribute("aria-hidden", "true");
  };

  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isHidden()) showMenu();
    else hideMenu();
  });

  // Click app items to activate corresponding taskbar button
  menu.querySelectorAll(".app-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const targetId = item.getAttribute("data-target");
      if (targetId) {
        const targetBtn = document.getElementById(targetId);
        if (targetBtn) targetBtn.click();
      }
      hideMenu();
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        item.click();
      }
    });
  });

  // Close when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== startBtn) hideMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideMenu();
  });
}
