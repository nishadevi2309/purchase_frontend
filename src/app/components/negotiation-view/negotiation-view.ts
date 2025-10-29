import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../services/purchase.service';
import { Request } from '../../service/request';

@Component({
  selector: 'app-negotiation-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './negotiation-view.html',
  styleUrls: ['./negotiation-view.css']
})
export class NegotiationViewComponent implements OnInit {
  negotiation: any = null;
  isLoading = false;
  errorMessage = '';
  negotiationId: number = 0;
  allEvents: any[] = [];
  allVendors: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    private requestService: Request
  ) {}

  ngOnInit(): void {
    this.loadAuxiliaryData(); // Load vendors and events first
    this.route.params.subscribe(params => {
      this.negotiationId = +params['id'];
      this.loadNegotiationDetails();
    });
  }

  loadAuxiliaryData(): void {
    // Load vendors and events for display
    this.requestService.getAllVendors().subscribe({
      next: (vendors) => {
        this.allVendors = vendors;
      },
      error: (error) => console.error('Error loading vendors:', error)
    });

    this.requestService.getAllEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
      },
      error: (error) => console.error('Error loading events:', error)
    });
  }

  loadNegotiationDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.purchaseService.getNegotiationDetails(this.negotiationId).subscribe({
      next: (data) => {
        this.negotiation = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading negotiation:', err);
        this.errorMessage = 'Failed to load negotiation details';
        this.isLoading = false;
      }
    });
  }

  calculateSavings(): number {
    if (!this.negotiation?.initialquoteamount || !this.negotiation?.finalquoteamount) return 0;
    return this.negotiation.initialquoteamount - this.negotiation.finalquoteamount;
  }

  calculateSavingsPercentage(): number {
    if (!this.negotiation?.initialquoteamount || !this.negotiation?.finalquoteamount) return 0;
    return (this.calculateSavings() / this.negotiation.initialquoteamount) * 100;
  }

  backToList(): void {
    this.router.navigate(['/negotiate']);
  }

  editNegotiation(): void {
    this.router.navigate(['/negotiate/edit', this.negotiationId]);
  }

  getStatusClass(status: string): string {
    const lower = status?.toLowerCase() || '';
    if (lower === 'approved') return 'status-approved';
    if (lower === 'pending') return 'status-pending';
    if (lower === 'rejected') return 'status-rejected';
    return 'status-default';
  }

  // Helper methods for display
  getEventName(eventId: number | undefined): string {
    if (eventId === undefined) return 'N/A';
    const event = this.allEvents.find(e => e.eventId === eventId);
    return event ? event.eventname : `Event ${eventId}`;
  }

  getVendorName(vendorId: number | undefined): string {
    if (vendorId === undefined) return 'N/A';
    const vendor = this.allVendors.find(v => v.vendorId === vendorId);
    return vendor ? vendor.vendorname : `Vendor ${vendorId}`;
  }
}