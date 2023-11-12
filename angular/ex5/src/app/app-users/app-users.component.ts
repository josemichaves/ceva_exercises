import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-users',
  template: `
    <div *ngFor="let user of users">
      {{ user.capitalizedName }}
    </div>
  `,
})
export class AppUsers {
  @Input()
  users: { name: string }[];

  private capitalizedNames: Map<string, string> = new Map(); // Initialize cache

  constructor() {}

  getCapitalizeFirstWord(name: string): string | undefined {
    if (!this.capitalizedNames.has(name)) {
      // If name is in cache dont execute again the function
      this.capitalizedNames.set(
        name,
        name
          .split(' ')
          .map(
            (n) =>
              n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()
          )
          .join(' ')
      );
    }
    return this.capitalizedNames.get(name);
  }
}
