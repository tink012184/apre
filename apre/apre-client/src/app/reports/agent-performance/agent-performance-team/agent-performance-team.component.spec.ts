import { TestBed } from '@angular/core/testing';
import { AgentPerformanceTeamComponent } from './agent-performance-team.component';
import { AgentPerformanceService } from '../agent-performance-by-team.service';
import { of, throwError } from 'rxjs';

describe('AgentPerformanceTeamComponent', () => {
  const mockSvc = {
    getTeams: jasmine.createSpy('getTeams'),
    getTeamPerformance: jasmine.createSpy('getTeamPerformance'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPerformanceTeamComponent],
      providers: [{ provide: AgentPerformanceService, useValue: mockSvc }],
    }).compileComponents();
  });

  it('should create', () => {
    mockSvc.getTeams.and.returnValue(of([]));

    const fixture = TestBed.createComponent(AgentPerformanceTeamComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should load teams and auto-load first team performance', () => {
    mockSvc.getTeams.and.returnValue(of(['Texas', 'West']));
    mockSvc.getTeamPerformance.and.returnValue(
      of([
        { agent: 'Agent A', score: 90 },
        { agent: 'Agent B', score: 80 },
      ]),
    );

    const fixture = TestBed.createComponent(AgentPerformanceTeamComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.selectedTeam).toBe('Texas');
    expect(component.chartLabels).toEqual(['Agent A', 'Agent B']);
    expect(component.chartData).toEqual([90, 80]);
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
