# Exercises

## NodeJs

### Exercise 1: Is there a problem? (1 points)

```javascript
// Call web service and return count user, (got is library to call url)
async function getCountUsers() {
  return {
    total: await got.get("https://my-webservice.moveecar.com/users/count"),
  };
}

// Add total from service with 20

async function computeResult() {
  const result = getCountUsers();

  return result.total + 20;
}
```

Yes, there’s a problem with this piece of code, the problem resides when we call `getCountUsers` to get the users count, we’re not awaiting the result of the promise, thus not resolving it, it will return an undefined.
In order to make this piece of code work, we need to await the result: [Exercise 1](https://github.com/josemichaves/test_ceva/blob/master/node/ex1/index.js)

### Exercise 2: Is there a problem? (2 points)

```javascript
async function getTotalVehicles() {
  return await got.get("https://my-webservice.moveecar.com/vehicles/total");
}

function getPlurial() {
  let total;

  getTotalVehicles().then((r) => (total = r));

  if (total <= 0) {
    return "none";
  }

  if (total <= 10) {
    return "few";
  }

  return "many";
}
```

Yes, again we have some problems with the usage of async/await, in this case the main problem is that in the function `getPlurial` the result is returned immediately, without waiting for `getTotalVehicles` to resolve, which makes ` r`` not having a value, and returning always  `many` as the value will be undefined, and undefined is not a number, so neither the if will be evaluated.

In order to make this piece of code work as expected, we need to convert `getTotalVehicles` into an async/await function: [Exercise 2](https://github.com/josemichaves/test_ceva/blob/master/node/ex2/index.js)

### Exercise 3: Unit test (2 points)

Write unit tests in jest for the function below in typescript

```typescript
import {
    expect,
    test
} from '@jest/globals';

function getCapitalizeFirstWord(name: string): string {

    if (name == null) {
        throw new Error('Failed to capitalize first word with null');
    }

    if (!name) {
        return name;
    }

    return name.split(' ').map(n => n.length > 1 ? (n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()) : n).join(' ');

}

test('1. test', async function () {

    ...

});
```

Here are the unit tests: [Exercise 3](https://github.com/josemichaves/test_ceva/blob/master/node/ex3/__tests__/index.spec.ts)

\*Note:

Function was not working as expected with single-letter words, I’ve fixed it, it was a matter of when we check the length of the word, we should check if the length is 1 or equal, and then will work.\*

Before:

```typescript
return name
  .split(" ")
  .map((n) =>
    n.length > 1
      ? n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()
      : n
  )
  .join(" ");
```

After:

```typescript
return name
  .split(" ")
  .map((n) =>
    n.length >= 1
      ? n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()
      : n
  )
  .join(" ");
```

## Angular

### Exercise 4 (5 points)

```typescript
@Component({
  selector: "app-users",
  template: `
    <input
      type="text"
      [(ngModel)]="query"
      (ngModelChange)="querySubject.next($event)"
    />
    <div *ngFor="let user of users">
      {{ user.email }}
    </div>
  `,
})
export class AppUsers implements OnInit {
  query = "";

  querySubject = new Subject<string>();

  users: {
    email: string;
  }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    concat(of(this.query), this.querySubject.asObservable())
      .pipe(
        concatMap((q) => timer(0, 60000).pipe(this.userService.findUsers(q)))
      )

      .subscribe({
        next: (res) => (this.users = res),
      });
  }
}
```

Yes, there's a problem, the concat method will not work as expected. In this case, we're using `pipe()`to combine two observables `of(this.query)` and `this.querySubject.asObservable()`. The `concat()` operator emits the values from the first observable `of(this.query)` in sequence, and then the second Observable in sequence again.

But in this case we only need the most recent value of `querySubject` Observable, because every time an input field changes, this Observable will emit, so there's no point in checking the value of `this.query`.

To improve this we can use `distinctUnitlChanged()` operator before the `concatMap` operator. This operator will emit the first value from the observable, and the subsequent values will be emitted if they've changed.

Therefore, every 60 seconds we'll emit the value of the Observable, except if the input value changes, in this case the new value will be emitted immediately.

[Exercice 4](https://github.com/josemichaves/test_ceva/blob/master/angular/ex4/src/app/app-users/app-users.component.ts)

### Exercise 5 (5 points)

```typescript
@Component({
  selector: "app-users",
  template: `
    <div *ngFor="let user of users">
      {{ getCapitalizeFirstWord(user.name) }}
    </div>
  `,
})
export class AppUsers {
  @Input()
  users: {
    name: string;
  }[];
  constructor() {}
  getCapitalizeFirstWord(name: string): string {
    return name
      .split(" ")
      .map(
        (n) => n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()
      )
      .join(" ");
  }
}
```

The main performance problem of this component is that getCapitalizeFirstWord` is called every render, which is not optimal at all, as this array of values if eligible to be static as possible. To fix this problem we can use the cache.

We can use the observable `map` to take an observable, in this case the users array, and then in every render, we check if we have available this data in the map, if we have it, we simply return this data, if not, we execute the function to capitalize the names, and then store it on the map.

[Exercise 5](https://github.com/josemichaves/test_ceva/blob/master/angular/ex5/src/app/app-users/app-users.component.ts)

## Exercice 6: Forms (8 points)

Complete and modify AppUserForm class to use Angular Reactive Forms. Add a button to submit.
The form should return data in this format

```json
{
  email: string; // mandatory, must be a email
  name: string; // mandatory, max 128 characters
  birthday ? : Date; // Not mandatory, must be less than today
  address: { // mandatory
      zip: number; // mandatory
      city: string; // mandatory, must contains only alpha uppercase and lower and space
};
```

```typescript
@Component({
    selector: 'app-user-form',
    template: `
      <form>
      <input type="text" placeholder="email">
      <input type="text" placeholder="name">
      <input type="date" placeholder="birthday">
      <input type="number" placeholder="zip">
      <input type="text" placeholder="city">
      </form>
`
})
export class AppUserForm {
    @Output()
    event = new EventEmitter < {
        email: string;
        name: string;
        birthday: Date;
        address: {
            zip: number;
            city: string;
        };
    } > ;
    constructor(
        private formBuilder: FormBuilder
    ) {}
    doSubmit(): void {
        this.event.emit(...);
    }
}
```

[Exercise 6](https://github.com/josemichaves/test_ceva/blob/master/angular/ex6/src/app/app-user-form/app-user-form.component.ts)

## CSS & Bootstrap

### Exercise 7: Card (5 points)

Recreate this card.

[Exercise 7](https://github.com/josemichaves/test_ceva/blob/master/css-bootstrap/ex7/index.html)

## MongoDb

### Exercise 8: MongoDb request (3 points)

MongoDb collection users with schema

`typescript{email: string;first_name: string;last_name: string;roles: string[];last_connection_date: Date;}`

Complete the query, you have a variable that contains a piece of text to search for. Search by exact email, starts with first or last name and only users logged in

for 6 months

`mongodbdb.collections('users').find(...);`

[Exercise 8](https://github.com/josemichaves/test_ceva/blob/master/mongodb/ex8/index.js)

- **What should be added to the collection so that the query is not slow?**

We should add indexes to our database, at the fields that we're going to search by, which will provide a better performance of the query. In this specific case, the most important field is `last_connection_date`, because the filter that we're using (less than 6 months) we can fetch a lot of records with this filter, so we need this field to be optimized as possible.

### Exercise 9: MongoDb aggregate (5 points)

MongoDb collection users with schema

`typescript{email: string;first_name: string;last_name: string;roles: string[];last_connection_date: Date;}`

Complete the aggregation so that it sends user emails by role `({_id: 'role', users: [email,...]})`

`dynamodbdb.collections('users').aggregate(...);`

[Exercise 9](https://github.com/josemichaves/test_ceva/blob/master/mongodb/ex9/index.js)

### Exercise 10: MongoDb update (5 points)

MongoDb collection users with schema

`typescript{email: string;first_name: string;last_name: string;roles: string[];last_connection_date: Date;addresses: {zip: number;city: string;}[]:}`

Update document `ObjectId("5cd96d3ed5d3e20029627d4a")` , modify only last_connection_date with **current date**:

`db.collections('users').updateOne(...);`

Update document `ObjectId("5cd96d3ed5d3e20029627d4a")` , add a role **admin**:

`db.collections('users').updateOne(...);`

Update document `ObjectId("5cd96d3ed5d3e20029627d4a")` , modify addresses with zip **75001** and replace city with **Paris 1**:

`db.collections('users').updateOne(...);`

[Exercise 10](https://github.com/josemichaves/test_ceva/blob/master/mongodb/ex10/index.js)
