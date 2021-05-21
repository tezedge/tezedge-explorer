import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Resource } from '../../shared/types/resources/resource.type';
import { CpuResource } from '../../shared/types/resources/cpu-resources.type';
import { DiskResource } from '../../shared/types/resources/disk-resource.type';
import { SystemMemoryResource, MemoryResourceUsage } from '../../shared/types/resources/system-memory-resource.type';
import { DatePipe } from '@angular/common';

const MB_DIVISOR = 1048576;
const GB_DIVISOR = 1073741824;

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {}

  getResources(endpoint: string): Observable<Resource[]> {
    return this.http.get<Resource[]>(endpoint)
      .pipe(map(response => this.mapGetResourcesResponse(response)));
  }

  private mapGetResourcesResponse(response: any): Resource[] {
    return response.reverse().map(responseItem => {
      const resource = new Resource();
      resource.timestamp = this.datePipe.transform(responseItem.timestamp * 1000, 'MM/dd, HH:mm:ss');

      resource.memory = new SystemMemoryResource();
      resource.memory.node = new MemoryResourceUsage();
      resource.memory.node.resident = responseItem.memory.node.resident_mem / MB_DIVISOR;
      resource.memory.node.virtual = responseItem.memory.node.virtual_mem / MB_DIVISOR;
      resource.memory.total = resource.memory.node.resident;

      if (responseItem.memory.protocol_runners) {
        resource.memory.protocolRunners = new MemoryResourceUsage();
        resource.memory.protocolRunners.resident = responseItem.memory.protocol_runners.resident_mem / MB_DIVISOR;
        resource.memory.protocolRunners.virtual = responseItem.memory.protocol_runners.virtual_mem / MB_DIVISOR;
        resource.memory.total += resource.memory.protocolRunners.resident;
      }

      if (responseItem.memory.validators) {
        resource.memory.validators = new MemoryResourceUsage();
        resource.memory.validators.resident = responseItem.memory.validators.resident_mem / MB_DIVISOR;
        resource.memory.validators.virtual = responseItem.memory.validators.virtual_mem / MB_DIVISOR;
        resource.memory.total += resource.memory.validators.resident;
      }

      resource.cpu = new CpuResource();
      resource.cpu.node = responseItem.cpu.node;
      resource.cpu.protocolRunners = responseItem.cpu.protocol_runners || undefined;
      resource.cpu.total = Object.values(resource.cpu).filter(Boolean).reduce((total: number, current: number) => total + current, 0);

      resource.disk = new DiskResource();
      resource.disk.blockStorage = responseItem.disk.block_storage / GB_DIVISOR;
      resource.disk.contextIrmin = responseItem.disk.context_irmin / GB_DIVISOR;
      resource.disk.mainDb = responseItem.disk.main_db / GB_DIVISOR || undefined;
      resource.disk.debugger = responseItem.disk.debugger / GB_DIVISOR || undefined;
      resource.disk.contextActions = responseItem.disk.context_actions / GB_DIVISOR || undefined;
      resource.disk.contextMerkleRocksDb = responseItem.disk.context_merkle_rocksdb / GB_DIVISOR || undefined;
      resource.disk.total = Object.values(resource.disk).filter(Boolean).reduce((total: number, current: number) => total + current, 0);

      return resource;
    });
  }
}
