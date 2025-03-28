import type { Routes } from "@angular/router"
import { SurfSpotListComponent } from "./pages/surf-spot-list/surf-spot-list.component"
import { CreateSpotComponent } from "./pages/create-spot/create-spot.component"
import { SpotDetailsComponent } from "./pages/spot-details/spot-details.component"
import { UserProfileComponent } from "./pages/user-profile/user-profile.component"
import { AuthGuard } from "./guards/auth.guard"

export const routes: Routes = [
  { path: "", component: SurfSpotListComponent, title: "Surf Spots" },
  { path: "create", component: CreateSpotComponent, canActivate: [AuthGuard], title: "Create Spot" },
  { path: "edit/:id", component: CreateSpotComponent, canActivate: [AuthGuard], title: "Edit Spot" },
  { path: "spots/:id", component: SpotDetailsComponent, canActivate: [AuthGuard], title: "Spot Details" },
  { path: "profile", component: UserProfileComponent, canActivate: [AuthGuard], title: "User Profile" },
  { path: "**", redirectTo: "" },
]

