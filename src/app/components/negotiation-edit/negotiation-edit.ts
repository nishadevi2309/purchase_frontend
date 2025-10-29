import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-negotiation-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './negotiation-edit.html',
  styleUrls: ['./negotiation-edit.css']
})
export class NegotiationEditComponent implements OnInit {
  negotiation: any = {
    negotiationid: 0,
    negotiationstatus: '',
    finalquoteamount: null,
    negotiationDate: '',
    comments: '',
    initialquoteamount: 0
  };
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  negotiationId: number = 0;
  statusOptions = ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.negotiationId = +params['id'];
      this.loadNegotiationDetails();
    });
  }

  loadNegotiationDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Loading negotiation details for ID:', this.negotiationId);
    
    this.purchaseService.getNegotiationDetails(this.negotiationId).subscribe({
      next: (data) => {
        this.negotiation = data;
        this.isLoading = false;
        console.log('Loaded negotiation:', data);
        console.log('Final quote amount:', data.finalquoteamount);
        console.log('Negotiation status:', data.negotiationstatus);
        console.log('Comments field:', data.comments);
        console.log('All negotiation properties:', Object.keys(data));
      },
      error: (err) => {
        console.error('Error loading negotiation:', err);
        this.errorMessage = 'Failed to load negotiation details';
        this.isLoading = false;
      }
    });
  }

  updateNegotiation(): void {
    if (!this.negotiation) return;
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const updateData: any = {
      negotiationstatus: this.negotiation.negotiationstatus,
      finalquoteamount: this.negotiation.finalquoteamount,
      negotiationDate: this.negotiation.negotiationDate,
      comments: this.negotiation.comments
    };
    
    console.log('Updating negotiation with data:', updateData);
    console.log('Comments being sent:', this.negotiation.comments);
    
    this.purchaseService.updateNegotiation(this.negotiationId, updateData).subscribe({
      next: (updated) => {
        this.negotiation = updated;
        this.successMessage = 'Negotiation updated successfully!';
        this.isSaving = false;
        console.log('Updated negotiation response:', updated);
        setTimeout(() => this.router.navigate(['/negotiate']), 2000);
      },
      error: (err) => {
        console.error('Error updating negotiation:', err);
        this.errorMessage = err.error?.message || 'Failed to update negotiation';
        this.isSaving = false;
      }
    });
  }

  updateStatus(): void {
    if (!this.negotiation?.negotiationstatus) return;
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.purchaseService.updateNegotiationStatus(this.negotiation, this.negotiation.negotiationstatus).subscribe({
      next: (updated) => {
        this.negotiation = updated;
        this.successMessage = 'Status updated successfully!';
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.errorMessage = err.error?.message || 'Failed to update status';
        this.isSaving = false;
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

  cancel(): void {
    this.router.navigate(['/negotiate']);
  }
}