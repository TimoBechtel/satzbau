export function number(n: number): string {
	const abs = Math.abs(n);
	return (
		(n < 0 ? 'minus ' : '') +
		(simpleNumberMap[abs] || (abs + '').replace('.', ','))
	);
}

const simpleNumberMap = {
	2: 'zwei',
	3: 'drei',
	4: 'vier',
	5: 'fünf',
	6: 'sechs',
	7: 'sieben',
	8: 'acht',
	9: 'neun',
	10: 'zehn',
};
