import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
export const validate = combineValidators({
	title: isRequired({ message: 'The event title is required' }),
	category: isRequired('Category'),
	description: composeValidators(isRequired('Description'), hasLengthGreaterThan(4)({ message: 'Description needs to be at least5 characters.' }))(),
	city: isRequired('City'),
	venue: isRequired('Venue'),
	date: isRequired('Date'),
	time: isRequired('Time')
});
