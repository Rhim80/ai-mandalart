import { ExportGrid } from './ExportGrid';
import { MandalartData } from '@/types/mandalart';

export type ExportRatio = 'story' | 'square' | 'wide';

interface ExportContainerProps {
  data: MandalartData;
  nickname?: string;
  ratio?: ExportRatio;
}

// 비율별 크기 설정
const RATIO_CONFIG = {
  story: { width: 1080, height: 1920 }, // 9:16
  square: { width: 1080, height: 1080 }, // 1:1
  wide: { width: 1920, height: 1080 }, // 16:9
};

export function ExportContainer({ data, nickname = 'My', ratio = 'story' }: ExportContainerProps) {
  const { width, height } = RATIO_CONFIG[ratio];
  const isStory = ratio === 'story';
  const isSquare = ratio === 'square';
  const isWide = ratio === 'wide';

  // 비율별 폰트 크기 조정
  const fontSize = {
    year: isStory ? 72 : isSquare ? 48 : 56,
    keyword: isStory ? 20 : isSquare ? 14 : 16,
    nickname: isStory ? 56 : isSquare ? 36 : 44,
    cta: isStory ? 28 : isSquare ? 18 : 22,
    url: isStory ? 24 : isSquare ? 16 : 18,
  };

  // 비율별 패딩/마진 조정
  const spacing = {
    containerPadding: isStory ? 24 : isSquare ? 16 : 20,
    headerPaddingTop: isStory ? 40 : isSquare ? 20 : 24,
    headerPaddingBottom: isStory ? 16 : isSquare ? 8 : 12,
    gridMargin: isStory ? 16 : isSquare ? 8 : 12,
    footerPaddingBottom: isStory ? 48 : isSquare ? 20 : 28,
    ctaMarginBottom: isStory ? 20 : isSquare ? 12 : 16,
  };

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#f6f3f0',
        display: 'flex',
        flexDirection: isWide ? 'row' : 'column',
        padding: `${spacing.containerPadding}px`,
        color: '#5d5654',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Wide 레이아웃: 왼쪽 헤더 + 오른쪽 그리드 */}
      {isWide ? (
        <>
          {/* 왼쪽: 헤더 + 푸터 */}
          <div
            style={{
              width: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingRight: '24px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h1
                style={{
                  fontSize: `${fontSize.year}px`,
                  fontWeight: 'bold',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  color: '#5d5654',
                }}
              >
                2026
              </h1>
              <h2
                style={{
                  fontSize: `${fontSize.keyword}px`,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#888888',
                  marginBottom: '16px',
                }}
              >
                Life Keyword
              </h2>
              <div
                style={{
                  fontSize: `${fontSize.nickname}px`,
                  fontWeight: 500,
                  color: '#d68c7b',
                  marginBottom: '32px',
                }}
              >
                {nickname}
              </div>
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                padding: '12px 20px',
                borderRadius: '12px',
                marginBottom: '12px',
              }}
            >
              <p
                style={{
                  fontSize: `${fontSize.cta}px`,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: '#5d5654',
                  textAlign: 'center',
                }}
              >
                2026년 목표를
                <br />
                SNS에 공유하고
                <br />
                함께 실천해보세요!
              </p>
            </div>
            <div
              style={{
                color: '#aaaaaa',
                fontSize: `${fontSize.url}px`,
              }}
            >
              mandalart.imiwork.com
            </div>
          </div>

          {/* 오른쪽: 그리드 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                maxWidth: `${height - spacing.containerPadding * 2}px`,
                aspectRatio: '1 / 1',
              }}
            >
              <ExportGrid data={data} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Story/Square 레이아웃: 세로 배치 */}
          {/* Header */}
          <header
            style={{
              flexShrink: 0,
              textAlign: 'center',
              paddingTop: `${spacing.headerPaddingTop}px`,
              paddingBottom: `${spacing.headerPaddingBottom}px`,
            }}
          >
            <h1
              style={{
                fontSize: `${fontSize.year}px`,
                fontWeight: 'bold',
                letterSpacing: '0.15em',
                marginBottom: isSquare ? '6px' : '12px',
                color: '#5d5654',
              }}
            >
              2026
            </h1>
            <h2
              style={{
                fontSize: `${fontSize.keyword}px`,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: '#888888',
                marginBottom: isSquare ? '12px' : '20px',
              }}
            >
              Life Keyword
            </h2>
            <div
              style={{
                fontSize: `${fontSize.nickname}px`,
                fontWeight: 500,
                color: '#d68c7b',
              }}
            >
              {nickname}
            </div>
          </header>

          {/* Grid */}
          <main
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 0,
              marginTop: `${spacing.gridMargin}px`,
              marginBottom: `${spacing.gridMargin}px`,
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                maxHeight: '100%',
              }}
            >
              <ExportGrid data={data} />
            </div>
          </main>

          {/* Footer */}
          <footer
            style={{
              flexShrink: 0,
              textAlign: 'center',
              paddingBottom: `${spacing.footerPaddingBottom}px`,
            }}
          >
            {isStory && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  padding: '20px 40px',
                  borderRadius: '16px',
                  display: 'inline-block',
                  marginBottom: `${spacing.ctaMarginBottom}px`,
                }}
              >
                <p
                  style={{
                    fontSize: `${fontSize.cta}px`,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: '#5d5654',
                  }}
                >
                  2026년 목표를 SNS에 공유하고
                  <br />
                  함께 실천해보세요!
                </p>
              </div>
            )}
            <div
              style={{
                color: '#aaaaaa',
                fontSize: `${fontSize.url}px`,
              }}
            >
              mandalart.imiwork.com
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
