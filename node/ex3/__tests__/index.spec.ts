import {
	expect,
	test
} from '@jest/globals';
import {
	getCapitalizeFirstWord
} from '..';
test('1. Should capitalize the first letter of a single word', () => {
	expect(getCapitalizeFirstWord('word')).toBe('Word')
});
test('2. Capitalzier should return the first letter of more than one word in capital', () => {
	expect(getCapitalizeFirstWord('word word')).toBe('Word Word')
});
test('3.Should handle mixed case input and capitalize only first letter of a capitalized word ', () => {
	expect(getCapitalizeFirstWord('wOrD')).toBe('Word')
	expect(getCapitalizeFirstWord('WORD')).toBe('Word')
});
test('4. Test Capitalizer is working if the first letter is already capitalized', () => {
	expect(getCapitalizeFirstWord('Word')).toBe('Word')
});
test('5. Should capitalize the first letter of a single-letter word', () => {
	expect(getCapitalizeFirstWord('w')).toBe('W')
});
test('6. Should return an empty string for an empty input', () => {
	expect(getCapitalizeFirstWord('')).toBe('')
});
test('7. Should throw an error when the input is null', () => {
	expect(() => getCapitalizeFirstWord(null)).toThrow(new Error('Failed to capitalize first word with null'))
});
test('8. Should handle input with special characters', () => {
	expect(getCapitalizeFirstWord('!"·$%&/()="1234567890€`+[]{}')).toBe('!"·$%&/()="1234567890€`+[]{}')
});
test('9. Should handle input with multiple spaces between words', () => {
	expect(getCapitalizeFirstWord('   word   word   word   word   ')).toBe('Word Word Word Word');
});