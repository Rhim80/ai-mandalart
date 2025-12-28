'use client';

import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { ExportContainer } from './ExportContainer';
import { MandalartData } from '@/types/mandalart';

interface ExportPreviewProps {
  data: MandalartData;
  nickname?: string;
  onExportComplete?: () => void;
}

export function ExportPreview({ data, nickname, onExportComplete }: ExportPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2, // 고해상도 (2x)
        useCORS: true,
        backgroundColor: '#f6f3f0',
        logging: false,
      });

      const link = document.createElement('a');
      const displayName = nickname || 'My';
      link.download = `${displayName}-mandalart-story-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      onExportComplete?.();
    } catch (err) {
      console.error('Failed to export:', err);
    }
  }, [nickname, onExportComplete]);

  return (
    <>
      {/* 화면 밖에 숨김 (렌더링은 됨) */}
      <div
        ref={containerRef}
        className="fixed -left-[9999px] top-0"
        style={{ width: '1080px', height: '1920px' }}
      >
        <ExportContainer data={data} nickname={nickname} />
      </div>
    </>
  );
}

// Export function을 외부에서 호출할 수 있도록 ref를 통해 노출
export function useExportPreview(
  data: MandalartData,
  nickname?: string
): [React.RefObject<HTMLDivElement | null>, () => Promise<void>] {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f6f3f0',
        logging: false,
      });

      const link = document.createElement('a');
      const displayName = nickname || 'My';
      link.download = `${displayName}-mandalart-story-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export:', err);
    }
  }, [nickname]);

  return [containerRef, handleExport];
}
