import { v4 as uuid } from "uuid";

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

// Project Class
enum ProjectStatus {
	Active,
	Finished,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

// Project State Management
type Listener<T> = (items: T[]) => void;

abstract class State<T> {
	protected listeners: Listener<T>[] = [];

	// method to add a listener
	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = [];
	// private listeners: Listener[] = [];
	private static instance: ProjectState;

	// Singleton class constructor
	private constructor() {
		super();
	}

	// method to get the instance of the class
	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	// method to add a new project
	addProject(title: string, description: string, numOfPeople: number) {
		const newProject = new Project(
			uuid(),
			title,
			description,
			numOfPeople,
			ProjectStatus.Active
		);

		this.projects.push(newProject);

		// call all the listeners
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}

	// // method to add a listener
	// addListener(listenerFn: Listener<Project>) {
	// 	this.listeners.push(listenerFn);
	// }
}

const projectState = ProjectState.getInstance();

/**
 * Base Component class
 *
 * A base class (Abstract class) to be extended by other classes
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string
	) {
		// get the template element from the DOM
		this.templateElement = document.getElementById(
			templateId
		)! as HTMLTemplateElement;
		// get the div element with id app from the DOM
		this.hostElement = document.getElementById(hostElementId)! as T;
		// get the deep copy of content of the template element
		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		// get the first element of the imported node
		this.element = importedNode.firstElementChild as U;
		// set the id of the element to the new element id
		if (newElementId) {
			this.element.id = newElementId;
		}

		// attach the element to the host element
		this.attach(insertAtStart);
	}

	// method to attach the element to the host element
	private attach(insertAtBeginning: boolean) {
		this.hostElement.insertAdjacentElement(
			insertAtBeginning ? "afterbegin" : "beforeend",
			this.element
		);
	}

	// method to abstract the configure method
	abstract configure(): void;
	// method to abstract the render content method
	abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
	private project: Project;

	get persons() {
		if (this.project.people === 1) {
			return "1 person";
		} else {
			return `${this.project.people} persons`;
		}
	}

	constructor(hostId: string, project: Project) {
		super("single-project", hostId, false, project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}

	// method to configure the project item
	configure() {}

	// method to render the content of the project item
	renderContent() {
		this.element.querySelector("h2")!.textContent = this.project.title;
		this.element.querySelector("h3")!.textContent =
			this.persons + " assigned";
		this.element.querySelector("p")!.textContent = this.project.description;
	}
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
	assignedProjects: Project[];

	constructor(private type: "active" | "finished") {
		super("project-list", "app", false, `${type}-projects`);

		// // get the template element from the DOM
		// this.templateElement = document.getElementById(
		// 	"project-list"
		// )! as HTMLTemplateElement;
		// // get the div element with id app from the DOM
		// this.hostElement = document.getElementById("app")! as HTMLDivElement;
		this.assignedProjects = [];

		// // get the deep copy of content of the template element
		// const importedNode = document.importNode(
		// 	this.templateElement.content,
		// 	true
		// );
		// // get the first element of the imported node
		// this.element = importedNode.firstElementChild as HTMLElement;
		// // set the id of the element to active-projects or finished-projects
		// this.element.id = `${this.type}-projects`;

		// attach the element to the DOM
		// this.attach();

		// configure the element
		this.configure();

		// render the content
		this.renderContent();
	}

	// method to configure the element
	configure() {
		// get the projects from the project state
		projectState.addListener((projects: Project[]) => {
			// filter the projects based on the type
			const relevantProjects = projects.filter((project) => {
				if (this.type === "active") {
					return project.status === ProjectStatus.Active;
				}
				return project.status === ProjectStatus.Finished;
			});
			// set the assigned projects
			this.assignedProjects = relevantProjects;
			// call the renderProjects method
			this.renderProjects();
		});
	}

	// method to render the projects
	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;

		// clear the list to avoid duplicate entries
		listEl.innerHTML = "";
		// loop through the assigned projects and add them to the list
		for (const projectItem of this.assignedProjects) {
			// const listItem = document.createElement("li");
			// listItem.textContent = projectItem.title;
			// listEl.appendChild(listItem);
			new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
		}
	}

	// method to render the content
	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + " PROJECTS";
	}

	// // method to attach the element to the DOM
	// private attach() {
	// 	this.hostElement.insertAdjacentElement("beforeend", this.element);
	// }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
