import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface purchaserequests {
  prid?: number;
  eventid: number;
  vendorid: number;
  allocatedamount: number;
  prstatus: string;
  requestLocalDate?: string;
}

@Component({
  selector: 'app-negotiation',
  imports: [CommonModule],
  templateUrl: './negotiation.html',
  styleUrl: './negotiation.css'
})
export class Negotiation implements OnInit {
  selectedPR: purchaserequests | null = null;
  activeTab: string = 'review';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get PR data from session storage
    const prData = sessionStorage.getItem('selectedPR');
    if (prData) {
      this.selectedPR = JSON.parse(prData);
    }

    // Alternatively, get PR ID from route params if needed
    const prId = this.route.snapshot.paramMap.get('id');
    if (prId && !this.selectedPR) {
      // Here you could load PR data by ID from a service
      console.log('PR ID from route:', prId);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
