/**These are necessary imports / components for the page */
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider } from "../../src/components";
import {ImageSize} from "../../src/shared/enums";

const Article = () => {
    return (
        // pass blogwithsidebar as show below for article page with sidebar layout
        <PageLayout blogcentered={true}>
            {/* Replace the below content with your content */}
            <p className="break-keep">
                2023/24년 불가리아 KSP 최종보고회 및 고위정책대화에서 안승준 교수가 불가리아 정부 및 유관기관 관계자들에게 주제별 최종 연구내용을 발표하고 정책제언이 반영될 수 있도록 사업의 결과를 확산하였다.
                <br /><br />
                From June 03, 2024, to June 07, 2024, At the Bulgarian KSP Final Report and High-level Policy Dialogue in 2023/24,
                Prof. Ahn presented the final findings of the thematic research to the Bulgarian government and related organizations and disseminated the project's findings for policy recommendations.
            </p>
            <div className='Bulgaria_Project' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'20px'}}>
                <Image src='/public/images/2406News1.png' alt='불가리아 프로젝트-1' size={ImageSize.MEDIUM}/>
                <Image src='/public/images/2406News2.png' alt='불가리아 프로젝트-2' size={ImageSize.MEDIUM}/>
            </div>
            {/*<div className="px-4 py-3 dark:bg-slate-900 bg-blue-200 rounded mt-5 !text-lg leading-relaxed">*/}
            {/*    <a href="https://www.mcnews.co.kr/82096" target="_blank" rel="noopener noreferrer"><u><i>[매일건설신문] 미래국인프라 혁신포럼 창립총회 및 기념세미나</i></u></a>.*/}
            {/*</div>*/}
            {/* Replace the above content with your content */}
        </PageLayout>
    )
}

export default Article;