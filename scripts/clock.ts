function getTimezoneName(fmt: Intl.DateTimeFormat, date: Date) {
    return fmt.formatToParts(date).filter((part) => part.type == "timeZoneName")[0].value;
}

export class MyTimezoneClock extends HTMLElement {
    titleElem: HTMLDivElement;
    timeElem: HTMLDivElement;
    subElem: HTMLDivElement;
    contentElem: HTMLDivElement;

    mainFormatter: Intl.DateTimeFormat;
    shortTzFormatter: Intl.DateTimeFormat;
    offsetTzFormatter: Intl.DateTimeFormat;

    constructor() {
        super();

        this.titleElem = document.createElement("div");
        this.titleElem.classList.add("clock-title");
        this.titleElem.textContent = "My time:";

        this.timeElem = document.createElement("div");
        this.timeElem.classList.add("clock-time");

        this.subElem = document.createElement("div");
        this.subElem.classList.add("clock-sub");

        this.contentElem = document.createElement("div");
        this.contentElem.classList.add("clock-content");
        this.contentElem.append(this.timeElem, this.subElem);

        this.mainFormatter = new Intl.DateTimeFormat(undefined, {
            timeStyle: "medium",
            timeZone: "Europe/Warsaw",
        });
        this.shortTzFormatter = new Intl.DateTimeFormat("pl-PL", {
            timeZoneName: "short",
            timeZone: "Europe/Warsaw",
        });
        this.offsetTzFormatter = new Intl.DateTimeFormat(undefined, {
            timeZoneName: "shortOffset",
            timeZone: "Europe/Warsaw",
        });
    }

    connectedCallback() {
        this.append(this.titleElem, this.contentElem);
        this.classList.add("clock", "gradient-border");

        this.update();

        setInterval(() => {
            this.update();
        }, 1000);
    }

    update() {
        const date = new Date();
        this.timeElem.textContent = this.mainFormatter.format(date);
        const newTzText = `${getTimezoneName(this.shortTzFormatter, date)} (${getTimezoneName(
            this.offsetTzFormatter,
            date
        )})`;
        // do not update when it is the same to avoid deselecting
        if (this.subElem.textContent != newTzText) {
            this.subElem.textContent = newTzText;
        }
    }
}

window.customElements.define("my-tz-clock", MyTimezoneClock);
