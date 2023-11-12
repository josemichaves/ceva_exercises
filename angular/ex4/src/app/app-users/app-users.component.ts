import { Component } from "@angular/core";
import { Subject, concat, concatMap, of, timer } from "rxjs";
import { UserService } from "../user-service.service";

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
  users: { email: string }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.querySubject
      .pipe(distinctUntilChanged())
      .pipe(
        concatMap((q) => timer(0, 60000).pipe(this.userService.findUsers(q)))
      )
      .subscribe({
        next: (res) => (this.users = res),
      });
  }
}
