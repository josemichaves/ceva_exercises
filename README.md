
# CEVA Test

# Name: Jose Miguel Chaves Ojeda

  
## Exercises

### NodeJs

####  Exercise 1: Is there a problem? (1 points)

```javascript
// Call web service and return count user, (got is library to call url)
async function getCountUsers() {
	return {
		total: await got.get('https://my-webservice.moveecar.com/users/count')
	};
}
// Add total from service with 20
async function computeResult() {
	const result = getCountUsers();
	return result.total + 20;
}
```
Yes, there’s a problem with this piece of code, the problem resides when we call `getCountUsers` to get the users count, we’re not awaiting the result of the promise, thus not resolving it, it will return an undefined.

In order to make this piece of code work we need to await the result: [Exercise 1](https://github.com/josemichaves/test_ceva/blob/master/node/ex1/index.js)

  

#### Exercise 2: Is there a problem? (2 points)
```javascript
async function getTotalVehicles() {
	return await got.get('https://my-webservice.moveecar.com/vehicles/total');
}

function getPlurial() {
	let total;
	getTotalVehicles().then(r => total = r);
	if(total <= 0) {
		return 'none';
	}
	if(total <= 10) {
		return 'few';
	}
	return 'many';
} 
``` 

Yes, again we have some problems with the usage of async/await, in this case the main problem is that in the function `getPlurial` the result is returned immediately,w without waiting for `getTotalVehicles` to resolve, which makes r not having a value, and returning always `many` as the value will be undefined, and undefined is not a number, so neither the if will be evaluated.

In order to make this piece of code work as expected, we need to convert `getTotalVehicles` into an async/await function: [Exercise 2](https://github.com/josemichaves/test_ceva/blob/master/node/ex2/index.js)


#### Exercise 3: Unit test (2 points)

Write unit tests in jest for the function below in typescript
```  typescript
import {
	expect,
	test
} from '@jest/globals';

function getCapitalizeFirstWord(name: string): string {
	if(name == null) {
		throw new Error('Failed to capitalize first word with null');
	}
	if(!name) {
		return name;
	}
	return name.split(' ').map(n => n.length > 1 ? (n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()) : n).join(' ');
}
test('1. test', async function() {
	...
});
```
There's the unit tests: [Exercise 3](https://github.com/josemichaves/test_ceva/blob/master/node/ex3/__tests__/index.spec.ts)

*Note:
Function was not working as expected with single-letter word, I’ve fixed it, it was a matter of when we check the length of the word, we should check if the length is 1 or equal, and then will work.*

Before:
```typescript
return name.split(' ').map(n => n.length > 1 ? (n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()) : n).join(' '); 
```

After:
``` typescript 
return name.split(' ').map(n => n.length >= 1 ? (n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()) : n).join(' ');
```