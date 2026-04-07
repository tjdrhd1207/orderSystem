const URL = 'http://localhost:3000/orders/redis';
const TOTAL_REQUESTS = 100;

async function runTest() {

    // 1. 테스트 시작 전 테이블 초기화
    console.log("데이터 초기화");
    // await fetch(URL + '/clear', { method: 'DELETE' });

    let success = 0;
    let fail = 0;
 
    const requests = [];

    for (let i = 0; i < TOTAL_REQUESTS; i++ ) {
        requests.push(
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: 1, userId: 'JM' }),
            }).then(async (res) => {
                if (!res.ok) {
                    fail++;
                    return;
                }
                success++;
            }).
                catch((err) => {
                    fail++;
                })
        );
    }

    console.time('⏱ 전체 실행 시간');
    await Promise.all(requests);
    console.timeEnd('⏱ 전체 실행 시간');

    console.log('✅ 성공:', success);
    console.log('❌ 실패:', fail);
    console.log('🚀 테스트 완료');
}


runTest();