import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Request } from '../../service/request';
import { purchaserequests } from '../../service/request';

@Component({
  selector: 'app-purchaserequest',
  imports: [FormsModule, CommonModule],
  templateUrl: './purchaserequest.html',
  styleUrl: './purchaserequest.css'
})
export class Purchaserequest implements OnInit{

  constructor(private requestService: Request, private router: Router) { }
  
  purchaserequest: purchaserequests = {
    prid: 0,
    eventid: 0,
    vendorid: 0,
    allocatedamount: 0,
    prstatus: '',
    requestLocalDate: ''
  };

  isModalOpen = false;
  purchaserequestsList: purchaserequests[] = [];
  
  // Edit functionality
  isEditModalOpen = false;
  currentEditingPR: purchaserequests | null = null;
  selectedStatus = '';
  
  // View functionality
  isViewModalOpen = false;
  currentViewingPR: purchaserequests | null = null;
  
  // Available status options matching backend enum
  statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_NEGOTIATION', label: 'In Negotiation' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' }
  ];
  
  // Dashboard counts
  pendingCount = 0;
  inNegotiationCount = 0;
  approvedCount = 0;
  rejectedCount = 0;

  ngOnInit(): void {
    this.loadPurchaseRequests();
  }

  loadPurchaseRequests(): void {
    this.requestService.getallPurchaseRequests().subscribe({
      next: (data) => {
        this.purchaserequestsList = data;
        this.calculateStatusCounts();
      },
      error: (error) => {
        console.error('Error loading purchase requests:', error);
        this.purchaserequestsList = [];
        this.resetCounts();
      }
    });
  }

  calculateStatusCounts(): void {
    this.pendingCount = this.purchaserequestsList.filter(pr => pr.prstatus === 'PENDING').length;
    this.inNegotiationCount = this.purchaserequestsList.filter(pr => pr.prstatus === 'IN_NEGOTIATION').length;
    this.approvedCount = this.purchaserequestsList.filter(pr => pr.prstatus === 'APPROVED').length;
    this.rejectedCount = this.purchaserequestsList.filter(pr => pr.prstatus === 'REJECTED').length;
  }

  resetCounts(): void {
    this.pendingCount = 0;
    this.inNegotiationCount = 0;
    this.approvedCount = 0;
    this.rejectedCount = 0;
  }

  openRaisePRModal(): void {
    this.isModalOpen = true;
    this.resetForm();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  openEditModal(pr: purchaserequests): void {
    this.currentEditingPR = { ...pr };
    this.selectedStatus = pr.prstatus || '';
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.currentEditingPR = null;
    this.selectedStatus = '';
  }

  updatePRStatus(): void {
    if (this.currentEditingPR && this.selectedStatus) {
      console.log('Updating PR ID:', this.currentEditingPR.prid, 'to status:', this.selectedStatus);
      this.requestService.updatePurchaseStatus(this.currentEditingPR.prid!, this.selectedStatus).subscribe({
        next: (updatedPR) => {
          console.log('PR status updated successfully:', updatedPR);
          this.loadPurchaseRequests();
          this.closeEditModal();
          alert('Purchase Request status updated successfully!');
        },
        error: (error) => {
          console.error('Error updating PR status:', error);
          console.error('Failed request details - ID:', this.currentEditingPR?.prid, 'Status:', this.selectedStatus);
          alert('Error updating Purchase Request status. Please try again.');
        }
      });
    }
  }

  // View functionality
  openViewModal(pr: purchaserequests): void {
    this.currentViewingPR = { ...pr };
    this.isViewModalOpen = true;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.currentViewingPR = null;
  }

  // Navigate to Review & Negotiate interface from specific PR
  navigateToNegotiate(pr: purchaserequests): void {
    // Store the PR data for the negotiate interface
    sessionStorage.setItem('selectedPR', JSON.stringify(pr));
    
    // Navigate to negotiate interface using Angular Router
    this.router.navigate(['/negotiate', pr.prid]);
    
    console.log('Selected PR for negotiation:', pr);
  }

  // Navigate to Review & Negotiate interface from sidebar
  navigateToNegotiateFromSidebar(): void {
    // Navigate to negotiate interface without specific PR
    this.router.navigate(['/negotiate']);
  }

  addPurchaseRequest(): void {
    if (this.validateRaisePRForm()) {
      // Create PR object with only the required fields for creation
      const newPR = {
        eventid: this.purchaserequest.eventid,
        vendorid: this.purchaserequest.vendorid,
        allocatedamount: this.purchaserequest.allocatedamount
      };

      console.log('Creating new PR:', newPR);
      
      this.requestService.createdata(newPR as purchaserequests).subscribe({
        next: (data) => {
          console.log('Purchase request created successfully:', data);
          this.loadPurchaseRequests();
          this.closeModal();
          alert('Purchase Request raised successfully!');
        },
        error: (error) => {
          console.error('Error creating purchase request:', error);
          alert('Error raising Purchase Request. Please try again.');
        }
      });
    }
  }

  resetForm(): void {
    this.purchaserequest = {
      prid: 0,
      eventid: 0,
      vendorid: 0,
      allocatedamount: 0,
      prstatus: '',
      requestLocalDate: ''
    };
  }

  validateRaisePRForm(): boolean {
    if (!this.purchaserequest.eventid || this.purchaserequest.eventid <= 0) {
      alert('Please enter a valid Event ID');
      return false;
    }
    if (!this.purchaserequest.vendorid || this.purchaserequest.vendorid <= 0) {
      alert('Please enter a valid Vendor ID');
      return false;
    }
    if (!this.purchaserequest.allocatedamount || this.purchaserequest.allocatedamount <= 0) {
      alert('Please enter a valid Allocated Amount');
      return false;
    }
    return true;
  }
}
