export interface BidanItem {
  id: number;
  name: string;
  email: string;
  is_active?: boolean;
  no_telepon?: string | null;
  no_str?: string | null;
  puskesmas_wilayah?: string | null;
  created_at: string;
}
