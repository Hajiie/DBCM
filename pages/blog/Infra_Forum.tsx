/**These are necessary imports / components for the page */
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider } from "../../src/components";
import {ImageSize} from "../../src/shared/enums";

const Article = () => {
    return (
        // pass blogwithsidebar as show below for article page with sidebar layout
        <PageLayout blogcentered={true}>
            {/* Replace the below content with your content */}
            <p className="break-keep">
            2024. 08. 28 대한토목학회와 함께 운영된 ‘미래국토인프라 포럼’ 의 공개좌담회에 안승준 교수가 참여 하였습니다.
            포럼은 도로, 철도, 하천 댐, 항만, 플랜트를 국토개발 차원에서 통합적으로 볼 컨트롤타워 설립을 주장했습니다.<br /><br />
            On August 28, 2024, at the National Infrastructure Innovation Forum organized in collaboration with the Korean Society of Civil Engineers, Prof. Ahn Seung-jun participated in the public discussion.
            The forum advocated for the establishment of a control tower to integrate road, rail, river dams, ports, and plants from a national development perspective.
            </p>
            <div className='Infra Forum' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'20px'}}>
                <Image src='/public/images/2508News1.jpg' alt='미래국토인프라 포럼-1' size={ImageSize.MEDIUM}/>
                <Image src='/public/images/2508News2.png' alt='미래국토인프라 포럼-2' size={ImageSize.MEDIUM}/>
            </div>
            <div className="px-4 py-3 dark:bg-slate-900 bg-blue-200 rounded mt-5 !text-lg leading-relaxed">
                <a href="https://www.mcnews.co.kr/82096" target="_blank" rel="noopener noreferrer"><u><i>[매일건설신문] 미래국인프라 혁신포럼 창립총회 및 기념세미나</i></u></a>.
            </div>
            {/* Replace the above content with your content */}
        </PageLayout>
    )
}

export default Article;