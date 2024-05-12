const A = 'A'.codePointAt(0)!;
const Z = 'Z'.codePointAt(0)!;
const space = ' '.codePointAt(0)!;

export function sentenceCase(str: string) {
	let out = str[0].toUpperCase();

	for (let i = 1; i < str.length; i++) {
		const ch = str.codePointAt(i)!;
		if (ch === space && i + 1 < str.length) {
			out += ` ${str[++i].toUpperCase()}`;
		} else if (ch >= A && ch <= Z) {
			const prev = str.codePointAt(i - 1)!;

			if (prev < A || prev > Z) {
				out += ' ';
			}

			out += str[i];
		} else {
			out += str[i];
		}
	}

	return out;
}
