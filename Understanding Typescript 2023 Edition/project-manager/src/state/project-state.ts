import { v4 as uuid } from "uuid";

import { Project } from "../models/project";
import { ProjectStatus } from "../models/project";

// Project State Management
type Listener<T> = (items: T[]) => void;

abstract class State<T> {
	protected listeners: Listener<T>[] = [];

	// method to add a listener
	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}

export class ProjectState extends State<Project> {
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

		// // call all the listeners
		// for (const listenerFn of this.listeners) {
		// 	listenerFn(this.projects.slice());
		// }

		// call the update listeners method
		this.updateListeners();
	}

	// method to move a project to the finished state
	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((prj) => prj.id === projectId);

		// to avoid unnecessary updates, check if the project exists and the status is different from the new status
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			// call the update listeners method
			this.updateListeners();
		}
	}

	// method to update the listeners
	private updateListeners() {
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}

	// // method to add a listener
	// addListener(listenerFn: Listener<Project>) {
	// 	this.listeners.push(listenerFn);
	// }
}
