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
    initialquoteamount: 0,
    approvalDate: '',
    rejectionDate: '',
    rejectionReason: ''
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
    
    // Automatically set approval/rejection dates when status changes
    this.setStatusDates();
    
    // Store approval/rejection dates in localStorage since backend doesn't support them yet
    if (this.negotiation.approvalDate) {
      localStorage.setItem(`approval_date_${this.negotiationId}`, this.negotiation.approvalDate);
      console.log('Stored approval date in localStorage:', this.negotiation.approvalDate, 'for negotiation', this.negotiationId);
    }
    if (this.negotiation.rejectionDate) {
      localStorage.setItem(`rejection_date_${this.negotiationId}`, this.negotiation.rejectionDate);
      localStorage.setItem(`rejection_reason_${this.negotiationId}`, this.negotiation.rejectionReason || '');
      console.log('Stored rejection date in localStorage:', this.negotiation.rejectionDate, 'for negotiation', this.negotiationId);
    }
    
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const updateData: any = {
      negotiationstatus: this.negotiation.negotiationstatus,
      finalquoteamount: this.negotiation.finalquoteamount,
      negotiationDate: this.negotiation.negotiationDate,
      comments: this.negotiation.comments,
      approvalDate: this.negotiation.approvalDate,
      rejectionDate: this.negotiation.rejectionDate,
      rejectionReason: this.negotiation.rejectionReason
    };
    
    this.purchaseService.updateNegotiation(this.negotiationId, updateData).subscribe({
      next: (updated) => {
        this.negotiation = updated;
        this.successMessage = 'Negotiation updated successfully!';
        this.isSaving = false;
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

  setStatusDates(): void {
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const status = this.negotiation.negotiationstatus?.toLowerCase();
    
    if (status === 'approved') {
      // Always set approval date when status is approved
      this.negotiation.approvalDate = currentDate;
      // Clear rejection fields when approved
      this.negotiation.rejectionDate = '';
      this.negotiation.rejectionReason = '';
    } else if (status === 'rejected') {
      // Always set rejection date when status is rejected
      this.negotiation.rejectionDate = currentDate;
      // Clear approval field when rejected
      this.negotiation.approvalDate = '';
    }
  }

  onStatusChange(): void {
    // Automatically set dates when status changes
    this.setStatusDates();
  }

  cancel(): void {
    this.router.navigate(['/negotiate']);
  }
}