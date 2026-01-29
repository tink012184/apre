import { TestBed } from '@angular/core/testing';
import { AgentPerformanceTeamComponent } from './agent-performance-team.component';
import { AgentPerformanceService } from '../agent-performance-by-team.service';
import { of, throwError } from 'rxjs';

describe('AgentPerformanceTeamComponent', () => {
  const mockSvc = {
    getTeams: jasmine.createSpy('getTeams'),
    getTeamPerformanceDual: jasmine.createSpy('getTeamPerformanceDual'),
  };

  beforeEach(async () => {
    // Reset spies BEFORE configuring
    mockSvc.getTeams.calls.reset();
    mockSvc.getTeamPerformanceDual.calls.reset();

    await TestBed.configureTestingModule({
      imports: [AgentPerformanceTeamComponent],
      providers: [{ provide: AgentPerformanceService, useValue: mockSvc }],
    }).compileComponents();
  });

  it('should create', () => {
    mockSvc.getTeams.and.returnValue(of([]));

    const fixture = TestBed.createComponent(AgentPerformanceTeamComponent);
    const component = fixture.componentInstance;

    // trigger ngOnInit
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load teams and auto-load first team performance (dual metrics)', () => {
    mockSvc.getTeams.and.returnValue(of(['TeleSales Titans', 'West']));
    mockSvc.getTeamPerformanceDual.and.returnValue(
      of([
        { agent: '1023', customerSatisfaction: 85, salesConversion: 75 },
        { agent: '1024', customerSatisfaction: 90, salesConversion: 60 },
      ]),
    );

    const fixture = TestBed.createComponent(AgentPerformanceTeamComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    expect(component.selectedTeam).toBe('TeleSales Titans');
    expect(mockSvc.getTeamPerformanceDual).toHaveBeenCalledWith(
      'TeleSales Titans',
    );

    expect(component.chartLabels).toEqual(['1023', '1024']);
    expect(component.datasets.length).toBe(2);
    expect(component.datasets[0].data).toEqual([85, 90]);
    expect(component.datasets[1].data).toEqual([75, 60]);
    expect(component.vm.state).toBe('ready');
  });

  it('should set error state when teams API fails', () => {
    mockSvc.getTeams.and.returnValue(throwError(() => new Error('boom')));

    const fixture = TestBed.createComponent(AgentPerformanceTeamComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    expect(component.vm.state).toBe('error');
    if (component.vm.state === 'error') {
      expect(component.vm.message).toContain(
        'Failed to load agent performance data',
      );
    }
  });
});
