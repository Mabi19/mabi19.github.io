const ICON_LIGHT = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM80-440q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h80q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440H80Zm720 0q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520h80q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440h-80ZM480-760q-17 0-28.5-11.5T440-800v-80q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v80q0 17-11.5 28.5T480-760Zm0 720q-17 0-28.5-11.5T440-80v-80q0-17 11.5-28.5T480-200q17 0 28.5 11.5T520-160v80q0 17-11.5 28.5T480-40ZM226-678l-43-42q-12-11-11.5-28t11.5-29q12-12 29-12t28 12l42 43q11 12 11 28t-11 28q-11 12-27.5 11.5T226-678Zm494 495-42-43q-11-12-11-28.5t11-27.5q11-12 27.5-11.5T734-282l43 42q12 11 11.5 28T777-183q-12 12-29 12t-28-12Zm-42-495q-12-11-11.5-27.5T678-734l42-43q11-12 28-11.5t29 11.5q12 12 12 29t-12 28l-43 42q-12 11-28 11t-28-11ZM183-183q-12-12-12-29t12-28l43-42q12-11 28.5-11t27.5 11q12 11 11.5 27.5T282-226l-42 43q-11 12-28 11.5T183-183Z"/></svg>`;
const ICON_DARK = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-120q-151 0-255.5-104.5T120-480q0-138 90-239.5T440-838q13-2 23 3.5t16 14.5q6 9 6.5 21t-7.5 23q-17 26-25.5 55t-8.5 61q0 90 63 153t153 63q31 0 61.5-9t54.5-25q11-7 22.5-6.5T819-479q10 5 15.5 15t3.5 24q-14 138-117.5 229T480-120Z"/></svg>`;
const ICON_SYSTEM = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-240q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H680l28 28q6 6 9 13.5t3 15.5v23q0 17-11.5 28.5T680-120H280q-17 0-28.5-11.5T240-160v-23q0-8 3-15.5t9-13.5l28-28H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z"/></svg>`;

const ICONS = {
    light: ICON_LIGHT,
    dark: ICON_DARK,
    system: ICON_SYSTEM,
};

let storageTheme = localStorage.getItem("theme") ?? "system";
switch (storageTheme) {
    case "light":
    case "dark":
    case "system":
        break;
    default:
        storageTheme = "system";
}
let selectedTheme = storageTheme as "light" | "dark" | "system";

function getSystemTheme() {
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getCurrentTheme() {
    if (selectedTheme == "system") {
        return getSystemTheme();
    } else {
        return selectedTheme;
    }
}

function applyTheme() {
    if (getCurrentTheme() == "dark") {
        document.documentElement.classList.add("dark-theme");
    } else {
        document.documentElement.classList.remove("dark-theme");
    }
}

class ThemeSwitcher extends HTMLElement {
    button: HTMLButtonElement;

    constructor() {
        super();

        this.button = document.createElement("button");
        this.button.classList.add("theme-switcher-button");
        this.updateIcon();
        this.button.addEventListener("click", () => this.switchTheme());
    }

    connectedCallback() {
        this.appendChild(this.button);
    }

    updateIcon() {
        this.button.innerHTML = ICONS[selectedTheme];
        this.button.title = selectedTheme;
    }

    switchTheme() {
        selectedTheme = (
            {
                light: "dark",
                dark: "system",
                system: "light",
            } as const
        )[selectedTheme];
        localStorage.setItem("theme", selectedTheme);
        this.updateIcon();

        applyTheme();
    }
}

applyTheme();

window.customElements.define("theme-switcher", ThemeSwitcher);
