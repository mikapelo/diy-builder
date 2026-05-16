// @vitest-environment jsdom
/**
 * usePDFChecklist.test.js
 *
 * Couvre le hook de génération du PDF checklist chantier.
 * Smoke test : status transitions + appel save() avec filename normalisé.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockSave = vi.fn();

vi.mock('jspdf', () => {
  function MockJsPDF() {
    this.save           = mockSave;
    this.setFontSize    = vi.fn();
    this.setFont        = vi.fn();
    this.text           = vi.fn();
    this.line           = vi.fn();
    this.rect           = vi.fn();
    this.roundedRect    = vi.fn();
    this.setLineWidth   = vi.fn();
    this.setTextColor   = vi.fn();
    this.setDrawColor   = vi.fn();
    this.setFillColor   = vi.fn();
    this.splitTextToSize = vi.fn(() => ['line']);
    this.internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 } };
  }
  return { default: MockJsPDF };
});

vi.mock('@/lib/projectTime', () => ({
  CHECKLISTS: {
    terrasse: [
      { title: 'Préparation', items: ['Mesurer le terrain', 'Marquer les emplacements'] },
      { title: 'Pose',        items: ['Couler les plots'] },
    ],
  },
}));

import { usePDFChecklist } from '@/hooks/usePDFChecklist.js';

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('usePDFChecklist', () => {
  it('expose handleExportChecklist et checklistStatus="idle"', () => {
    const { result } = renderHook(() => usePDFChecklist());
    expect(result.current.checklistStatus).toBe('idle');
    expect(typeof result.current.handleExportChecklist).toBe('function');
  });

  it('génère un PDF avec filename projectType-WxD.pdf et passe done puis idle', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { result } = renderHook(() => usePDFChecklist());

    const weekendPlan = [
      { moment: 'Samedi matin', tasks: ['Plots'] },
      { moment: 'Samedi am',    tasks: ['Lambourdes'] },
    ];

    await act(async () => {
      await result.current.handleExportChecklist('terrasse', { width: 5, depth: 3 }, weekendPlan);
    });

    expect(mockSave).toHaveBeenCalledWith('checklist-terrasse-bois-5x3m.pdf');
    expect(result.current.checklistStatus).toBe('done');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600);
    });
    expect(result.current.checklistStatus).toBe('idle');
  });
});
