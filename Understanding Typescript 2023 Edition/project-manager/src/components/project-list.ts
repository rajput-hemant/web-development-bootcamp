import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { AutoBind } from "../decorators/autobind";
import { Project, ProjectStatus } from "../models/project";
import { DragTarget } from "../models/drag-drop";
import { ProjectState } from "../state/project-state";

const projectState = ProjectState.getInstance();

export class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
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

	@AutoBind
	dragOverHandler(event: DragEvent) {
		if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
			event.preventDefault();
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.add("droppable");
		}
	}

	@AutoBind
	dropHandler(event: DragEvent) {
		const prjId = event.dataTransfer!.getData("text/plain");
		projectState.moveProject(
			prjId,
			this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
		);
		// console.log(event.dataTransfer!.getData("text/plain"));
	}

	@AutoBind
	dragLeaveHandler(_: DragEvent) {
		const listEl = this.element.querySelector("ul")!;
		listEl.classList.remove("droppable");
	}

	// method to configure the element
	configure() {
		// add the event listener to the element
		this.element.addEventListener("dragover", this.dragOverHandler);
		this.element.addEventListener("dragleave", this.dragLeaveHandler);
		this.element.addEventListener("drop", this.dropHandler);

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
