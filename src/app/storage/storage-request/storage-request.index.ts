import { StorageRequest } from '@shared/types/storage/request/storage-request.type';

export class StorageRequestState {
  requests: StorageRequest[];
  errors: number;
  success: number;
  pending: number;
  stream: boolean;
}
