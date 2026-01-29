import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AgentPerformanceService } from './agent-performance-by-team.service';

describe('AgentPerformanceByTeamService', () => {
  let service: AgentPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AgentPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
