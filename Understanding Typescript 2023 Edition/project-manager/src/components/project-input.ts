import { Component } from "./base-component";
import { AutoBind } from "../decorators/autobind";
import { ProjectState } from "../state/project-state";
import { Validatable, validate } from "../util/validation";

const projectState = ProjectState.getInstance();

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		super("project-input", "app", true, "user-input");

		// // get the template element from the DOM
		// this.templateElement = document.getElementById(
		// 	"project-input"
		// )! as HTMLTemplateElement;
		// // get the div element with id app from the DOM
		// this.hostElement = document.getElementById("app")! as HTMLDivElement;

		// // get the deep copy of content of the template element
		// const importedNode = document.importNode(
		// 	this.templateElement.content,
		// 	true // deep copy
		// );
		// // get the first element of the imported node
		// this.element = importedNode.firstElementChild as HTMLFormElement;
		// // set the id of the form to user-input
		// this.element.id = "user-input";

		// get the input elements from the form
		this.titleInputElement = this.element.querySelector(
			"#title"
		) as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector(
			"#people"
		) as HTMLInputElement;

		// configure the form
		this.configure();

		// render the content
		this.renderContent();

		// // attach the form to the DOM
		// this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputElement.value;
		const enteredDescription = this.descriptionInputElement.value;
		const enteredPeople = this.peopleInputElement.value;

		// validate the input
		const titleValidatable: Validatable = {
			value: enteredTitle,
			required: true,
		};
		const descriptionValidatable: Validatable = {
			value: enteredDescription,
			required: true,
			minLength: 5,
		};
		const peopleValidatable: Validatable = {
			value: +enteredPeople,
			required: true,
			min: 1,
			max: 5,
		};

		if (
			// enteredTitle.trim().length === 0 ||
			// enteredDescription.trim().length === 0 ||
			// enteredPeople.trim().length === 0
			!validate(titleValidatable) ||
			!validate(descriptionValidatable) ||
			!validate(peopleValidatable)
		) {
			alert("Invalid input, please try again!");
			return;
		} else {
			return [enteredTitle, enteredDescription, +enteredPeople];
		}
	}

	private clearInputs() {
		this.titleInputElement.value = "";
		this.descriptionInputElement.value = "";
		this.peopleInputElement.value = "";
	}

	@AutoBind
	private submitHandler(event: Event) {
		event.preventDefault();

		// console.log(this.titleInputElement.value);

		// get the user input
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			// console.log(title, desc, people);
			projectState.addProject(title, desc, people);

			// clear the form
			this.clearInputs();
		}
	}

	// method to configure the form
	configure() {
		// add event listener to the form
		this.element.addEventListener("submit", this.submitHandler);
	}

	// method to render the content
	renderContent() {}

	// // method to attach the form to the DOM
	// private attach() {
	// 	this.hostElement.insertAdjacentElement("afterbegin", this.element);
	// }
}
