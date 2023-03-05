/**
 * Base Component class
 *
 * A base class (Abstract class) to be extended by other classes
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
