import { Injectable } from "@angular/core"
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router"
import { type Observable, of } from "rxjs"
import { catchError, map } from "rxjs/operators"
import { ApiService } from "../services/api.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private api: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.api.getUser().pipe(
      map((user) => {
        if (user) {
          return true
        } else {
          if (state.url.includes("/spots/")) {
            this.snackBar
              .open("Please log in to view spot details", "Login", {
                duration: 5000,
                panelClass: "warning-snackbar",
                horizontalPosition: "center",
                verticalPosition: "bottom",
              })
              .onAction()
              .subscribe(() => {
                this.router.navigate(["/login"], {
                  queryParams: { returnUrl: state.url },
                })
              })

            this.router.navigate(["/"])
          } else {
            this.router.navigate(["/login"], {
              queryParams: { returnUrl: state.url },
            })
          }
          return false
        }
      }),
      catchError(() => {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url },
        })
        return of(false)
      }),
    )
  }
}

