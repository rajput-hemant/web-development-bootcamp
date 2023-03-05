import "./style.css";

// Validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

const validate = (validatableInput: Validatable) => {
	let isValid = true;

	// if the value is required, then check if the value is not empty
	if (validatableInput.required) {
		isValid = isValid && validatableInput.value.toString().trim().length !== 0;
	}
	// check if the value is greater than or equal to the minimum length
	if (
		validatableInput.minLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid && validatableInput.value.length >= validatableInput.minLength;
	}
	// check if the value is less than or equal to the maximum length
	if (
		validatableInput.maxLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid && validatableInput.value.length <= validatableInput.maxLength;
	}
	// check if the value is greater than or equal to the minimum value
	if (
		validatableInput.min != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}
	// check if the value is less than or equal to the maximum value
	if (
		validatableInput.max != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}

	return isValid;
};

// Decorators - are functions that can be attached to classes, methods, properties, and parameters

/**
 * Decorator function to bind the this keyword to the instance of the class
 *
 * @param target target class
 * @param methodName method name
 * @param descriptor property descriptor
 * @returns modified property descriptor
 */
const AutoBind = (_: any, __: string, descriptor: PropertyDescriptor) => {
	// get the original method
	const originalMethod = descriptor.value;
	// create a new property descriptor
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		enumerable: false,

		// getter method to return the original method with the this keyword bound to the instance of the class
		get() {
			return originalMethod.bind(this);
		},
	};

	return adjDescriptor;
};

class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		// get the template element from the DOM
		this.templateElement = document.getElementById(
			"project-input"
		)! as HTMLTemplateElement;
		// get the div element with id app from the DOM
		this.hostElement = document.getElementById("app")! as HTMLDivElement;

		// get the deep copy of content of the template element
		const importedNode = document.importNode(
			this.templateElement.content,
			true // deep copy
		);
		// get the first element of the imported node
		this.element = importedNode.firstElementChild as HTMLFormElement;
		// set the id of the form to user-input
		this.element.id = "user-input";

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

		// attach the form to the DOM
		this.attach();
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

	@AutoBind
	private submitHandler(event: Event) {
		event.preventDefault();

		// console.log(this.titleInputElement.value);

		// get the user input
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			console.log(title, desc, people);
		}

		// clear the form
		// this.clearInputs();
	}

	private configure() {
		// add event listener to the form
		this.element.addEventListener("submit", this.submitHandler);
	}

	// method to attach the form to the DOM
	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}

const prjInput = new ProjectInput();
