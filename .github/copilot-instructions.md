# Copilot Rules - Python 기반 프로젝트

## 핵심 규칙

- 커뮤니케이션은 한국어로 진행합니다.
- UI(예: Streamlit, Jupyter Notebook) 구현 시 실행 코드를 먼저 작성합니다. 코어 비즈니스 로직 구현 시에는 TDD로 진행합니다.
- 모든 비즈니스 로직 및 데이터 처리 코드는 TDD로 구현합니다.
- 커밋 전에 docs/checklist.md에 진행상황을 업데이트합니다.
- 설계 변경 시에는 requirements.md와 design.md를 수정합니다.

## 분석 프로세스

요청에 응답하기 전에 다음 단계를 따르세요:

1. 요구사항 분석
   - 작업 유형 파악 (코드 생성, 디버깅, 아키텍처 설계 등)
   - 관련 언어 및 프레임워크 식별 (Python, Streamlit, pandas 등)
   - 명시적/암묵적 요구사항 파악
   - 핵심 문제와 원하는 결과 정의
   - 프로젝트 컨텍스트와 제약 조건 고려

2. 솔루션 계획
   - 논리적 단계로 솔루션 분해
   - 모듈화 및 재사용성 고려
   - 필요한 파일 및 의존성 식별
   - 대안 접근 방식 평가
   - 테스트 및 검증 계획 수립

3. 구현 전략
   - 적절한 디자인 패턴 선택
   - 성능 영향 고려
   - 오류 처리 및 엣지 케이스 계획
   - 접근성 및 Pythonic 코드 준수 확인
   - 모범 사례 정렬 확인

## 코드 스타일 및 구조

### 일반 원칙

- 간결하고 가독성 높은 Python 코드 작성
- 함수형 및 선언적 프로그래밍 패턴 권장
- DRY(Don't Repeat Yourself) 원칙 준수
- 가독성 향상을 위한 조기 반환(early return) 구현
- 모듈, 함수, 클래스 논리적 구조화: 내보내기, 하위 함수/클래스, 헬퍼, 타입

### 명명 규칙

- 설명적이고 일관된 snake_case 네이밍 사용
- 이벤트 핸들러에 handle_ 접두사 사용 (handle_click, handle_submit)
- 디렉토리는 소문자와 대시 또는 언더스코어 사용 (data_utils, streamlit_ui 등)
- 주요 함수, 클래스, 모듈은 명명된 내보내기(named exports) 선호

### Python 타입 및 스타일

- 타입 힌트 적극 사용
- 타입 검증을 위한 mypy 등 도구 활용 권장
- enum 대신 Literal, dict, class 등 Pythonic 방식 활용
- PEP8 스타일 가이드 준수 (black, isort, flake8 등 도구 활용)
- 타입 검증을 위한 typing, typing_extensions 등 활용

## UI 개발 규칙 (Streamlit/Jupyter 등)

### 컴포넌트 아키텍처

- UI 함수/컴포넌트는 단일 책임 원칙을 따라야 함
- 재사용 가능하고 테스트 가능하게 작성
- 프레젠테이션과 데이터/비즈니스 로직 분리
- 컴포넌트 크기는 작고 집중적으로 유지

### 상태 관리

- Streamlit의 session_state, Jupyter의 전역 변수 등 활용
- 상태 업데이트는 불변성 유지 권장

### UI 라이브러리 사용

- Streamlit, matplotlib, seaborn 등 시각화 라이브러리 활용
- 일관된 디자인 시스템 유지
- 접근성(WCAG 2.1 AA) 준수 권장
- 반응형 디자인(가능한 범위 내) 구현

### 테스트 방법

- **UI 구현 시 실행 코드 먼저 작성**
- **코어 비즈니스 로직 구현 시에만 TDD 방식 적용**
- pytest, unittest 등으로 함수/클래스 테스트
- 사용자 상호작용 시나리오 테스트(가능한 경우)
- Jupyter/Streamlit UI는 수동 테스트 및 예제 notebook 제공

## 비즈니스 로직/데이터 처리 규칙

### API/함수 설계

- 명확하고 일관된 함수/클래스 명명
- 적절한 예외 처리 및 상태 코드 표준화
- 데이터 접근 계층 추상화
- 쿼리/연산 성능 최적화
- 트랜잭션 및 일관성 관리

### TDD 기반 테스트

- **비즈니스 로직/데이터 처리 구현은 반드시 TDD 방식으로 진행**
- 단위 테스트, 통합 테스트, E2E 테스트 구현
- 테스트 커버리지 목표 설정
- 테스트 자동화 구현 (pytest, coverage 등)

## Clean Architecture 적용

### 계층 분리

- 엔티티: 핵심 비즈니스 규칙 및 데이터 구조 (예: 데이터 클래스)
- 유스케이스: 애플리케이션 특정 비즈니스 규칙
- 인터페이스 어댑터: UI, 데이터 어댑터, 프레젠터
- 프레임워크 및 드라이버: Streamlit, Jupyter, DB, 외부 서비스

### 의존성 규칙

- 내부 계층은 외부 계층에 의존하지 않음
- 의존성 주입을 통한 결합도 감소
- 인터페이스/추상화 계층 활용
- 외부 프레임워크/라이브러리에 대한 의존성 최소화

## 모노레포 구조 관리

### 패키지 구성

- src/: 핵심 비즈니스 로직 및 데이터 처리
- pages/: Streamlit/Jupyter UI 코드
- refer/: 참고/샘플 코드
- test/: 테스트 코드
- docs/: 문서화
- scripts/: 유틸리티 스크립트

### 의존성 관리

- requirements.txt, uv 등으로 의존성 관리
- 패키지 간 명확한 의존성 정의
- 순환 의존성 방지
- 공통 코드는 별도 모듈로 추출
- 일관된 버전 관리

## 버전 관리 및 협업

### Git 사용 규칙

- `--no-verify` 절대 사용 금지
- 명확하고 일관된 커밋 메시지 작성
- 적절한 크기로 커밋 유지
- 브랜치 전략 준수

### 코드 리뷰 프로세스

- 코드 품질 및 표준 준수 확인
- 테스트 커버리지 검증
- 성능 및 보안 이슈 검토
- 문서화 적절성 확인

## 문서화

### 코드 문서화

- 주요 함수 및 클래스에 docstring 사용
- 복잡한 로직에 대한 설명 추가
- 타입 정의 문서화
- API/함수 엔드포인트 문서화

### 프로젝트 문서화

- **커밋 전 docs/checklist.md에 진행상황 업데이트**
- **설계 변경 시 requirements.md와 design.md 수정**
- 주요 컴포넌트 개발 후 /docs/[component].md에 요약 작성
- 아키텍처 결정 기록 유지

## 배포 및 인프라

### 인프라

- requirements.txt, UV, Dockerfile 등으로 환경 관리
- 환경별 설정 분리
- 보안 모범 사례 준수

### CI/CD 파이프라인

- GitHub Actions를 통한 자동화
- 테스트, 빌드, 배포 자동화
- 환경별 배포 전략
- 롤백 메커니즘 구현

## 언어 및 커뮤니케이션

- **커뮤니케이션은 한국어로 진행**
- 기술적 용어나 라이브러리 이름은 원문 유지
- 간단한 다이어그램은 mermaid 사용, 복잡한 아키텍처 다이어그램은 SVG 파일 생성

## 구현 우선순위

1. 기본 데이터 처리/분석 기능 구현 (UI 우선)
2. UI/UX 개선
3. 비즈니스 로직/데이터 처리 고도화
4. 배포 및 CI/CD 구성

## 라이브러리 및 프레임워크 버전

### 주요 라이브러리/프레임워크

| 라이브러리/프레임워크 | 버전 | 공식 문서 URL |
|----------------------|------|--------------|
| Python | >=3.10 | https://docs.python.org/3/ |
| pandas | 최신 | https://pandas.pydata.org/docs/ |
| numpy | 최신 | https://numpy.org/doc/ |
| Streamlit | 최신 | https://docs.streamlit.io/ |
| Jupyter | 최신 | https://jupyter.org/documentation |
| UV | 최신 | https://docs.astral.sh/uv/#tools |
| poetry | 최신 | https://python-poetry.org/docs/ |
| pytest | 최신 | https://docs.pytest.org/ |
| black | 최신 | https://black.readthedocs.io/ |
| isort | 최신 | https://pycqa.github.io/isort/ |
| flake8 | 최신 | https://flake8.pycqa.org/en/latest/ |
| mkdocs | 최신 | https://www.mkdocs.org/ |
| coverage | 최신 | https://coverage.readthedocs.io/ |
| Docker | 최신 | https://docs.docker.com/ |
| GitHub Actions | - | https://docs.github.com/ko/actions |
