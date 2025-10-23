import { Routes } from '@angular/router';
import { Purchaserequest } from './components/purchaserequest/purchaserequest';
import { Negotiation } from './components/negotiation/negotiation';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Purchaserequest },
  { path: 'negotiate', component: Negotiation },
  { path: 'negotiate/:id', component: Negotiation }
];
