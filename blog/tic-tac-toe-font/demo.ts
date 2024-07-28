class TicTacToeFontDemo extends HTMLElement {
    firstInput: HTMLInputElement;
    secondInput: HTMLInputElement;

    constructor() {
        super();

        this.firstInput = document.createElement("input");
        this.firstInput.id = "in-special-font";
        this.firstInput.inputMode = "numeric";
        this.secondInput = document.createElement("input");
        this.secondInput.id = "in-regular-font";
        this.secondInput.inputMode = "numeric";
    }

    makeLabel(id: string, content: string) {
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = content;
        return label;
    }

    connectedCallback() {
        this.innerHTML = "";
        this.classList.add("font-demo");

        const heading = document.createElement("strong");
        heading.textContent =
            "The two input boxes below will have their contents synced automatically.";

        this.append(
            heading,
            this.makeLabel("in-special-font", "In the Tic Tac Toe font"),
            this.firstInput,
            this.makeLabel("in-regular-font", "What you actually typed"),
            this.secondInput
        );

        this.firstInput.addEventListener("input", () => {
            if (this.firstInput.value != this.secondInput.value) {
                this.secondInput.value = this.firstInput.value;
            }
        });

        this.secondInput.addEventListener("input", () => {
            if (this.firstInput.value != this.secondInput.value) {
                this.firstInput.value = this.secondInput.value;
            }
        });

        // TODO: virtual keyboard?
    }
}

window.customElements.define("tic-tac-toe-font-demo", TicTacToeFontDemo);
