// Decorators - are functions that can be attached to classes, methods, properties, and parameters

/**
 * Decorator function to bind the this keyword to the instance of the class
 *
 * @param target target class
 * @param methodName method name
 * @param descriptor property descriptor
 * @returns modified property descriptor
 */
export const AutoBind = (
	_: any,
	__: string,
	descriptor: PropertyDescriptor
) => {
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
