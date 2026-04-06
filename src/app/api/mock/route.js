const BRIEFING={
    markets:[
        {name : "KOSPI", value: "5620.31", change: "+87.44(+1.58%)", up:true},
        {name : "KOSDAQ", value:"1189.56", change: "+23.12(+1.98%)", up:true},
    ],
    headline:
    "미국 연준의 금리 인하 시사에 글로벌 증시가 동반 상승하며 코스피가 1.58% 올랐습니다. 외국인이 1조 2천억 원 순매수하며 반도체 2차 전지 섹터가 강세를 보였고 기관도 매수 우위를 기록했습니다.",
    hotStocks:["삼성전자", "SK하이닉스", "LG에너지솔루션", "NAVER", "카카오"],
};
const ANALYSIS = {
    삼성전자:{
        sentiment: 72,
        summary:
        "삼성전자는 메모리 반도체 업황 회복과 AI 서버용 HBM 수요 증가로 긍정적 흐름을 보이고 있다. 최근 분기 실적이 시장 기대치를 상회하며 외국인 매수세가 이어지고 있다.",
        insights:[
            {type:"positive", txt: "HBM3E 양산 본격화로 AI 반도체 매출 증가 기대"},
            {type:"trend", txt:"외국인 순매수 5거래일 연속 지속"},
            {type:"news", txt:"갤럭시 s26 시리즈 사전 예약 역대 최고 기록"},
            {type:"warning", txt:"중국 스마트폰 시장 점유율 하락 추세 지속"},
        ],
    },
};
function makeDefault(stock){
    return{
        sentiment:55,
        summary:stock+"은(는) 현재 시장 평균 수준의 흐름을 보이고 있다. 업종 내 경쟁 상황과 글로벌 경기 동향에 따라 향후 방향성이 결정될 전망이다.",
        insights:[
            {type:"trend", txt:stock+" 업종 평균 수준의 거래량 유지 중"},
            {type:"news", txt:stock+" 다음 분기 실적 발표 예정"},
            {type:"positive", txt:stock+" 최근 신규 사업 진출 발표로 관심 증가"},
            {type:"warning", txt:"글로벌 경기 불확실성에 따른 변동성 주의"},
        
        ],
    };
}

export async function GET(req){
    await new Promise((r)=>setTimeout(r, 1000+Math.random()*1000));

    const stock=new URL(req.url).searchParams.get("stock");

    if(stock){
        return Response.json(ANALYSIS[stock]||makeDefault(stock));
    }
    return Response.json(BRIEFING);
}