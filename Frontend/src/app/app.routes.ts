import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { UsersComponent } from "./pages/users/users.component";
import { AddComponent } from "./pages/add/add.component";
import { ManageKeysComponent } from "./pages/manage-keys/manage-keys.component";
import { FindKeyComponent } from "./pages/find-key/find-key.component";
import { AddUserComponent } from "./pages/add-user/add-user.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'add', component: AddComponent },
  { path: 'add/:userId', component: AddComponent },
  { path: 'manage-keys', component: ManageKeysComponent },
  { path: 'find-key', component: FindKeyComponent },
  { path: 'add-user', component: AddUserComponent },
];
