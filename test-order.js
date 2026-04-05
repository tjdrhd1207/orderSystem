const URL = 'http://localhost:3000/orders';
const TOTAL_REQUESTS = 100;

async function runTest() {

    // 1. 테스트 시작 전 테이블 초기화
    console.log("데이터 초기화");
    await fetch(URL + '/clear', { method: 'DELETE' });

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
                    const err = await res.text();
                    console.log(`실패 ${i}`, err);
                    return;
                }
                console.log(`성공 ${i}`);
            }).
                catch((err) => {
                    console.err("네트워크 에러");
                })
        );
    }

    console.time('⏱ 전체 실행 시간');
    await Promise.all(requests);
    console.timeEnd('⏱ 전체 실행 시간');

    console.log('🚀 테스트 완료');
}


runTest();