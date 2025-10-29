// src/app/models/negotiation.model.ts
import { PurchaseRequest } from './pr.model';

// Main Negotiation entity (matches backend response)
export interface Negotiation {
  negotiationid: number;  // Matches backend field name (lowercase)
  eventid: number;        // Matches backend field name (lowercase)
  vendorid: number;       // Matches backend field name (lowercase)
  initialquoteamount: number;
  finalquoteamount?: number;
  negotiationstatus: string; // "PENDING", "APPROVED", "REJECTED", "IN_PROGRESS", etc.
  negotiationDate: string; // ISO date string (YYYY-MM-DD)
  comments?: string; // Added comments field
  purchaseRequest?: PurchaseRequest;
}

// DTO for initiating a negotiation (matches backend InitiateNegotiationRequest)
export interface InitiateNegotiationRequest {
  prId: number;
  eventId: number;
  vendorId: number;
  initialQuoteAmount: number;
  negotiationDate?: string; // YYYY-MM-DD format
}

// DTO for updating status (matches backend StatusUpdateRequest)
export interface StatusUpdateRequest {
  newStatus: string;
}

// Response for dashboard (can be same as Negotiation for now)
export interface NegotiationResponse extends Negotiation {
  // Add any additional fields that might come from backend
  prId?: number;
  vendorName?: string;
}