import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ManageItemsComponent } from './pages/manage-items/manage-items.component';
import { SearchComponent } from './pages/search/search.component';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security.component';
import { HelpComponent } from './pages/help/help.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'manage', component: ManageItemsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'privacy-security', component: PrivacySecurityComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '' }
];

