📦 NestJS-OrderProgram (재고 관리 시스템) (2026.03.22)
Prisma와 NestJS를 활용하여 고성능 주문 시스템을 구축하고, 동시성 문제를 해결해 나가는 프로젝트입니다.

📅 오늘 진행한 내용 (Development Log)
1. 프로젝트 기반 구조 수동 구축
nest new 대신 필요한 패키지를 수동으로 설치하며 NestJS의 핵심 구조(AppModule, main.ts, tsconfig.json)를 직접 설정함.

Troubleshooting: tsconfig.json 부재로 인한 데코레이터(@Post, @Body) 인식 오류 해결.

2. Prisma ORM 연동
PrismaService를 생성하여 NestJS와 DB(PostgreSQL/MySQL 등) 연결.

OnModuleInit 인터페이스를 구현하여 앱 구동 시 DB 연결 자동화.

Troubleshooting: npx prisma generate를 통한 Client 생성 및 의존성 꼬임 문제 해결(node_modules 완전 재설치).

3. 주문(Orders) 기능 구현 (v1. 위험한 버전)
OrdersController, OrdersService를 생성하여 POST /orders API 개발.

비즈니스 로직: 재고 조회 -> 재고 확인 -> 재고 감소 -> 주문 생성.

Race Condition 확인: 동시성 처리가 되지 않은 로직을 작성하여 부하 테스트 준비 완료.

4. 부하 테스트 스크립트 작성
axios와 Promise.all을 이용해 100개의 주문을 동시에 날리는 test-order.js 작성.

---------------------------------------------------------------------------------------
🛠 실행 방법 (Getting Started)
Bash
# 1. 의존성 설치
npm install

# 2. Prisma Client 생성 및 DB 반영
npx prisma generate
npx prisma db push

# 3. 서버 실행 (Watch Mode)
npm run start:dev

# 4. 동시성 부하 테스트 (서버 실행 중인 상태에서 별도 터미널)
node test-order.js

-------------------------------------------------------------------------------------

TODO (앞으로 진행할 과제)

## 🚀 Upcoming Task: 동시성 주문 테스트 (Concurrency Test)

DB 연결이 완료되었으므로, 다음 단계는 100명의 사용자가 동시에 주문했을 때 재고가 정확히 차감되는지 확인하는 테스트입니다.
### 1. 테스트 시나리오
* **준비물**: Prisma Studio를 통해 `Product` 테이블의 `id: 1` 상품 재고(`stock`)를 **100**으로 설정.
* **상황**: 100명의 가상 사용자가 동시에 `POST /orders` API를 호출하여 재고를 1개씩 구매.
* **기대 결과**: 재고가 정확히 **0**이 되어야 함. (동시성 이슈 발생 시 0보다 큰 숫자가 남을 수 있음)

### 2. 테스트 스크립트 실행 방법 (`test-order.js`)
프로젝트 루트에 `test-order.js` 파일을 생성하고 아래 명령어를 실행합니다.

```bash
# 1. HTTP 클라이언트 설치
npm install axios

# 2. 테스트 스크립트 실행 (서버가 켜져 있어야 함)
node test-order.js
```

Phase 1: 문제 진단
[✔️] node test-order.js 실행 후 재고 정합성 어긋나는 현상 확인.

[✔️] Prisma Studio를 통해 실제 주문 수와 남은 재고의 불일치 데이터 로그 남기기.


Phase 2: 동시성 문제 해결 (Race Condition Zero)
[✔️] Level 1. DB Pessimistic Lock (비관적 락): SELECT FOR UPDATE를 활용해 DB 수준에서 차례대로 줄 세우기.

[ ] Level 2. Redis 기반 분산 락 (Distributed Lock): Redlock 알고리즘을 사용하여 애플리케이션 레벨에서 효율적으로 제어하기.

[ ] Level 3. Message Queue (BullMQ): 주문 요청을 큐(Queue)에 쌓아 순차적으로 처리하는 비동기 방식 도입.

Phase 3: 고도화
[ ] 주문 상태(대기, 완료, 취소) 관리 기능 추가.

[ ] 유닛 테스트 및 통합 테스트 코드 작성.


-------------------------------------------------------------------------------------

(Today I Learned)
NestJS의 데코레이터는 tsconfig.json의 experimentalDecorators 설정이 필수다.

Prisma Client가 꼬였을 때는 node_modules를 지우고 새로 generate 하는 것이 가장 확실하다.

조회 후 수정(Check-then-Act) 방식의 로직은 동시성 환경에서 데이터가 오염될 확률이 매우 높다.


-------------------------------------------------------------------------------------

🛠️ Troubleshooting: Prisma & Docker Connection Issues
프로젝트 초기 세팅 과정에서 발생한 Prisma Client 초기화 오류와 환경 변수 인식 문제에 대한 기록입니다.

1. 문제 상황 (The Problem)
에러 메시지: PrismaClientInitializationError: PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions

원인: NestJS 서버가 실행될 때 루트 폴더의 .env 파일을 정상적으로 읽어오지 못함.

상세: 빌드 결과물인 dist 폴더 내에서 실행될 때 경로 문제로 인해 DATABASE_URL이 undefined로 전달되어 Prisma Client가 DB 위치를 찾지 못함.

2. 해결 시도 및 분석
Docker DB 구축: PostgreSQL 컨테이너를 생성하여 5432 포트로 데이터베이스 서버를 정상 구동함.

dotenv 강제 로드: main.ts 최상단에서 dotenv.config()를 호출했으나, 빌드 환경에 따라 여전히 환경 변수 주입이 불안정한 현상 발생.

타입 에러 발생: Prisma 생성자에 직접 설정을 주입할 때 TypeScript의 엄격한 타입 체크(datasources 속성 미정의)로 인해 컴파일 에러 발생.

3. 최종 해결 방법 (The Solution)
문제를 근본적으로 우회하고 확실한 연결을 위해 PrismaService 내부에 접속 정보를 직접 주입(Hardcoding) 하는 방식을 선택했습니다.

PrismaService 수정:

super() 생성자에 datasources 객체를 직접 전달.

TypeScript의 타입 체크를 통과하기 위해 @ts-ignore 주석을 활용하여 강제 컴파일.

빌드 클린업:

Remove-Item -Recurse -Force dist 명령어를 통해 잘못된 환경 변수 정보가 담긴 이전 빌드 파일을 완전히 삭제 후 재빌드.

-------------------------------------------------------------------------------------
💡 다음 단계 (Next Step)
이제 환경 설정이 완벽하므로, 다음에는 README에 정리해둔 **test-order.js**를 실행해서 재고 동시성 이슈를 테스트해보면 됩니다.