import { noun } from '../src/noun';
import { into, to, within } from '../src/utility';

test('provides aliases', () => {
	const car = noun('das Haus,häuser,-es');
	expect(within(car).write()).toBe('in einem Haus');
	expect(within(car.specific()).write()).toBe('in dem Haus');

	expect(into(car).write()).toBe('in ein Haus');

	expect(to(car).write()).toBe('zu einem Haus');
});
